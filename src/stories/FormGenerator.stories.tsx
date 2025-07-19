import type { Story } from '@ladle/react';
import { z } from 'zod';
import { FormGenerator } from '../components/FormGenerator';

export const BasicForm: Story = () => {
  const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    age: z.number().min(18, 'Must be at least 18 years old'),
    isSubscribed: z.boolean()
  });

  return (
    <FormGenerator
      schema={schema}
      onSubmit={(data) => {
        console.log('Form submitted:', data);
        alert(`Form submitted: ${JSON.stringify(data, null, 2)}`);
      }}
      defaultValues={{ name: 'John Doe', age: 25 }}
    />
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
    <FormGenerator
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
    <FormGenerator
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
    <FormGenerator
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
    <FormGenerator
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
    <FormGenerator
      schema={schema}
      onSubmit={(data) => {
        console.log('Complex union form:', data);
        alert(`Action created: ${JSON.stringify(data, null, 2)}`);
      }}
      defaultValues={{
        name: 'My Action',
        action: {
          type: 'webhook',
          method: 'POST',
          timeout: 5000
        }
      }}
    />
  );
};
