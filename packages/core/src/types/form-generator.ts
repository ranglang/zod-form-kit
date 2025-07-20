import { z } from 'zod';
import { UIAdapter } from './plugin-system';

// A Zod schema for a discriminated union's option, requiring a 'variant' literal.
type ZodDiscriminatedUnionOption<T extends string> = z.ZodObject<{
  variant: z.ZodLiteral<T>;
  [key: string]: z.ZodTypeAny;
}>;

// A Zod schema for a discriminated union with 'variant' as the discriminator.
export type ZodDiscriminatedUnion<T extends string> = z.ZodDiscriminatedUnion<'variant', [ZodDiscriminatedUnionOption<T>, ...ZodDiscriminatedUnionOption<T>[]]>;

// Defines the primitive types that are supported by the form generator.
export const supportedPrimitives = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.date(),
  z.enum(['']), // Placeholder for enums
]);

// A recursive type for a valid form schema.
export type ValidFormSchema = 
  | z.ZodObject<Record<string, any>>
  | ZodDiscriminatedUnion<string>
  | typeof supportedPrimitives;

// The props for the ZodForm component, now with a more restrictive schema type.
export interface ZodFormProps<T extends ValidFormSchema> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void;
  defaultValues?: Partial<z.infer<T>>;
  className?: string;
  /** 
   * UI adapter to register and automatically set as the default theme adapter.
   * When provided, this adapter will be registered and set as the default for the form.
   */
  registerUIAdapter?: UIAdapter;
}

export interface FieldProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export type SupportedZodTypes = 
  | z.ZodString
  | z.ZodNumber
  | z.ZodBoolean
  | z.ZodDate
  | z.ZodArray<any>
  | z.ZodObject<any>
  | z.ZodDiscriminatedUnion<any, any>
  | z.ZodOptional<any>
  | z.ZodNullable<any>
  | z.ZodDefault<any>;