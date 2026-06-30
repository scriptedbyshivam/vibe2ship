import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CustomCursor() {
  const [hoverType, setHoverType] = useState<"none" | "button" | "card" | "ai" | "map">("none");
  const [isVisible, setIsVisible] = useState(false);

  // Mouse coordinate motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physical properties for the lagging outer tracking ring
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if the device supports hover interactions to avoid cluttering touch screens
    const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const isMobile = window.innerWidth < 768;
    if (!hasMouse || isMobile) return;

    setIsVisible(true);

    const updateMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Detect the element under the cursor to apply specific stylistic changes
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const button = target.closest("button, a, input, select, textarea, [role='button']");
      const card = target.closest(".tilt-card, [data-cursor='magnetic'], .hover-card");
      const ai = target.closest("[data-cursor='ai'], .ai-element, .ai-badge");
      const map = target.closest("svg, .map-container, [data-cursor='map']");

      if (ai) {
        setHoverType("ai");
      } else if (map) {
        setHoverType("map");
      } else if (button) {
        setHoverType("button");
      } else if (card) {
        setHoverType("card");
      } else {
        setHoverType("none");
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", updateMouse);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updateMouse);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  // Render variations of cursor styles based on hover type
  const getOuterStyle = () => {
    switch (hoverType) {
      case "button":
        return {
          width: 50,
          height: 50,
          backgroundColor: "rgba(26, 115, 232, 0.08)",
          borderColor: "#1A73E8",
          borderWidth: "1.5px",
        };
      case "card":
        return {
          width: 60,
          height: 60,
          backgroundColor: "rgba(99, 102, 241, 0.04)",
          borderColor: "#6366f1",
          borderWidth: "1px",
          borderRadius: "16px", // morph into rounded square on cards!
        };
      case "ai":
        return {
          width: 55,
          height: 55,
          backgroundColor: "rgba(16, 185, 129, 0.05)",
          borderColor: "#10b981",
          borderWidth: "2px",
          boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)",
        };
      case "map":
        return {
          width: 40,
          height: 40,
          backgroundColor: "transparent",
          borderColor: "#ea4335",
          borderWidth: "1px",
          borderStyle: "dashed", // dashboard scanner style
        };
      default:
        return {
          width: 20,
          height: 20,
          backgroundColor: "transparent",
          borderColor: "rgba(26, 115, 232, 0.5)",
          borderWidth: "1px",
        };
    }
  };

  const getInnerStyle = () => {
    switch (hoverType) {
      case "button":
        return { scale: 1.5, backgroundColor: "#1A73E8" };
      case "card":
        return { scale: 1.2, backgroundColor: "#6366f1" };
      case "ai":
        return { scale: 1.8, backgroundColor: "#10b981" };
      case "map":
        return { scale: 0.8, backgroundColor: "#ea4335" };
      default:
        return { scale: 1, backgroundColor: "#1A73E8" };
    }
  };

  return (
    <>
      {/* 1. LAG OUTER MOVEMENT CIRCLE */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full flex items-center justify-center"
        animate={getOuterStyle()}
        transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          borderStyle: "solid",
        }}
      >
        {hoverType === "map" && (
          // Add miniature crosshair pointers on maps
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-4 h-px bg-red-400/40" />
            <div className="h-4 w-px bg-red-400/40 absolute" />
          </div>
        )}
      </motion.div>

      {/* 2. DIRECT INNER GLOWING DOT */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 rounded-full"
        animate={getInnerStyle()}
        transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
