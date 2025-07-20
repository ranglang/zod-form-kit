import { z } from 'zod';
import { ZodForm } from '../components/ZodForm';
import { UIAdapter } from '../types/plugin-system';
import { getDefaultAdapter } from '../utils/plugin-registry';

// Create a custom adapter
const blueThemeAdapter: UIAdapter = {
  name: 'blue-theme',
  components: {
    string: ({ name, label, value, onChange, error, required }) => (
      <div style={{ marginBottom: '1rem' }}>
        <label 
          htmlFor={name} 
          style={{ 
            display: 'block', 
            color: '#1e40af', 
            fontWeight: 'bold',
            marginBottom: '0.5rem' 
          }}
        >
          {label}
          {required && <span style={{ color: '#dc2626' }}>*</span>}
        </label>
        <input
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: error ? '2px solid #dc2626' : '2px solid #3b82f6',
            borderRadius: '0.375rem',
            fontSize: '1rem'
          }}
          placeholder={`Enter ${label}`}
        />
        {error && (
          <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {error}
          </div>
        )}
      </div>
    ),
    
    boolean: ({ name, label, value, onChange }) => (
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name={name}
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            style={{ 
              marginRight: '0.5rem',
              transform: 'scale(1.2)',
              accentColor: '#3b82f6'
            }}
          />
          <span style={{ color: '#1e40af', fontWeight: 'bold' }}>{label}</span>
        </label>
      </div>
    ),
  }
};

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  newsletter: z.boolean().default(false),
});

export function DefaultAdapterDemo() {
  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log('Submitted data:', data);
    
    // Show current default adapter
    const defaultAdapter = getDefaultAdapter();
    console.log('Current default adapter:', defaultAdapter?.name);
    
    alert(`Form submitted!\nDefault adapter: ${defaultAdapter?.name}\nData: ${JSON.stringify(data, null, 2)}`);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
      <h2 style={{ color: '#1e40af', marginBottom: '1rem' }}>
        Auto-Default Adapter Demo
      </h2>
      
      <div style={{ 
        background: '#eff6ff', 
        padding: '1rem', 
        borderRadius: '0.5rem', 
        marginBottom: '2rem',
        border: '1px solid #3b82f6'
      }}>
        <p style={{ margin: 0, color: '#1e40af', fontSize: '0.875rem' }}>
          <strong>Note:</strong> The blue-theme adapter will be automatically registered 
          and set as the default when this form renders.
        </p>
      </div>

      <ZodForm
        schema={schema}
        onSubmit={handleSubmit}
        registerUIAdapter={blueThemeAdapter}  // Automatically becomes default!
        defaultValues={{
          name: '',
          email: '',
          newsletter: false,
        }}
      />
    </div>
  );
}

/**
 * Usage:
 * 
 * When you pass `registerUIAdapter` to ZodForm:
 * 1. The adapter is registered in the plugin system
 * 2. It's automatically set as the default theme adapter
 * 3. All form fields will use this adapter's components
 * 4. No additional setup required!
 */ 