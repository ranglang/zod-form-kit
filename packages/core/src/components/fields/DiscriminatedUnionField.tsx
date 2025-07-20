
import { ParsedField } from '../../utils/schema-parser';
import { FieldRenderer } from '../FieldRenderer';

interface DiscriminatedUnionFieldProps {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  error?: string;
  required?: boolean;
  label: string;
  name: string;
  discriminator: string;
  variants: Record<string, ParsedField>;
  form: any;
  path: string;
}

export function DiscriminatedUnionField({
  value = {},
  onChange,
  error: _error,
  required,
  label,
  name,
  discriminator,
  variants,
  form,
  path
}: DiscriminatedUnionFieldProps) {
  const currentVariant = value?.[discriminator];
  
  const variantOptions = Object.keys(variants);

  const handleVariantChange = (selectedVariant: string) => {
    const variantSchema = variants[selectedVariant];
    const newValue = {
      [discriminator]: selectedVariant,
      // Initialize with default values for the selected variant
      ...getDefaultValueForVariant(variantSchema)
    };
    onChange(newValue);
  };

  const getDefaultValueForVariant = (schema: ParsedField): Record<string, any> => {
    if (schema.type === 'object' && schema.properties) {
      const defaults: Record<string, any> = {};
      Object.entries(schema.properties).forEach(([key, fieldSchema]) => {
        if (key !== discriminator) { // Don't override discriminator
          defaults[key] = getDefaultValue(fieldSchema as ParsedField);
        }
      });
      return defaults;
    }
    return {};
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

  const currentVariantSchema = currentVariant ? variants[currentVariant] : null;

  return (
    <div className="discriminated-union-field">
      <label className="union-label">
        {label} {required && <span className="required">*</span>}
      </label>
      
      <div className="variant-selector">
        <label htmlFor={`${name}-variant`}>Type:</label>
        <select
          id={`${name}-variant`}
          value={currentVariant || ''}
          onChange={(e) => handleVariantChange(e.target.value)}
          className="variant-select"
          key={`${name}-variant-${currentVariant || 'none'}`}
        >
          <option value="">Select a type...</option>
          {variantOptions.map((variant) => (
            <option key={variant} value={variant}>
              {variant}
            </option>
          ))}
        </select>
      </div>

      {currentVariantSchema && (
        <div className="variant-fields">
          <FieldRenderer
            schema={currentVariantSchema}
            form={form}
            path={path}
          />
        </div>
      )}
    </div>
  );
}