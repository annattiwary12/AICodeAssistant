import { GeneratedFile } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check, FileCode, File as FileIcon, Folder } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CodePreviewProps {
  files: GeneratedFile[];
}

export function CodePreview({ files }: CodePreviewProps) {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (content: string, fileName: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedFile(fileName);
    toast({
      title: "Copied!",
      description: `${fileName} copied to clipboard`,
    });
    setTimeout(() => setCopiedFile(null), 2000);
  };

  // Group files by directory
  const fileTree = files.reduce((acc, file) => {
    const parts = file.path.split("/");
    const dir = parts.length > 1 ? parts[0] : "root";
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(file);
    return acc;
  }, {} as Record<string, GeneratedFile[]>);

  if (files.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-muted rounded-lg mx-auto flex items-center justify-center">
            <FileCode className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">No Code Generated Yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configure your entity and click "Generate Code" to see the preview
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* File Tree */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Folder className="w-4 h-4" />
          Project Structure
        </h3>
        <div className="space-y-1 text-sm font-mono">
          {Object.entries(fileTree).map(([dir, dirFiles]) => (
            <div key={dir} className="space-y-1">
              <div className="text-muted-foreground flex items-center gap-2">
                <Folder className="w-3 h-3" />
                {dir}
              </div>
              {dirFiles.map((file) => (
                <div key={file.path} className="pl-6 flex items-center gap-2 text-muted-foreground">
                  <FileIcon className="w-3 h-3" />
                  {file.path.split("/").pop()}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      {/* Code Tabs */}
      <Card className="overflow-hidden">
        <Tabs defaultValue={files[0]?.path}>
          <div className="border-b">
            <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent">
              {files.map((file) => (
                <TabsTrigger
                  key={file.path}
                  value={file.path}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  data-testid={`tab-file-${file.path}`}
                >
                  <FileIcon className="w-3 h-3 mr-2" />
                  {file.path.split("/").pop()}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {files.map((file) => (
            <TabsContent key={file.path} value={file.path} className="m-0">
              <div className="relative">
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => copyToClipboard(file.content, file.path.split("/").pop()!)}
                    data-testid={`button-copy-${file.path}`}
                  >
                    {copiedFile === file.path.split("/").pop() ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copiedFile === file.path.split("/").pop() ? "Copied" : "Copy"}
                  </Button>
                </div>
                <pre className="p-6 overflow-x-auto text-sm bg-muted/50">
                  <code className="font-mono">{file.content}</code>
                </pre>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}
