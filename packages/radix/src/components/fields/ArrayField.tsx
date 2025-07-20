// React import not needed with new JSX transform
import { Flex, Text, Button, Card, TextField } from '@radix-ui/themes';

// Define the props interface locally
interface ArrayFieldRendererProps {
  name: string;
  label?: string;
  value: any[];
  onChange: (path: string, value: any) => void;
  error?: string;
  required?: boolean;
  className?: string;
  itemSchema: any; // Simplified for now
  errors: Record<string, string>;
  path: string;
  options?: {
    minLength?: number;
    maxLength?: number;
  };
}

export function ArrayField({
  label,
  value = [],
  onChange,
  error,
  required,
  itemSchema,
  errors,
  path,
  options = {},
  className = ''
}: ArrayFieldRendererProps) {
  const { minLength = 0, maxLength } = options;

  const addItem = () => {
    const newValue = [...value, getDefaultValueForSchema(itemSchema)];
    onChange(path, newValue);
  };

  const removeItem = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(path, newValue);
  };

  const updateItem = (index: number, newItemValue: any) => {
    const newValue = [...value];
    newValue[index] = newItemValue;
    onChange(path, newValue);
  };

  const canAddMore = !maxLength || value.length < maxLength;
  const canRemove = value.length > minLength;

  return (
    <Flex direction="column" gap="4" className={className}>
      <Flex align="center" justify="between">
        {label && (
          <Text size="2" weight="medium">
            {label}
            {required && <Text color="red" ml="1">*</Text>}
          </Text>
        )}
        <Button
          type="button"
          variant="outline"
          size="2"
          onClick={addItem}
          disabled={!canAddMore}
        >
          Add Item
        </Button>
      </Flex>
      
      {value.length === 0 ? (
        <Card>
          <Text size="2" color="gray" align="center">
            No items added yet. Click "Add Item" to get started.
          </Text>
        </Card>
      ) : (
        <Flex direction="column" gap="3">
          {value.map((item, index) => (
            <Card key={index}>
              <Flex direction="column" gap="2">
                <Flex align="center" justify="between">
                  <Text size="2" weight="medium">Item {index + 1}</Text>
                  {canRemove && (
                    <Button
                      type="button"
                      variant="soft"
                      color="red"
                      size="1"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </Button>
                  )}
                </Flex>

                {/* Simplified item rendering - would need FieldRenderer integration */}
                <Flex direction="column" gap="2">
                  {typeof item === 'string' ? (
                    <TextField.Root
                      value={item}
                      onChange={(e) => updateItem(index, e.target.value)}
                      placeholder={`Enter ${itemSchema.type || 'value'}`}
                      size="2"
                    />
                  ) : typeof item === 'number' ? (
                    <TextField.Root
                      type="number"
                      value={item.toString()}
                      onChange={(e) => updateItem(index, Number(e.target.value))}
                      placeholder={`Enter ${itemSchema.type || 'number'}`}
                      size="2"
                    />
                  ) : (
                    <Text size="2" color="gray">
                      Complex item type - {JSON.stringify(item)}
                    </Text>
                  )}
                </Flex>

                {errors[`${path}.${index}`] && (
                  <Text size="1" color="red">
                    {errors[`${path}.${index}`]}
                  </Text>
                )}
              </Flex>
            </Card>
          ))}
        </Flex>
      )}

      {error && (
        <Text size="1" color="red">
          {error}
        </Text>
      )}
    </Flex>
  );
}

// Helper function to get default value for a schema
function getDefaultValueForSchema(schema: any): any {
  if (schema.defaultValue !== undefined) return schema.defaultValue;
  
  switch (schema.type) {
    case 'string': return '';
    case 'number': return 0;
    case 'boolean': return false;
    case 'date': return new Date();
    case 'array': return [];
    case 'object': return {};
    default: return null;
  }
} 