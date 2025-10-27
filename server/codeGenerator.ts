import { openai } from "./openai";
import { CodeGenerationRequest, GeneratedFile, Framework } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user

export async function generateBackendCode(
  request: CodeGenerationRequest
): Promise<GeneratedFile[]> {
  const { entityName, fields, framework, includeDocker, includeCICD, includeSwagger } = request;

  const systemPrompt = `You are an expert backend developer. Generate clean, production-ready code based on the specifications provided. 
Always return valid JSON in the exact format specified. Do not include any markdown formatting or code blocks in your response.`;

  const userPrompt = buildPromptForFramework(framework, entityName, fields, includeDocker, includeCICD, includeSwagger);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 8192,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.files || [];
  } catch (error) {
    console.error("OpenAI generation error:", error);
    throw new Error("Failed to generate code with AI");
  }
}

function buildPromptForFramework(
  framework: Framework,
  entityName: string,
  fields: any[],
  includeDocker: boolean,
  includeCICD: boolean,
  includeSwagger: boolean
): string {
  const fieldsList = fields.map(f => `- ${f.name}: ${f.type}`).join('\n');

  if (framework === "nodejs-express") {
    return `You are an expert Node.js/Express developer. Generate COMPLETE, PRODUCTION-READY, WORKING CODE for a CRUD API.

Entity Name: ${entityName}
Fields:
${fieldsList}

Generate the following files with FULL, COMPILABLE CODE (not placeholders):

1. models/${entityName}.ts - Complete TypeScript interface for the ${entityName} entity with all fields listed above
2. controllers/${entityName}Controller.ts - Complete controller with FULL implementations of:
   - create${entityName}(req, res) - handles POST requests
   - getAll${entityName}s(req, res) - handles GET all
   - get${entityName}ById(req, res) - handles GET by ID
   - update${entityName}(req, res) - handles PUT/PATCH
   - delete${entityName}(req, res) - handles DELETE
   Use in-memory storage array, proper error handling, and async/await.

3. routes/${entityName}Routes.ts - Complete Express Router setup with all CRUD routes properly connected to controller methods

4. index.ts - Complete Express server setup that:
   - Imports express and required middleware
   - Sets up JSON parsing
   - Mounts the ${entityName} routes at /api/${entityName.toLowerCase()}s
   - Starts server on port 3000
   - Includes error handling middleware

${includeSwagger ? `5. swagger.yaml - Complete OpenAPI 3.0 specification with all CRUD endpoints documented, including request/response schemas for ${entityName}` : ''}

${includeDocker ? `6. Dockerfile - Complete, working Dockerfile for Node.js app with:
   - Node 18 Alpine base image
   - Working directory setup
   - Package installation
   - Proper EXPOSE and CMD` : ''}

${includeCICD ? `7. .github/workflows/ci.yml - Complete GitHub Actions workflow with:
   - Node.js setup
   - npm install and test steps
   - Runs on push and pull requests` : ''}

CRITICAL: Generate COMPLETE, WORKING CODE for each file. Do NOT use placeholders like "// code here". Write the ACTUAL implementation.

Return ONLY a JSON object with this structure:
{
  "files": [
    {"path": "models/${entityName}.ts", "content": "<COMPLETE_TYPESCRIPT_CODE>", "language": "typescript"},
    {"path": "controllers/${entityName}Controller.ts", "content": "<COMPLETE_TYPESCRIPT_CODE>", "language": "typescript"},
    {"path": "routes/${entityName}Routes.ts", "content": "<COMPLETE_TYPESCRIPT_CODE>", "language": "typescript"},
    {"path": "index.ts", "content": "<COMPLETE_TYPESCRIPT_CODE>", "language": "typescript"}
    ${includeSwagger ? `,{"path": "swagger.yaml", "content": "<COMPLETE_YAML>", "language": "yaml"}` : ''}
    ${includeDocker ? `,{"path": "Dockerfile", "content": "<COMPLETE_DOCKERFILE>", "language": "dockerfile"}` : ''}
    ${includeCICD ? `,{"path": ".github/workflows/ci.yml", "content": "<COMPLETE_YAML>", "language": "yaml"}` : ''}
  ]
}`;
  } else {
    // Spring Boot
    return `You are an expert Spring Boot developer. Generate COMPLETE, PRODUCTION-READY, WORKING JAVA CODE for a CRUD API.

Entity Name: ${entityName}
Fields:
${fieldsList}

Generate the following files with FULL, COMPILABLE CODE (not placeholders):

1. src/main/java/com/example/demo/model/${entityName}.java - Complete JPA entity class with:
   - @Entity annotation
   - @Id and @GeneratedValue for id field
   - All fields from the list above with proper Java types
   - Getters and setters
   - No-arg constructor

2. src/main/java/com/example/demo/repository/${entityName}Repository.java - Complete repository interface extending JpaRepository<${entityName}, Long>

3. src/main/java/com/example/demo/service/${entityName}Service.java - Complete service class with FULL implementations:
   - @Service annotation
   - Autowired repository
   - findAll() method
   - findById(Long id) method
   - save(${entityName} entity) method
   - deleteById(Long id) method
   - Full method bodies with business logic

4. src/main/java/com/example/demo/controller/${entityName}Controller.java - Complete REST controller with:
   - @RestController and @RequestMapping annotations
   - Autowired service
   - @GetMapping, @PostMapping, @PutMapping, @DeleteMapping methods
   - Full CRUD endpoints with proper HTTP status codes
   ${includeSwagger ? '- Swagger/OpenAPI annotations on all endpoints' : ''}

5. src/main/resources/application.properties - Complete properties file with:
   - H2 database configuration
   - JPA/Hibernate settings
   - Server port configuration

${includeDocker ? `6. Dockerfile - Complete, working Dockerfile for Spring Boot app with:
   - OpenJDK 17 base image
   - JAR file copy and execution
   - Proper EXPOSE and ENTRYPOINT` : ''}

${includeCICD ? `7. .github/workflows/ci.yml - Complete GitHub Actions workflow with:
   - Java/Maven setup
   - Build and test steps
   - Runs on push and pull requests` : ''}

CRITICAL: Generate COMPLETE, WORKING CODE for each file. Do NOT use placeholders like "// code here". Write the ACTUAL implementation with proper package declarations, imports, and method bodies.

Return ONLY a JSON object with this structure:
{
  "files": [
    {"path": "src/main/java/com/example/demo/model/${entityName}.java", "content": "<COMPLETE_JAVA_CODE>", "language": "java"},
    {"path": "src/main/java/com/example/demo/repository/${entityName}Repository.java", "content": "<COMPLETE_JAVA_CODE>", "language": "java"},
    {"path": "src/main/java/com/example/demo/service/${entityName}Service.java", "content": "<COMPLETE_JAVA_CODE>", "language": "java"},
    {"path": "src/main/java/com/example/demo/controller/${entityName}Controller.java", "content": "<COMPLETE_JAVA_CODE>", "language": "java"},
    {"path": "src/main/resources/application.properties", "content": "<COMPLETE_PROPERTIES>", "language": "properties"}
    ${includeDocker ? `,{"path": "Dockerfile", "content": "<COMPLETE_DOCKERFILE>", "language": "dockerfile"}` : ''}
    ${includeCICD ? `,{"path": ".github/workflows/ci.yml", "content": "<COMPLETE_YAML>", "language": "yaml"}` : ''}
  ]
}`;
  }
}
