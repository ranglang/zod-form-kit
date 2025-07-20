// React import not needed with new JSX transform
import { Flex, Text, Checkbox, Switch } from '@radix-ui/themes';

// Define the props interface locally
interface BooleanFieldRendererProps {
  name: string;
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  error?: string;
  required?: boolean;
  className?: string;
  options?: {
    variant?: 'checkbox' | 'switch';
  };
}

export function BooleanField({
  name,
  label,
  value = false,
  onChange,
  error,
  required,
  options = {},
  className = ''
}: BooleanFieldRendererProps) {
  const { variant = 'checkbox' } = options;

  if (variant === 'switch') {
    return (
      <Flex direction="column" gap="2" className={className}>
        <Text as="label" size="2" weight="medium">
          <Flex align="center" gap="2">
            <Switch
              id={name}
              name={name}
              checked={value}
              onCheckedChange={onChange}
              size="2"
            />
            {label}
            {required && <Text color="red" ml="1">*</Text>}
          </Flex>
        </Text>
        {error && (
          <Text size="1" color="red">
            {error}
          </Text>
        )}
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="2" className={className}>
      <Text as="label" size="2" weight="medium">
        <Flex align="center" gap="2">
          <Checkbox
            id={name}
            name={name}
            checked={value}
            onCheckedChange={onChange}
            size="2"
          />
          {label}
          {required && <Text color="red" ml="1">*</Text>}
        </Flex>
      </Text>
      {error && (
        <Text size="1" color="red">
          {error}
        </Text>
      )}
    </Flex>
  );
} 