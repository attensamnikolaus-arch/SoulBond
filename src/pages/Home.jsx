import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Eye, Calendar } from "lucide-react";
import HeroSection from "../components/HeroSection";
import AnimalCard from "../components/AnimalCard";
import StatsBar from "../components/StatsBar";

export default function Home() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnimals = async () => {
      const data = await base44.entities.Animal.list("-created_date", 6);
      setAnimals(data);
      setLoading(false);
    };
    loadAnimals();
  }, []);

  return (
    <div>
      <HeroSection />

      {/* Gallery Preview */}
      <section id="gallery-preview" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-sm font-body font-medium tracking-[0.2em] uppercase text-accent mb-3">
              Waiting for You
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold text-foreground mb-4">
              Meet the Souls
            </h2>
            <p className="text-muted-foreground font-body max-w-lg mx-auto leading-relaxed">
              Each one has a story. Each one deserves a chance. Your bond could be 
              the reason they see tomorrow.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-muted border-t-accent rounded-full animate-spin" />
            </div>
          ) : animals.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-body">
                Animals will appear here soon. Check back shortly!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {animals.map((animal, i) => (
                <AnimalCard key={animal.id} animal={animal} index={i} />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-medium text-sm rounded-full hover:bg-primary/90 transition-all"
            >
              See All Animals
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <StatsBar />

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-body font-medium tracking-[0.2em] uppercase text-accent mb-3">
              Simple & Meaningful
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
              How Virtual Adoption Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Choose Your Bond",
                desc: "Browse our gallery and find the animal that speaks to your heart. Read their story and discover their unique personality.",
              },
              {
                icon: Eye,
                title: "Receive Updates",
                desc: "Get weekly or monthly photos, videos, and stories about how your animal is doing. Feel the connection grow.",
              },
              {
                icon: Calendar,
                title: "Visit or Adopt",
                desc: "Schedule visits to meet your bonded animal. When you're ready, take the step to give them their forever home.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
                  <step.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary-foreground mb-4">
              Every Bond Saves a Life
            </h2>
            <p className="text-primary-foreground/70 font-body mb-8 max-w-lg mx-auto leading-relaxed">
              The animals in shelters are running out of time. Your support — no matter how small — 
              extends their stay, covers their care, and gives them hope.
            </p>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-semibold rounded-full hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
            >
              Find Your Kinship
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}