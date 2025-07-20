import { z } from 'zod';
import { ZodForm } from '../components/ZodForm';
import { UIAdapter } from '../types/plugin-system';

// Example custom UI adapter
const customAdapter: UIAdapter = {
  name: 'custom-example',
  components: {
    string: ({ name, label, value, onChange, error, required }) => (
      <div className="custom-string-field">
        <label htmlFor={name} className="custom-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
        <input
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`custom-input ${error ? 'error' : ''}`}
          placeholder={`Enter ${label}`}
        />
        {error && <div className="error-message">{error}</div>}
      </div>
    ),
    
    boolean: ({ name, label, value, onChange }) => (
      <div className="custom-boolean-field">
        <label className="custom-checkbox-label">
          <input
            type="checkbox"
            name={name}
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            className="custom-checkbox"
          />
          <span className="checkbox-text">{label}</span>
        </label>
      </div>
    ),
  }
};

// Example schema
const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  subscribe: z.boolean().default(false),
});

export function RegisterAdapterExample() {
  const handleSubmit = (data: z.infer<typeof userSchema>) => {
    console.log('Form submitted with custom adapter:', data);
  };

  return (
    <div className="register-adapter-example">
      <h2>ZodForm with Custom UI Adapter</h2>
      <p>The custom adapter will be automatically registered and set as the default theme.</p>
      
      {/* ZodForm with registerUIAdapter prop - automatically sets as default */}
      <ZodForm
        schema={userSchema}
        onSubmit={handleSubmit}
        registerUIAdapter={customAdapter}
        defaultValues={{
          name: '',
          email: '',
          subscribe: false,
        }}
        className="custom-form"
      />
    </div>
  );
} 