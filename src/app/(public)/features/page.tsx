"use client"

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/dist/client/components/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Check, X, Camera, Zap, Shield, Image as ImageIcon, ArrowRight, MousePointer, RefreshCw, ChevronDown, ArrowLeft } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "FREE!",
    features: [
      "50 AI photos",
      "Access to legacy models",
      <span
        key="highlight1"
        className="bg-red-400 text-background rounded-full px-2 py-0.5 font-semibold"
      >
        Low Quality Photos
      </span>,
      <span
        key="highlight2"
        className="bg-red-400 text-background rounded-full px-2 py-0.5 font-semibold"
      >
        Low Resemblance
      </span>,
      "Take 1 photo at a time",
      "Limited access to premium and ultra packs",
      "Watermarked photo",
      "No free auto-generated photos"
    ],
  },
  {
    name: "Premium",
    price: "$14.99/month",
    features: [
      "50 AI Photos",
      "1 AI Model",
      <span
        key="highlight1"
        className="bg-yellow-400 text-background rounded-full px-2 py-0.5 font-semibold"
      >
        High Quality Photos
      </span>,
      <span
        key="highlight2"
        className="bg-yellow-400 text-background rounded-full px-2 py-0.5 font-semibold"
      >
        High Resemblance
      </span>,
      "Take 4 photo at a time",
      "Full access to packs",
      "No watermark",
      "Free auto-generated photos"
    ],
  }
];

export default function FeaturesPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const { user, accessToken } = useAppContext();
  const [activeTab, setActiveTab] = useState("quality");
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  
  const handlePlanSelect = (planType: string) => {
    if (user && accessToken) {
      router.push("/home");
    } else {
      signIn();
    }
  };
  
  // Fixed scroll calculation for the comparison slider
  const scrollYProgress = useRef(0);
  const qualityComparisonRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollPosition(window.scrollY);
        
        // Update current section
        const viewportHeight = window.innerHeight;
        const currentPosition = window.scrollY + viewportHeight / 2;
        
        sectionsRef.current.forEach((section, index) => {
          if (section && currentPosition >= section.offsetTop && 
              currentPosition < (section.offsetTop + section.offsetHeight)) {
            setCurrentSection(index);
          }
        });
        
        // Modified calculation for comparison slider - make it reveal more gradually
        if (qualityComparisonRef.current) {
          const rect = qualityComparisonRef.current.getBoundingClientRect();
          const sectionVisibility = Math.max(0, Math.min(1, 
            (viewportHeight - rect.top) / (viewportHeight + rect.height)
          ));
          
          // Adjusted formula to make the reveal happen over a longer scroll distance
          scrollYProgress.current = Math.min(1, Math.max(0, sectionVisibility * 1.5 - 0.25));
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    
    // Build sections ref array
    sectionsRef.current = Array.from(document.querySelectorAll('.scroll-section')).map(
      section => section as HTMLDivElement
    );
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const scrollToNextSection = () => {
    if (currentSection < sectionsRef.current.length - 1) {
      const nextSection = sectionsRef.current[currentSection + 1];
      if (nextSection) {
        window.scrollTo({
          top: nextSection.offsetTop,
          behavior: 'smooth'
        });
      }
    }
  };
  
  const ComparisonFeature = ({ title, free, premium, icon: Icon }: { title: string, free: boolean | string, premium: boolean | string, icon: React.ElementType }) => (
    <div className="grid grid-cols-12 gap-4 py-6 border-b border-white/10">
      <div className="col-span-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500/20 to-purple-500/20 flex items-center justify-center">
          <Icon className="h-5 w-5 text-sky-400" />
        </div>
        <span className="font-medium">{title}</span>
      </div>
      <div className="col-span-4 flex items-center justify-center">
        {typeof free === "boolean" ? (
          free ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <X className="h-5 w-5 text-red-500" />
          )
        ) : (
          <span className="text-gray-400">{free}</span>
        )}
      </div>
      <div className="col-span-4 flex items-center justify-center">
        {typeof premium === "boolean" ? (
          premium ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <X className="h-5 w-5 text-red-500" />
          )
        ) : (
          <span className="text-sky-400 font-medium">{premium}</span>
        )}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-x-hidden snap-y snap-mandatory">
      {/* Background gradient effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      {/* Navigation arrow */}
      <div className="absolute top-0 left-4 z-50">
        <button 
          onClick={() => router.back()}
          className="w-18 h-18 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
      </div>
      
      {/* Floating navigation arrow */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={scrollToNextSection}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-purple-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <ChevronDown className="h-6 w-6 text-white" />
        </button>
      </div>
      
      {/* Hero section with interactive 3D cards */}
      <div className="relative overflow-hidden py-16 lg:py-20 scroll-section snap-start" ref={el => { sectionsRef.current[0] = el as HTMLDivElement; }}>
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Elevate Your <span className="bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">Photos</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See how our AI technology transforms your ordinary photos into extraordinary art
            </p>
          </motion.div>
          
          <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-4 lg:gap-12">
            {/* Free plan 3D card - modified to be less prominent on mobile */}
            <motion.div
              initial={{ opacity: 0, x: -50, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ 
                scale: 1.02, 
                rotateY: -5,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              className="w-full max-w-sm lg:max-w-xs relative -mt-4 lg:mt-0"
              style={{ perspective: "1000px" }}
            >
              {/* Added "budget option" label */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10 py-1 px-3 bg-red-500/80 rounded-full text-xs font-medium lg:hidden">
                Budget Option
              </div>
              <Card className="relative overflow-hidden border-0 p-1 bg-gradient-to-b from-white/10 to-white/5">
                <div className="p-6 bg-black/40 backdrop-blur-sm rounded-lg h-full flex flex-col">
                  <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                  
                  <h2 className="text-2xl font-bold mb-1">Freemium</h2>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-gray-400 pb-1">/forever</span>
                  </div>
                  
                  <div className="mb-6 rounded-lg overflow-hidden relative">
                    <Image 
                      src="/banner_images/img_12.jpg"
                      alt="Free Plan Example"
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="px-4 py-1 bg-black/60 backdrop-blur-sm rounded-full text-sm font-medium">
                        Freemium Quality
                      </span>
                    </div>
                  </div>
                  
                  <ul className="mb-8 space-y-4">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>50 AI photos per month</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Access to legacy models</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-gray-400">Standard quality output</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-gray-400">Watermarked photos</span>
                    </li>
                  </ul>
                  
                  <Button
                    onClick={() => handlePlanSelect('free')}
                    variant="outline" 
                    className="mt-auto w-full border-white/20 hover:bg-white/10"
                  >
                    Start Free
                  </Button>
                </div>
              </Card>
            </motion.div>
            
            {/* Premium plan 3D card - enhanced to be more prominent */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -15, zIndex: 10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                boxShadow: "0 25px 50px -12px rgba(66, 153, 225, 0.25)"
              }}
              className="w-full max-w-sm lg:scale-110 relative"
              style={{ perspective: "1000px" }}
            >
              {/* Added "RECOMMENDED" flag */}
              <div className="absolute -top-4 left-0 right-0 z-10 flex justify-center">
                <div className="py-1 px-4 bg-gradient-to-r from-sky-500 to-purple-500 rounded-full text-xs font-semibold shadow-lg">
                  RECOMMENDED
                </div>
              </div>
              <Card className="relative overflow-hidden border-0 p-1 bg-gradient-to-b from-sky-500/30 via-purple-500/20 to-pink-500/30">
                <div className="p-6 bg-black/60 backdrop-blur-sm rounded-lg h-full flex flex-col">
                  <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-sky-500 to-purple-500"></div>
                  
                  <div className="absolute -right-12 -top-12 w-24 h-24 bg-gradient-to-br from-sky-500/20 to-purple-500/20 rounded-full blur-xl"></div>
                  
                  <h2 className="text-2xl font-bold mb-1">Premium</h2>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-bold">$14.99</span>
                    <span className="text-gray-400 pb-1">/month</span>
                  </div>
                  
                  <div className="mb-6 rounded-lg overflow-hidden relative">
                    <Image 
                      src="/banner_images/img_3.jpg"
                      alt="Premium Plan Example"
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="px-4 py-1 bg-gradient-to-r from-sky-500/80 to-purple-500/80 backdrop-blur-sm rounded-full text-sm font-medium">
                        Premium Quality
                      </span>
                    </div>
                  </div>
                  
                  <ul className="mb-8 space-y-4">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>50 AI photos per month</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>1 custom AI model</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Ultra-HD quality output</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>No watermarks</span>
                    </li>
                  </ul>
                  
                  <Button
                    onClick={() => handlePlanSelect('premium')}
                    className="mt-auto w-full bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600 text-white border-0"
                  >
                    Go Premium
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Interactive comparison section */}
      <div className="py-20 scroll-section snap-start" ref={el => { sectionsRef.current[1] = el as HTMLDivElement; }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See The <span className="bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">Difference</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Compare the quality between free and premium options
            </p>
          </div>
          
          {/* Tabs navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 rounded-lg bg-white/5 backdrop-blur-sm">
              {["quality", "speed", "features"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-md capitalize transition-all ${
                    activeTab === tab 
                      ? "bg-gradient-to-r from-sky-500 to-purple-500 text-white" 
                      : "hover:bg-white/5 text-gray-400"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab content */}
          <div className="max-w-5xl mx-auto">
            {activeTab === "quality" && (
              <div className="space-y-12">
                {/* Image quality comparison slider */}
                <div 
                  ref={qualityComparisonRef}
                  className="relative h-[600px] rounded-xl overflow-hidden"
                >
                  <div className="absolute inset-0 z-10">
                    <Image 
                      src="/banner_images/img_3.jpg" 
                      alt="Premium quality"
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div 
                    className="absolute inset-0 z-20 overflow-hidden"
                    style={{ 
                      width: `${scrollYProgress.current * 100}%`,
                    }}
                  >
                    <Image 
                      src="/banner_images/img_12.jpg" 
                      alt="Free quality"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-end">
                      <div className="h-full w-1 bg-white"></div>
                    </div>
                  </div>
                  
                  <div className="absolute inset-x-0 bottom-0 z-30 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex justify-between">
                      <span className="px-4 py-1 bg-red-500/80 backdrop-blur-sm rounded-full text-sm font-medium">
                        Free Quality
                      </span>
                      <span className="px-4 py-1 bg-gradient-to-r from-sky-500/80 to-purple-500/80 backdrop-blur-sm rounded-full text-sm font-medium">
                        Premium Quality
                      </span>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 z-20 flex items-center justify-center text-xl font-medium text-white">
                    <span className="px-6 py-2 bg-black/60 backdrop-blur-sm rounded-xl">
                      Scroll to reveal difference
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-500">
                        <X className="h-4 w-4" />
                      </span>
                      Free Quality Issues
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <span>Lower resolution output</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <span>Limited color accuracy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <span>Basic lighting effects</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <span>Simplified detail rendering</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-sky-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-white/10">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/20 text-sky-500">
                        <Check className="h-4 w-4" />
                      </span>
                      Premium Quality Benefits
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                        <span>Ultra HD resolution</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                        <span>Professional color grading</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                        <span>Advanced lighting simulation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                        <span>Intricate detail preservation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "speed" && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3">
                      <span className="flex items-center justify-center h-10 w-10 rounded-full bg-red-500/20 text-red-500">
                        <RefreshCw className="h-4 w-4" />
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-4">Free Processing</h3>
                    <div className="mb-6">
                      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-2/5 h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                      </div>
                      <div className="flex justify-between mt-1 text-sm">
                        <span>Processing Time</span>
                        <span className="text-red-400">~40-60 seconds</span>
                      </div>
                    </div>
                    
                    <div className="text-center px-4 py-6 bg-white/5 rounded-xl mb-6">
                      <span className="text-4xl font-bold text-red-400">1</span>
                      <p className="text-gray-400 mt-2">Photo at a time</p>
                    </div>
                    
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <span>Standard processing queue</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <span>Lower priority in queue</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-sky-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3">
                      <span className="flex items-center justify-center h-10 w-10 rounded-full bg-sky-500/20 text-sky-500">
                        <Zap className="h-4 w-4" />
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-4">Premium Processing</h3>
                    <div className="mb-6">
                      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-4/5 h-full bg-gradient-to-r from-sky-500 to-purple-500 rounded-full"></div>
                      </div>
                      <div className="flex justify-between mt-1 text-sm">
                        <span>Processing Time</span>
                        <span className="text-sky-400">~5-10 seconds</span>
                      </div>
                    </div>
                    
                    <div className="text-center px-4 py-6 bg-white/5 rounded-xl mb-6">
                      <span className="text-4xl font-bold text-sky-400">4</span>
                      <p className="text-gray-400 mt-2">Photos in parallel</p>
                    </div>
                    
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                        <span>Priority processing queue</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                        <span>Dedicated server resources</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "features" && (
              <div className="space-y-12">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8">
                  <div className="grid grid-cols-12 gap-4 py-4 border-b border-white/10 mb-4">
                    <div className="col-span-4 font-semibold">Feature</div>
                    <div className="col-span-4 text-center font-semibold">Free Plan</div>
                    <div className="col-span-4 text-center font-semibold">Premium Plan</div>
                  </div>
                  
                  <div className="space-y-1">
                    <ComparisonFeature 
                      title="Monthly AI Photos" 
                      free="50" 
                      premium="Unlimited" 
                      icon={ImageIcon} 
                    />
                    <ComparisonFeature 
                      title="Ultra HD Quality" 
                      free={false} 
                      premium={true} 
                      icon={Camera} 
                    />
                    <ComparisonFeature 
                      title="Processing Speed" 
                      free="40-60s" 
                      premium="5-10s" 
                      icon={Zap} 
                    />
                    <ComparisonFeature 
                      title="Parallel Processing" 
                      free="1" 
                      premium="4" 
                      icon={Camera} 
                    />
                    <ComparisonFeature 
                      title="AI Model Access" 
                      free="Legacy models only" 
                      premium="All models" 
                      icon={RefreshCw} 
                    />
                    <ComparisonFeature 
                      title="Watermarks" 
                      free={false} 
                      premium={true} 
                      icon={Shield} 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-24 scroll-section snap-start" ref={el => { sectionsRef.current[2] = el as HTMLDivElement; }}>
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto p-10 bg-gradient-to-br from-white/5 via-sky-500/5 to-purple-500/5 backdrop-blur-sm rounded-2xl border border-white/10 relative"
          >
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-500/0 rounded-full blur-xl opacity-30"></div>
            <div className="absolute -bottom-15 -right-10 w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-500/0 rounded-full blur-xl opacity-30"></div>
            
            {/* Floating elements */}
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 5,
                ease: "easeInOut"
              }}
              className="absolute -top-8 right-10 w-16 h-16 bg-black"
              style={{ borderRadius: '28% 72% 38% 62% / 53% 27% 73% 47%' }}
            >
              <div className="w-full h-full p-2">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-sky-500 to-purple-500 opacity-70 blur-sm"></div>
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, -8, 0],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 7,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-10 left-20 w-20 h-20 bg-black"
              style={{ borderRadius: '63% 37% 30% 70% / 50% 45% 55% 50%' }}
            >
              <div className="w-full h-full p-2">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-70 blur-sm"></div>
              </div>
            </motion.div>
            
            <h2 className="text-3xl font-bold text-center mb-6">
              Ready to create <span className="bg-gradient-to-r from-sky-400 to-purple-500 text-transparent bg-clip-text">stunning AI photos?</span>
            </h2>
            
            <p className="text-gray-300 text-center mb-8 max-w-xl mx-auto">
              Join thousands of creators making professional photos with TakeAIPhotos. Start with our free plan or go premium for the ultimate experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => handlePlanSelect('free')}
                variant="outline"
                size="lg"
                className="border-white/20 hover:bg-white/10 cursor-pointer"
              >
                Try Free
              </Button>
              
              <Button
                onClick={() => handlePlanSelect('premium')}
                size="lg"
                className="bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600 border-0 cursor-pointer"
              >
                Go Premium
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
