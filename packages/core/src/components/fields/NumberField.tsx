import { FieldProps } from '../../types/form-generator';

interface NumberFieldProps extends FieldProps {
  value: number;
  onChange: (value: number) => void;
  options?: {
    min?: number;
    max?: number;
    step?: number | 'any';
  };
}

export function NumberField({
  name,
  label,
  value = 0,
  onChange,
  error,
  required,
  options = {},
  className = ''
}: NumberFieldProps) {
  return (
    <div className={`field number-field ${className}`}>
      <label htmlFor={name} id={name + '-label'} className={`field-label ${required ? 'required' : ''}`}>
        {label}
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
        aria-labelledby={name + '-label'}
      />
      
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}