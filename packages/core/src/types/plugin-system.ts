import React from 'react';
import { ParsedField } from '../utils/schema-parser';
import { FieldProps } from './form-generator';
import { z } from 'zod';

// Base field renderer props that all field renderers must accept
export interface BaseFieldRendererProps extends FieldProps {
  value: any;
  error?: string;
  required?: boolean;
  name: string;
  label?: string;
  className?: string;
}

// Specific field renderer props for each field type
export interface StringFieldRendererProps extends BaseFieldRendererProps {
  value: string;
  onChange: (value: string) => void;
  options?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    format?: string;
    readonly?: boolean;
  };
}

export interface NumberFieldRendererProps extends BaseFieldRendererProps {
  value: number;
  onChange: (value: number) => void;
  options?: {
    min?: number;
    max?: number;
    step?: number;
    readonly?: boolean;
  };
}

export interface BooleanFieldRendererProps extends BaseFieldRendererProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export interface DateFieldRendererProps extends BaseFieldRendererProps {
  value: Date | null;
  onChange: (value: Date | null) => void;
}

export interface ArrayFieldRendererProps extends BaseFieldRendererProps {
  value: any[];
  onChange: (path: string, value: any) => void;
  itemSchema: ParsedField;
  errors: Record<string, string>;
  path: string;
  options?: {
    minLength?: number;
    maxLength?: number;
  };
}

export interface ObjectFieldRendererProps extends BaseFieldRendererProps {
  value: Record<string, any>;
  onChange: (path: string, value: any) => void;
  properties: Record<string, ParsedField>;
  errors: Record<string, string>;
  path: string;
}

export interface DiscriminatedUnionFieldRendererProps extends BaseFieldRendererProps {
  value: Record<string, any>;
  onChange: (path: string, value: any) => void;
  discriminator: string;
  variants: Record<string, ParsedField>;
  errors: Record<string, string>;
  path: string;
}

// Field renderer component types
export type StringFieldRenderer = React.ComponentType<StringFieldRendererProps>;
export type NumberFieldRenderer = React.ComponentType<NumberFieldRendererProps>;
export type BooleanFieldRenderer = React.ComponentType<BooleanFieldRendererProps>;
export type DateFieldRenderer = React.ComponentType<DateFieldRendererProps>;
export type ArrayFieldRenderer = React.ComponentType<ArrayFieldRendererProps>;
export type ObjectFieldRenderer = React.ComponentType<ObjectFieldRendererProps>;
export type DiscriminatedUnionFieldRenderer = React.ComponentType<DiscriminatedUnionFieldRendererProps>;

// Union type for all field renderers
export type FieldRendererComponent = 
  | StringFieldRenderer
  | NumberFieldRenderer
  | BooleanFieldRenderer
  | DateFieldRenderer
  | ArrayFieldRenderer
  | ObjectFieldRenderer
  | DiscriminatedUnionFieldRenderer;

// Field type enum
export type FieldType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'enum'
  | 'array'
  | 'object'
  | 'discriminatedUnion';

// =============================================================================
// SCHEMA PATTERN MATCHING EXTENSION
// =============================================================================

// Schema pattern matcher function type - takes a Zod schema and returns true if it matches
export type SchemaPatternMatcher = (zodSchema: z.ZodTypeAny, parsedField: ParsedField, formValue?: any) => boolean;

// Schema pattern renderer props - enhanced with schema information
export interface SchemaPatternRendererProps extends BaseFieldRendererProps {
  value: any;
  onChange: (value: any) => void;
  zodSchema: z.ZodTypeAny;
  parsedField: ParsedField;
  form: any; // TanStack Form instance
  path: string;
}

// Schema pattern renderer component type
export type SchemaPatternRenderer = React.ComponentType<SchemaPatternRendererProps>;

// Pattern registry entry
export interface PatternRegistryEntry {
  id: string; // Unique identifier for the pattern
  matcher: SchemaPatternMatcher;
  component: SchemaPatternRenderer;
  priority: number; // Higher numbers = higher priority (checked first)
}

// Extended plugin registry interface with pattern support
export interface PluginRegistry {
  fieldRenderers: Map<FieldType, FieldRendererComponent>;
  patternRenderers: PatternRegistryEntry[]; // Array to maintain priority order
  uiAdapters: Map<string, UIAdapter>;
  defaultAdapter?: string;
}

// UI Adapter interface
export interface UIAdapter {
  name: string;
  components: {
    string?: StringFieldRenderer;
    number?: NumberFieldRenderer;
    boolean?: BooleanFieldRenderer;
    date?: DateFieldRenderer;
    array?: ArrayFieldRenderer;
    object?: ObjectFieldRenderer;
    discriminatedUnion?: DiscriminatedUnionFieldRenderer;
  };
}

// Plugin system configuration
export interface PluginSystemConfig {
  defaultAdapter?: string;
  fallbackToDefaults?: boolean;
} 