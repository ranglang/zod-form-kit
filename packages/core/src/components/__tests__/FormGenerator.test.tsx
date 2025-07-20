import { describe, it, expect } from 'vitest';
import { FormGenerator } from '../FormGenerator';
import { ZodForm } from '../ZodForm';

describe('FormGenerator Component (Alias)', () => {
  it('should be the same as ZodForm component', () => {
    // FormGenerator should be an exact reference to ZodForm
    expect(FormGenerator).toBe(ZodForm);
  });
  
  it('should export the same component functionality', () => {
    // Both should have the same prototype and constructor
    expect(FormGenerator.prototype).toBe(ZodForm.prototype);
    expect(FormGenerator.constructor).toBe(ZodForm.constructor);
  });
});
