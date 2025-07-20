// React import not needed with new JSX transform
import { Flex, Text, TextField } from '@radix-ui/themes';

// Define the props interface locally to avoid import issues for now
interface NumberFieldRendererProps {
  name: string;
  label?: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  required?: boolean;
  className?: string;
  options?: {
    min?: number;
    max?: number;
    step?: number;
    readonly?: boolean;
    showSlider?: boolean;
  };
}

export function NumberField({
  name,
  label,
  value = 0,
  onChange,
  error,
  required,
  options = {},
  className = ''
}: NumberFieldRendererProps) {
  const { min, max, step = 1, readonly } = options;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      onChange(0);
    } else {
      const numericValue = Number(inputValue);
      // Only call onChange if we have a valid number
      if (!isNaN(numericValue)) {
        onChange(numericValue);
      }
    }
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
        type="number"
        value={value.toString()}
        onChange={handleInputChange}
        color={error ? "red" : undefined}
        variant="surface"
        size="2"
        required={required}
        readOnly={readonly}
        min={min}
        max={max}
        step={step}
      />

      {error && (
        <Text size="1" color="red">
          {error}
        </Text>
      )}
    </Flex>
  );
} 