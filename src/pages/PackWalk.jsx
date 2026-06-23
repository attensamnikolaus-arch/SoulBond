import { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Clock, Check, Heart, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";

const upcomingWalks = [
{ date: "Saturday, April 19", time: "9:00 AM – 11:00 AM", location: "Riverside Park Trail", spots: 8 },
{ date: "Saturday, May 3", time: "9:00 AM – 11:00 AM", location: "Lakeview Nature Loop", spots: 10 },
{ date: "Saturday, May 17", time: "9:00 AM – 11:00 AM", location: "Riverside Park Trail", spots: 10 }];


const experienceLevels = [
{ value: "first_time", label: "First Timer" },
{ value: "some_experience", label: "Some Experience" },
{ value: "experienced", label: "Experienced Handler" }];


export default function PackWalk() {
  const [selectedWalk, setSelectedWalk] = useState(null);
  const [form, setForm] = useState({ full_name: "", phone: "", experience_level: "some_experience", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    if (!selectedWalk) {setError("Please select a walk date.");return;}
    if (!form.full_name) {setError("Please enter your name.");return;}
    setLoading(true);
    const user = await base44.auth.me();
    await base44.entities.PackWalkSignup.create({
      full_name: form.full_name,
      email: user.email,
      phone: form.phone,
      walk_date: selectedWalk.date,
      experience_level: form.experience_level,
      message: form.message,
      status: "pending"
    });
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-accent" />
          </div>
          <h2 className="font-heading text-3xl font-semibold mb-3">You're on the List!</h2>
          <p className="text-muted-foreground font-body text-base leading-relaxed mb-6">
            We'll confirm your spot for the {selectedWalk?.date} Pack Walk and send everything you need before the day.
          </p>
          <Link to="/gallery" className="text-accent font-body font-medium hover:underline">← Back to Gallery</Link>
        </motion.div>
      </div>);

  }

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="pt-16 pb-12 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">
          <p className="text-sm font-body font-medium tracking-[0.2em] uppercase text-accent mb-3">Community Programme</p>
          <h1 className="text-green-950 mb-5 text-4xl font-semibold leading-tight md:text-5xl">Paws in Motion

          </h1>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            Every Saturday morning, a small group of volunteers walks alongside our shelter dogs — giving them fresh air, socialisation, and the feeling of being truly seen. No experience required. Just an open heart.
          </p>
        </motion.div>
      </section>

      {/* What to Expect */}
      <section className="py-12 bg-primary text-primary-foreground px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm font-body uppercase tracking-widest text-accent mb-8">What to Expect</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
            { icon: Users, title: "Small Groups", desc: "Max 10 volunteers per walk — one dog per person, every dog gets full attention." },
            { icon: MapPin, title: "Curated Routes", desc: "We walk beautiful local trails and parks specifically chosen for shelter dog socialisation." },
            { icon: Shield, title: "Fully Guided", desc: "A shelter staff member leads every walk. Briefing included for first-timers." }].
            map((item, i) =>
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 text-center">
              
                <item.icon className="w-6 h-6 text-accent mx-auto mb-3" />
                <h3 className="font-heading text-lg font-semibold mb-2">{item.title}</h3>
                <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            )}
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-sm font-body text-primary-foreground/70">
            {[
            "Dogs remain on leash at all times",
            "No dog parks or off-leash areas",
            "Must be 18+ to participate",
            "Own transport required — no ride-shares",
            "Avoid contact with outside animals",
            "Stay with your assigned dog throughout"].
            map((rule, i) =>
            <div key={i} className="flex items-start gap-2">
                <Star className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                <span>{rule}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sign Up */}
      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border p-8">
            
            <h2 className="font-heading text-2xl font-semibold mb-1">Reserve Your Spot</h2>
            <p className="text-sm text-muted-foreground font-body mb-6">Spots fill quickly. Sign up and we'll confirm within 24 hours.</p>

            {error &&
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-body mb-5">{error}</div>
            }

            {/* Walk Selection */}
            <div className="mb-5">
              <p className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-2">Choose a Date <span className="text-accent">*</span></p>
              <div className="space-y-2">
                {upcomingWalks.map((walk, i) =>
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedWalk(walk)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedWalk === walk ? "border-accent bg-accent/5" : "border-border hover:border-accent/40"}`
                  }>
                  
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-body text-sm font-semibold">{walk.date}</p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground font-body">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{walk.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{walk.location}</span>
                        </div>
                      </div>
                      <span className="text-xs font-body text-muted-foreground">{walk.spots} spots</span>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                Full Name <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => set("full_name", e.target.value)}
                placeholder="Jane Smith"
                className="w-full px-4 py-3 rounded-xl bg-muted border-0 font-body text-sm focus:ring-2 focus:ring-accent outline-none" />
              
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+1 (000) 000-0000"
                className="w-full px-4 py-3 rounded-xl bg-muted border-0 font-body text-sm focus:ring-2 focus:ring-accent outline-none" />
              
            </div>

            {/* Experience */}
            <div className="mb-4">
              <label className="block text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Dog Handling Experience</label>
              <div className="flex gap-2">
                {experienceLevels.map((lvl) =>
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() => set("experience_level", lvl.value)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-body font-medium transition-all ${
                  form.experience_level === lvl.value ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`
                  }>
                  
                    {lvl.label}
                  </button>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="mb-7">
              <label className="block text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Anything we should know?</label>
              <textarea
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                rows={2}
                placeholder="Allergies, physical limitations, dog preferences..."
                className="w-full px-4 py-3 rounded-xl bg-muted border-0 font-body text-sm focus:ring-2 focus:ring-accent outline-none resize-none" />
              
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-6 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold text-base">
              
              {loading ?
              <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" /> :

              <><Heart className="w-4 h-4 mr-2 fill-current" /> Reserve My Spot</>
              }
            </Button>
          </motion.div>
        </div>
      </section>
    </div>);

}