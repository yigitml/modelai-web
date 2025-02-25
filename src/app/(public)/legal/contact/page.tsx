"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Get in <span className="bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">Touch</span>
          </h1>
          <p className="text-gray-400 mb-12 text-xl">
            We're here to help and answer any questions you might have.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                  <p className="text-gray-400">General Inquiries:</p>
                  <a href="mailto:contact.modelai@gmail.com" className="text-sky-500 hover:text-sky-400">
                    contact.modelai@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                  <p className="text-gray-400">Phone Support:</p>
                  <a href="tel:+905522466373" className="text-sky-500 hover:text-sky-400">
                    (+90) 552 246 6373
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
                  <p className="text-gray-400">
                    Zümrütevler, Ertuğrul Gazi Cd,<br />
                    34852 Maltepe/İstanbul<br />
                    Turkey
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-sky-500"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-sky-500 min-h-[150px]"
                />
              </div>
              <Button 
                type="submit"
                className="w-full h-12 font-semibold text-white border-3 border-transparent bg-transparent hover:bg-white/5 transition-all duration-300 ease-in-out transform hover:scale-105 relative
                  before:absolute before:inset-0 before:p-[2px] before:rounded-md before:bg-gradient-to-r before:from-sky-500 before:via-purple-500 before:to-pink-500 before:content-[''] before:-z-10 before:mask-button"
              >
                Send Message
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
