# Contributing to zod-form-kit

Thank you for your interest in contributing to zod-form-kit! This document provides guidelines and information for contributors.

## Project Goals

zod-form-kit aims to be:
- **UI-Agnostic**: Framework-agnostic core that separates schema parsing from UI rendering
- **Extensible**: Easy to create custom adapters for different UI libraries
- **Type-Safe**: Full TypeScript support with automatic type generation
- **Well-Tested**: Comprehensive test coverage and documentation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Git

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/zod-form-kit.git
   cd zod-form-kit
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Run tests**
   ```bash
   pnpm test
   ```

5. **View Storybook**
   ```bash
   pnpm ladle
   ```

## 📝 Development Guidelines

### Code Style

We use [Biome](https://biomejs.dev/) for linting and formatting:

```bash
# Check code style
pnpm lint

# Fix code style issues
pnpm lint:fix

# Format code
pnpm format
```

### TypeScript

- Use TypeScript for all new code
- Maintain strict type safety
- Add proper JSDoc comments for public APIs
- Use meaningful type names and interfaces

### Testing

- Write tests for all new features
- Maintain high test coverage
- Use descriptive test names
- Test both success and error cases

```bash
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests in watch mode
pnpm test --watch
```

### Architecture Principles

1. **Separation of Concerns**: Keep schema parsing separate from UI rendering
2. **Adapter Pattern**: Design for extensibility and framework-agnostic usage
3. **Type Safety**: Leverage TypeScript and Zod for compile-time safety
4. **Performance**: Optimize for minimal re-renders and efficient updates

## 🔧 Creating Custom Adapters

When creating custom adapters, follow these guidelines:

1. **Implement the FieldRenderer interface**
2. **Handle all field types** (string, number, boolean, date, array, object, union)
3. **Provide proper error handling**
4. **Add comprehensive tests**
5. **Document usage examples**

Example adapter structure:

```typescript
import { FieldRenderer, FieldConfig } from 'zod-form-kit';

export class CustomUIAdapter implements FieldRenderer {
  renderStringField(config: FieldConfig) {
    // Implementation for string fields
  }

  renderNumberField(config: FieldConfig) {
    // Implementation for number fields
  }

  // ... implement all other field types
}
```

## 📚 Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new APIs
- Create Storybook stories for new components
- Update type definitions as needed

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce**
3. **Expected vs actual behavior**
4. **Environment details** (OS, Node version, etc.)
5. **Code example** if applicable

## 💡 Feature Requests

When requesting features, please:

1. **Describe the use case** and problem it solves
2. **Provide examples** of how it would be used
3. **Consider the impact** on existing APIs
4. **Think about extensibility** and framework-agnostic design

## 🔄 Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the guidelines above
3. **Add tests** for new functionality
4. **Update documentation** as needed
5. **Run the full test suite** and ensure all tests pass
6. **Submit a pull request** with a clear description

### PR Guidelines

- **Clear title** describing the change
- **Detailed description** of what was changed and why
- **Link to related issues** if applicable
- **Screenshots** for UI changes
- **Test coverage** information

## 🏷️ Versioning

We follow [Semantic Versioning](https://semver.org/):

- **Major**: Breaking changes to the API
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

## 📄 License

By contributing to zod-form-kit, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to zod-form-kit! 🚀 