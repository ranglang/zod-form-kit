# zod-form-radix

A comprehensive Radix UI adapter for `zod-form-kit` that provides modern, accessible form components using Radix UI primitives with beautiful styling.

## Features

- 🎨 **Modern Design**: Beautiful components styled with Tailwind CSS
- ♿ **Accessibility First**: Built on Radix UI primitives for excellent a11y
- 🔧 **Type Safe**: Full TypeScript support with proper type definitions  
- 🎯 **Complete Coverage**: Implements all field renderer interfaces
- 🔌 **Plugin System**: Seamlessly integrates with zod-form-kit's plugin system
- 🎛️ **Flexible**: Use individual components or the complete adapter

## Installation

```bash
npm install zod-form-radix zod-form-kit
# or
pnpm add zod-form-radix zod-form-kit
# or
yarn add zod-form-radix zod-form-kit
```

## Quick Start

### Using ZodForm with Built-in Adapter (Recommended)

The easiest way to get started is using the `ZodForm` component that comes with the Radix adapter pre-registered:

```tsx
import { z } from 'zod';
import { ZodForm } from 'zod-form-radix';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be at least 18'),
  subscribe: z.boolean(),
  role: z.enum(['admin', 'user', 'moderator']),
});

function MyForm() {
  const handleSubmit = (data: z.infer<typeof userSchema>) => {
    console.log('Form submitted:', data);
  };

  return (
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
    />
  );
}
```

> **✨ Benefits**: This `ZodForm` component automatically registers the `radixThemesAdapter` and sets it as the default. No additional setup required!

### Using the Complete UI Adapter (Manual Setup)

The simplest way to use this package is to register the complete UI adapter:

```tsx
import { registerUIAdapter } from 'zod-form-kit';
import { radixThemesAdapter } from 'zod-form-radix';
import { z } from 'zod';

// Register the Radix UI adapter
registerUIAdapter(radixThemesAdapter);

// Define your schema
const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18 or older'),
  subscribe: z.boolean().default(false),
  birthDate: z.date(),
});

// Use in your component
function UserForm() {
  return (
    <FormGenerator
      schema={userSchema}
      onSubmit={(data) => console.log(data)}
    />
  );
}
```

### Using Individual Components

You can also use individual field components directly:

```tsx
import { StringField, NumberField, BooleanField } from '@zod-form-kit/radix';

function CustomForm() {
  const [values, setValues] = useState({
    name: '',
    age: 0,
    subscribe: false
  });

  return (
    <form>
      <StringField
        name="name"
        label="Full Name"
        value={values.name}
        onChange={(value) => setValues(prev => ({ ...prev, name: value }))}
        required
      />
      
      <NumberField
        name="age"
        label="Age"
        value={values.age}
        onChange={(value) => setValues(prev => ({ ...prev, age: value }))}
        options={{ min: 0, max: 120 }}
      />
      
      <BooleanField
        name="subscribe"
        label="Subscribe to newsletter"
        value={values.subscribe}
        onChange={(value) => setValues(prev => ({ ...prev, subscribe: value }))}
        options={{ variant: 'switch' }}
      />
    </form>
  );
}
```

## Available Components

### Field Renderers

| Component | Purpose | Special Features |
|-----------|---------|------------------|
| `StringField` | Text inputs, email, URL, password | Format detection, validation styling |
| `NumberField` | Numeric inputs | Min/max validation, step support |
| `BooleanField` | Checkboxes and switches | Checkbox or switch variants |
| `DateField` | Date/time inputs | Multiple date formats |
| `ArrayField` | Dynamic lists | Add/remove items, nested validation |
| `ObjectField` | Nested forms | Recursive field rendering |
| `DiscriminatedUnionField` | Conditional forms | Type-based field switching |
| `EnumField` | Select dropdowns | Searchable options |

### Base Components

| Component | Purpose |
|-----------|---------|
| `Input` | Base input component |
| `Label` | Accessible labels |
| `Button` | Action buttons |
| `Textarea` | Multi-line text |

## Field Options

### StringField Options

```tsx
interface StringFieldOptions {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  format?: 'email' | 'url' | 'password';
  readonly?: boolean;
}
```

### NumberField Options

```tsx
interface NumberFieldOptions {
  min?: number;
  max?: number;
  step?: number;
  readonly?: boolean;
  showSlider?: boolean; // Future feature
}
```

### BooleanField Options

```tsx
interface BooleanFieldOptions {
  variant?: 'checkbox' | 'switch';
}
```

### ArrayField Options

```tsx
interface ArrayFieldOptions {
  minLength?: number;
  maxLength?: number;
}
```

## Advanced Usage

### Custom Styling

All components accept a `className` prop for custom styling:

```tsx
<StringField
  name="email"
  label="Email Address"
  value={email}
  onChange={setEmail}
  className="mb-4"
  error={errors.email}
/>
```

### Error Handling

Components automatically style themselves based on error state:

```tsx
<StringField
  name="username"
  label="Username"
  value={username}
  onChange={setUsername}
  error="Username is already taken"
  required
/>
```

### Plugin System Integration

Register custom field renderers alongside the adapter:

```tsx
import { registerFieldRenderer, registerUIAdapter } from '@zod-form-kit/core';
import { radixThemesAdapter } from '@zod-form-kit/radix';

// Register the main adapter
registerUIAdapter(radixThemesAdapter);

// Override specific fields if needed
registerFieldRenderer('string', MyCustomStringField);
```

### Adapter Configuration

```tsx
import { registerRadixThemesAdapter } from '@zod-form-kit/radix';

// Use the convenience function
const adapter = registerRadixThemesAdapter();

// Or register manually with core
import { registerUIAdapter } from '@zod-form-kit/core';
registerUIAdapter(adapter);
```

## TypeScript Support

All components are fully typed and integrate seamlessly with zod-form-kit's type system:

```tsx
import type { 
  StringFieldRendererProps,
  NumberFieldRendererProps,
  BooleanFieldRendererProps 
} from '@zod-form-kit/core';

// Custom components must implement the correct interface
const MyCustomField: React.FC<StringFieldRendererProps> = (props) => {
  // Component implementation
};
```

## Dependencies

This package requires the following peer dependencies:

- `react` >= 16.8.0
- `react-dom` >= 16.8.0
- `@zod-form-kit/core`

The package automatically includes:

- `@radix-ui/react-*` primitives
- Styling utilities for consistent appearance

## Contributing

See the main repository's [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](../../LICENSE) for details. 