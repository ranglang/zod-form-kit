import { ParsedField } from '../../utils/schema-parser';
import { FieldRenderer } from '../FieldRenderer';

interface ArrayFieldProps {
  value: any[];
  onChange: (value: any[]) => void;
  error?: string;
  required?: boolean;
  label: string;
  name: string;
  itemSchema: ParsedField;
  form: any;
  path: string;
  options?: any;
}

export function ArrayField({
  value = [],
  onChange,
  error,
  required,
  label,
  itemSchema,
  form,
  path,
  options
}: ArrayFieldProps) {
  const minItems = options?.minItems || 0;
  const maxItems = options?.maxItems || Infinity;
  const canAdd = value.length < maxItems;
  const canRemove = value.length > minItems;

  const addItem = () => {
    if (canAdd) {
      const newItem = getDefaultValue(itemSchema);
      onChange([...value, newItem]);
    }
  };

  const removeItem = (index: number) => {
    if (canRemove) {
      const newValue = value.filter((_, i) => i !== index);
      onChange(newValue);
    }
  };

  const getDefaultValue = (schema: ParsedField): any => {
    switch (schema.type) {
      case 'string': return '';
      case 'number': return 0;
      case 'boolean': return false;
      case 'array': return [];
      case 'object': return {};
      default: return null;
    }
  };

  return (
    <div className="array-field">
      <div className="array-header">
        <label className="array-label">
          {label} {required && <span className="required">*</span>}
        </label>
        {canAdd && (
          <button type="button" onClick={addItem} className="add-button">
            Add Item
          </button>
        )}
      </div>
      {error && <div className="error-message">{error}</div>}
      
      <div className="array-items">
        {value.map((_, index) => (
          <div key={index} className="array-item">
            <FieldRenderer
              schema={itemSchema}
              form={form}
              path={`${path}.${index}`}
              label={`Item ${index + 1}`}
            />
            {canRemove && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="remove-button"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      
      {value.length === 0 && (
        <div className="array-empty">
          No items. Click "Add Item" to get started.
        </div>
      )}
    </div>
  );
}