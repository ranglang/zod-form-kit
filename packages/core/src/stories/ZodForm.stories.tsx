import type { Story } from '@ladle/react';
import { z } from 'zod';
import { ZodForm } from '../components/ZodForm';
import { registerSchemaPatternRenderer, clearPatternRenderers } from '../utils/plugin-registry';

// Custom Email Pattern Renderer
const CustomEmailRenderer = ({ 
  value, 
  onChange, 
  error, 
  label, 
  name, 
  required 
}: any) => (
  <div style={{ 
    marginBottom: '16px', 
    padding: '12px', 
    border: '2px solid #4f46e5', 
    borderRadius: '8px',
    backgroundColor: '#f8fafc'
  }}>
    <label 
      htmlFor={name} 
      style={{ 
        display: 'block', 
        fontWeight: 'bold', 
        color: '#4f46e5',
        marginBottom: '8px'
      }}
    >
      📧 {label} {required && <span style={{ color: 'red' }}>*</span>}
    </label>
    <input
      id={name}
      type="email"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter your email address"
      style={{
        width: '100%',
        padding: '8px 12px',
        border: error ? '2px solid #ef4444' : '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '14px'
      }}
    />
    {error && (
      <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
        {error}
      </div>
    )}
    <small style={{ color: '#6b7280', fontSize: '12px', display: 'block', marginTop: '4px' }}>
      ✨ Custom Email Pattern Renderer
    </small>
  </div>
);

// Custom URL Pattern Renderer
const CustomUrlRenderer = ({ 
  value, 
  onChange, 
  error, 
  label, 
  name, 
  required 
}: any) => (
  <div style={{ 
    marginBottom: '16px', 
    padding: '12px', 
    border: '2px solid #059669', 
    borderRadius: '8px',
    backgroundColor: '#f0fdf4'
  }}>
    <label 
      htmlFor={name} 
      style={{ 
        display: 'block', 
        fontWeight: 'bold', 
        color: '#059669',
        marginBottom: '8px'
      }}
    >
      🌐 {label} {required && <span style={{ color: 'red' }}>*</span>}
    </label>
    <input
      id={name}
      type="url"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="https://example.com"
      style={{
        width: '100%',
        padding: '8px 12px',
        border: error ? '2px solid #ef4444' : '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '14px'
      }}
    />
    {error && (
      <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
        {error}
      </div>
    )}
    <small style={{ color: '#6b7280', fontSize: '12px', display: 'block', marginTop: '4px' }}>
      ✨ Custom URL Pattern Renderer
    </small>
  </div>
);

// Custom Age Range Renderer (for numbers 0-120)
const CustomAgeRenderer = ({ 
  value, 
  onChange, 
  error, 
  label, 
  name, 
  required 
}: any) => (
  <div style={{ 
    marginBottom: '16px', 
    padding: '12px', 
    border: '2px solid #dc2626', 
    borderRadius: '8px',
    backgroundColor: '#fef2f2'
  }}>
    <label 
      htmlFor={name} 
      style={{ 
        display: 'block', 
        fontWeight: 'bold', 
        color: '#dc2626',
        marginBottom: '8px'
      }}
    >
      🎂 {label} {required && <span style={{ color: 'red' }}>*</span>}
    </label>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <input
        id={name}
        type="range"
        min="0"
        max="120"
        value={value || 0}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          flex: 1,
          height: '6px',
          background: '#dc2626',
          borderRadius: '3px'
        }}
      />
      <input
        type="number"
        min="0"
        max="120"
        value={value || 0}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '80px',
          padding: '4px 8px',
          border: error ? '2px solid #ef4444' : '1px solid #d1d5db',
          borderRadius: '4px',
          fontSize: '14px'
        }}
      />
      <span style={{ color: '#dc2626', fontWeight: 'bold' }}>years</span>
    </div>
    {error && (
      <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
        {error}
      </div>
    )}
    <small style={{ color: '#6b7280', fontSize: '12px', display: 'block', marginTop: '4px' }}>
      ✨ Custom Age Range Pattern Renderer (0-120)
    </small>
  </div>
);

// Custom Password Strength Renderer
const CustomPasswordRenderer = ({ 
  value, 
  onChange, 
  error, 
  label, 
  name, 
  required 
}: any) => {
  const getStrength = (password: string) => {
    if (!password) return { score: 0, text: 'Enter password', color: '#6b7280' };
    if (password.length < 6) return { score: 1, text: 'Too short', color: '#ef4444' };
    if (password.length < 8) return { score: 2, text: 'Weak', color: '#f59e0b' };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { score: 3, text: 'Fair', color: '#eab308' };
    return { score: 4, text: 'Strong', color: '#22c55e' };
  };

  const strength = getStrength(value || '');

  return (
    <div style={{ 
      marginBottom: '16px', 
      padding: '12px', 
      border: '2px solid #7c3aed', 
      borderRadius: '8px',
      backgroundColor: '#faf5ff'
    }}>
      <label 
        htmlFor={name} 
        style={{ 
          display: 'block', 
          fontWeight: 'bold', 
          color: '#7c3aed',
          marginBottom: '8px'
        }}
      >
        🔒 {label} {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input
        id={name}
        type="password"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter a strong password"
        style={{
          width: '100%',
          padding: '8px 12px',
          border: error ? '2px solid #ef4444' : '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
          marginBottom: '8px'
        }}
      />
      <div style={{ marginBottom: '8px' }}>
        <div style={{ 
          height: '4px', 
          backgroundColor: '#e5e7eb', 
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(strength.score / 4) * 100}%`,
            height: '100%',
            backgroundColor: strength.color,
            transition: 'all 0.3s ease'
          }} />
        </div>
        <small style={{ color: strength.color, fontSize: '12px' }}>
          Strength: {strength.text}
        </small>
      </div>
      {error && (
        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
          {error}
        </div>
      )}
      <small style={{ color: '#6b7280', fontSize: '12px', display: 'block', marginTop: '4px' }}>
        ✨ Custom Password Pattern Renderer
      </small>
    </div>
  );
};

export const BasicForm: Story = () => {
  const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    age: z.number().min(18, 'Must be at least 18 years old'),
    isSubscribed: z.boolean()
  });

  return (
    <ZodForm
      schema={schema}
      onSubmit={(data) => {
        console.log('Form submitted:', data);
        alert(`Form submitted: ${JSON.stringify(data, null, 2)}`);
      }}
      defaultValues={{ name: 'John Doe', age: 25 }}
    />
  );
};

export const SchemaPatternRenderersDemo: Story = () => {
  // Clear any existing patterns to ensure clean state
  clearPatternRenderers();

  // Register Email Pattern Renderer (using function matcher)
  registerSchemaPatternRenderer(
    'custom-email',
    (zodSchema: z.ZodTypeAny) => {
      return zodSchema instanceof z.ZodString && 
             zodSchema._def.checks?.some((check: any) => check.kind === 'email');
    },
    CustomEmailRenderer,
    100
  );

  // Register URL Pattern Renderer (using function matcher)
  registerSchemaPatternRenderer(
    'custom-url',
    (zodSchema: z.ZodTypeAny) => {
      return zodSchema instanceof z.ZodString && 
             zodSchema._def.checks?.some((check: any) => check.kind === 'url');
    },
    CustomUrlRenderer,
    90
  );

  // Register Age Range Pattern Renderer (using Zod schema matcher)
  const ageRangeSchema = z.number().min(0).max(120);
  registerSchemaPatternRenderer(
    'age-range',
    ageRangeSchema,
    CustomAgeRenderer,
    80
  );

  // Register Password Pattern Renderer (using function matcher with min length)
  registerSchemaPatternRenderer(
    'password-strength',
    (zodSchema: z.ZodTypeAny) => {
      if (!(zodSchema instanceof z.ZodString)) return false;
      const checks = zodSchema._def.checks || [];
      return checks.some((check: any) => 
        check.kind === 'min' && check.value >= 6
      );
    },
    CustomPasswordRenderer,
    85
  );

  const schema = z.object({
    // This will use the custom email renderer
    email: z.string().email('Please enter a valid email address'),
    
    // This will use the custom URL renderer
    website: z.string().url('Please enter a valid URL'),
    
    // This will use the custom age renderer (matches our registered schema pattern)
    age: z.number().min(0, 'Age must be positive').max(120, 'Age must be realistic'),
    
    // This will use the custom password renderer
    password: z.string().min(6, 'Password must be at least 6 characters'),
    
    // These will use default renderers (no pattern match)
    name: z.string().min(2, 'Name must be at least 2 characters'),
    bio: z.string().optional(),
    isSubscribed: z.boolean(),
    
    // This number field won't match our age pattern (different constraints)
    score: z.number().min(0).max(100)
  });

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        marginBottom: '24px', 
        padding: '16px', 
        backgroundColor: '#f1f5f9', 
        borderRadius: '8px',
        border: '1px solid #cbd5e1'
      }}>
        <h2 style={{ margin: '0 0 12px 0', color: '#334155' }}>
          🎨 Schema Pattern Renderers Demo
        </h2>
        <p style={{ margin: '0', color: '#64748b', fontSize: '14px' }}>
          This form demonstrates custom pattern renderers that automatically activate 
          when specific Zod schema patterns are detected. Notice how email, URL, age, 
          and password fields have custom UI components, while regular fields use defaults.
        </p>
      </div>

      <ZodForm
        schema={schema}
        onSubmit={(data) => {
          console.log('Pattern demo form submitted:', data);
          alert(`Form submitted with custom patterns! Check console for data.`);
        }}
        defaultValues={{
          name: 'Jane Smith',
          email: 'jane@example.com',
          website: 'https://janesmith.dev',
          age: 28,
          score: 85,
          isSubscribed: true
        }}
        className="pattern-demo-form"
      />

      <div style={{ 
        marginTop: '32px', 
        padding: '16px', 
        backgroundColor: '#f8fafc', 
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#374151', fontSize: '16px' }}>
          📝 Pattern Registration Code
        </h3>
        <pre style={{ 
          margin: '0', 
          fontSize: '12px', 
          backgroundColor: '#1f2937', 
          color: '#f9fafb', 
          padding: '12px', 
          borderRadius: '6px', 
          overflow: 'auto'
        }}>
{`// Email pattern (function matcher)
registerSchemaPatternRenderer(
  'custom-email',
  (zodSchema) => zodSchema instanceof z.ZodString && 
    zodSchema._def.checks?.some(check => check.kind === 'email'),
  CustomEmailRenderer,
  100
);

// Age range pattern (Zod schema matcher)
const ageRangeSchema = z.number().min(0).max(120);
registerSchemaPatternRenderer(
  'age-range',
  ageRangeSchema,
  CustomAgeRenderer,
  80
);`}
        </pre>
      </div>
    </div>
  );
};

export const NestedObjectForm: Story = () => {
  const schema = z.object({
    user: z.object({
      name: z.string(),
      email: z.string().email(),
      profile: z.object({
        bio: z.string().optional(),
        website: z.string().url().optional()
      })
    }),
    preferences: z.object({
      newsletter: z.boolean(),
      notifications: z.boolean()
    })
  });

  return (
    <ZodForm
      schema={schema}
      onSubmit={(data) => console.log('Nested form:', data)}
    />
  );
};

export const ArrayForm: Story = () => {
  const schema = z.object({
    name: z.string(),
    hobbies: z.array(z.string()).min(1, 'At least one hobby required'),
    contacts: z.array(z.object({
      name: z.string(),
      phone: z.string()
    }))
  });

  return (
    <ZodForm
      schema={schema}
      onSubmit={(data) => console.log('Array form:', data)}
      defaultValues={{
        hobbies: ['Reading'],
        contacts: [{ name: 'Emergency Contact', phone: '' }]
      }}
    />
  );
};

export const DiscriminatedUnionForm: Story = () => {
  const schema = z.object({
    contactMethod: z.discriminatedUnion('variant', [
      z.object({
        variant: z.literal('email'),
        email: z.string().email(),
        subject: z.string()
      }),
      z.object({
        variant: z.literal('phone'),
        phone: z.string(),
        preferredTime: z.string()
      }),
      z.object({
        variant: z.literal('mail'),
        address: z.string(),
        zipCode: z.string()
      })
    ])
  });

  return (
    <ZodForm
      schema={schema}
      onSubmit={(data) => console.log('Union form:', data)}
    />
  );
};

export const OptionalAndDefaultFields: Story = () => {
  const schema = z.object({
    name: z.string(),
    nickname: z.string().optional(),
    role: z.string().default('user'),
    isActive: z.boolean().default(true),
    joinDate: z.date().default(() => new Date())
  });

  return (
    <ZodForm
      schema={schema}
      onSubmit={(data) => console.log('Optional/default form:', data)}
    />
  );
};

export const ComplexDiscriminatedUnionForm: Story = () => {
  const schema = z.object({
    name: z.string().min(1, 'Action name is required'),
    description: z.string().optional(),
    action: z.discriminatedUnion('type', [
      z.object({
        type: z.literal('webhook'),
        url: z.string().url('Must be a valid URL'),
        method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
        headers: z.record(z.string()).optional(),
        timeout: z.number().min(1000).max(30000).default(5000)
      }),
      z.object({
        type: z.literal('email'),
        recipient: z.string().email('Must be a valid email'),
        subject: z.string().min(1, 'Subject is required'),
        body: z.string().min(10, 'Body must be at least 10 characters'),
        priority: z.enum(['low', 'normal', 'high']).default('normal'),
        attachments: z.array(z.string()).optional()
      }),
      z.object({
        type: z.literal('delay'),
        duration: z.number().min(1, 'Duration must be positive'),
        unit: z.enum(['seconds', 'minutes', 'hours', 'days']),
        description: z.string().optional()
      }),
      z.object({
        type: z.literal('database'),
        query: z.string().min(1, 'Query is required'),
        connection: z.string().min(1, 'Connection string is required'),
        timeout: z.number().min(1000).default(10000),
        retries: z.number().min(0).max(5).default(3)
      })
    ])
  });

  return (
    <ZodForm
      schema={schema}
      onSubmit={(data) => {
        console.log('Complex union form:', data);
        alert(`Action created: ${JSON.stringify(data, null, 2)}`);
      }}
      defaultValues={{
        name: 'My Action',
        action: {
          type: 'webhook',
          url: 'https://example.com/webhook',
          method: 'POST',
          timeout: 5000
        }
      }}
    />
  );
}; 