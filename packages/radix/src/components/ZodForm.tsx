import { ZodForm as CoreZodForm, type ZodFormProps, type ValidFormSchema } from 'zod-form-kit';
import { radixThemesAdapter } from '../adapters/RadixThemesAdapter';

/**
 * ZodForm component with built-in Radix Themes adapter
 * 
 * This component automatically registers the radixThemesAdapter and sets it as the default,
 * providing a seamless experience for users who want to use Radix UI components.
 */
export function ZodForm<T extends ValidFormSchema>(props: ZodFormProps<T>) {
  return <CoreZodForm registerUIAdapter={radixThemesAdapter} {...props} />;
}
