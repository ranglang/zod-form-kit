import { FieldProps } from '../../types/form-generator';

interface StringFieldProps extends FieldProps {
  value: string;
  onChange: (value: string) => void;
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
}: StringFieldProps) {
  const inputType = getInputType(options.format);
  
  return (
    <div className={`field string-field ${className}`}>
      <label htmlFor={name} id={name + '-label'} className={`field-label ${required ? 'required' : ''}`}>
        {label}
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
        aria-labelledby={name + '-label'}
      />
      
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

function getInputType(format?: string): string {
  switch (format) {
    case 'email': return 'email';
    case 'url': return 'url';
    default: return 'text';
  }
}
