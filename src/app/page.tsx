"use client"

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Card } from "@/components/ui/card"
import { Camera, Video, Sparkles, Upload, Heart, CheckCircle, ArrowRight, Star, ChevronDown } from "lucide-react"
import GoogleAuthButton from "@/components/GoogleAuthButton"
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";
import { motion } from "framer-motion";

export default function Home() {
  const { user, accessToken } = useAppContext();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  
  // Array of all available images
  const allImages = [
    "/banner_images/img_1.jpg",
    "/banner_images/img_2.jpg",
    "/banner_images/img_3.jpg",
    "/banner_images/img_4.jpg",
    "/banner_images/img_5.jpg",
    "/banner_images/img_6.jpg",
    "/banner_images/img_7.jpg",
    "/banner_images/img_8.jpg",
    "/banner_images/img_9.jpg",
    "/banner_images/img_10.jpg",
    "/banner_images/img_11.jpg",
    "/banner_images/img_12.jpg",
  ];
  
  // Initialize with a loading state
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Initialize with placeholder but don't display until we have real images
  const [currentImageSet, setCurrentImageSet] = useState({
    topLeft: "/placeholder.jpg",
    bottomLeft: "/placeholder.jpg",
    topRight: "/placeholder.jpg",
    bottomRight: "/placeholder.jpg",
  });
  
  const [imageSetKey, setImageSetKey] = useState(0);
  
  // Start with empty usedImages array
  const [usedImages, setUsedImages] = useState<string[]>([]);

  // Generate initial random set on mount
  useEffect(() => {
    // Get a random selection of 4 images for the initial set
    const shuffled = [...allImages].sort(() => 0.5 - Math.random());
    const initialSelection = shuffled.slice(0, 4);
    
    // Set the initial image set
    setCurrentImageSet({
      topLeft: initialSelection[0],
      bottomLeft: initialSelection[1],
      topRight: initialSelection[2],
      bottomRight: initialSelection[3],
    });
    
    // Mark these as used
    setUsedImages(initialSelection);
    
    // Mark images as loaded
    setImagesLoaded(true);
  }, []); // Empty dependency array = run once on mount

  useEffect(() => {
    if (user && accessToken) {
      router.push("/home")
    }
  }, [user, accessToken, router])

  // Function to generate a complete new set of images
  const generateNewImageSet = useCallback(() => {
    // Get all unused images
    const unusedImages = allImages.filter(img => !usedImages.includes(img));
    
    // If we've used all images or almost all (fewer than 4 left),
    // reset the tracking but keep the current set excluded
    if (unusedImages.length < 4) {
      const currentValues = Object.values(currentImageSet);
      setUsedImages([...currentValues]);
      return;
    }
    
    // Randomly select 4 unique images from unused ones
    const selectedImages: string[] = [];
    while (selectedImages.length < 4 && unusedImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * unusedImages.length);
      selectedImages.push(unusedImages[randomIndex]);
      unusedImages.splice(randomIndex, 1);
    }
    
    // Create the new image set
    const newImageSet = {
      topLeft: selectedImages[0],
      bottomLeft: selectedImages[1],
      topRight: selectedImages[2],
      bottomRight: selectedImages[3],
    };
    
    // Update state
    setCurrentImageSet(newImageSet);
    setUsedImages(prev => [...prev, ...selectedImages]);
    setImageSetKey(prev => prev + 1); // Increment key to force re-rendering
  }, [allImages, usedImages, currentImageSet]);

  // Timer effect for changing ALL images every 10 seconds
  useEffect(() => {
    const imageTimer = setInterval(() => {
      generateNewImageSet();
    }, 10000); // Change entire set every 10 seconds
    
    return () => clearInterval(imageTimer);
  }, [generateNewImageSet]);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const viewportHeight = window.innerHeight;
        const currentPosition = window.scrollY + viewportHeight / 2;
        
        sectionsRef.current.forEach((section, index) => {
          if (section && currentPosition >= section.offsetTop && 
              currentPosition < (section.offsetTop + section.offsetHeight)) {
            setCurrentSection(index);
          }
        });
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    
    sectionsRef.current = Array.from(document.querySelectorAll('.scroll-section')).map(
      section => section as HTMLDivElement
    );
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-x-hidden snap-y snap-mandatory">
      {/* Background gradient effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      {/* Floating navigation arrow - always visible */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={scrollToNextSection}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-purple-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <ChevronDown className="h-6 w-6 text-white" />
        </button>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-2xl font-bold cursor-pointer flex items-center"
              onClick={() => router.push("/home")}
            >
              <Image src="/favicon.png" alt="TakeAIPhotos Logo" width={36} height={36} className="mr-2" />
              TakeAIPhotos
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="hover:text-sky-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-sky-400 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-sky-400 transition-colors">Pricing</a>
            <span 
              onClick={() => router.push("/features")} 
              className="cursor-pointer hover:text-sky-400 transition-colors"
            >
              Compare Plans
            </span>
          </div>
          
          <GoogleAuthButton 
            onClick={() => router.push("/auth/signin")}
          />
        </header>
        
        {/* Hero section with improved image layout */}
        <section className="py-12 lg:py-20 scroll-section snap-start relative" ref={el => { sectionsRef.current[0] = el as HTMLDivElement; }}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2"
              >
                <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                  Transform Your Photos With 
                  <span className="bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 text-transparent bg-clip-text"> AI Magic</span>
                </h1>
                
                <p className="text-xl text-gray-300 mb-8">
                  Create stunning, professional AI photos of yourself in various styles. Perfect for social media, profile pictures, and creative projects.
                </p>
                
                <div className="flex gap-4 mb-8">
                  <GoogleAuthButton 
                    variant="gradient"
                    size="lg"
                    onClick={() => router.push("/auth/signin")}
                  />
                  <a
                    href="#how-it-works"
                    className="px-6 py-3 rounded-lg border border-white/20 flex items-center gap-2 hover:bg-white/5 transition-colors"
                  >
                    Learn more
                  </a>
                </div>
                
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-black overflow-hidden">
                        <Image
                          src={`/testimonials/avatar_${i}.jpg`}
                          alt="User"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    <span className="text-gray-400">from 2,000+ happy users</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:w-1/2 relative"
              >
                {imagesLoaded ? (
                  <div className="relative z-10 grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="rounded-xl overflow-hidden h-64 shadow-lg">
                        <motion.div
                          key={`image-set-${imageSetKey}-top-left`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Image 
                            src={currentImageSet.topLeft} 
                            alt="AI Portrait"
                            width={500}
                            height={500}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      </div>
                      <div className="rounded-xl overflow-hidden h-64 shadow-lg">
                        <motion.div
                          key={`image-set-${imageSetKey}-bottom-left`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Image 
                            src={currentImageSet.bottomLeft} 
                            alt="AI Portrait"
                            width={500}
                            height={500}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-xl overflow-hidden h-64 shadow-lg">
                        <motion.div
                          key={`image-set-${imageSetKey}-top-right`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Image 
                            src={currentImageSet.topRight} 
                            alt="AI Portrait"
                            width={500}
                            height={500}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      </div>
                      <div className="rounded-xl overflow-hidden h-64 shadow-lg">
                        <motion.div
                          key={`image-set-${imageSetKey}-bottom-right`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Image 
                            src={currentImageSet.bottomRight} 
                            alt="AI Portrait"
                            width={500}
                            height={500}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Loading state while images are being selected
                  <div className="relative z-10 grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-64 rounded-xl bg-white/5 animate-pulse" />
                    ))}
                  </div>
                )}
                <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-gradient-to-br from-sky-500/30 to-purple-500/30 rounded-full blur-[60px] z-0"></div>
              </motion.div>
            </div>
            
            {/* Repositioned scroll indicator - below images and aligned center */}
            <div className="mt-12 flex justify-center">
              <div className="bg-black/40 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                <div className="flex flex-col items-center">
                  <p className="text-white/90 mb-2 flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 animate-bounce" />
                    Scroll to explore different styles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section id="features" className="py-24 scroll-section snap-start" ref={el => { sectionsRef.current[1] = el as HTMLDivElement; }}>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Amazing 
                <span className="mx-2 bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                  Features
                </span>
                for Everyone
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Create stunning AI portraits with our advanced tools and features
              </p>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  icon: <Upload className="h-8 w-8" />,
                  title: "Upload & Transform",
                  description: "Upload your photos and transform them with AI-powered technology"
                },
                {
                  icon: <Camera className="h-8 w-8" />,
                  title: "Professional Quality",
                  description: "Get studio-quality results in seconds with our advanced AI models"
                },
                {
                  icon: <Video className="h-8 w-8" />,
                  title: "Video Generation",
                  description: "Turn your still photos into captivating short videos with animation"
                },
                {
                  icon: <Heart className="h-8 w-8" />,
                  title: "Style Presets",
                  description: "Choose from hundreds of curated AI styles to match your vision"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  className="group"
                >
                  <Card className="h-full p-8 bg-white/5 backdrop-blur-sm border-0 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                    <div className="h-16 w-16 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 mb-6 group-hover:bg-sky-500/20 transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 scroll-section snap-start" ref={el => { sectionsRef.current[2] = el as HTMLDivElement; }}>
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How 
                <span className="mx-2 bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                  TakeAIPhotos
                </span>
                Works
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Three simple steps to create stunning AI-generated photos
              </p>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  step: "01",
                  title: "Upload Your Photos",
                  description: "Upload a few photos of yourself or the subject you want to transform"
                },
                {
                  step: "02",
                  title: "Choose Your Style",
                  description: "Select from our wide range of AI styles and customization options"
                },
                {
                  step: "03",
                  title: "Get Amazing Results",
                  description: "Receive professionally-generated AI photos in seconds"
                }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  className="relative"
                >
                  <Card className="h-full p-8 bg-white/5 backdrop-blur-sm border-0">
                    <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-gradient-to-r from-sky-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 mt-4">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section id="pricing" className="py-24 scroll-section snap-start" ref={el => { sectionsRef.current[3] = el as HTMLDivElement; }}>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple
                <span className="mx-2 bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                  Pricing
                </span>
                Plans
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Choose the perfect plan for your needs
              </p>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  name: "Free",
                  price: "$0",
                  period: "/month",
                  description: "Perfect for trying out our AI photo generation",
                  popular: false,
                  features: [
                    "50 AI photos per month",
                    "Access to 3 basic styles",
                    "Standard quality output",
                    "Basic editing tools",
                    "Watermarked photos",
                    "Email support"
                  ]
                },
                {
                  name: "Premium",
                  price: "$14.99",
                  period: "/month",
                  description: "Our most popular plan for AI enthusiasts",
                  popular: true,
                  features: [
                    "200 AI photos per month",
                    "Access to 20+ premium styles",
                    "HD quality output",
                    "Advanced editing tools",
                    "No watermarks",
                    "Priority support"
                  ]
                },
                {
                  name: "Professional",
                  price: "$29.99",
                  period: "/month",
                  description: "For creators who need the very best quality",
                  popular: false,
                  features: [
                    "Unlimited AI photos",
                    "Access to all styles & features",
                    "Ultra HD quality output",
                    "Professional editing suite",
                    "Commercial usage rights",
                    "Dedicated support"
                  ]
                }
              ].map((plan, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  className="relative"
                >
                  <Card className={`h-full p-8 backdrop-blur-sm border-0 relative overflow-hidden ${
                    plan.popular 
                      ? "bg-gradient-to-b from-white/10 to-purple-500/10 border border-purple-500/20" 
                      : "bg-white/5"
                  }`}>
                    {plan.popular && (
                      <div className="absolute top-5 right-5">
                        <span className="px-3 py-1 bg-gradient-to-r from-sky-500 to-purple-500 rounded-full text-xs font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                    <div className="flex items-end gap-1 mb-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-gray-400 mb-1">{plan.period}</span>}
                    </div>
                    <p className="text-gray-400 mb-6">{plan.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <GoogleAuthButton
                      variant={plan.popular ? "gradient" : "outline"}
                      size="default"
                      onClick={() => router.push("/auth/signin")}
                    />
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 scroll-section snap-start" ref={el => { sectionsRef.current[4] = el as HTMLDivElement; }}>
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Our
                <span className="mx-2 bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                  Customers
                </span>
                Say
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Hear from people who have transformed their photos with our AI technology
              </p>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  name: "Sarah Johnson",
                  role: "Content Creator",
                  image: "/testimonials/avatar_1.jpg",
                  quote: "I've tried many AI photo tools, but TakeAIPhotos provides the most realistic results. My followers can't tell the difference!"
                },
                {
                  name: "Michael Chen",
                  role: "Digital Marketer",
                  image: "/testimonials/avatar_2.jpg",
                  quote: "The variety of styles is amazing. I've been able to create consistent branding images across all my platforms."
                },
                {
                  name: "Emma Rodriguez",
                  role: "Photographer",
                  image: "/testimonials/avatar_3.jpg",
                  quote: "As a professional photographer, I was skeptical. But the quality of these AI portraits has completely won me over."
                }
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                >
                  <Card className="h-full p-8 bg-white/5 backdrop-blur-sm border-0">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <Image 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          width={48} 
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{testimonial.name}</h4>
                        <p className="text-sm text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    <p className="text-gray-300 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 scroll-section snap-start" ref={el => { sectionsRef.current[5] = el as HTMLDivElement; }}>
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-purple-500/20 to-pink-500/20"></div>
              <div className="relative z-10 py-16 px-8 md:px-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to transform your photos with AI?
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                  Join thousands of users creating stunning, professional photos with our AI technology.
                </p>
                <GoogleAuthButton
                  variant="gradient"
                  size="lg"
                  onClick={() => router.push("/auth/signin")}
                />
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Image src="/favicon.png" alt="TakeAIPhotos Logo" width={32} height={32} />
              <span className="font-semibold">TakeAIPhotos</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <a href="/legal/acceptable-use" className="hover:text-white transition-colors">
                Acceptable Use
              </a>
              <a href="/legal/cookies" className="hover:text-white transition-colors">
                Cookies
              </a>
              <a href="/legal/disclaimer" className="hover:text-white transition-colors">
                Disclaimer
              </a>
              <a href="/legal/eula" className="hover:text-white transition-colors">
                EULA
              </a>
              <a href="/legal/privacy" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="/legal/tos" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/legal/contact" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
            <div className="text-sm text-gray-400">
              ©{new Date().getFullYear()} TakeAIPhotos. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}