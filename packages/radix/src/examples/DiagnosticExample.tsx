import { z } from 'zod';
import { ZodForm } from '../components/ZodForm';

// Simple schema for testing
const simpleSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export function DiagnosticExample() {
  const handleSubmit = (data: z.infer<typeof simpleSchema>) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="max-w-md mx-auto p-6" style={{ maxWidth: '400px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
        Diagnostic ZodForm Test
      </h1>
      
      <div style={{ marginBottom: '16px' }}>
        <p>This form is used to test input functionality and identify issues.</p>
      </div>

      <ZodForm
        schema={simpleSchema}
        onSubmit={handleSubmit}
        defaultValues={{
          name: '',
          email: '',
        }}
      />

      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Expected Behavior:</h3>
        <ul style={{ marginLeft: '20px' }}>
          <li>You should be able to type in the name field</li>
          <li>You should be able to type in the email field</li>
          <li>Form should validate on submit</li>
        </ul>
      </div>
    </div>
  );
} 