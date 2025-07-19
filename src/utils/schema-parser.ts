import { z } from 'zod';

export interface ParsedField {
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object' | 'discriminatedUnion';
  required: boolean;
  label?: string;
  description?: string;
  defaultValue?: any;
  options?: any;
  items?: ParsedField;
  properties?: Record<string, ParsedField>;
  discriminator?: string;
  variants?: Record<string, ParsedField>;
}

export function parseZodSchema(schema: z.ZodTypeAny): ParsedField {
  // Handle optional, nullable, and default wrappers
  if (schema instanceof z.ZodOptional) {
    return { ...parseZodSchema(schema._def.innerType), required: false };
  }
  
  if (schema instanceof z.ZodNullable) {
    return { ...parseZodSchema(schema._def.innerType), required: false };
  }
  
  if (schema instanceof z.ZodDefault) {
    return { 
      ...parseZodSchema(schema._def.innerType), 
      defaultValue: schema._def.defaultValue() 
    };
  }

  // Handle core types
  if (schema instanceof z.ZodString) {
    return {
      type: 'string',
      required: true,
      options: {
        minLength: schema._def.checks?.find(c => c.kind === 'min')?.value,
        maxLength: schema._def.checks?.find(c => c.kind === 'max')?.value,
        pattern: schema._def.checks?.find(c => c.kind === 'regex')?.regex,
        format: getStringFormat(schema._def.checks || [])
      }
    };
  }

  if (schema instanceof z.ZodNumber) {
    return {
      type: 'number',
      required: true,
      options: {
        min: schema._def.checks?.find(c => c.kind === 'min')?.value,
        max: schema._def.checks?.find(c => c.kind === 'max')?.value,
        step: schema._def.checks?.find(c => c.kind === 'int') ? 1 : 'any'
      }
    };
  }

  if (schema instanceof z.ZodBoolean) {
    return { type: 'boolean', required: true };
  }

  if (schema instanceof z.ZodDate) {
    return { type: 'date', required: true };
  }

  if (schema instanceof z.ZodArray) {
    return {
      type: 'array',
      required: true,
      items: parseZodSchema(schema._def.type),
      options: {
        minLength: schema._def.minLength?.value,
        maxLength: schema._def.maxLength?.value
      }
    };
  }

  if (schema instanceof z.ZodObject) {
    const properties: Record<string, ParsedField> = {};
    
    for (const [key, value] of Object.entries(schema._def.shape())) {
      properties[key] = parseZodSchema(value as z.ZodTypeAny);
    }

    return {
      type: 'object',
      required: true,
      properties
    };
  }

  if (schema instanceof z.ZodDiscriminatedUnion) {
    const variants: Record<string, ParsedField> = {};
    
    for (const option of schema._def.options) {
      const discriminatorValue = option._def.shape()[schema._def.discriminator].value;
      variants[discriminatorValue] = parseZodSchema(option);
    }

    return {
      type: 'discriminatedUnion',
      required: true,
      discriminator: schema._def.discriminator,
      variants
    };
  }

  throw new Error(`Unsupported Zod type: ${schema.constructor.name}`);
}

function getStringFormat(checks: any[]): string | undefined {
  for (const check of checks) {
    if (check.kind === 'email') return 'email';
    if (check.kind === 'url') return 'url';
    if (check.kind === 'uuid') return 'uuid';
  }
  return undefined;
}