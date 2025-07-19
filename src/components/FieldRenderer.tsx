import React from 'react';
import { ParsedField } from '../utils/schema-parser';
import { StringField } from './fields/StringField';
import { NumberField } from './fields/NumberField';
import { BooleanField } from './fields/BooleanField';
import { DateField } from './fields/DateField';
import { ArrayField } from './fields/ArrayField';
import { ObjectField } from './fields/ObjectField';
import { DiscriminatedUnionField } from './fields/DiscriminatedUnionField';

interface FieldRendererProps {
  schema: ParsedField;
  value: any;
  onChange: (path: string, value: any) => void;
  errors: Record<string, string>;
  path: string;
  label?: string;
}

export function FieldRenderer({
  schema,
  value,
  onChange,
  errors,
  path,
  label
}: FieldRendererProps) {
  const fieldProps = {
    value,
    onChange: (newValue: any) => onChange(path, newValue),
    error: errors[path],
    required: schema.required,
    label: label || path.split('.').pop() || '',
    name: path
  };

  switch (schema.type) {
    case 'string':
      return <StringField {...fieldProps} options={schema.options} />;
    
    case 'number':
      return <NumberField {...fieldProps} options={schema.options} />;
    
    case 'boolean':
      return <BooleanField {...fieldProps} />;
    
    case 'date':
      return <DateField {...fieldProps} />;
    
    case 'array':
      return (
        <ArrayField
          {...fieldProps}
          itemSchema={schema.items!}
          onChange={onChange}
          errors={errors}
          path={path}
          options={schema.options}
        />
      );
    
    case 'object':
      return (
        <ObjectField
          {...fieldProps}
          properties={schema.properties!}
          onChange={onChange}
          errors={errors}
          path={path}
        />
      );
    
    case 'discriminatedUnion':
      return (
        <DiscriminatedUnionField
          {...fieldProps}
          discriminator={schema.discriminator!}
          variants={schema.variants!}
          onChange={onChange}
          errors={errors}
          path={path}
        />
      );
    
    default:
      return <div>Unsupported field type: {schema.type}</div>;
  }
}