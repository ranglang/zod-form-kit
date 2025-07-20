interface EnumFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  label: string;
  name: string;
  values: string[];
}

export function EnumField({
  value = '',
  onChange,
  error,
  required,
  label,
  name,
  values = []
}: EnumFieldProps) {
  return (
    <div className="field enum-field">
      <label className={`field-label ${required ? 'required' : ''}`} htmlFor={name} id={`${name}-label`}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`field-input ${error ? 'error' : ''}`}
        aria-labelledby={`${name}-label`}
        required={required}
      >
        <option value="">Select an option...</option>
        {values.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <div className="field-error">{error}</div>}
    </div>
  );
} 