import { createContext, useContext, ReactNode } from 'react';
import { usePluginSystem } from '../hooks/usePluginSystem';
import { 
  PluginSystemConfig, 
  FieldType, 
  FieldRendererComponent, 
  UIAdapter,
  SchemaPatternMatcher,
  SchemaPatternRenderer
} from '../types/plugin-system';
import { z } from 'zod';

interface PluginSystemContextValue {
  registerFieldRenderer: (fieldType: FieldType, component: FieldRendererComponent) => void;
  registerUIAdapter: (adapter: UIAdapter) => void;
  getRegisteredRenderer: (fieldType: FieldType) => FieldRendererComponent | undefined;
  getUIAdapter: (adapterName: string) => UIAdapter | undefined;
  getDefaultAdapter: () => UIAdapter | undefined;
  setDefaultAdapter: (adapterName: string) => void;
  // Pattern registration methods
  registerSchemaPatternRenderer: (
    id: string,
    matcher: SchemaPatternMatcher | z.ZodTypeAny,
    component: SchemaPatternRenderer,
    priority?: number
  ) => void;
  getMatchingPatternRenderer: (
    zodSchema: z.ZodTypeAny, 
    parsedField: any, 
    formValue?: any
  ) => SchemaPatternRenderer | undefined;
  removeSchemaPatternRenderer: (id: string) => boolean;
  getAllPatternRenderers: () => any[];
  clearPatternRenderers: () => void;
  registry: any;
}

const PluginSystemContext = createContext<PluginSystemContextValue | undefined>(undefined);

interface PluginProviderProps {
  children: ReactNode;
  config?: PluginSystemConfig;
}

export function PluginProvider({ children, config: _config }: PluginProviderProps) {
  const pluginSystem = usePluginSystem();

  return (
    <PluginSystemContext.Provider value={pluginSystem}>
      {children}
    </PluginSystemContext.Provider>
  );
}

export function usePluginContext() {
  const context = useContext(PluginSystemContext);
  if (context === undefined) {
    throw new Error('usePluginContext must be used within a PluginProvider');
  }
  return context;
} 