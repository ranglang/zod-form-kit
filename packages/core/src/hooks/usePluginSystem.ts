import { useCallback } from 'react';
import {
  FieldType,
  FieldRendererComponent,
  UIAdapter,
  SchemaPatternMatcher,
  SchemaPatternRenderer
} from '../types/plugin-system';
import {
  pluginRegistry,
  registerFieldRenderer,
  registerUIAdapter,
  getRegisteredRenderer,
  getUIAdapter,
  getDefaultAdapter,
  setDefaultAdapter,
  registerSchemaPatternRenderer,
  getMatchingPatternRenderer,
  removeSchemaPatternRenderer,
  getAllPatternRenderers,
  clearPatternRenderers
} from '../utils/plugin-registry';
import { z } from 'zod';

/**
 * React hook for accessing the plugin system functionality
 */
export function usePluginSystem() {
  const registerFieldRendererCallback = useCallback((
    fieldType: FieldType,
    component: FieldRendererComponent
  ) => {
    registerFieldRenderer(fieldType, component);
  }, []);

  const registerUIAdapterCallback = useCallback((adapter: UIAdapter) => {
    registerUIAdapter(adapter);
  }, []);

  const getRegisteredRendererCallback = useCallback((fieldType: FieldType) => {
    return getRegisteredRenderer(fieldType);
  }, []);

  const getUIAdapterCallback = useCallback((adapterName: string) => {
    return getUIAdapter(adapterName);
  }, []);

  const getDefaultAdapterCallback = useCallback(() => {
    return getDefaultAdapter();
  }, []);

  const setDefaultAdapterCallback = useCallback((adapterName: string) => {
    setDefaultAdapter(adapterName);
  }, []);

  // Pattern registration callbacks
  const registerSchemaPatternRendererCallback = useCallback((
    id: string,
    matcher: SchemaPatternMatcher | z.ZodTypeAny,
    component: SchemaPatternRenderer,
    priority?: number
  ) => {
    registerSchemaPatternRenderer(id, matcher, component, priority);
  }, []);

  const getMatchingPatternRendererCallback = useCallback((
    zodSchema: z.ZodTypeAny, 
    parsedField: any, 
    formValue?: any
  ) => {
    return getMatchingPatternRenderer(zodSchema, parsedField, formValue);
  }, []);

  const removeSchemaPatternRendererCallback = useCallback((id: string) => {
    return removeSchemaPatternRenderer(id);
  }, []);

  const getAllPatternRenderersCallback = useCallback(() => {
    return getAllPatternRenderers();
  }, []);

  const clearPatternRenderersCallback = useCallback(() => {
    clearPatternRenderers();
  }, []);

  return {
    // Registration methods
    registerFieldRenderer: registerFieldRendererCallback,
    registerUIAdapter: registerUIAdapterCallback,
    
    // Retrieval methods
    getRegisteredRenderer: getRegisteredRendererCallback,
    getUIAdapter: getUIAdapterCallback,
    getDefaultAdapter: getDefaultAdapterCallback,
    
    // Configuration methods
    setDefaultAdapter: setDefaultAdapterCallback,
    
    // Pattern registration methods
    registerSchemaPatternRenderer: registerSchemaPatternRendererCallback,
    getMatchingPatternRenderer: getMatchingPatternRendererCallback,
    removeSchemaPatternRenderer: removeSchemaPatternRendererCallback,
    getAllPatternRenderers: getAllPatternRenderersCallback,
    clearPatternRenderers: clearPatternRenderersCallback,
    
    // Direct access to registry for advanced usage
    registry: pluginRegistry
  };
} 