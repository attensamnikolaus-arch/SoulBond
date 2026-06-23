import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function KeeperNote({ note, keeperName, animalName }) {
  if (!note) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative bg-primary text-primary-foreground rounded-2xl p-7 overflow-hidden"
    >
      {/* Decorative quote mark */}
      <Quote className="absolute top-4 right-5 w-16 h-16 text-primary-foreground/5" />

      <p className="text-xs font-body font-medium tracking-[0.15em] uppercase text-accent mb-3">
        A Note from {animalName}'s Keeper
      </p>

      <blockquote className="font-heading text-lg italic leading-relaxed text-primary-foreground/90 mb-4">
        "{note}"
      </blockquote>

      <p className="font-body text-sm text-primary-foreground/60">
        — {keeperName || "The Shelter Team"}
      </p>
    </motion.div>
  );
}