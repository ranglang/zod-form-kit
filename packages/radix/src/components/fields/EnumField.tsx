// React import not needed with new JSX transform
import { Flex, Text, Select } from '@radix-ui/themes';

// Define the props interface locally
interface EnumFieldRendererProps {
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
  values: string[];
}

export function EnumField({
  name,
  label,
  value = '',
  onChange,
  error,
  required,
  values,
  className = ''
}: EnumFieldRendererProps) {
  return (
    <Flex direction="column" gap="2" className={className}>
      {label && (
        <Text as="label" htmlFor={name} size="2" weight="medium">
          {label}
          {required && <Text color="red" ml="1">*</Text>}
        </Text>
      )}

      <Select.Root value={value} onValueChange={onChange} size="2">
        <Select.Trigger
          placeholder="Select an option..."
          color={error ? "red" : undefined}
          variant="surface"
        />
        <Select.Content>
          {values.map((option) => (
            <Select.Item key={option} value={option}>
              {option}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      {error && (
        <Text size="1" color="red">
          {error}
        </Text>
      )}
    </Flex>
  );
} 