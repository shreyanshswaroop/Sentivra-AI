"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
   <SliderPrimitive.Track
  className="
    relative h-[7px] w-full grow rounded-full

    bg-gradient-to-r
    from-[#BFE8D7]
    via-[#D8DED8]
    to-[#E9E3D6]

    dark:from-[#A7DCC3]
    dark:via-[#172B38]
    dark:to-[#34304F]

    shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_0_18px_rgba(120,170,150,0.12)]
    dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_22px_rgba(159,224,194,0.14)]
  "
/>

<SliderPrimitive.Thumb
  className="
    relative block h-[20px] w-[20px] rounded-full

    border-[2.5px]
    border-[#8FD6B8]
    dark:border-[#B7EFD4]

    bg-[#FAF5E8]/70
    dark:bg-[#071015]/70

    backdrop-blur-md

    shadow-[0_0_0_5px_rgba(143,214,184,0.14),0_10px_25px_rgba(0,0,0,0.10)]
    dark:shadow-[0_0_0_5px_rgba(183,239,212,0.10),0_0_24px_rgba(183,239,212,0.28)]

    transition-all duration-300
    hover:scale-110
    hover:border-[#B9F3D6]
    hover:shadow-[0_0_0_7px_rgba(143,214,184,0.18),0_0_26px_rgba(143,214,184,0.35)]

    focus-visible:outline-none
  "
/>
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };