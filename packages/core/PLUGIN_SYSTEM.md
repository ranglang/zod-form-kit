# Zod Form Kit Plugin System

The Zod Form Kit plugin system allows you to extend the form generator with custom UI components and field renderers while maintaining the existing adapter pattern architecture. This system provides a centralized registry for managing custom field renderers and UI adapters.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Plugin System Architecture](#plugin-system-architecture)
- [Creating Custom Field Renderers](#creating-custom-field-renderers)
- [Creating UI Adapters](#creating-ui-adapters)
- [Registration API](#registration-api)
- [Advanced Usage](#advanced-usage)
- [Examples](#examples)
- [Type Safety](#type-safety)

## Overview

The plugin system consists of several key components:

- **Plugin Registry**: A centralized system for registering and retrieving custom field renderers
- **Field Renderer Interfaces**: Type-safe interfaces for each field type
- **UI Adapter Pattern**: A standardized way to package multiple field renderers
- **React Hooks**: Easy access to plugin system functionality
- **Provider Component**: Context-based configuration

## Quick Start

### 1. Basic Usage

```tsx
import { FormGenerator, registerUIAdapter, radixAdapter } from '@zod-form-kit/core';

// Register a UI adapter
registerUIAdapter(radixAdapter);

// Use the form generator
function MyForm() {
  return (
    <FormGenerator
      schema={myZodSchema}
      onSubmit={handleSubmit}
    />
  );
}
```

### 2. Using the Plugin Provider

```tsx
import { PluginProvider, FormGenerator, radixAdapter } from '@zod-form-kit/core';

function App() {
  return (
    <PluginProvider config={{ defaultAdapter: 'radix' }}>
      <FormGenerator
        schema={myZodSchema}
        onSubmit={handleSubmit}
      />
    </PluginProvider>
  );
}
```

### 3. Using the Hook

```tsx
import { usePluginSystem, FormGenerator } from '@zod-form-kit/core';

function MyComponent() {
  const { registerFieldRenderer, getRegisteredRenderer } = usePluginSystem();

  // Register a custom field renderer
  React.useEffect(() => {
    registerFieldRenderer('string', MyCustomStringField);
  }, []);

  return (
    <FormGenerator
      schema={myZodSchema}
      onSubmit={handleSubmit}
    />
  );
}
```

## Plugin System Architecture

### Core Components

1. **Plugin Registry** (`plugin-registry.ts`)
   - Manages registration and retrieval of field renderers
   - Handles UI adapter registration
   - Provides fallback to default renderers

2. **Type Definitions** (`plugin-system.ts`)
   - Defines interfaces for all field renderer types
   - Provides type-safe field renderer components
   - Defines UI adapter interface

3. **Field Renderer** (`FieldRenderer.tsx`)
   - Updated to use the plugin system
   - Dynamically retrieves registered renderers
   - Falls back to default renderers

4. **React Hooks** (`usePluginSystem.ts`)
   - Provides easy access to plugin system functionality
   - Memoized callbacks for performance

5. **Provider Component** (`PluginProvider.tsx`)
   - Context-based configuration
   - Allows app-level plugin system setup

### Field Types

The plugin system supports the following field types:

- `string` - Text input fields
- `number` - Numeric input fields
- `boolean` - Checkbox fields
- `date` - Date picker fields
- `array` - Dynamic array fields
- `object` - Object/nested form fields
- `discriminatedUnion` - Union type fields with discriminator

## Creating Custom Field Renderers

### Basic Field Renderer

```tsx
import { StringFieldRendererProps } from '@zod-form-kit/core';

function MyCustomStringField({
  name,
  label,
  value = '',
  onChange,
  error,
  required,
  options = {},
  className = ''
}: StringFieldRendererProps) {
  return (
    <div className={`my-field ${className}`}>
      <label htmlFor={name}>
        {label}
        {required && <span>*</span>}
      </label>
      
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'error' : ''}
        required={required}
      />
      
      {error && <span className="error">{error}</span>}
    </div>
  );
}
```

### Registering Individual Field Renderers

```tsx
import { registerFieldRenderer } from '@zod-form-kit/core';

// Register a custom string field renderer
registerFieldRenderer('string', MyCustomStringField);

// Register a custom number field renderer
registerFieldRenderer('number', MyCustomNumberField);
```

### Field Renderer Props

Each field type has its own props interface:

- `StringFieldRendererProps` - For string fields
- `NumberFieldRendererProps` - For number fields
- `BooleanFieldRendererProps` - For boolean fields
- `DateFieldRendererProps` - For date fields
- `ArrayFieldRendererProps` - For array fields
- `ObjectFieldRendererProps` - For object fields
- `DiscriminatedUnionFieldRendererProps` - For discriminated union fields

All field renderers extend `BaseFieldRendererProps` which includes:

```tsx
interface BaseFieldRendererProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  value: any;
}
```

## Creating UI Adapters

### Complete UI Adapter

```tsx
import { UIAdapter } from '@zod-form-kit/core';

const myUIAdapter: UIAdapter = {
  name: 'my-ui-library',
  components: {
    string: MyStringField,
    number: MyNumberField,
    boolean: MyBooleanField,
    date: MyDateField,
    array: MyArrayField,
    object: MyObjectField,
    discriminatedUnion: MyDiscriminatedUnionField
  }
};
```

### Registering UI Adapters

```tsx
import { registerUIAdapter } from '@zod-form-kit/core';

// Register the complete adapter
registerUIAdapter(myUIAdapter);

// Set as default (optional)
setDefaultAdapter('my-ui-library');
```

### Example: Material-UI Adapter

```tsx
import { TextField, Checkbox, FormControlLabel } from '@mui/material';
import { UIAdapter, StringFieldRendererProps } from '@zod-form-kit/core';

function MaterialUIStringField(props: StringFieldRendererProps) {
  const { name, label, value, onChange, error, required, options } = props;
  
  return (
    <TextField
      name={name}
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      required={required}
      type={options?.format === 'email' ? 'email' : 'text'}
      fullWidth
    />
  );
}

const materialUIAdapter: UIAdapter = {
  name: 'material-ui',
  components: {
    string: MaterialUIStringField,
    // ... other field types
  }
};
```

## Registration API

### Core Functions

```tsx
// Register individual field renderers
registerFieldRenderer(fieldType: FieldType, component: FieldRendererComponent)

// Register complete UI adapters
registerUIAdapter(adapter: UIAdapter)

// Retrieve registered renderers
getRegisteredRenderer(fieldType: FieldType): FieldRendererComponent | undefined

// Retrieve UI adapters
getUIAdapter(adapterName: string): UIAdapter | undefined

// Get default adapter
getDefaultAdapter(): UIAdapter | undefined

// Set default adapter
setDefaultAdapter(adapterName: string): void
```

### React Hook API

```tsx
const {
  registerFieldRenderer,
  registerUIAdapter,
  getRegisteredRenderer,
  getUIAdapter,
  getDefaultAdapter,
  setDefaultAdapter,
  registry
} = usePluginSystem();
```

### Provider Configuration

```tsx
<PluginProvider config={{
  defaultAdapter: 'material-ui',
  fallbackToDefaults: true
}}>
  {/* Your app */}
</PluginProvider>
```

## Advanced Usage

### Conditional Field Rendering

```tsx
function ConditionalStringField(props: StringFieldRendererProps) {
  const { value, options } = props;
  
  // Render different components based on options
  if (options?.format === 'email') {
    return <EmailField {...props} />;
  }
  
  if (options?.format === 'url') {
    return <UrlField {...props} />;
  }
  
  return <DefaultStringField {...props} />;
}
```

### Custom Validation Display

```tsx
function CustomStringField(props: StringFieldRendererProps) {
  const { error, options } = props;
  
  return (
    <div>
      <input {...props} />
      {error && (
        <div className="custom-error">
          <Icon name="error" />
          <span>{error}</span>
        </div>
      )}
      {options?.maxLength && (
        <span className="char-count">
          {value.length}/{options.maxLength}
        </span>
      )}
    </div>
  );
}
```

### Dynamic Field Registration

```tsx
function DynamicForm() {
  const { registerFieldRenderer } = usePluginSystem();
  
  useEffect(() => {
    // Register field renderers based on user preferences
    if (userPrefersMaterialUI) {
      registerFieldRenderer('string', MaterialUIStringField);
    } else {
      registerFieldRenderer('string', DefaultStringField);
    }
  }, [userPrefersMaterialUI]);
  
  return <FormGenerator schema={schema} onSubmit={onSubmit} />;
}
```

## Examples

### Ant Design Integration

```tsx
import { Input, Checkbox, DatePicker, Select } from 'antd';
import { UIAdapter } from '@zod-form-kit/core';

const antdAdapter: UIAdapter = {
  name: 'antd',
  components: {
    string: ({ name, label, value, onChange, error, required, options }) => (
      <Input
        name={name}
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        status={error ? 'error' : undefined}
        required={required}
        type={options?.format === 'email' ? 'email' : 'text'}
      />
    ),
    boolean: ({ name, label, value, onChange, required }) => (
      <Checkbox
        name={name}
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        required={required}
      >
        {label}
      </Checkbox>
    ),
    // ... other field types
  }
};
```

### Chakra UI Integration

```tsx
import { Input, Checkbox, Select } from '@chakra-ui/react';
import { UIAdapter } from '@zod-form-kit/core';

const chakraAdapter: UIAdapter = {
  name: 'chakra',
  components: {
    string: ({ name, label, value, onChange, error, required, options }) => (
      <Input
        name={name}
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        isInvalid={!!error}
        required={required}
        type={options?.format === 'email' ? 'email' : 'text'}
      />
    ),
    // ... other field types
  }
};
```

### Custom Theme Integration

```tsx
function ThemedStringField(props: StringFieldRendererProps) {
  const theme = useTheme();
  const { name, label, value, onChange, error, required } = props;
  
  return (
    <div style={{ 
      backgroundColor: theme.colors.background,
      borderColor: error ? theme.colors.error : theme.colors.border
    }}>
      <input
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={{ color: theme.colors.text }}
      />
    </div>
  );
}
```

## Type Safety

The plugin system is fully type-safe with TypeScript. All field renderer components must implement the correct interface for their field type:

```tsx
// Type-safe field renderer registration
registerFieldRenderer('string', MyStringField); // ✅ Correct
registerFieldRenderer('number', MyStringField); // ❌ Type error

// Type-safe UI adapter
const adapter: UIAdapter = {
  name: 'my-adapter',
  components: {
    string: MyStringField, // ✅ Must implement StringFieldRendererProps
    number: MyNumberField, // ✅ Must implement NumberFieldRendererProps
    // Missing required components will cause type errors
  }
};
```

### Type Guards

```tsx
function isStringFieldRenderer(component: any): component is StringFieldRenderer {
  return typeof component === 'function';
}

// Usage
if (isStringFieldRenderer(MyComponent)) {
  registerFieldRenderer('string', MyComponent);
}
```

## Best Practices

1. **Use TypeScript**: Always use TypeScript for type safety
2. **Implement All Required Props**: Ensure your field renderers implement all required props
3. **Handle Errors Gracefully**: Always display validation errors
4. **Support Accessibility**: Include proper labels and ARIA attributes
5. **Test Your Components**: Write tests for your custom field renderers
6. **Document Your Adapters**: Provide clear documentation for your UI adapters
7. **Use Consistent Styling**: Maintain consistent styling across your field renderers

## Migration Guide

### From Direct Component Usage

**Before:**
```tsx
import { StringField } from '@zod-form-kit/core';

// Direct usage
<StringField {...props} />
```

**After:**
```tsx
import { registerFieldRenderer } from '@zod-form-kit/core';

// Register custom renderer
registerFieldRenderer('string', MyCustomStringField);

// FormGenerator will automatically use registered renderer
<FormGenerator schema={schema} onSubmit={onSubmit} />
```

### From Custom FieldRenderer

**Before:**
```tsx
// Custom FieldRenderer with hardcoded components
function CustomFieldRenderer({ schema, ...props }) {
  switch (schema.type) {
    case 'string':
      return <MyStringField {...props} />;
    // ...
  }
}
```

**After:**
```tsx
// Use plugin system
import { registerFieldRenderer } from '@zod-form-kit/core';

registerFieldRenderer('string', MyStringField);
// FormGenerator will use registered renderers automatically
```

This plugin system provides a flexible, type-safe way to extend Zod Form Kit with custom UI components while maintaining the existing architecture and providing excellent developer experience. 