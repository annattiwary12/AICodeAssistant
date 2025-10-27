import { EntityField, fieldTypes } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface EntityFieldBuilderProps {
  fields: EntityField[];
  onChange: (fields: EntityField[]) => void;
}

export function EntityFieldBuilder({ fields, onChange }: EntityFieldBuilderProps) {
  const addField = () => {
    onChange([...fields, { name: "", type: "string" }]);
  };

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<EntityField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    onChange(newFields);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        Entity Fields
      </label>
      
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={index} className="flex gap-2" data-testid={`row-field-${index}`}>
            <Input
              placeholder="Field name (e.g., username)"
              value={field.name}
              onChange={(e) => updateField(index, { name: e.target.value })}
              className="flex-1"
              data-testid={`input-field-name-${index}`}
            />
            <Select
              value={field.type}
              onValueChange={(value) => updateField(index, { type: value as any })}
            >
              <SelectTrigger className="w-[140px]" data-testid={`select-field-type-${index}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeField(index)}
              disabled={fields.length === 1}
              data-testid={`button-remove-field-${index}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={addField}
        className="w-full"
        data-testid="button-add-field"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Field
      </Button>
    </div>
  );
}
