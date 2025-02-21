"use client";

import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import { ModelSelector } from "./ModelSelector";
import { ParametersForm } from "./ParametersForm";
import { Card, CardContent } from "./ui/card";
import PacksContent from "@/components/content/PacksContent";
import PromptsContent from "@/components/content/PromptsContent";
import CameraContent from "@/components/content/CameraContent";
import ModelsContent from "@/components/content/ModelsContent";
import DeletedContent from "@/components/content/DeletedContent";

const TakeAIPhotos: React.FC = () => {
  const { activeTab, setActiveTab, tabs } = useAppContext();
  
  const renderContent = () => {
    switch (activeTab) {
      case "Packs":
        return <PacksContent />;
      case "Prompts":
        return <PromptsContent />;
      case "Camera":
        return <CameraContent />;
      case "Models":
        return <ModelsContent />;
      case "Deleted":
        return <DeletedContent />;
      default:
        return <CameraContent />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground px-2 sm:px-4">
      <div className="flex-grow overflow-hidden">
        <div className="h-full flex flex-col lg:flex-row gap-4">
          <div className="flex flex-col w-full lg:w-1/4">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl md:text-4xl font-bold text-center tracking-tight">
                {tabs.find(tab => tab.name === activeTab)?.text[0]} <span className="bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500 text-transparent bg-clip-text">{tabs.find(tab => tab.name === activeTab)?.text[1]}</span>
              </h1>
            </div>
            <Card className="w-full flex flex-col my-2 lg:mb-4">
              <CardContent className="flex-grow overflow-y-auto p-2">
                <div className="space-y-4">
                  <ModelSelector />
                </div>
                <ParametersForm />
              </CardContent>
            </Card>
          </div>
          <div className="w-full lg:w-3/4 flex flex-col py-2">
            <div className="flex flex-wrap sm:flex-nowrap w-full border-b border-border/50 gap-2 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`
                    flex-1 px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-300 transform
                    text-sm sm:text-base whitespace-nowrap
                    ${activeTab === tab.name 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "bg-muted/30 hover:bg-muted/60"}
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            <div className="overflow-y-auto p-2 flex-grow">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeAIPhotos;
