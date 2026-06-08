"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Brain,
  Heart,
  Shield,
  MessageCircle,
  Sparkles,
  LineChart,
  Waves,
  Check,
  ArrowRight,
  HeartPulse,
  Lightbulb,
  Lock,
  MessageSquareHeart,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React from "react";
import { Ripple } from "@/components/ui/ripple";

export default function Home() {
  const emotions = [
    { value: 0, label: "😔 Down", color: "from-blue-500/50" },
    { value: 25, label: "😊 Content", color: "from-green-500/50" },
    { value: 50, label: "😌 Peaceful", color: "from-purple-500/50" },
    { value: 75, label: "🤗 Happy", color: "from-yellow-500/50" },
    { value: 100, label: "✨ Excited", color: "from-pink-500/50" },
  ];

  const [emotion, setEmotion] = useState(50);
  const [mounted, setMounted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const welcomeSteps = [
    {
      title: "Welcome to Sentivra 👋",
      description:
        "Your Personal AI companion, created to listen, understand, and support you through every step of your journey.",
        
      icon: Waves,
    },
    {
      title: "Personalized Support",
      description:
        "I adapt to your needs and emotional state, offering evidence-based techniques and gentle guidance when you need it most.",
      icon: Brain,
    },
    {
      title: "Your Space. Your Story.",
      description:
        "What you share stays confidential. Sentivra is built with privacy at its core, giving you a secure space to speak openly and honestly.",
      icon: Shield,
    },
    
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentEmotion =
    emotions.find((em) => Math.abs(emotion - em.value) < 15) || emotions[2];

  const features = [
    {
      icon: HeartPulse,
      title: "24/7 Support",
      description: "Day or night, Sentivra is ready to listen, helping you navigate difficult moments whenever they arise.",
      color: "from-rose-500/20",
      delay: 0.2,
    },
    {
      icon: Lightbulb,
      title: "Personalized Guidance",
      description: "Receive insights and support tailored to your emotional patterns, goals, and personal experiences.",
      color: "from-amber-500/20",
      delay: 0.4,
    },
    {
      icon: Lock,
      title: "Privacy You Can Trust",
      description: "Your conversations remain confidential and protected, giving you a safe space to express yourself freely.",
      color: "from-emerald-500/20",
      delay: 0.6,
    },
    {
      icon: MessageSquareHeart,
      title: "Continuous Growth",
      description: "Track your emotional journey, discover patterns, and build healthier habits over time.",
      color: "from-blue-500/20",
      delay: 0.8,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
    
<section className="relative min-h-[90vh] mt-20 flex items-center px-4 py-16 overflow-hidden">
  {/* Background */}
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div
      className={`absolute w-[480px] h-[480px] rounded-full blur-3xl -top-20 -left-24 transition-all duration-700
      bg-gradient-to-r ${currentEmotion.color} to-transparent opacity-35`}
    />
    <div className="absolute w-[420px] h-[420px] rounded-full bg-accent/10 blur-3xl bottom-0 right-0" />
    <div className="absolute inset-0 bg-background/90 backdrop-blur-3xl" />
  </div>

  <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-2">
    {/* LEFT CONTENT */}
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 24 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center lg:text-left"
    >
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-xl">
        <Waves className="h-4 w-4" />
        A Safe Space for Every Thought
      </div>

      <h1 className="text-5xl font-medium leading-[0.95] tracking-[-0.06em] text-foreground md:text-7xl lg:text-[84px]">
        Understanding You
        <br />
        Beyond Words
      </h1>

      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg lg:mx-0 mx-auto">
        Sentivra provides a safe, intelligent space where you can express your
        thoughts freely, and navigate life's journey with confidence.
      </p>

      <div className="mt-8 flex justify-center lg:justify-start">
        <Button
          onClick={() => setShowDialog(true)}
          className="
            btn-premium
            group
            h-11
            rounded-full
            border
            border-zinc-800
            bg-black
            px-6
            text-sm
            font-medium
            tracking-[-0.02em]
            text-white
            shadow-[0_10px_25px_rgba(0,0,0,0.12)]
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:bg-zinc-900
            hover:shadow-[0_14px_32px_rgba(0,0,0,0.18)]
          "
        >
          <span className="flex items-center gap-2">
            Begin Your Journey
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Button>
      </div>
    </motion.div>
     {/* Enhanced scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary/20 flex items-start justify-center p-1 hover:border-primary/40 transition-colors duration-300">
            <div className="w-1 h-2 rounded-full bg-primary animate-scroll" />
          </div>
        </motion.div>

    {/* RIGHT MOOD CARD */}


 <motion.div

      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 24 }}
      transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
      className="relative flex justify-center lg:justify-end"
    >
  <div className="relative w-full overflow-hidden rounded-[30px] border border-black/10 bg-[#faf5e8]/85 p-8 lg:grid-cols-2 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-[#050808] dark:shadow-[0_30px_100px_rgba(0,0,0,0.25)]">
    <Ripple className="opacity-20 dark:opacity-30" />

    <div
      className={`absolute left-8 bottom-16 h-32 w-60 rounded-full blur-3xl bg-gradient-to-r ${currentEmotion.color} to-transparent opacity-25 dark:opacity-35`}
    />

    <div className="relative z-10 space-y-9">
      <p className="text-center text-sm font-medium text-muted-foreground dark:text-zinc-400">
        Whatever you're feeling, we're here to listen
      </p>

      <div className="flex items-center justify-between">
        {emotions.map((em) => {
          const isActive = Math.abs(emotion - em.value) < 15;

          return (
            <button
              key={em.value}
              onClick={() => setEmotion(em.value)}
              className={`group text-center transition-all duration-500 ${
                isActive
                  ? "scale-110 opacity-100"
                  : "scale-100 opacity-45 hover:opacity-80"
              }`}
            >
              <div className="text-3xl transition-transform duration-500 group-hover:-translate-y-1">
                {em.label.split(" ")[0]}
              </div>

              <div
                className={`mt-2 text-sm font-medium tracking-[-0.03em] ${
                  isActive
                    ? "text-foreground dark:text-zinc-200"
                    : "text-muted-foreground dark:text-zinc-500"
                }`}
              >
                {em.label.split(" ")[1]}
              </div>
            </button>
          );
        })}
      </div>

     <div className="space-y-6">
  <Slider
    value={[emotion]}
    onValueChange={(value) => setEmotion(value[0])}
    min={0}
    max={100}
    step={1}
    className="py-3"
  />

  <p className="text-center text-sm text-muted-foreground dark:text-zinc-500">
    Slide to express how you're feeling today
  </p>
</div>
    </div>
  </div>
</motion.div>


  
  </div>
</section>

      {/* Enhanced Features Grid */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" /> */}

        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16 space-y-4 text-white ">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent dark:text-primary/90">
              Why People Choose Sentivra
            </h2>
            <p className="text-foreground dark:text-foreground/95 max-w-2xl mx-auto font-medium text-lg">
              Because feeling understood matters just as much as finding answers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="group relative overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-300 h-[200px] bg-card/30 dark:bg-card/80 backdrop-blur-sm">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 dark:group-hover:opacity-30`}
                  />
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300">
                        <feature.icon className="w-5 h-5 text-primary dark:text-primary/90" />
                      </div>
                      <h3 className="font-semibold tracking-tight text-foreground/90 dark:text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground/90 dark:text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 dark:via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px] bg-card/80 backdrop-blur-lg">
          <DialogHeader>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {welcomeSteps[currentStep] && (
                  <div>
                    {React.createElement(welcomeSteps[currentStep].icon, {
                      className: "w-8 h-8 text-primary",
                    })}
                  </div>
                )}
              </div>
              <DialogTitle className="text-2xl text-center">
                {welcomeSteps[currentStep]?.title}
              </DialogTitle>
              <DialogDescription className="text-center text-base leading-relaxed">
                {welcomeSteps[currentStep]?.description}
              </DialogDescription>
            </motion.div>
          </DialogHeader>
          <div className="flex justify-between items-center mt-8">
            <div className="flex gap-2">
              {welcomeSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep ? "bg-primary w-4" : "bg-primary/20"
                  }`}
                />
              ))}
            </div>
            <Button
              onClick={() => {
                if (currentStep < welcomeSteps.length - 1) {
                  setCurrentStep((c) => c + 1);
                } else {
                  setShowDialog(false);
                  setCurrentStep(0);
                  // Here you would navigate to the chat interface
                }
              }}
              className="relative group px-6"
            >
              <span className="flex items-center gap-2">
                {currentStep === welcomeSteps.length - 1 ? (
                  <>
                    Let's Begin
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add custom animations to globals.css */}
    </div>
  );
}
