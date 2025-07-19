import React from 'react';
import { FieldProps } from '../../types/form-generator';

interface DateFieldProps extends FieldProps {
  value: Date;
  onChange: (value: Date) => void;
}

export function DateField({
  name,
  label,
  value,
  onChange,
  error,
  required,
  className = ''
}: DateFieldProps) {
  const formatDateForInput = (date: Date): string => {
    return date ? date.toISOString().split('T')[0] : '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value ? new Date(e.target.value) : new Date();
    onChange(dateValue);
  };

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
        value={formatDateForInput(value)}
        onChange={handleChange}
        className={`field-input ${error ? 'error' : ''}`}
        required={required}
      />
      
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}