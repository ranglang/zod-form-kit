# zod-form-kit Monorepo

A monorepo containing a UI-agnostic form generation library based on Zod schemas with extensible adapter pattern and Radix UI integration.

## 🏗️ Monorepo Structure

```
packages/
├── core/                    # Core form generation library
├── website/                 # Documentation and demo website
└── radix/                   # Radix UI integration package
```

## 📦 Packages

### `zod-form-kit`
The core library that provides UI-agnostic form generation from Zod schemas. This package contains the main form generation logic and can be used with any UI framework.

**Features:**
- Schema-driven form generation
- Type-safe validation
- Extensible adapter pattern
- Support for complex schemas (nested objects, arrays, discriminated unions)

### `@zod-form-kit/radix`
Radix UI integration package that provides pre-built components styled with Tailwind CSS and following Radix UI design patterns.

**Features:**
- Radix UI components with Tailwind CSS styling
- Consistent design system
- Accessibility-first approach
- Theme support

### `@zod-form-kit/website`
Documentation and demo website built with Next.js, showcasing the library's capabilities.

**Features:**
- Interactive demos
- API documentation
- Code examples
- Live playground

### Key Features

- **🔧 UI-Agnostic**: Framework-agnostic core that separates schema parsing from UI rendering
- **🎯 Adapter Pattern**: Extensible architecture allowing easy integration with any UI library
- **📝 Schema-Driven**: Leverage Zod's powerful schema validation and type inference
- **⚡ Type-Safe**: Full TypeScript support with automatic type generation
- **🔄 Extensible**: Easy to create custom field renderers and adapters
- **🧪 Tested**: Comprehensive test suite with Storybook documentation

## 🏗️ Architecture

zod-form-kit follows the adapter pattern, separating concerns into distinct layers:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Zod Schema    │───▶│  Schema Parser   │───▶│  Field Renderer │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   UI Adapter     │
                       │  (React/Vue/etc) │
                       └──────────────────┘
```

### Core Components

1. **Schema Parser**: Converts Zod schemas into field configurations
2. **Field Renderer**: Renders form fields based on parsed schemas
3. **UI Adapter**: Framework-specific implementation layer
4. **Form Generator**: Orchestrates the entire form generation process

## 🚀 Quick Start

### Installation

```bash
# Install both packages
npm install zod-form-kit zod-form-radix

# Or with the Radix adapter
npm install zod-form-radix  # This will pull in zod-form-kit as peer dependency
```

### Basic Usage

```tsx
import { FormGenerator } from 'zod-form-kit'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
})

function MyForm() {
  return (
    <FormGenerator
      schema={schema}
      onSubmit={(data) => console.log('Form submitted:', data)}
    />
  )
}
```

### Using Radix UI Components

```tsx
import { FormGenerator } from '@zod-form-kit/radix'
import { z } from 'zod'

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
})

function MyForm() {
  return (
    <FormGenerator
      schema={schema}
      onSubmit={(data) => console.log('Form submitted:', data)}
    />
  )
}
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development server for website
pnpm dev

# Run tests
pnpm test

# Run linting
pnpm lint
```

### Available Scripts

- `pnpm dev` - Start the website development server
- `pnpm build` - Build all packages
- `pnpm test` - Run tests across all packages
- `pnpm lint` - Run linting across all packages
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code across all packages
- `pnpm clean` - Clean build artifacts
- `pnpm ladle` - Start Ladle storybook for core package

## 📚 Supported Field Types

zod-form-kit supports all major Zod field types:

- **String Fields**: Text inputs, textareas, selects
- **Number Fields**: Number inputs, sliders, ranges
- **Boolean Fields**: Checkboxes, toggles, radio buttons
- **Date Fields**: Date pickers, datetime inputs
- **Array Fields**: Dynamic lists, multi-selects
- **Object Fields**: Nested forms, grouped fields
- **Union Fields**: Conditional rendering, discriminated unions

## 🎨 Customization

### Styling

zod-form-kit provides flexible styling options:

```typescript
<FormGenerator
  schema={userSchema}
  onSubmit={handleSubmit}
  className="custom-form"
  fieldClassName="custom-field"
  labelClassName="custom-label"
  errorClassName="custom-error"
/>
```

### Validation

Leverage Zod's powerful validation capabilities:

```typescript
const advancedSchema = z.object({
  username: z.string()
    .min(3, 'Username too short')
    .max(20, 'Username too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Invalid characters'),
  password: z.string()
    .min(8, 'Password too short')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password too weak'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

## 🎨 UI Framework Support

The core package is designed to be UI-agnostic and can work with any UI framework through the adapter pattern. Currently supported:

- **Radix UI** (via `@zod-form-kit/radix`)
- **Custom implementations** (extend the core package)

## 📚 Documentation

Visit the [website](./packages/website) for comprehensive documentation, examples, and interactive demos.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

MIT License - see [LICENSE](./LICENSE) for details. 