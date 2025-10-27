import { z } from "zod";

// Field types supported for entity generation
export const fieldTypes = [
  "string",
  "number",
  "boolean",
  "date",
  "email",
  "password",
  "text",
  "integer",
  "float",
  "array",
] as const;

export type FieldType = typeof fieldTypes[number];

// Framework options
export const frameworks = ["nodejs-express", "spring-boot"] as const;
export type Framework = typeof frameworks[number];

// Entity field definition
export const entityFieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  type: z.enum(fieldTypes),
});

export type EntityField = z.infer<typeof entityFieldSchema>;

// Code generation request
export const codeGenerationRequestSchema = z.object({
  entityName: z.string().min(1, "Entity name is required"),
  fields: z.array(entityFieldSchema).min(1, "At least one field is required"),
  framework: z.enum(frameworks),
  includeDocker: z.boolean().default(false),
  includeCICD: z.boolean().default(false),
  includeSwagger: z.boolean().default(true),
});

export type CodeGenerationRequest = z.infer<typeof codeGenerationRequestSchema>;

// Generated file structure
export interface GeneratedFile {
  path: string;
  content: string;
  language: string; // For syntax highlighting
}

// Code generation response
export const codeGenerationResponseSchema = z.object({
  files: z.array(z.object({
    path: z.string(),
    content: z.string(),
    language: z.string(),
  })),
  projectName: z.string(),
  framework: z.enum(frameworks),
});

export type CodeGenerationResponse = z.infer<typeof codeGenerationResponseSchema>;

// Insert schema for code generation request
export const insertCodeGenerationRequestSchema = codeGenerationRequestSchema;
export type InsertCodeGenerationRequest = z.infer<typeof insertCodeGenerationRequestSchema>;
