"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Brain,
  Shield,
  Fingerprint,
  Activity,
  Bot,
  LineChart,
  Wifi,
  Heart,
} from "lucide-react";

const features = [
  {
    icon: <Bot className="w-10 h-10 text-primary" />,
    title: "AI Wellness Companion",
    description:
      "Personalized emotional support designed to help you reflect, reset, and feel understood whenever you need it.",
  },
  {
    icon: <Shield className="w-10 h-10 text-primary" />,
    title: "Secure by Design",
    description:
      "Built with privacy-focused technology to keep your conversations safe, protected, and fully under your control.",
  },
  {
    icon: <Brain className="w-10 h-10 text-primary" />,
    title: "Emotion Intelligence",
    description:
      "Understands mood patterns, emotional signals, and conversation context to offer more meaningful guidance.",
  },
  {
    icon: <Activity className="w-10 h-10 text-primary" />,
    title: "Safety Awareness",
    description:
      "Recognizes moments of emotional distress and helps guide users toward timely support when it matters most.",
  },
  {
    icon: <Wifi className="w-10 h-10 text-primary" />,
    title: "Connected Wellness",
    description:
      "Works with digital wellness tools and smart devices to create a calmer, more personalized support experience.",
  },
  {
    icon: <LineChart className="w-10 h-10 text-primary" />,
    title: "Growth Insights",
    description:
      "Simple, meaningful insights that help you understand your progress and emotional wellness over time.",
  },
  {
    icon: <Fingerprint className="w-10 h-10 text-primary" />,
    title: "Privacy First",
    description:
      "Your personal reflections stay private with secure, confidential, and user-first data protection.",
  },
  {
    icon: <Heart className="w-10 h-10 text-primary" />,
    title: "Whole-Person Care",
    description:
      "Supports emotional balance through a more complete view of your habits, mood, and wellbeing.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
       <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
        Features Designed for Better Mental Wellness
      </h1>

      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Sentivra AI brings together intelligent support, privacy-first design, and
        meaningful wellness insights to help people feel calmer, clearer, and more in
        control.
      </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-300 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center mt-16"
      >
        {/* <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-8">
          Join thousands of users benefiting from AI-powered mental health
          support.
        </p>
        <a
          href="/coming-soon"
          className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Start Your Journey
          <Heart className="ml-2 w-5 h-5" />
        </a> */}
        <h2 className="text-3xl font-semibold tracking-tight mb-4">
  A Better Conversation Starts Here
</h2>

<p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
  Experience a new approach to mental wellness — thoughtful, private, and
  designed to support you through every stage of life.
</p>

<a
  href="/coming-soon"
  className="inline-flex items-center px-7 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md"
>
  Start Your Journey
  <Heart className="ml-2 w-5 h-5" />
</a>
        
      </motion.div>
    </div>
  );
}
