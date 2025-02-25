"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Camera, 
  Zap, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  ShoppingCart, 
  PackageCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

export default function CreditsPage() {
  const { user, credits } = useAppContext();
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [pack3Quantity, setPack3Quantity] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Credit package details
  const creditPackages = [
    {
      id: "model_credit",
      name: "Model Credit",
      description: "Create up to 10 AI models a month",
      price: 10,
      contents: [
        { type: "MODEL", amount: 1, icon: Zap }
      ],
      mostPopular: false,
      color: "from-emerald-500 to-teal-500"
    },
    {
      id: "photo_credit",
      name: "Photo Credit",
      description: "Generate up to 10,000 AI photos a month",
      price: 10,
      contents: [
        { type: "PHOTO", amount: 150, icon: Camera }
      ],
      mostPopular: false,
      color: "from-blue-500 to-indigo-500"
    },
    {
      id: "pack_1",
      name: "Starter Pack",
      description: "Perfect for beginners",
      price: 25,
      contents: [
        { type: "MODEL", amount: 1, icon: Zap },
        { type: "PHOTO", amount: 200, icon: Camera }
      ],
      mostPopular: false,
      color: "from-purple-500 to-indigo-500"
    },
    {
      id: "pack_2",
      name: "Pro Pack",
      description: "Best for regular users",
      price: 40,
      contents: [
        { type: "MODEL", amount: 2, icon: Zap },
        { type: "PHOTO", amount: 400, icon: Camera }
      ],
      mostPopular: true,
      color: "from-pink-500 to-purple-500"
    },
    {
      id: "pack_3",
      name: "Premium Pack",
      description: "Maximum value for power users",
      price: 50,
      contents: [
        { type: "MODEL", amount: 2, icon: Zap },
        { type: "PHOTO", amount: 750, icon: Camera }
      ],
      quantitySelectable: true,
      mostPopular: false,
      color: "from-sky-500 to-blue-500"
    }
  ];

  // Split packages into bundles and single credits
  const bundlePackages = creditPackages.filter(pack => 
    pack.id.includes('pack_')
  );
  
  const singleCreditPackages = creditPackages.filter(pack => 
    !pack.id.includes('pack_')
  );
  
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8; // Approximate card width
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = pack3Quantity + change;
    if (newQuantity >= 1 && newQuantity <= 8) {
      setPack3Quantity(newQuantity);
    }
  };

  const getTotalPrice = () => {
    const pack = creditPackages.find(p => p.id === selectedPackage);
    if (!pack) return 0;
    
    if (pack.id === "pack_3") {
      return pack.price * pack3Quantity;
    }
    return pack.price;
  };

  const handleCheckout = () => {
    // Implement checkout logic here
    console.log(`Checkout with package: ${selectedPackage}, quantity: ${selectedPackage === "pack_3" ? pack3Quantity : 1}`);
    // Would connect to payment provider here
  };

  useEffect(() => {
    setSelectedPackage(creditPackages[2].id);
  }, [credits]);

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-black text-white">
        <Header />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-center">
            Add <span className="bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">Credits</span>
          </h1>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Purchase credits to create AI models and generate photos. Choose the package that best fits your creative needs.
          </p>
          
          {/* Bundle Packages */}
          <h2 className="text-2xl font-bold mb-4">Credit Bundles</h2>
          <div className="mb-4 md:hidden flex justify-center">
            <p className="text-sm text-gray-400">
              <span className="inline-block animate-pulse mr-1">←</span> 
              Swipe packages 
              <span className="inline-block animate-pulse ml-1">→</span>
            </p>
          </div>

          <div className="relative overflow-x-auto md:overflow-visible pb-8 -mx-4 px-4 md:mx-0 md:px-0 mb-16">
            {/* Mobile scroll buttons */}
            <div className="md:hidden absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => handleScroll('left')}
                className="bg-black/70 backdrop-blur-sm p-2 rounded-full border border-white/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            <div className="md:hidden absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => handleScroll('right')}
                className="bg-black/70 backdrop-blur-sm p-2 rounded-full border border-white/10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            <div 
              ref={scrollContainerRef}
              className="flex md:grid md:grid-cols-3 gap-10 snap-x snap-mandatory overflow-x-auto hide-scrollbar px-6 md:px-0"
            >
              {bundlePackages.map((pack) => (
                <motion.div
                  key={pack.id}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex-shrink-0 w-[70%] sm:w-[45%] md:w-auto flex flex-col h-full snap-center"
                >
                  <Card
                    className={`relative h-full overflow-hidden border-0 p-1 bg-gradient-to-b ${
                      selectedPackage === pack.id 
                        ? pack.color
                        : 'from-white/10 to-white/5'
                    }`}
                    onClick={() => setSelectedPackage(pack.id)}
                  >
                    <div className="p-6 bg-black/60 backdrop-blur-sm rounded-lg h-full flex flex-col">
                      {pack.mostPopular && (
                        <div className="absolute -right-12 top-6 bg-gradient-to-r from-amber-500 to-yellow-500 rotate-45 px-12 py-1 text-xs font-semibold">
                          MOST POPULAR
                        </div>
                      )}
                      
                      <h2 className="text-xl font-bold mb-2">{pack.name}</h2>
                      <p className="text-gray-400 text-sm mb-5">{pack.description}</p>
                      
                      <div className="flex items-end gap-1 mb-6">
                        <span className="text-3xl font-bold">${pack.price}</span>
                        {pack.id === "pack_3" && pack.quantitySelectable && (
                          <div className="ml-auto flex items-center gap-1">
                            <div className="bg-white/10 rounded-lg p-1 flex items-center">
                              <button 
                                className="h-6 w-6 flex items-center justify-center rounded hover:bg-white/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuantityChange(-1);
                                }}
                                disabled={pack3Quantity <= 1}
                              >
                                <ChevronDown className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-sm">{pack3Quantity}</span>
                              <button 
                                className="h-6 w-6 flex items-center justify-center rounded hover:bg-white/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuantityChange(1);
                                }}
                                disabled={pack3Quantity >= 8}
                              >
                                <ChevronUp className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <ul className="space-y-3 mb-8 text-sm">
                          {pack.contents.map((content, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500/20 to-purple-500/20 flex items-center justify-center">
                                <content.icon className="h-3.5 w-3.5 text-sky-400" />
                              </div>
                              <span>
                                <strong>{content.amount}</strong> {content.type.charAt(0) + content.type.slice(1).toLowerCase()} 
                                {content.amount > 1 ? 's' : ''}
                              </span>
                            </li>
                          ))}
                          
                          {pack.quantitySelectable && (
                            <li className="flex items-center gap-2 text-xs text-gray-400 italic mt-4">
                              <span>Limit: 8 packs per month</span>
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <div className={`h-1 w-full mb-6 rounded-full ${
                        selectedPackage === pack.id 
                          ? `bg-gradient-to-r ${pack.color}`
                          : 'bg-white/10'
                      }`}></div>
                      
                      <div className="mt-auto">
                        {selectedPackage === pack.id ? (
                          <div className="flex items-center justify-center h-10 rounded-md bg-white/10 text-white text-sm">
                            <Check className="h-4 w-4 mr-2" />
                            Selected
                          </div>
                        ) : (
                          <div className="h-10"></div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-2 justify-center mt-8 md:hidden">
              {bundlePackages.map((pack) => (
                <div 
                  key={pack.id} 
                  className={`h-1.5 rounded-full ${
                    selectedPackage === pack.id 
                      ? 'w-5 bg-gradient-to-r from-sky-500 to-purple-500' 
                      : 'w-1.5 bg-white/20'
                  }`}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Single Credit Items */}
          <h2 className="text-2xl font-bold mb-6">Individual Credits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            {singleCreditPackages.map((pack) => (
              <motion.div
                key={pack.id}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex-shrink-0 flex flex-col h-full"
              >
                <Card
                  className={`relative h-full overflow-hidden border-0 p-1 bg-gradient-to-b ${
                    selectedPackage === pack.id 
                      ? pack.color
                      : 'from-white/10 to-white/5'
                  }`}
                  onClick={() => setSelectedPackage(pack.id)}
                >
                  <div className="p-8 bg-black/60 backdrop-blur-sm rounded-lg h-full flex flex-col">
                    <h2 className="text-xl font-bold mb-2">{pack.name}</h2>
                    <p className="text-gray-400 text-sm mb-6">{pack.description}</p>
                    
                    <div className="flex items-end gap-1 mb-8">
                      <span className="text-3xl font-bold">${pack.price}</span>
                    </div>
                    
                    <div className="flex-grow">
                      <ul className="space-y-4 mb-8">
                        {pack.contents.map((content, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500/20 to-purple-500/20 flex items-center justify-center">
                              <content.icon className="h-4 w-4 text-sky-400" />
                            </div>
                            <span>
                              <strong>{content.amount}</strong> {content.type.charAt(0) + content.type.slice(1).toLowerCase()} 
                              {content.amount > 1 ? 's' : ''}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className={`h-1 w-full mb-8 rounded-full ${
                      selectedPackage === pack.id 
                        ? `bg-gradient-to-r ${pack.color}`
                        : 'bg-white/10'
                    }`}></div>
                    
                    <div className="mt-auto">
                      {selectedPackage === pack.id ? (
                        <div className="flex items-center justify-center h-12 rounded-md bg-white/10 text-white">
                          <Check className="h-5 w-5 mr-2" />
                          Selected
                        </div>
                      ) : (
                        <div className="h-12"></div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Current credits section */}
          <div className="mb-48">
            <h2 className="text-xl font-bold mb-4">Your Current Credits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {credits.map((credit) => {
                const percentage = (credit.amount / credit.totalAmount) * 100 || 0;
                const Icon = credit.type === "PHOTO" ? Camera : Zap;
                
                return (
                  <div key={credit.type} className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500/20 to-purple-500/20 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-sky-400" />
                      </div>
                      <span className="font-medium">
                        {credit.type.charAt(0) + credit.type.slice(1).toLowerCase()} Credits
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Available</span>
                      <span className="font-semibold">{credit.amount}/{credit.totalAmount}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-sky-500 to-purple-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Checkout section */}
          {selectedPackage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-4 pb-6"
            >
              <div className="container mx-auto max-w-4xl">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500/20 to-purple-500/20 flex items-center justify-center">
                      <PackageCheck className="h-6 w-6 text-sky-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {creditPackages.find(p => p.id === selectedPackage)?.name}
                        {selectedPackage === "pack_3" && ` × ${pack3Quantity}`}
                      </h3>
                      <div className="text-2xl font-bold">
                        Total: ${getTotalPrice()}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full md:w-auto bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600 text-white border-0 py-6"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Decorative background elements */}
          <motion.div 
            className="absolute top-40 left-10 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl opacity-20 -z-10"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          <motion.div 
            className="absolute top-80 right-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl opacity-20 -z-10"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.25, 0.2]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}
