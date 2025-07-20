// React import not needed with new JSX transform
import { Button } from '../button';
import { Label } from '../label';
import { cn } from '../../lib/utils';

// Define the props interface locally
interface ArrayFieldRendererProps {
  name: string;
  label?: string;
  value: any[];
  onChange: (path: string, value: any) => void;
  error?: string;
  required?: boolean;
  className?: string;
  itemSchema: any; // Simplified for now
  errors: Record<string, string>;
  path: string;
  options?: {
    minLength?: number;
    maxLength?: number;
  };
}

export function ArrayField({
  label,
  value = [],
  onChange,
  error,
  required,
  itemSchema,
  errors,
  path,
  options = {},
  className = ''
}: ArrayFieldRendererProps) {
  const { minLength = 0, maxLength } = options;

  const addItem = () => {
    const newValue = [...value, getDefaultValueForSchema(itemSchema)];
    onChange(path, newValue);
  };

  const removeItem = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(path, newValue);
  };

  const updateItem = (index: number, newItemValue: any) => {
    const newValue = [...value];
    newValue[index] = newItemValue;
    onChange(path, newValue);
  };

  const canAddMore = !maxLength || value.length < maxLength;
  const canRemove = value.length > minLength;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        {label && (
          <Label>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          disabled={!canAddMore}
        >
          Add Item
        </Button>
      </div>
      
      {value.length === 0 ? (
        <div className="text-sm text-muted-foreground p-4 border-2 border-dashed rounded-lg text-center">
          No items added yet. Click "Add Item" to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((item, index) => (
            <div key={index} className="flex items-start space-x-2 p-3 border rounded-lg bg-card">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Item {index + 1}</span>
                  {canRemove && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                {/* Simplified item rendering - would need FieldRenderer integration */}
                <div className="space-y-2">
                  {typeof item === 'string' ? (
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateItem(index, e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder={`Enter ${itemSchema.type || 'value'}`}
                    />
                  ) : typeof item === 'number' ? (
                    <input
                      type="number"
                      value={item}
                      onChange={(e) => updateItem(index, Number(e.target.value))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder={`Enter ${itemSchema.type || 'number'}`}
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Complex item type - {JSON.stringify(item)}
                    </div>
                  )}
                </div>
                
                {errors[`${path}.${index}`] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors[`${path}.${index}`]}
                  </p>
                )}
              </div>
            </div>
          ))}
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

// Helper function to get default value for a schema
function getDefaultValueForSchema(schema: any): any {
  if (schema.defaultValue !== undefined) return schema.defaultValue;
  
  switch (schema.type) {
    case 'string': return '';
    case 'number': return 0;
    case 'boolean': return false;
    case 'date': return new Date();
    case 'array': return [];
    case 'object': return {};
    default: return null;
  }
} 