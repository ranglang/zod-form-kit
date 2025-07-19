import { z } from 'zod';

export interface FormGeneratorProps<T extends z.ZodTypeAny> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  defaultValues?: Partial<z.infer<T>>;
  className?: string;
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