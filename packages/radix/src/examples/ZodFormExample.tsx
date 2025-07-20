import { z } from 'zod';
import { ZodForm } from '../components/ZodForm';

// Example schema
const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be at least 18'),
  subscribe: z.boolean(),
  role: z.enum(['admin', 'user', 'moderator']),
});

export function ZodFormExample() {
  const handleSubmit = (data: z.infer<typeof userSchema>) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ZodForm with Radix Adapter</h1>
      
      {/* 
        This ZodForm automatically has the radixThemesAdapter registered!
        No need to manually register adapters or set up providers.
      */}
      <ZodForm
        schema={userSchema}
        onSubmit={handleSubmit}
        defaultValues={{
          name: '',
          email: '',
          age: 18,
          subscribe: false,
          role: 'user' as const,
        }}
        className="space-y-4"
      />
    </div>
  );
}

export default ZodFormExample; 