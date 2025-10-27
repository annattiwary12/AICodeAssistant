import type { Express } from "express";
import { createServer, type Server } from "http";
import { codeGenerationRequestSchema, codeGenerationResponseSchema, type CodeGenerationResponse } from "@shared/schema";
import { generateBackendCode } from "./codeGenerator";
import { createZipBuffer } from "./zipGenerator";

export async function registerRoutes(app: Express): Promise<Server> {
  // Code generation endpoint
  app.post("/api/generate", async (req, res) => {
    try {
      // Validate request body
      const validationResult = codeGenerationRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Invalid request",
          details: validationResult.error.errors,
        });
      }

      const request = validationResult.data;

      // Generate code using OpenAI
      const files = await generateBackendCode(request);

      const response: CodeGenerationResponse = {
        files,
        projectName: `${request.entityName.toLowerCase()}-${request.framework}`,
        framework: request.framework,
      };

      res.json(response);
    } catch (error) {
      console.error("Code generation error:", error);
      res.status(500).json({
        error: "Failed to generate code",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Download ZIP endpoint
  app.post("/api/download", async (req, res) => {
    try {
      // Validate request body using schema
      const validationResult = codeGenerationResponseSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Invalid code response",
          details: validationResult.error.errors,
        });
      }

      const codeResponse = validationResult.data;

      // Generate ZIP buffer
      const zipBuffer = await createZipBuffer(codeResponse);

      // Send ZIP file
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${codeResponse.projectName}.zip"`
      );
      res.send(zipBuffer);
    } catch (error) {
      console.error("ZIP generation error:", error);
      res.status(500).json({
        error: "Failed to create ZIP file",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
