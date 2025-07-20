const { z } = require('zod');
const { parseZodSchema } = require('./src/utils/schema-parser.ts');

const schema = z.object({ 
  name: z.string(), 
  email: z.string() 
});

console.log('Original schema:', schema);
console.log('Parsed schema:', JSON.stringify(parseZodSchema(schema), null, 2)); 