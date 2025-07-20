// React import not needed with new JSX transform
import { Flex, Text, TextField } from '@radix-ui/themes';

// Define the props interface locally
interface StringFieldRendererProps {
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
  options?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    format?: string;
    readonly?: boolean;
  };
}

export function StringField({
  name,
  label,
  value = '',
  onChange,
  error,
  required,
  options = {},
  className = ''
}: StringFieldRendererProps) {
  const inputType = getInputType(options.format);
  
  return (
    <Flex direction="column" gap="2" className={className}>
      {label && (
        <Text as="label" htmlFor={name} size="2" weight="medium">
          {label}
          {required && <Text color="red" ml="1">*</Text>}
        </Text>
      )}

      <TextField.Root
        id={name}
        name={name}
        type={inputType as any}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        color={error ? "red" : undefined}
        variant="surface"
        size="2"
        required={required}
        readOnly={options.readonly}
        minLength={options.minLength}
        maxLength={options.maxLength}
        pattern={options.pattern?.source}
        placeholder={options.format === 'email' ? 'Enter email address' :
                   options.format === 'url' ? 'Enter URL' :
                   label ? `Enter ${label.toLowerCase()}` : undefined}
      />

      {error && (
        <Text size="1" color="red">
          {error}
        </Text>
      )}
    </Flex>
  );
}

function getInputType(format?: string): string {
  switch (format) {
    case 'email': return 'email';
    case 'url': return 'url';
    case 'password': return 'password';
    default: return 'text';
  }
} 