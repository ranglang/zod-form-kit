import React from 'react';
import { radixThemesAdapter } from '../adapters/RadixThemesAdapter';
import { 
  StringField, 
  NumberField, 
  BooleanField, 
  DateField, 
  ArrayField, 
  ObjectField,
  EnumField 
} from '../index';

// Example showing direct component usage
export function DirectComponentExample() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    age: 25,
    subscribe: false,
    birthDate: null as Date | null,
    skills: [] as string[],
    address: {
      street: '',
      city: '',
      country: ''
    },
    role: ''
  });

  const [errors] = React.useState<Record<string, string>>({});

  const updateField = (path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Radix UI Adapter Example
      </h1>

      <form className="space-y-6">
        {/* String Fields */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
          
          <StringField
            name="name"
            label="Full Name"
            value={formData.name}
            onChange={(value) => updateField('name', value)}
            required
            error={errors.name}
          />

          <StringField
            name="email"
            label="Email Address"
            value={formData.email}
            onChange={(value) => updateField('email', value)}
            options={{ format: 'email' }}
            required
            error={errors.email}
          />
        </div>

        {/* Number Field */}
        <NumberField
          name="age"
          label="Age"
          value={formData.age}
          onChange={(value) => updateField('age', value)}
          options={{ min: 0, max: 120 }}
          required
        />

        {/* Boolean Fields */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Preferences</h2>
          
          <BooleanField
            name="subscribe"
            label="Subscribe to newsletter"
            value={formData.subscribe}
            onChange={(value) => updateField('subscribe', value)}
            options={{ variant: 'checkbox' }}
          />
        </div>

        {/* Date Field */}
        <DateField
          name="birthDate"
          label="Birth Date"
          value={formData.birthDate}
          onChange={(value) => updateField('birthDate', value)}
          options={{ format: 'date' }}
        />

        {/* Enum Field */}
        <EnumField
          name="role"
          label="Role"
          value={formData.role}
          onChange={(value) => updateField('role', value)}
          values={['user', 'admin', 'moderator']}
          required
        />

        {/* Array Field */}
        <ArrayField
          name="skills"
          label="Skills"
          value={formData.skills}
          onChange={updateField}
          itemSchema={{ type: 'string' }}
          errors={errors}
          path="skills"
          options={{ minLength: 0, maxLength: 10 }}
        />

        {/* Object Field */}
        <ObjectField
          name="address"
          label="Address"
          value={formData.address}
          onChange={updateField}
          properties={{
            street: { type: 'string', label: 'Street Address', required: true },
            city: { type: 'string', label: 'City', required: true },
            country: { type: 'string', label: 'Country', required: true }
          }}
          errors={errors}
          path="address"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={(e) => {
            e.preventDefault();
            console.log('Form Data:', formData);
          }}
        >
          Submit Form
        </button>
      </form>

      {/* Display current form data */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Current Form Data:</h3>
        <pre className="text-sm text-gray-700 overflow-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// Example showing how to use the adapter with the plugin system
export function AdapterRegistrationExample() {
  // In a real application, you would call this during app initialization
  const setupAdapter = () => {
    console.log('Adapter ready:', radixThemesAdapter.name);
    console.log('Available components:', Object.keys(radixThemesAdapter.components));
    
    // This would typically be:
    // import { registerUIAdapter } from 'zod-form-kit';
    // registerUIAdapter(radixThemesAdapter);
  };

  React.useEffect(() => {
    setupAdapter();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Adapter Registration Example</h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Integration Steps:</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          <li>Install: <code className="bg-blue-100 px-1 rounded">npm install zod-form-radix</code></li>
          <li>Register: <code className="bg-blue-100 px-1 rounded">registerUIAdapter(radixThemesAdapter)</code></li>
          <li>Use: <code className="bg-blue-100 px-1 rounded">{'<FormGenerator schema={schema} />'}</code></li>
        </ol>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Adapter Info:</h4>
        <p><strong>Name:</strong> {radixThemesAdapter.name}</p>
        <p><strong>Components:</strong> {Object.keys(radixThemesAdapter.components).join(', ')}</p>
      </div>
    </div>
  );
}

export default DirectComponentExample; 