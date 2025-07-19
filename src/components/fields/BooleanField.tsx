import React from 'react';
import { FieldProps } from '../../types/form-generator';

interface BooleanFieldProps extends FieldProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function BooleanField({
  name,
  label,
  value = false,
  onChange,
  error,
  className = ''
}: BooleanFieldProps) {
  return (
    <div className={`field boolean-field ${className}`}>
      <label className="field-label checkbox-label">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className={`field-input ${error ? 'error' : ''}`}
        />
        {label}
      </label>
      
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}