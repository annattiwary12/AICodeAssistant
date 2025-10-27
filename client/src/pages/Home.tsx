import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { 
  CodeGenerationRequest, 
  codeGenerationRequestSchema, 
  CodeGenerationResponse,
  EntityField 
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FrameworkSelector } from "@/components/FrameworkSelector";
import { EntityFieldBuilder } from "@/components/EntityFieldBuilder";
import { CodePreview } from "@/components/CodePreview";
import { Code2, Download, Sparkles, Github, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [generatedCode, setGeneratedCode] = useState<CodeGenerationResponse | null>(null);
  const { toast } = useToast();

  const form = useForm<CodeGenerationRequest>({
    resolver: zodResolver(codeGenerationRequestSchema),
    defaultValues: {
      entityName: "",
      fields: [{ name: "", type: "string" }] as EntityField[],
      framework: "nodejs-express",
      includeDocker: false,
      includeCICD: false,
      includeSwagger: true,
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: CodeGenerationRequest) => {
      const response = await apiRequest<CodeGenerationResponse>(
        "POST",
        "/api/generate",
        data
      );
      return response;
    },
    onSuccess: (data) => {
      setGeneratedCode(data);
      toast({
        title: "Code Generated!",
        description: `Successfully generated ${data.files.length} files for ${data.projectName}`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || "Failed to generate code. Please try again.",
      });
    },
  });

  const onSubmit = (data: CodeGenerationRequest) => {
    generateMutation.mutate(data);
  };

  const downloadZip = async () => {
    if (!generatedCode) return;

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generatedCode),
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${generatedCode.projectName}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: `${generatedCode.projectName}.zip is downloading`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Failed to download the project. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">AI Code Assistant</h1>
                <p className="text-xs text-muted-foreground">Generate backend boilerplate with AI</p>
              </div>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Configuration */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Configure Your Backend</h2>
              <p className="text-sm text-muted-foreground">
                Define your entity and select a framework to generate production-ready code
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Framework Selection */}
                <FormField
                  control={form.control}
                  name="framework"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FrameworkSelector
                          selected={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Entity Name */}
                <FormField
                  control={form.control}
                  name="entityName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entity Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., User, Product, Article"
                          {...field}
                          data-testid="input-entity-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Entity Fields */}
                <FormField
                  control={form.control}
                  name="fields"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <EntityFieldBuilder
                          fields={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Optional Features */}
                <Card className="p-6">
                  <h3 className="font-semibold text-sm mb-4">Optional Features</h3>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="includeSwagger"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-swagger"
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Include Swagger/OpenAPI Documentation
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="includeDocker"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-docker"
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Include Dockerfile
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="includeCICD"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-cicd"
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Include GitHub Actions CI/CD
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>

                {/* Generate Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={generateMutation.isPending}
                  data-testid="button-generate"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Code...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Code
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Code Preview</h2>
                <p className="text-sm text-muted-foreground">
                  Review your generated files before downloading
                </p>
              </div>
              {generatedCode && (
                <Button
                  variant="default"
                  onClick={downloadZip}
                  data-testid="button-download"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download ZIP
                </Button>
              )}
            </div>

            <CodePreview files={generatedCode?.files || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
