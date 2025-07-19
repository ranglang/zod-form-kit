import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { FormGenerator } from '../components/FormGenerator';

describe('FormGenerator', () => {
  it('renders string field correctly', () => {
    const schema = z.object({
      name: z.string()
    });
    
    const onSubmit = vi.fn();
    
    render(<FormGenerator schema={schema} onSubmit={onSubmit} />);
    
    expect(screen.getByLabelText('name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    const schema = z.object({
      name: z.string(),
      age: z.number()
    });
    
    const onSubmit = vi.fn();
    
    render(<FormGenerator schema={schema} onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText('name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('age'), { target: { value: '25' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: 'John', age: 25 });
    });
  });

  it('displays validation errors', async () => {
    const schema = z.object({
      email: z.string().email()
    });
    
    const onSubmit = vi.fn();
    
    render(<FormGenerator schema={schema} onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText('email'), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid email/)).toBeInTheDocument();
    });
    
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('handles optional fields', () => {
    const schema = z.object({
      name: z.string(),
      nickname: z.string().optional()
    });
    
    const onSubmit = vi.fn();
    
    render(<FormGenerator schema={schema} onSubmit={onSubmit} />);
    
    const nicknameField = screen.getByLabelText('nickname');
    expect(nicknameField).not.toHaveAttribute('required');
  });

  it('handles default values', () => {
    const schema = z.object({
      name: z.string().default('John Doe')
    });
    
    const onSubmit = vi.fn();
    
    render(<FormGenerator schema={schema} onSubmit={onSubmit} />);
    
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
  });
});