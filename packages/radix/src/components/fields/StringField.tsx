// React import not needed with new JSX transform
import { Input } from '../input';
import { Label } from '../label';
import { cn } from '../../lib/utils';

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
        type={inputType}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className={cn(error && "border-red-500 focus-visible:ring-red-500")}
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
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
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