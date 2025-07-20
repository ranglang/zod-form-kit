// React import not needed with new JSX transform
import { Flex, Text, TextField } from '@radix-ui/themes';

// Define the props interface locally
interface DateFieldRendererProps {
  name: string;
  label?: string;
  value: Date | null;
  onChange: (value: Date | null) => void;
  error?: string;
  required?: boolean;
  className?: string;
  options?: {
    format?: 'date' | 'datetime-local' | 'time';
    min?: string;
    max?: string;
  };
}

export function DateField({
  name,
  label,
  value = null,
  onChange,
  error,
  required,
  options = {},
  className = ''
}: DateFieldRendererProps) {
  const { format = 'date', min, max } = options;
  
  // Convert Date to string format for input
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    
    switch (format) {
      case 'datetime-local':
        return date.toISOString().slice(0, 16);
      case 'time':
        return date.toTimeString().slice(0, 5);
      case 'date':
      default:
        return date.toISOString().split('T')[0];
    }
  };

  // Convert string input to Date
  const parseInputDate = (value: string): Date | null => {
    if (!value) return null;
    
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = parseInputDate(e.target.value);
    onChange(newDate);
  };

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
        type={format}
        value={formatDateForInput(value)}
        onChange={handleChange}
        color={error ? "red" : undefined}
        variant="surface"
        size="2"
        required={required}
        min={min}
        max={max}
      />

      {error && (
        <Text size="1" color="red">
          {error}
        </Text>
      )}
    </Flex>
  );
} 