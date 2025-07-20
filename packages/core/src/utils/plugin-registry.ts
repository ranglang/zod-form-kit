import {
  FieldType,
  FieldRendererComponent,
  UIAdapter,
  PluginRegistry,
  PluginSystemConfig,
  StringFieldRenderer,
  NumberFieldRenderer,
  BooleanFieldRenderer,
  DateFieldRenderer,
  ArrayFieldRenderer,
  ObjectFieldRenderer,
  DiscriminatedUnionFieldRenderer,
  SchemaPatternMatcher,
  SchemaPatternRenderer,
  PatternRegistryEntry
} from '../types/plugin-system';
import { z } from 'zod';

// Default field renderers (will be imported from existing components)
import { StringField } from '../components/fields/StringField';
import { NumberField } from '../components/fields/NumberField';
import { BooleanField } from '../components/fields/BooleanField';
import { DateField } from '../components/fields/DateField';
import { EnumField } from '../components/fields/EnumField';
import { ArrayField } from '../components/fields/ArrayField';
import { ObjectField } from '../components/fields/ObjectField';
import { DiscriminatedUnionField } from '../components/fields/DiscriminatedUnionField';

class PluginRegistryManager {
  private registry: PluginRegistry;
  private config: PluginSystemConfig;

  constructor(config: PluginSystemConfig = {}) {
    this.config = {
      fallbackToDefaults: true,
      ...config
    };

    this.registry = {
      fieldRenderers: new Map(),
      patternRenderers: [], // Initialize empty pattern renderers array
      uiAdapters: new Map(),
      defaultAdapter: this.config.defaultAdapter
    };

    // Register default field renderers
    this.registerDefaultRenderers();
  }

  private registerDefaultRenderers(): void {
    this.registry.fieldRenderers.set('string', StringField as unknown as StringFieldRenderer);
    this.registry.fieldRenderers.set('number', NumberField as unknown as NumberFieldRenderer);
    this.registry.fieldRenderers.set('boolean', BooleanField as unknown as BooleanFieldRenderer);
    this.registry.fieldRenderers.set('date', DateField as unknown as DateFieldRenderer);
    this.registry.fieldRenderers.set('enum', EnumField as unknown as FieldRendererComponent);
    this.registry.fieldRenderers.set('array', ArrayField as unknown as ArrayFieldRenderer);
    this.registry.fieldRenderers.set('object', ObjectField as unknown as ObjectFieldRenderer);
    this.registry.fieldRenderers.set('discriminatedUnion', DiscriminatedUnionField as unknown as DiscriminatedUnionFieldRenderer);
  }

  /**
   * Register a custom field renderer for a specific field type
   */
  registerFieldRenderer<T extends FieldType>(
    fieldType: T,
    component: FieldRendererComponent
  ): void {
    this.registry.fieldRenderers.set(fieldType, component);
  }

  /**
   * Register a schema pattern renderer
   * @param id - Unique identifier for this pattern
   * @param matcher - Function or Zod schema to match against
   * @param component - React component to render when pattern matches
   * @param priority - Priority level (higher numbers = higher priority)
   */
  registerSchemaPatternRenderer(
    id: string,
    matcher: SchemaPatternMatcher | z.ZodTypeAny,
    component: SchemaPatternRenderer,
    priority: number = 0
  ): void {
    // Convert Zod schema to matcher function if needed
    const matcherFunction: SchemaPatternMatcher = typeof matcher === 'function' 
      ? matcher 
      : (zodSchema: z.ZodTypeAny, _parsedField, _formValue) => {
          try {
            // For literal schemas, check if the structure matches
            if (zodSchema instanceof z.ZodLiteral && matcher instanceof z.ZodLiteral) {
              return zodSchema._def.value === matcher._def.value;
            }
            
            // For object schemas, perform deep structural comparison
            if (zodSchema instanceof z.ZodObject && matcher instanceof z.ZodObject) {
              return this.compareZodObjectSchemas(zodSchema, matcher);
            }
            
            // For number schemas, compare constraints
            if (zodSchema instanceof z.ZodNumber && matcher instanceof z.ZodNumber) {
              return this.compareZodNumberSchemas(zodSchema, matcher);
            }
            
            // For string schemas, compare constraints
            if (zodSchema instanceof z.ZodString && matcher instanceof z.ZodString) {
              return this.compareZodStringSchemas(zodSchema, matcher);
            }
            
            // For other schema types, use type comparison
            return zodSchema.constructor === matcher.constructor;
          } catch {
            return false;
          }
        };

    // Remove existing pattern with same ID
    this.registry.patternRenderers = this.registry.patternRenderers.filter(
      entry => entry.id !== id
    );

    // Add new pattern and sort by priority (highest first)
    this.registry.patternRenderers.push({
      id,
      matcher: matcherFunction,
      component,
      priority
    });

    this.registry.patternRenderers.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Helper method to compare Zod object schemas structurally
   */
  private compareZodObjectSchemas(schema1: z.ZodObject<any>, schema2: z.ZodObject<any>): boolean {
    const shape1 = schema1.shape;
    const shape2 = schema2.shape;
    
    // Check if all keys in schema2 exist in schema1 with matching types
    for (const [key, value2] of Object.entries(shape2)) {
      const value1 = shape1[key];
      if (!value1) return false;
      
      // Cast value2 to z.ZodTypeAny since it comes from a Zod object shape
      const zodValue2 = value2 as z.ZodTypeAny;
      const zodValue1 = value1 as z.ZodTypeAny;
      
      // For literal values, check exact match
      if (zodValue2 instanceof z.ZodLiteral) {
        if (!(zodValue1 instanceof z.ZodLiteral) || zodValue1._def.value !== zodValue2._def.value) {
          return false;
        }
      }
      // For other types, check constructor match
      else if (zodValue1.constructor !== zodValue2.constructor) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Helper method to compare Zod number schemas with constraints
   */
  private compareZodNumberSchemas(schema1: z.ZodNumber, schema2: z.ZodNumber): boolean {
    // Get checks for both schemas
    const checks1 = schema1._def.checks || [];
    const checks2 = schema2._def.checks || [];
    
    // If pattern has no constraints, it matches any number
    if (checks2.length === 0) {
      return true;
    }
    
    // Extract constraints from both schemas
    const getConstraints = (checks: any[]) => {
      const constraints: any = {};
      checks.forEach((check: any) => {
        if (check.kind === 'min') constraints.min = check.value;
        if (check.kind === 'max') constraints.max = check.value;
        if (check.kind === 'int') constraints.int = true;
        if (check.kind === 'multipleOf') constraints.multipleOf = check.value;
      });
      return constraints;
    };
    
    const constraints1 = getConstraints(checks1);
    const constraints2 = getConstraints(checks2);
    
    // Check if all constraints in schema2 are present in schema1 with same values
    for (const [key, value] of Object.entries(constraints2)) {
      if (constraints1[key] !== value) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Helper method to compare Zod string schemas with constraints
   */
  private compareZodStringSchemas(schema1: z.ZodString, schema2: z.ZodString): boolean {
    // Get checks for both schemas
    const checks1 = schema1._def.checks || [];
    const checks2 = schema2._def.checks || [];
    
    // If pattern has no constraints, it matches any string
    if (checks2.length === 0) {
      return true;
    }
    
    // Extract constraints from both schemas
    const getConstraints = (checks: any[]) => {
      const constraints: any = {};
      checks.forEach((check: any) => {
        if (check.kind === 'min') constraints.min = check.value;
        if (check.kind === 'max') constraints.max = check.value;
        if (check.kind === 'email') constraints.email = true;
        if (check.kind === 'url') constraints.url = true;
        if (check.kind === 'uuid') constraints.uuid = true;
        if (check.kind === 'regex') constraints.regex = check.regex.toString();
        if (check.kind === 'length') constraints.length = check.value;
      });
      return constraints;
    };
    
    const constraints1 = getConstraints(checks1);
    const constraints2 = getConstraints(checks2);
    
    // Check if all constraints in schema2 are present in schema1 with same values
    for (const [key, value] of Object.entries(constraints2)) {
      if (constraints1[key] !== value) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Register a complete UI adapter
   */
  registerUIAdapter(adapter: UIAdapter): void {
    this.registry.uiAdapters.set(adapter.name, adapter);
    
    // Register all components from the adapter as field renderers
    Object.entries(adapter.components).forEach(([fieldType, component]) => {
      this.registry.fieldRenderers.set(fieldType as FieldType, component);
    });
    
    // If this is the first adapter and no default is set, make it the default
    if (!this.registry.defaultAdapter) {
      this.registry.defaultAdapter = adapter.name;
    }
  }

  /**
   * Get a registered field renderer for a specific field type
   */
  getRegisteredRenderer(fieldType: FieldType): FieldRendererComponent | undefined {
    return this.registry.fieldRenderers.get(fieldType);
  }

  /**
   * Get a registered UI adapter by name
   */
  getUIAdapter(adapterName: string): UIAdapter | undefined {
    return this.registry.uiAdapters.get(adapterName);
  }

  /**
   * Get the default UI adapter
   */
  getDefaultAdapter(): UIAdapter | undefined {
    if (!this.registry.defaultAdapter) {
      return undefined;
    }
    return this.registry.uiAdapters.get(this.registry.defaultAdapter);
  }

  /**
   * Set the default UI adapter
   */
  setDefaultAdapter(adapterName: string): void {
    if (this.registry.uiAdapters.has(adapterName)) {
      this.registry.defaultAdapter = adapterName;
      
      // Update field renderers with components from the new default adapter
      const adapter = this.registry.uiAdapters.get(adapterName);
      if (adapter) {
        Object.entries(adapter.components).forEach(([fieldType, component]) => {
          this.registry.fieldRenderers.set(fieldType as FieldType, component);
        });
      }
    } else {
      throw new Error(`UI adapter "${adapterName}" not found`);
    }
  }

  /**
   * Get pattern renderer that matches the given schema
   */
  getMatchingPatternRenderer(
    zodSchema: z.ZodTypeAny, 
    parsedField: any, 
    formValue?: any
  ): SchemaPatternRenderer | undefined {
    for (const entry of this.registry.patternRenderers) {
      if (entry.matcher(zodSchema, parsedField, formValue)) {
        return entry.component;
      }
    }
    return undefined;
  }

  /**
   * Remove a pattern renderer by ID
   */
  removeSchemaPatternRenderer(id: string): boolean {
    const originalLength = this.registry.patternRenderers.length;
    this.registry.patternRenderers = this.registry.patternRenderers.filter(
      entry => entry.id !== id
    );
    return this.registry.patternRenderers.length < originalLength;
  }

  /**
   * Get all registered field renderers
   */
  getAllFieldRenderers(): Map<FieldType, FieldRendererComponent> {
    return new Map(this.registry.fieldRenderers);
  }

  /**
   * Get all registered UI adapters
   */
  getAllUIAdapters(): Map<string, UIAdapter> {
    return new Map(this.registry.uiAdapters);
  }

  /**
   * Get all registered pattern renderers
   */
  getAllPatternRenderers(): PatternRegistryEntry[] {
    return [...this.registry.patternRenderers];
  }

  /**
   * Clear all custom field renderers (keeps defaults)
   */
  clearCustomFieldRenderers(): void {
    this.registry.fieldRenderers.clear();
    this.registerDefaultRenderers();
  }

  /**
   * Clear all UI adapters
   */
  clearUIAdapters(): void {
    this.registry.uiAdapters.clear();
    this.registry.defaultAdapter = undefined;
  }

  /**
   * Clear all pattern renderers
   */
  clearPatternRenderers(): void {
    this.registry.patternRenderers = [];
  }

  /**
   * Reset the entire registry to defaults
   */
  reset(): void {
    this.registry = {
      fieldRenderers: new Map(),
      patternRenderers: [], // Initialize empty pattern renderers array
      uiAdapters: new Map(),
      defaultAdapter: this.config.defaultAdapter
    };
    this.registerDefaultRenderers();
  }

  /**
   * Check if a field renderer is registered for a specific type
   */
  hasFieldRenderer(fieldType: FieldType): boolean {
    return this.registry.fieldRenderers.has(fieldType);
  }

  /**
   * Check if a UI adapter is registered
   */
  hasUIAdapter(adapterName: string): boolean {
    return this.registry.uiAdapters.has(adapterName);
  }

  /**
   * Check if a pattern renderer is registered
   */
  hasPatternRenderer(id: string): boolean {
    return this.registry.patternRenderers.some(entry => entry.id === id);
  }

  /**
   * Get the current registry state
   */
  getRegistry(): PluginRegistry {
    return {
      fieldRenderers: new Map(this.registry.fieldRenderers),
      patternRenderers: [...this.registry.patternRenderers], // Deep copy pattern renderers
      uiAdapters: new Map(this.registry.uiAdapters),
      defaultAdapter: this.registry.defaultAdapter
    };
  }

  /**
   * Get the current configuration
   */
  getConfig(): PluginSystemConfig {
    return { ...this.config };
  }

  /**
   * Update the configuration
   */
  updateConfig(newConfig: Partial<PluginSystemConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Create a singleton instance
const pluginRegistry = new PluginRegistryManager();

// Export the singleton instance and the class for testing
export { pluginRegistry, PluginRegistryManager };

// Export convenience functions that use the singleton
export const registerFieldRenderer = (fieldType: FieldType, component: FieldRendererComponent) => {
  pluginRegistry.registerFieldRenderer(fieldType, component);
};

export const registerUIAdapter = (adapter: UIAdapter) => {
  pluginRegistry.registerUIAdapter(adapter);
};

export const getRegisteredRenderer = (fieldType: FieldType) => {
  return pluginRegistry.getRegisteredRenderer(fieldType);
};

export const getUIAdapter = (adapterName: string) => {
  return pluginRegistry.getUIAdapter(adapterName);
};

export const getDefaultAdapter = () => {
  return pluginRegistry.getDefaultAdapter();
};

export const setDefaultAdapter = (adapterName: string) => {
  pluginRegistry.setDefaultAdapter(adapterName);
};

// Export convenience functions for pattern registration
export const registerSchemaPatternRenderer = (
  id: string,
  matcher: SchemaPatternMatcher | z.ZodTypeAny,
  component: SchemaPatternRenderer,
  priority?: number
) => {
  pluginRegistry.registerSchemaPatternRenderer(id, matcher, component, priority);
};

export const getMatchingPatternRenderer = (
  zodSchema: z.ZodTypeAny, 
  parsedField: any, 
  formValue?: any
) => {
  return pluginRegistry.getMatchingPatternRenderer(zodSchema, parsedField, formValue);
};

export const removeSchemaPatternRenderer = (id: string) => {
  return pluginRegistry.removeSchemaPatternRenderer(id);
};

export const getAllPatternRenderers = () => {
  return pluginRegistry.getAllPatternRenderers();
};

export const clearPatternRenderers = () => {
  pluginRegistry.clearPatternRenderers();
}; 