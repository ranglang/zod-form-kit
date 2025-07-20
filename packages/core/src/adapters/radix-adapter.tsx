
import {
  StringFieldRendererProps,
  NumberFieldRendererProps,
  BooleanFieldRendererProps,
  DateFieldRendererProps,
  ArrayFieldRendererProps,
  ObjectFieldRendererProps,
  DiscriminatedUnionFieldRendererProps,
  UIAdapter
} from '../types/plugin-system';

// Radix UI field renderers
function RadixStringField({
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
    <div className={`field string-field ${className}`}>
      <label htmlFor={name} className="field-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      
      <input
        id={name}
        name={name}
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        minLength={options.minLength}
        maxLength={options.maxLength}
        pattern={options.pattern?.source}
        className={`field-input ${error ? 'error' : ''}`}
        required={required}
        readOnly={options.readonly}
      />
      
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

function RadixNumberField({
  name,
  label,
  value = 0,
  onChange,
  error,
  required,
  options = {},
  className = ''
}: NumberFieldRendererProps) {
  return (
    <div className={`field number-field ${className}`}>
      <label htmlFor={name} className="field-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      
      <input
        id={name}
        name={name}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={options.min}
        max={options.max}
        step={options.step}
        className={`field-input ${error ? 'error' : ''}`}
        required={required}
        readOnly={options.readonly}
      />
      
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

function RadixBooleanField({
  name,
  label,
  value = false,
  onChange,
  error,
  required,
  className = ''
}: BooleanFieldRendererProps) {
  return (
    <div className={`field boolean-field ${className}`}>
      <label className="field-label">
        <input
          type="checkbox"
          name={name}
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          className={error ? 'error' : ''}
        />
        {label}
        {required && <span className="required">*</span>}
      </label>
      
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

function RadixDateField({
  name,
  label,
  value = null,
  onChange,
  error,
  required,
  className = ''
}: DateFieldRendererProps) {
  const dateValue = value ? value.toISOString().split('T')[0] : '';
  
  return (
    <div className={`field date-field ${className}`}>
      <label htmlFor={name} className="field-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      
      <input
        id={name}
        name={name}
        type="date"
        value={dateValue}
        onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
        className={`field-input ${error ? 'error' : ''}`}
        required={required}
      />
      
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

function RadixArrayField({
  name: _name,
  label,
  value = [],
  onChange,
  error,
  required,
  itemSchema,
  errors: _errors,
  path,
  options = {},
  className = ''
}: ArrayFieldRendererProps) {
  const addItem = () => {
    const newValue = [...value, getDefaultValue(itemSchema)];
    onChange(path, newValue);
  };

  const removeItem = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(path, newValue);
  };

  const canAddMore = !options.maxLength || value.length < options.maxLength;
  const canRemove = !options.minLength || value.length > options.minLength;

  return (
    <div className={`field array-field ${className}`}>
      <div className="array-header">
        <label className="field-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
        <button
          type="button"
          onClick={addItem}
          disabled={!canAddMore}
          className="add-button"
        >
          Add Item
        </button>
      </div>
      
      <div className="array-items">
        {value.map((_item, index) => (
          <div key={index} className="array-item">
            <div className="item-content">
              {/* This would need to render the item using FieldRenderer */}
              <span>Item {index + 1}</span>
            </div>
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
      
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

function RadixObjectField({
  name: _name,
  label,
  value: _value = {},
  onChange: _onChange,
  error,
  required,
  properties,
  errors: _errors,
  path: _path,
  className = ''
}: ObjectFieldRendererProps) {
  return (
    <div className={`field object-field ${className}`}>
      {label && (
        <div className="object-label">
          {label}
          {required && <span className="required">*</span>}
        </div>
      )}
      
      <div className="object-properties">
        {Object.entries(properties).map(([_key, _schema]) => {
          return (
            <div key={_key} className="property-field">
              <label className="property-label">{_key}</label>
              {/* This would need to render the property using FieldRenderer */}
              <span>Property: {_key}</span>
            </div>
          );
        })}
      </div>
      
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

function RadixDiscriminatedUnionField({
  name: _name,
  label,
  value = {},
  onChange,
  error,
  required,
  discriminator,
  variants,
  errors: _errors,
  path,
  className = ''
}: DiscriminatedUnionFieldRendererProps) {
  const currentVariant = value[discriminator];
  const variantOptions = Object.keys(variants);

  const handleVariantChange = (newVariant: string) => {
    const newValue = { [discriminator]: newVariant };
    onChange(path, newValue);
  };

  return (
    <div className={`field discriminated-union-field ${className}`}>
      {label && (
        <div className="union-label">
          {label}
          {required && <span className="required">*</span>}
        </div>
      )}
      
      <div className="variant-selector">
        <label className="field-label">Type</label>
        <select
          value={currentVariant || ''}
          onChange={(e) => handleVariantChange(e.target.value)}
          className="field-input"
        >
          <option value="">Select type...</option>
          {variantOptions.map((variant) => (
            <option key={variant} value={variant}>
              {variant}
            </option>
          ))}
        </select>
      </div>

      {currentVariant && variants[currentVariant] && (
        <div className="variant-fields">
          {/* This would need to render the variant using FieldRenderer */}
          <span>Variant: {currentVariant}</span>
        </div>
      )}
      
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

// Helper functions
function getInputType(format?: string): string {
  switch (format) {
    case 'email': return 'email';
    case 'url': return 'url';
    default: return 'text';
  }
}

function getDefaultValue(schema: any): any {
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

// Radix UI Adapter
export const radixAdapter: UIAdapter = {
  name: 'radix',
  components: {
    string: RadixStringField,
    number: RadixNumberField,
    boolean: RadixBooleanField,
    date: RadixDateField,
    array: RadixArrayField,
    object: RadixObjectField,
    discriminatedUnion: RadixDiscriminatedUnionField
  }
}; 