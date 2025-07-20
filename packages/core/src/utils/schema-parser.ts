import { z } from 'zod';

// Define the shape of a parsed field. This will be used to render the form.
export type ParsedField = {
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'object' | 'discriminatedUnion' | 'array';
  required: boolean;
  defaultValue?: any;
  literalValue?: any; // For ZodLiteral types
  isRecord?: boolean; // For ZodRecord types
  [key: string]: any; // Allow other properties
}

/**
 * Parses a Zod schema and returns a simplified representation of it.
 * This is used to dynamically render a form based on the schema.
 * @param schema The Zod schema to parse.
 * @returns A simplified representation of the schema.
 */
export function parseZodSchema(schema: z.ZodTypeAny): ParsedField {
  // Handle optional, nullable, and default values
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return { ...parseZodSchema(schema._def.innerType), required: false };
  }
  if (schema instanceof z.ZodDefault) {
    return { ...parseZodSchema(schema._def.innerType), defaultValue: schema._def.defaultValue() };
  }

  // Handle complex types
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const properties = Object.fromEntries(
      Object.entries(shape).map(([key, value]) => [key, parseZodSchema(value as z.ZodTypeAny)])
    );
    return { type: 'object', properties, required: true };
  }

  if (schema instanceof z.ZodDiscriminatedUnion) {
    const options = schema.options;
    const discriminatorKey = schema.discriminator;
    const variants = Object.fromEntries(
      options.map((option: z.ZodObject<any>) => [option.shape[discriminatorKey].value, parseZodSchema(option)])
    );
    return { type: 'discriminatedUnion', variants, required: true, discriminator: discriminatorKey };
  }

  // Handle primitive types
  if (schema instanceof z.ZodString) {
    return { type: 'string', required: true };
  }
  if (schema instanceof z.ZodNumber) {
    return { type: 'number', required: true };
  }
  if (schema instanceof z.ZodBoolean) {
    return { type: 'boolean', required: true };
  }
  if (schema instanceof z.ZodDate) {
    return { type: 'date', required: true };
  }
  if (schema instanceof z.ZodEnum) {
    return { type: 'enum', values: schema.options, required: true };
  }
  
  if (schema instanceof z.ZodArray) {
    return { type: 'array', items: parseZodSchema(schema.element), required: true };
  }

  if (schema instanceof z.ZodUnion) {
    // This is a simplified handling. We just take the first type in the union.
    // A more robust implementation would handle each type in the union.
    return parseZodSchema(schema.options[0]);
  }

  if (schema instanceof z.ZodLiteral) {
    return { type: 'string', required: true, literalValue: schema.value };
  }

  if (schema instanceof z.ZodRecord) {
    return { type: 'object', required: true, isRecord: true };
  }

  // Fallback for unknown types
  throw new Error(`Unsupported schema type: ${schema.constructor.name}`);
}