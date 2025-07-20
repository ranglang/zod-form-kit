import React from 'react';
import { z } from 'zod';
import { ZodForm, registerSchemaPatternRenderer, SchemaPatternRendererProps } from '../index';

// =============================================================================
// DEMO: Schema Pattern Registration for Upload Components
// =============================================================================

// Define a Zod schema pattern for upload fields
const uploadSchema = z.object({
  upload: z.literal(true),
  url: z.string(),
  host: z.literal("cdn")
});

// Custom Upload Component
const CustomUploadComponent: React.FC<SchemaPatternRendererProps> = ({
  value,
  onChange,
  label,
  error,
  required,
  zodSchema: _zodSchema,
  parsedField: _parsedField
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate uploading and getting a URL
      const uploadedData = {
        upload: true,
        url: URL.createObjectURL(file),
        host: "cdn" as const
      };
      onChange(uploadedData);
    }
  };

  return (
    <div className="upload-field">
      <label htmlFor="file-upload">
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        style={{
          display: 'block',
          margin: '8px 0',
          padding: '8px',
          border: '2px dashed #ccc',
          borderRadius: '4px'
        }}
      />
      {value?.url && (
        <div style={{ marginTop: '8px' }}>
          <p>Uploaded to: {value.host}</p>
          <img 
            src={value.url} 
            alt="Preview" 
            style={{ maxWidth: '200px', maxHeight: '200px' }}
          />
        </div>
      )}
      {error && <div style={{ color: 'red', fontSize: '12px' }}>{error}</div>}
    </div>
  );
};

// Register the pattern renderer
registerSchemaPatternRenderer(
  'upload-pattern', // unique ID
  uploadSchema,     // Zod schema pattern to match
  CustomUploadComponent, // component to render
  100 // high priority
);

// Alternative: Register using a matcher function
registerSchemaPatternRenderer(
  'custom-upload-matcher',
  (zodSchema, _parsedField, _formValue) => {
    // Custom logic to determine if this schema should use our custom component
    return (
      zodSchema instanceof z.ZodObject &&
      zodSchema.shape.upload instanceof z.ZodLiteral &&
      zodSchema.shape.upload._def.value === true &&
      zodSchema.shape.host instanceof z.ZodLiteral &&
      zodSchema.shape.host._def.value === "cdn"
    );
  },
  CustomUploadComponent,
  90 // slightly lower priority than the schema-based matcher
);

// =============================================================================
// DEMO: Schema Pattern for Special String Fields
// =============================================================================

// Pattern for color picker fields
const colorFieldMatcher = (zodSchema: z.ZodTypeAny, parsedField: any) => {
  return (
    zodSchema instanceof z.ZodString &&
    parsedField.options?.format === 'color'
  );
};

const ColorPickerComponent: React.FC<SchemaPatternRendererProps> = ({
  value,
  onChange,
  label,
  error,
  required
}) => {
  return (
    <div className="color-field">
      <label>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        style={{
          display: 'block',
          margin: '8px 0',
          width: '60px',
          height: '40px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
      {error && <div style={{ color: 'red', fontSize: '12px' }}>{error}</div>}
    </div>
  );
};

registerSchemaPatternRenderer(
  'color-picker-pattern',
  colorFieldMatcher,
  ColorPickerComponent,
  80
);

// =============================================================================
// DEMO FORM EXAMPLE
// =============================================================================

// Example schema that uses the registered patterns
const demoFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  profileImage: uploadSchema,
  coverImage: uploadSchema,
  themeColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  description: z.string().optional()
});

type DemoFormData = z.infer<typeof demoFormSchema>;

export const SchemaPatternDemo: React.FC = () => {
  const handleSubmit = async (data: DemoFormData) => {
    console.log('Form submitted with data:', data);
    alert('Form submitted! Check console for data.');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Schema Pattern Registration Demo</h1>
      <p>
        This demo shows how to register custom UI components for specific Zod schema patterns.
        The upload fields and color fields below use custom components that were registered
        to match specific schema patterns.
      </p>
      
      <ZodForm
        schema={demoFormSchema}
        onSubmit={handleSubmit}
        defaultValues={{
          title: '',
          themeColor: '#3366cc',
          backgroundColor: '#ffffff'
        }}
        className="demo-form"
      />
      
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h3>Code Example:</h3>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
{`// Register custom component for upload pattern
const uploadSchema = z.object({
  upload: z.literal(true),
  url: z.string(),
  host: z.literal("cdn")
});

registerSchemaPatternRenderer(
  'upload-pattern',
  uploadSchema,
  CustomUploadComponent,
  100
);

// Register custom component using matcher function
registerSchemaPatternRenderer(
  'color-picker-pattern',
  (zodSchema, parsedField) => (
    zodSchema instanceof z.ZodString &&
    parsedField.options?.format === 'color'
  ),
  ColorPickerComponent,
  80
);`}
        </pre>
      </div>
    </div>
  );
};

export default SchemaPatternDemo; 