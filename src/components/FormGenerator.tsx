import React, { useState } from 'react';
import { z } from 'zod';
import { FormGeneratorProps } from '../types/form-generator';
import { FieldRenderer } from './FieldRenderer';
import { parseZodSchema } from '../utils/schema-parser';

export function FormGenerator<T extends z.ZodTypeAny>({
  schema,
  onSubmit,
  defaultValues = {},
  className = ''
}: FormGeneratorProps<T>) {
  const [formData, setFormData] = useState<any>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const validatedData = schema.parse(formData);
      setErrors({});
      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (path: string, value: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
    
    // Clear error for this field
    if (errors[path]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[path];
        return newErrors;
      });
    }
  };

  const parsedSchema = parseZodSchema(schema);

  return (
    <form onSubmit={handleSubmit} className={`form-generator ${className}`}>
      <FieldRenderer
        schema={parsedSchema}
        value={formData}
        onChange={handleFieldChange}
        errors={errors}
        path=""
      />
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}