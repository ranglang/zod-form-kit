'use client'

import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ZodForm, ZodFormExample } from 'zod-form-radix'

const demoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  // email: z.string().email('Invalid email address'),
  // age: z.number().min(18, 'Must be at least 18 years old'),
  // isSubscribed: z.boolean(),
  // role: z.enum(['user', 'admin', 'moderator']),
  // bio: z.string().optional(),
  // preferences: z.object({
  //   newsletter: z.boolean(),
  //   notifications: z.boolean()
  // })
})

type FormData = z.infer<typeof demoSchema>

export default function HomePage() {
  const handleSubmit = (data: FormData) => {
    console.log('Form submitted:', data)
    alert(`Form submitted: ${JSON.stringify(data, null, 2)}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Zod Radix Form
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            UI-agnostic form generation library based on Zod schemas with extensible adapter pattern
          </p>
          <div className="flex gap-2 justify-center">
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">Zod</Badge>
            <Badge variant="secondary">Radix UI</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
          </div>
        </div>

        {/* Demo Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Live Demo</CardTitle>
              <CardDescription>
                Try out the form generator with a sample schema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ZodForm
                schema={demoSchema}
                onSubmit={handleSubmit}
                defaultValues={{
                  name: 'John Doe'
                }}
                className="space-y-4"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schema Definition</CardTitle>
              <CardDescription>
                The form above is generated from this Zod schema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                <code>{`const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
  isSubscribed: z.boolean(),
  role: z.enum(['user', 'admin', 'moderator']),
  bio: z.string().optional(),
  preferences: z.object({
    newsletter: z.boolean(),
    notifications: z.boolean()
  })
})`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Additional Example Section */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Additional Example</CardTitle>
              <CardDescription>
                Another form example using the Radix adapter with different field types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ZodFormExample />
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Schema-Driven
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Generate forms automatically from Zod schemas with validation rules, types, and constraints.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                UI-Agnostic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Works with any UI library through the extensible adapter pattern. Built-in support for Radix UI.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Type-Safe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Full TypeScript support with automatic type inference from your Zod schemas.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Installation Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>
              Install and start using Zod Radix Form in your project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Install the core package:</h4>
                <pre className="bg-muted p-3 rounded-lg text-sm">
                  <code>npm install @zod-form-kit/core</code>
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Install Radix UI integration:</h4>
                <pre className="bg-muted p-3 rounded-lg text-sm">
                  <code>npm install zod-form-radix</code>
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Basic usage:</h4>
                <pre className="bg-muted p-3 rounded-lg text-sm overflow-auto">
                  <code>{`import { ZodForm } from 'zod-form-radix';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
});

<ZodForm
  schema={schema}
  onSubmit={(data) => console.log(data)}
  defaultValues={{ name: '', email: '' }}
/>`}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 