import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const HERO_IMAGE = "https://media.base44.com/images/public/69d522a330ff913b8a0c7893/0cc39c1b5_generated_93a24dce.png";

export default function HeroSection() {
  const scrollToGallery = () => {
    document.getElementById("gallery-preview")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Close-up of a gentle dog's eye in warm golden light"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/30 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-sm md:text-base font-body font-medium tracking-[0.2em] uppercase text-white/80 mb-6"
        >
          Virtual Adoption Program
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-heading text-4xl md:text-6xl lg:text-7xl font-semibold text-white max-w-4xl leading-tight"
        >
          You are the difference between a life lost and a life{" "}
          <span className="italic text-accent">loved</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-6 text-base md:text-lg text-white/70 max-w-xl font-body font-light leading-relaxed"
        >
          Can't adopt physically? Your virtual bond keeps them safe, fed, and loved 
          — giving every animal a fighting chance at their forever home.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          onClick={scrollToGallery}
          className="mt-10 px-8 py-4 bg-accent text-accent-foreground font-body font-medium text-base rounded-full hover:bg-accent/90 transition-all hover:shadow-lg hover:shadow-accent/20 active:scale-95"
        >
          Find Your Kinship
        </motion.button>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-6 h-6 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}