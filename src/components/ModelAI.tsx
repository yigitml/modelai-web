import React, { ReactNode } from "react";
import { ModelSelector } from "./ModelSelector";
import { ParametersForm } from "./ParametersForm";
import { Card, CardContent } from "./ui/card";

interface ModelAIProps {
  activeTab: string;
  children: ReactNode;
}

const ModelAI: React.FC<ModelAIProps> = ({ activeTab, children }) => {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground px-4">
      <div className="flex-grow overflow-hidden">
        <div className="h-full flex">
          <Card className="w-1/4 flex flex-col m-4">
            <CardContent className="flex-grow overflow-y-auto p-4">
              <div className="space-y-4">
                <ModelSelector />
              </div>
              <ParametersForm />
            </CardContent>
          </Card>

          <div className="w-3/4 overflow-y-auto p-4">
            {activeTab}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelAI;
