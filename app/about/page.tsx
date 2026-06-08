"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Heart, Target, Sparkles } from "lucide-react";

const missions = [
  {
    icon: <Heart className="w-10 h-10 text-primary" />,
    title: "Our Mission",
    description:
      "Helping people feel understood, supported, and empowered through intelligent care.",
  },
  {
    icon: <Target className="w-10 h-10 text-primary" />,
    title: "Our Vision",
    description:
      "A world where meaningful mental health support is always within reach.",
  },
  {
    icon: <Sparkles className="w-10 h-10 text-primary" />,
    title: "Our Values",
    description:
      "Built on empathy. Protected by privacy. Driven by innovation.",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-20"
      >
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Understanding Humanity Through Technology
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
           At Sentivra AI, we believe mental wellness should be as accessible as the
          technology we use every day. Our platform combines advanced AI intelligence
          with empathy-driven design to create meaningful conversations, personalized
          guidance, and a safe space for emotional growth.
        </p>
      </motion.div>

      {/* Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6 text-center h-full bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="mb-4 flex justify-center">{mission.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{mission.title}</h3>
              <p className="text-muted-foreground">{mission.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
