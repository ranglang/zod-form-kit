// React import not needed with new JSX transform
import { Flex, Text, Separator, Card } from '@radix-ui/themes';
import { StringField } from './StringField';
import { NumberField } from './NumberField';
import { BooleanField } from './BooleanField';
import { DateField } from './DateField';
import type { ObjectFieldRendererProps } from 'zod-form-kit';

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
          <Card variant="surface">
            <Flex direction="column" gap="1">
              <Text size="2" weight="medium">Unsupported field type: {propertySchema.type}</Text>
              <Text size="1" color="gray">Property: {propertyName}</Text>
              <Text size="1" color="gray">Current value: {JSON.stringify(propertyValue)}</Text>
            </Flex>
          </Card>
        );
    }
  };

  return (
    <Flex direction="column" gap="4" className={className}>
      {label && (
        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">
            {label}
            {required && <Text color="red" ml="1">*</Text>}
          </Text>
          <Separator size="4" />
        </Flex>
      )}

      <Card variant="surface">
        <Flex direction="column" gap="4">
          {Object.entries(properties).map(([propertyName, propertySchema]) => {
            // Skip if schema is undefined
            if (!propertySchema) {
              console.warn(`ObjectField: Schema for property '${propertyName}' is undefined`);
              return null;
            }

            const propertyValue = value[propertyName];
            const propertyError = errors?.[`${path}.${propertyName}`] || errors?.[propertyName];

            return (
              <Flex key={propertyName} direction="column">
                {renderPropertyField(propertyName, propertySchema, propertyValue, propertyError)}
              </Flex>
            );
          })}
        </Flex>
      </Card>

      {error && (
        <Text size="1" color="red">
          {error}
        </Text>
      )}
    </Flex>
  );
} 