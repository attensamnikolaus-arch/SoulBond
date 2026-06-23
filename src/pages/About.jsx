import { motion } from "framer-motion";
import { Heart, Shield, Eye, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <section className="pt-16 pb-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
            
            <p className="text-sm font-body font-medium tracking-[0.2em] uppercase text-accent mb-3">
              Our Mission
            </p>
            <h1 className="font-heading text-3xl md:text-5xl font-semibold text-foreground mb-6 leading-tight">
              No Animal Should Die Because They Weren't Seen
            </h1>
            <p className="text-muted-foreground font-body text-lg leading-relaxed max-w-2xl mx-auto">
              SoulBond exists for one reason: to keep shelter animals alive, loved, and visible 
              until they find their forever home. We believe that every animal deserves a chance, 
              and that distance shouldn't stop compassion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12">
            
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-4">
              The Reality We're Changing
            </h2>
            <p className="text-primary-foreground/70 font-body leading-relaxed max-w-2xl mx-auto">
              Millions of animals enter shelters every year. Many don't make it out. 
              Shelters are underfunded and overcrowded. When space runs out and funds dry up, 
              the hardest decisions get made. That's where you come in.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
            {
              icon: Shield,
              title: "Financial Lifeline",
              desc: "Your monthly contribution directly funds food, shelter, and medical care for the animal you bond with. 100% goes to the shelter."
            },
            {
              icon: Eye,
              title: "Visibility Saves Lives",
              desc: "An animal with a virtual parent gets seen more. Their profile gets shared. Their story gets told. That's how forever homes are found."
            },
            {
              icon: Heart,
              title: "Emotional Connection",
              desc: "Regular updates — photos, videos, milestones — create a genuine bond. You become part of their story, and they become part of yours."
            },
            {
              icon: Home,
              title: "The Ultimate Goal",
              desc: "Every virtual adoption is a step toward the real thing. When the time is right, you or someone inspired by you can give them a forever home."
            }].
            map((item, i) =>
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10">
              
                <item.icon className="w-6 h-6 text-accent mb-4" />
                <h3 className="font-heading text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-primary-foreground/70 font-body leading-relaxed">{item.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* How Funds Are Used */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-4">
              Where Your Money Goes
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed mb-10">
              Transparency matters. Every dollar you donate through SoulBond goes directly 
              to our partner shelter. Here's how it helps:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
            { pct: "40%", label: "Food & Nutrition", color: "text-accent" },
            { pct: "35%", label: "Medical Care", color: "text-foreground" },
            { pct: "25%", label: "Shelter & Enrichment", color: "text-secondary" }].
            map((item, i) =>
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border">
              
                <p className={`font-heading text-4xl font-bold ${item.color} mb-2`}>{item.pct}</p>
                <p className="font-body text-sm text-muted-foreground">{item.label}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-muted-foreground font-body mb-8 leading-relaxed">
              It takes less than a minute to form a bond that could save a life.
            </p>
            <Link
              to="/gallery" className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-semibold rounded-full hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">Find Your Kinship




            </Link>
          </motion.div>
        </div>
      </section>
    </div>);

}