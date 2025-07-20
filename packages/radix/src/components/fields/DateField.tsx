// React import not needed with new JSX transform
import { Input } from '../input';
import { Label } from '../label';
import { cn } from '../../lib/utils';

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
        type={format}
        value={formatDateForInput(value)}
        onChange={handleChange}
        className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        required={required}
        min={min}
        max={max}
      />
      
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
} 