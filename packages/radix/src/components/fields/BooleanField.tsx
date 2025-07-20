// React import not needed with new JSX transform
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as SwitchPrimitive from '@radix-ui/react-switch';
// Using a simple checkmark instead of lucide-react for now
import { Label } from '../label';
import { cn } from '../../lib/utils';

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
      <div className={cn("flex items-center space-x-2", className)}>
        <SwitchPrimitive.Root
          id={name}
          name={name}
          checked={value}
          onCheckedChange={onChange}
          className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
        >
          <SwitchPrimitive.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
        </SwitchPrimitive.Root>
        {label && (
          <Label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        {error && (
          <p className="text-sm text-red-500 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <CheckboxPrimitive.Root
        id={name}
        name={name}
        checked={value}
        onCheckedChange={onChange}
        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
} 