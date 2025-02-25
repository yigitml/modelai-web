"use client";

import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import { ModelSelector } from "@/components/ModelSelector";
import { ParametersForm } from "@/components/ParametersForm";
import { Card, CardContent } from "@/components/ui/card";
import PacksContent from "@/components/content/PacksContent";
import PromptsContent from "@/components/content/PromptsContent";
import CameraContent from "@/components/content/CameraContent";
import ModelsContent from "@/components/content/ModelsContent";
import DeletedContent from "@/components/content/DeletedContent";
import { Header } from "@/components/Header";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

export default function HomePage() {
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
    <AuthenticatedLayout>
      <div className="flex flex-col min-h-screen bg-background text-foreground px-1 sm:px-4">
        <Header />
        <div className="flex-grow overflow-hidden">
        <div className="h-full flex flex-col lg:flex-row gap-2 sm:gap-4">
          <div className="flex flex-col w-full lg:w-1/4">
            <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
              <h1 className="text-4xl font-bold text-center tracking-tight">
                {tabs.find(tab => tab.name === activeTab)?.text[0]} <span className="bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500 text-transparent bg-clip-text">{tabs.find(tab => tab.name === activeTab)?.text[1]}</span>
              </h1>
            </div>
            <Card className="w-full flex flex-col my-1 sm:my-2 lg:mb-4">
              <CardContent className="flex-grow overflow-y-auto p-1 sm:p-2">
                <div className="space-y-2 sm:space-y-4">
                  <ModelSelector />
                </div>
                <ParametersForm />
              </CardContent>
            </Card>
          </div>
          <div className="w-full lg:w-3/4 flex flex-col py-1 sm:py-2">
            <div className="flex flex-wrap sm:flex-nowrap w-full border-b border-border/50 gap-1 sm:gap-2 p-1 sm:p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`
                    flex-1 px-1 sm:px-4 py-1 sm:py-3 rounded-lg transition-all duration-300 transform
                    whitespace-nowrap
                    ${activeTab === tab.name 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "bg-muted/30 hover:bg-muted/60"}
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            <div className="overflow-y-auto p-1 sm:p-2 flex-grow">
              {renderContent()}
            </div>
          </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
