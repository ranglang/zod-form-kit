// React import not needed with new JSX transform
import * as SelectPrimitive from '@radix-ui/react-select';
import { Label } from '../label';
import { cn } from '../../lib/utils';

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
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <SelectPrimitive.Root value={value} onValueChange={onChange}>
        <SelectPrimitive.Trigger
          id={name}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500"
          )}
        >
          <SelectPrimitive.Value placeholder="Select an option..." />
          <SelectPrimitive.Icon asChild>
            <svg className="h-4 w-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
            <SelectPrimitive.Viewport className="p-1">
              {values.map((option) => (
                <SelectPrimitive.Item
                  key={option}
                  value={option}
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <SelectPrimitive.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText>{option}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
} 