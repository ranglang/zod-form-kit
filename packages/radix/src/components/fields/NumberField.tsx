// React import not needed with new JSX transform
import { Input } from '../input';
import { Label } from '../label';
import { cn } from '../../lib/utils';

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
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <Input
        id={name}
        name={name}
        type="number"
        value={value}
        onChange={handleInputChange}
        className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        required={required}
        readOnly={readonly}
        min={min}
        max={max}
        step={step}
      />
      
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
} 