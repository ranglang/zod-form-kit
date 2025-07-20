# zod-form-kit Monorepo Setup

This document provides a comprehensive guide for setting up and understanding the zod-form-kit monorepo structure.

## 📁 Monorepo Structure

```
zod-form-kit-monorepo/
├── packages/
│   ├── core/                 # Core form generation library
│   ├── radix/                # Radix UI integration
│   └── website/              # Documentation and demo website
├── package.json              # Root package.json
├── pnpm-workspace.yaml       # Workspace configuration
└── README.md                 # Project documentation
```

## 📦 Package Overview

### 1. `@zod-form-kit/core` (packages/core/)
The core library that provides UI-agnostic form generation from Zod schemas.

**Key Features:**
- Schema-driven form generation
- Type-safe validation
- Extensible adapter pattern
- Support for complex schemas

### 2. `@zod-form-kit/radix` (packages/radix/)
Radix UI integration package with pre-built components styled with Tailwind CSS.

**Key Features:**
- Radix UI components with Tailwind CSS styling
- Consistent design system
- Accessibility-first approach
- Theme support

### 3. `@zod-form-kit/website` (packages/website/)
Documentation and demo website built with Next.js.

**Key Features:**
- Interactive demos
- API documentation
- Code examples
- Live playground

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- pnpm

### Installation
```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm build

# Start development server
pnpm dev
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

## 🔧 Key Features Implemented

### 1. pnpm Workspaces
- Configured `pnpm-workspace.yaml` to include all packages
- Set up workspace dependencies using `workspace:*` syntax
- Enabled cross-package development and testing

### 2. Core Package Migration
- Successfully moved existing codebase to `packages/core/`
- Maintained all original functionality
- Updated package.json with proper exports and peer dependencies
- Preserved build configuration (TypeScript + Vite)

### 3. Radix UI Integration
- Created comprehensive UI component library
- Implemented design system with Tailwind CSS
- Added support for:
  - Input fields
  - Labels
  - Buttons
  - Cards
  - Badges
  - Textareas
- Used class-variance-authority for component variants

### 4. Website Package
- Built with Next.js 14 (App Router)
- Implemented modern UI with Tailwind CSS
- Created interactive form demo
- Added comprehensive documentation
- Responsive design with mobile support

### 5. Type Safety
- Full TypeScript support across all packages
- Proper type exports and imports
- Zod schema integration with type inference
- Strict TypeScript configuration

## 🏗️ Architecture Overview

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

## 🎨 UI Framework Support

The core package is designed to be UI-agnostic and can work with any UI framework through the adapter pattern. Currently supported:

- **Radix UI** (via `@zod-form-kit/radix`)
- **Custom implementations** (extend the core package)

### Future Extensions
The adapter pattern allows for easy integration with:
- Material-UI
- Ant Design
- Chakra UI
- Mantine
- Any custom UI library

## 📊 Build Status

✅ **Core Package**: Successfully builds and exports
✅ **Radix UI Package**: Successfully builds and exports  
✅ **Website Package**: Successfully builds and serves
✅ **Monorepo Scripts**: All working correctly
✅ **Development Server**: Running at http://localhost:3000

## 🚀 Next Steps

1. **Publish Packages**: Prepare packages for npm publication
2. **Documentation**: Expand API documentation
3. **Testing**: Add comprehensive test coverage
4. **CI/CD**: Set up automated testing and deployment
5. **Examples**: Add more complex form examples
6. **Performance**: Optimize bundle sizes and performance

## 📦 Dependency Graph

```
zod-form-kit-monorepo
├── @zod-form-kit/core
│   ├── react
│   ├── react-dom
│   └── zod
├── @zod-form-kit/radix
│   ├── @zod-form-kit/core (workspace)
│   ├── @radix-ui/* packages
│   ├── class-variance-authority
│   ├── clsx
│   └── tailwind-merge
└── @zod-form-kit/website
├── @zod-form-kit/core (workspace)
├── @zod-form-kit/radix (workspace)
├── next
├── react
├── react-dom
└── tailwindcss
```

## 📝 Usage Examples

### Basic Usage

```tsx
import { FormGenerator } from '@zod-form-kit/core'
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

## 🎯 Benefits Achieved

1. **Modularity**: Clear separation of concerns
2. **Reusability**: Core logic can be used with any UI framework
3. **Maintainability**: Easier to maintain and update individual packages
4. **Scalability**: Easy to add new UI integrations
5. **Developer Experience**: Better tooling and development workflow
6. **Type Safety**: Full TypeScript support across the ecosystem

The monorepo is now ready for development and can be easily extended with additional UI framework integrations. 