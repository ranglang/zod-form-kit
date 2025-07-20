// React import not needed with new JSX transform
import { Label } from '../label';
import { cn } from '../../lib/utils';
import { StringField } from './StringField';
import { NumberField } from './NumberField';
import { BooleanField } from './BooleanField';
import { DateField } from './DateField';
import type { ObjectFieldRendererProps } from '@zod-form-kit/core';

export function ObjectField({
  name,
  label,
  value = {},
  onChange,
  error,
  required,
  properties = {},
  errors = {},
  path,
  className = ''
}: ObjectFieldRendererProps) {
  const handlePropertyChange = (propertyPath: string, propertyValue: any) => {
    // Call onChange with the property path and value as expected by core
    onChange(propertyPath, propertyValue);
  };

  const renderPropertyField = (
    propertyName: string, 
    propertySchema: any, 
    propertyValue: any, 
    propertyError?: string
  ) => {
    const propertyPath = path ? `${path}.${propertyName}` : propertyName;
    
    const fieldProps = {
      name: `${name}-${propertyName}`,
      label: propertySchema.label || propertyName,
      value: propertyValue,
      onChange: (newValue: any) => handlePropertyChange(propertyPath, newValue),
      error: propertyError,
      required: propertySchema.required,
      path: propertyPath
    };

    // Render the appropriate field component based on type
    switch (propertySchema.type) {
      case 'string':
        return <StringField {...fieldProps} />;
        
      case 'number':
        return <NumberField {...fieldProps} />;
        
      case 'boolean':
        return <BooleanField {...fieldProps} />;
        
      case 'date':
        return <DateField {...fieldProps} />;
        
      case 'object':
        return (
          <ObjectField 
            {...fieldProps} 
            properties={propertySchema.properties || {}}
            errors={errors}
          />
        );
        
      default:
        // Fallback for unsupported types
        return (
          <div className="text-sm text-muted-foreground p-2 border border-dashed rounded">
            <div className="font-medium mb-1">Unsupported field type: {propertySchema.type}</div>
            <div className="text-xs">Property: {propertyName}</div>
            <div className="text-xs">Current value: {JSON.stringify(propertyValue)}</div>
          </div>
        );
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <div className="space-y-2">
          <Label htmlFor={name}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <hr className="border-border" />
        </div>
      )}
      
      <div className={cn(
        "space-y-4",
        "pl-4 border-l-2 border-border"
      )}>
        {Object.entries(properties).map(([propertyName, propertySchema]) => {
          // Skip if schema is undefined
          if (!propertySchema) {
            console.warn(`ObjectField: Schema for property '${propertyName}' is undefined`);
            return null;
          }
          
          const propertyValue = value[propertyName];
          const propertyError = errors?.[`${path}.${propertyName}`] || errors?.[propertyName];
          
          return (
            <div key={propertyName}>
              {renderPropertyField(propertyName, propertySchema, propertyValue, propertyError)}
            </div>
          );
        })}
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-2">
          {error}
        </p>
      )}
    </div>
  );
} 