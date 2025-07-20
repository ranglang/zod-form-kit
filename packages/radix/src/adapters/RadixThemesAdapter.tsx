import { StringField } from '../components/fields/StringField';
import { NumberField } from '../components/fields/NumberField';
import { BooleanField } from '../components/fields/BooleanField';
import { DateField } from '../components/fields/DateField';
import { ArrayField } from '../components/fields/ArrayField';
import { ObjectField } from '../components/fields/ObjectField';
import { DiscriminatedUnionField } from '../components/fields/DiscriminatedUnionField';
import { EnumField } from '../components/fields/EnumField';

// Import the actual UIAdapter interface and registration function
import type { UIAdapter } from '@zod-form-kit/core';
import { registerUIAdapter, registerFieldRenderer } from '@zod-form-kit/core';

// Enhanced Radix UI Adapter with modern styling and components
export const radixThemesAdapter: UIAdapter = {
  name: 'radix-themes',
  components: {
    string: StringField,
    //@ts-ignore
    string1: StringField,
    number: NumberField,
    boolean: BooleanField,
    date: DateField,
    array: ArrayField,
    object: ObjectField,
    discriminatedUnion: DiscriminatedUnionField
    // Note: enum field is not included in UIAdapter interface yet,
    // but will be registered separately in registerRadixThemesAdapter()
  }
};

// Convenience function to register the adapter
export function registerRadixThemesAdapter() {
  registerUIAdapter(radixThemesAdapter);
  
  // Register enum field separately since it's not included in UIAdapter interface yet
  // Using type assertion since EnumFieldRenderer is not in the core type union yet
  registerFieldRenderer('enum', EnumField as any);
  
  console.log('Radix Themes Adapter registered successfully:', radixThemesAdapter.name);
  return radixThemesAdapter;
}

// Export individual components for direct use
export {
  StringField,
  NumberField,
  BooleanField,
  DateField,
  ArrayField,
  ObjectField,
  DiscriminatedUnionField,
  EnumField
}; 