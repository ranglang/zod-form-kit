// React import not needed with new JSX transform
import { Flex, Text, Select, Card, TextField, Checkbox } from '@radix-ui/themes';

// Define the props interface locally
interface DiscriminatedUnionFieldRendererProps {
  name: string;
  label?: string;
  value: Record<string, any>;
  onChange: (path: string, value: any) => void;
  error?: string;
  required?: boolean;
  className?: string;
  discriminator: string;
  variants: Record<string, any>; // Simplified schema for now
  errors: Record<string, string>;
  path: string;
}

export function DiscriminatedUnionField({
  name,
  label,
  value = {},
  onChange,
  error,
  required,
  discriminator,
  variants,
  errors,
  path,
  className = ''
}: DiscriminatedUnionFieldRendererProps) {
  const currentVariant = value[discriminator];
  const variantOptions = Object.keys(variants);

  const handleVariantChange = (newVariant: string) => {
    // Reset the object with just the discriminator when variant changes
    const newValue = { [discriminator]: newVariant };
    onChange(path, newValue);
  };

  const handleVariantPropertyChange = (propertyName: string, propertyValue: any) => {
    const newValue = { ...value, [propertyName]: propertyValue };
    onChange(path, newValue);
  };

  return (
    <Flex direction="column" gap="4" className={className}>
      {label && (
        <Text size="2" weight="medium">
          {label}
          {required && <Text color="red" ml="1">*</Text>}
        </Text>
      )}

      {/* Discriminator selector */}
      <Flex direction="column" gap="2">
        <Text as="label" htmlFor={`${name}-discriminator`} size="2" weight="medium">Type</Text>
        <Select.Root value={currentVariant || ''} onValueChange={handleVariantChange} size="2">
          <Select.Trigger placeholder="Select type..." />
          <Select.Content>
            {variantOptions.map((variant) => (
              <Select.Item key={variant} value={variant}>
                {variant}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* Variant-specific fields */}
      {currentVariant && variants[currentVariant] && (
        <Card>
          <Flex direction="column" gap="4">
            <Text size="2" weight="bold">
              {currentVariant} Properties
            </Text>

            <Flex direction="column" gap="3">
              {Object.entries(variants[currentVariant].properties || {}).map(([propertyName, propertySchema]) => {
                // Skip the discriminator property as it's handled above
                if (propertyName === discriminator) return null;

                const propertyPath = `${path}.${propertyName}`;
                const propertyValue = value[propertyName];
                const propertyError = errors[propertyPath];

                return (
                  <Flex key={propertyName} direction="column" gap="2">
                    <Text as="label" htmlFor={`${name}-${propertyName}`} size="2" weight="medium">
                      {(propertySchema as any).label || propertyName}
                      {(propertySchema as any).required && <Text color="red" ml="1">*</Text>}
                    </Text>

                    {renderVariantPropertyField(
                      `${name}-${propertyName}`,
                      propertyName,
                      propertyValue,
                      propertySchema as any,
                      propertyError,
                      (newValue) => handleVariantPropertyChange(propertyName, newValue)
                    )}

                    {propertyError && (
                      <Text size="1" color="red">
                        {propertyError}
                      </Text>
                    )}
                  </Flex>
                );
              })}
            </Flex>
          </Flex>
        </Card>
      )}

      {error && (
        <Text size="1" color="red">
          {error}
        </Text>
      )}
    </Flex>
  );
}

// Helper function to render variant property fields
function renderVariantPropertyField(
  id: string,
  name: string,
  value: any,
  schema: any,
  error: string | undefined,
  onChange: (value: any) => void
) {
  switch (schema.type) {
    case 'string':
      return (
        <TextField.Root
          id={id}
          name={name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          color={error ? "red" : undefined}
          variant="surface"
          size="2"
          placeholder={`Enter ${schema.label || name}`}
        />
      );

    case 'number':
      return (
        <TextField.Root
          id={id}
          name={name}
          type="number"
          value={(value || 0).toString()}
          onChange={(e) => onChange(Number(e.target.value))}
          color={error ? "red" : undefined}
          variant="surface"
          size="2"
          min={schema.min}
          max={schema.max}
          step={schema.step}
        />
      );

    case 'boolean':
      return (
        <Text as="label" size="2">
          <Flex align="center" gap="2">
            <Checkbox
              id={id}
              name={name}
              checked={value || false}
              onCheckedChange={onChange}
              size="2"
            />
            Yes
          </Flex>
        </Text>
      );

    default:
      return (
        <Card variant="surface">
          <Text size="2" color="gray">
            Unsupported property type: {schema.type}
            <br />
            Current value: {JSON.stringify(value)}
          </Text>
        </Card>
      );
  }
}