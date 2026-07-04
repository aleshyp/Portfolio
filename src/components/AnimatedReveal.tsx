"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Delay in seconds before the reveal begins. */
  delay?: number;
  /** Direction the element travels from as it fades in. */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Render as a different element if needed (defaults to div). */
  as?: "div" | "li" | "section";
};

const offset = 16;

function getOffset(direction: AnimatedRevealProps["direction"]) {
  switch (direction) {
    case "down":
      return { y: -offset, x: 0 };
    case "left":
      return { y: 0, x: offset };
    case "right":
      return { y: 0, x: -offset };
    case "none":
      return { y: 0, x: 0 };
    case "up":
    default:
      return { y: offset, x: 0 };
  }
}

/**
 * Fades + slides its children into view on scroll. Honors prefers-reduced-motion
 * by rendering content immediately with no transform. This is the shared
 * building block for the site's subtle, consistent motion language.
 */
export function AnimatedReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  as = "div",
}: AnimatedRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const { x, y } = getOffset(direction);

  const variants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x, y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Container that staggers the reveal of its direct AnimatedReveal children.
 * Wrap a grid/list and give children `direction`/index-based delays, or use
 * the `Stagger.Item` helper below.
 */
export function StaggerGroup({
  children,
  className,
  as = "div",
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul";
  stagger?: number;
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </MotionTag>
  );
}

/** Child item for use inside StaggerGroup. */
export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      variants={{
        hidden: shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}
