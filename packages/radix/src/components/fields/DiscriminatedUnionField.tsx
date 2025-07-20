// React import not needed with new JSX transform
import * as SelectPrimitive from '@radix-ui/react-select';
import { Label } from '../label';
import { cn } from '../../lib/utils';

// Define the props interface locally
interface DiscriminatedUnionFieldRendererProps {
  name: string;
  label?: string;
  value: Record<string, any>;
  onChange: (path: string, value: any) => void;
  error?: string;
  required?: boolean;
  className?: string;
  discriminator: string;
  variants: Record<string, any>; // Simplified schema for now
  errors: Record<string, string>;
  path: string;
}

export function DiscriminatedUnionField({
  name,
  label,
  value = {},
  onChange,
  error,
  required,
  discriminator,
  variants,
  errors,
  path,
  className = ''
}: DiscriminatedUnionFieldRendererProps) {
  const currentVariant = value[discriminator];
  const variantOptions = Object.keys(variants);

  const handleVariantChange = (newVariant: string) => {
    // Reset the object with just the discriminator when variant changes
    const newValue = { [discriminator]: newVariant };
    onChange(path, newValue);
  };

  const handleVariantPropertyChange = (propertyName: string, propertyValue: any) => {
    const newValue = { ...value, [propertyName]: propertyValue };
    onChange(path, newValue);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      {/* Discriminator selector */}
      <div className="space-y-2">
        <Label htmlFor={`${name}-discriminator`}>Type</Label>
        <SelectPrimitive.Root value={currentVariant || ''} onValueChange={handleVariantChange}>
          <SelectPrimitive.Trigger
            id={`${name}-discriminator`}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SelectPrimitive.Value placeholder="Select type..." />
            <SelectPrimitive.Icon asChild>
              <svg className="h-4 w-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6,9 12,15 18,9" />
              </svg>
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
              <SelectPrimitive.Viewport className="p-1">
                {variantOptions.map((variant) => (
                  <SelectPrimitive.Item
                    key={variant}
                    value={variant}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <SelectPrimitive.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    </SelectPrimitive.ItemIndicator>
                    <SelectPrimitive.ItemText>{variant}</SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      </div>

      {/* Variant-specific fields */}
      {currentVariant && variants[currentVariant] && (
        <div className="space-y-4 p-4 border rounded-lg bg-card">
          <h4 className="text-sm font-semibold text-card-foreground">
            {currentVariant} Properties
          </h4>
          
          <div className="space-y-3">
            {Object.entries(variants[currentVariant].properties || {}).map(([propertyName, propertySchema]) => {
              // Skip the discriminator property as it's handled above
              if (propertyName === discriminator) return null;
              
              const propertyPath = `${path}.${propertyName}`;
              const propertyValue = value[propertyName];
              const propertyError = errors[propertyPath];
              
              return (
                <div key={propertyName} className="space-y-2">
                  <Label htmlFor={`${name}-${propertyName}`}>
                    {(propertySchema as any).label || propertyName}
                    {(propertySchema as any).required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  
                  {renderVariantPropertyField(
                    `${name}-${propertyName}`,
                    propertyName,
                    propertyValue,
                    propertySchema as any,
                    propertyError,
                    (newValue) => handleVariantPropertyChange(propertyName, newValue)
                  )}
                  
                  {propertyError && (
                    <p className="text-sm text-red-500 mt-1">
                      {propertyError}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

// Helper function to render variant property fields
function renderVariantPropertyField(
  id: string,
  name: string,
  value: any,
  schema: any,
  error: string | undefined,
  onChange: (value: any) => void
) {
  const baseInputClasses = cn(
    "w-full px-3 py-2 border border-input rounded-md bg-background",
    error && "border-red-500 focus-visible:ring-red-500"
  );

  switch (schema.type) {
    case 'string':
      return (
        <input
          id={id}
          name={name}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClasses}
          placeholder={`Enter ${schema.label || name}`}
        />
      );
      
    case 'number':
      return (
        <input
          id={id}
          name={name}
          type="number"
          value={value || 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className={baseInputClasses}
          min={schema.min}
          max={schema.max}
          step={schema.step}
        />
      );
      
    case 'boolean':
      return (
        <div className="flex items-center space-x-2">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          <span className="text-sm">Yes</span>
        </div>
      );
      
    default:
      return (
        <div className="text-sm text-muted-foreground p-2 border border-dashed rounded">
          Unsupported property type: {schema.type}
          <br />
          Current value: {JSON.stringify(value)}
        </div>
      );
  }
} 