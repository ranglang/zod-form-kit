export { ZodForm } from './components/ZodForm';
export { FormGenerator } from './components/FormGenerator';
export { FieldRenderer } from './components/FieldRenderer';
export { parseZodSchema } from './utils/schema-parser';
export type { ZodFormProps, FieldProps, ValidFormSchema } from './types/form-generator';
export type { ParsedField } from './utils/schema-parser';

// Plugin System Exports
export { PluginProvider, usePluginContext } from './components/PluginProvider';
export { usePluginSystem } from './hooks/usePluginSystem';
export { 
  registerFieldRenderer, 
  registerUIAdapter, 
  getRegisteredRenderer, 
  getUIAdapter, 
  getDefaultAdapter, 
  setDefaultAdapter,
  // Pattern registration functions
  registerSchemaPatternRenderer,
  getMatchingPatternRenderer,
  removeSchemaPatternRenderer,
  getAllPatternRenderers,
  clearPatternRenderers,
  pluginRegistry 
} from './utils/plugin-registry';

// Plugin System Types
export type {
  FieldType,
  FieldRendererComponent,
  UIAdapter,
  PluginRegistry,
  PluginSystemConfig,
  StringFieldRendererProps,
  NumberFieldRendererProps,
  BooleanFieldRendererProps,
  DateFieldRendererProps,
  ArrayFieldRendererProps,
  ObjectFieldRendererProps,
  DiscriminatedUnionFieldRendererProps,
  StringFieldRenderer,
  NumberFieldRenderer,
  BooleanFieldRenderer,
  DateFieldRenderer,
  ArrayFieldRenderer,
  ObjectFieldRenderer,
  DiscriminatedUnionFieldRenderer,
  // Pattern registration types
  SchemaPatternMatcher,
  SchemaPatternRenderer,
  SchemaPatternRendererProps,
  PatternRegistryEntry
} from './types/plugin-system';

// Export individual field components for custom usage
export { StringField } from './components/fields/StringField';
export { NumberField } from './components/fields/NumberField';
export { BooleanField } from './components/fields/BooleanField';
export { DateField } from './components/fields/DateField';
export { ArrayField } from './components/fields/ArrayField';
export { ObjectField } from './components/fields/ObjectField';
export { DiscriminatedUnionField } from './components/fields/DiscriminatedUnionField';
