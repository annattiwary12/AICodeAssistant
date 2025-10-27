import { Framework } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { SiNodedotjs, SiSpringboot } from "react-icons/si";

interface FrameworkSelectorProps {
  selected: Framework;
  onChange: (framework: Framework) => void;
}

const frameworkOptions = [
  {
    id: "nodejs-express" as Framework,
    name: "Node.js / Express",
    icon: SiNodedotjs,
    description: "Modern JavaScript backend with Express.js",
    color: "text-[#339933]",
  },
  {
    id: "spring-boot" as Framework,
    name: "Spring Boot",
    icon: SiSpringboot,
    description: "Enterprise Java framework with Spring",
    color: "text-[#6DB33F]",
  },
];

export function FrameworkSelector({ selected, onChange }: FrameworkSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        Select Framework
      </label>
      <div className="grid md:grid-cols-2 gap-4">
        {frameworkOptions.map((framework) => {
          const Icon = framework.icon;
          const isSelected = selected === framework.id;
          
          return (
            <Card
              key={framework.id}
              className={`cursor-pointer transition-all hover-elevate active-elevate-2 ${
                isSelected ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onChange(framework.id)}
              data-testid={`card-framework-${framework.id}`}
            >
              <div className="p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <Icon className={`w-8 h-8 ${framework.color}`} />
                  {isSelected && (
                    <div className="bg-primary text-primary-foreground rounded-full p-1" data-testid={`icon-selected-${framework.id}`}>
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-base">{framework.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {framework.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
