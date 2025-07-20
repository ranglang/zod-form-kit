
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

// Material-UI field renderers (example implementation)
// Note: This is a conceptual example - actual Material-UI components would need to be imported

function MaterialUIStringField({
  name,
  label,
  value = '',
  onChange,
  error,
  required,
  options = {},
  className = ''
}: StringFieldRendererProps) {
  return (
    <div className={`mui-field string-field ${className}`}>
      {/* Material-UI TextField would be used here */}
      <label htmlFor={name} className="mui-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      
      <input
        id={name}
        name={name}
        type={getInputType(options.format)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        minLength={options.minLength}
        maxLength={options.maxLength}
        pattern={options.pattern?.source}
        className={`mui-input ${error ? 'error' : ''}`}
        required={required}
        readOnly={options.readonly}
      />
      
      {error && <span className="mui-error">{error}</span>}
    </div>
  );
}

function MaterialUINumberField({
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
    <div className={`mui-field number-field ${className}`}>
      <label htmlFor={name} className="mui-label">
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
        className={`mui-input ${error ? 'error' : ''}`}
        required={required}
        readOnly={options.readonly}
      />
      
      {error && <span className="mui-error">{error}</span>}
    </div>
  );
}

function MaterialUIBooleanField({
  name,
  label,
  value = false,
  onChange,
  error,
  required,
  className = ''
}: BooleanFieldRendererProps) {
  return (
    <div className={`mui-field boolean-field ${className}`}>
      <label className="mui-label">
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
      
      {error && <span className="mui-error">{error}</span>}
    </div>
  );
}

function MaterialUIDateField({
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
    <div className={`mui-field date-field ${className}`}>
      <label htmlFor={name} className="mui-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      
      <input
        id={name}
        name={name}
        type="date"
        value={dateValue}
        onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
        className={`mui-input ${error ? 'error' : ''}`}
        required={required}
      />
      
      {error && <span className="mui-error">{error}</span>}
    </div>
  );
}

function MaterialUIArrayField({
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
    <div className={`mui-field array-field ${className}`}>
      <div className="mui-array-header">
        <label className="mui-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
        <button
          type="button"
          onClick={addItem}
          disabled={!canAddMore}
          className="mui-add-button"
        >
          Add Item
        </button>
      </div>
      
      <div className="mui-array-items">
        {value.map((_item, index) => (
          <div key={index} className="mui-array-item">
            <div className="mui-item-content">
              <span>Item {index + 1}</span>
            </div>
            {canRemove && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="mui-remove-button"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      
      {error && <span className="mui-error">{error}</span>}
    </div>
  );
}

function MaterialUIObjectField({
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
    <div className={`mui-field object-field ${className}`}>
      {label && (
        <div className="mui-object-label">
          {label}
          {required && <span className="required">*</span>}
        </div>
      )}
      
      <div className="mui-object-properties">
        {Object.entries(properties).map(([_key, _schema]) => {
          return (
            <div key={_key} className="mui-property-field">
              <label className="mui-property-label">{_key}</label>
              <span>Property: {_key}</span>
            </div>
          );
        })}
      </div>
      
      {error && <span className="mui-error">{error}</span>}
    </div>
  );
}

function MaterialUIDiscriminatedUnionField({
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
    <div className={`mui-field discriminated-union-field ${className}`}>
      {label && (
        <div className="mui-union-label">
          {label}
          {required && <span className="required">*</span>}
        </div>
      )}
      
      <div className="mui-variant-selector">
        <label className="mui-label">Type</label>
        <select
          value={currentVariant || ''}
          onChange={(e) => handleVariantChange(e.target.value)}
          className="mui-input"
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
        <div className="mui-variant-fields">
          <span>Variant: {currentVariant}</span>
        </div>
      )}
      
      {error && <span className="mui-error">{error}</span>}
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

// Material-UI Adapter
export const materialUIAdapter: UIAdapter = {
  name: 'material-ui',
  components: {
    string: MaterialUIStringField,
    number: MaterialUINumberField,
    boolean: MaterialUIBooleanField,
    date: MaterialUIDateField,
    array: MaterialUIArrayField,
    object: MaterialUIObjectField,
    discriminatedUnion: MaterialUIDiscriminatedUnionField
  }
}; 