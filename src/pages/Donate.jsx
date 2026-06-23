import { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Heart, Shield, Zap, Home, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const presetAmounts = [25, 50, 100, 250, 500, 1000];

const impactItems = [
  { icon: Zap, amount: "$25", desc: "Feeds a shelter animal for an entire month" },
  { icon: Shield, amount: "$100", desc: "Covers full vaccination & health check for one animal" },
  { icon: Heart, amount: "$250", desc: "Funds spay/neuter surgery, giving an animal a healthier life" },
  { icon: Home, amount: "$1,000", desc: "Sponsors a rescue operation and full rehabilitation care" },
];

export default function Donate() {
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [dedication, setDedication] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedAmount = customAmount ? Number(customAmount) : amount;

  const handleDonate = async () => {
    setLoading(true);
    const user = await base44.auth.me();
    await base44.entities.Donation.create({
      donor_email: user.email,
      donor_name: isAnonymous ? "Anonymous" : (donorName || user.full_name || user.email),
      amount: selectedAmount,
      message,
      dedication,
      is_anonymous: isAnonymous,
    });
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-accent" />
          </div>
          <h2 className="font-heading text-3xl font-semibold mb-3">Thank You.</h2>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            Your donation of <span className="text-foreground font-semibold">${selectedAmount.toLocaleString()}</span> will
            make a direct, lasting difference to the animals in our care.
            {dedication && (
              <span className="block mt-3 italic">
                In honour of: {dedication}
              </span>
            )}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="pt-16 pb-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-sm font-body font-medium tracking-[0.2em] uppercase text-accent mb-3">
            One-Time Giving
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground leading-tight mb-5">
            Give Once. Change a Life{" "}
            <span className="italic text-accent">Forever.</span>
          </h1>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            No subscriptions, no commitments. A single donation — any size — goes directly
            to the shelter to feed, heal, and protect the animals in their care.
          </p>
        </motion.div>
      </section>

      {/* Impact Section */}
      <section className="py-12 bg-primary text-primary-foreground px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm font-body uppercase tracking-widest text-accent mb-8">
            What Your Donation Does
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 text-center"
              >
                <item.icon className="w-6 h-6 text-accent mx-auto mb-3" />
                <p className="font-heading text-2xl font-bold mb-2">{item.amount}</p>
                <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16 px-6">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border p-8"
          >
            <h2 className="font-heading text-2xl font-semibold mb-1">Make Your Donation</h2>
            <p className="text-sm text-muted-foreground font-body mb-7">
              100% of every dollar goes directly to our partner shelter. No platform fees.
            </p>

            {/* Amount Presets */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {presetAmounts.map((a) => (
                <button
                  key={a}
                  onClick={() => { setAmount(a); setCustomAmount(""); }}
                  className={`py-3 rounded-xl text-sm font-medium font-body transition-all ${
                    selectedAmount === a && !customAmount
                      ? "bg-accent text-accent-foreground shadow-md"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  ${a.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-body">$</span>
              <input
                type="number"
                placeholder="Or enter your own amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-muted border-0 font-body text-sm focus:ring-2 focus:ring-accent outline-none"
              />
            </div>

            {/* Donor Name */}
            <div className="mb-4">
              <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Full name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                disabled={isAnonymous}
                className="w-full px-4 py-3 rounded-xl bg-muted border-0 font-body text-sm focus:ring-2 focus:ring-accent outline-none disabled:opacity-40"
              />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="accent-accent"
                />
                <span className="text-xs font-body text-muted-foreground">Donate anonymously</span>
              </label>
            </div>

            {/* Dedication */}
            <div className="mb-4">
              <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                Dedication <span className="normal-case font-normal">(optional — in honour or memory of someone)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. In memory of Bella"
                value={dedication}
                onChange={(e) => setDedication(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted border-0 font-body text-sm focus:ring-2 focus:ring-accent outline-none"
              />
            </div>

            {/* Message */}
            <div className="mb-7">
              <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                Personal Message <span className="normal-case font-normal">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Share why this matters to you..."
                className="w-full px-4 py-3 rounded-xl bg-muted border-0 font-body text-sm focus:ring-2 focus:ring-accent outline-none resize-none"
              />
            </div>

            <Button
              onClick={handleDonate}
              disabled={loading || selectedAmount <= 0}
              className="w-full py-6 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold text-base shadow-lg shadow-accent/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2 fill-current" />
                  Donate ${selectedAmount > 0 ? selectedAmount.toLocaleString() : "—"} Now
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4 font-body">
              This is a one-time donation. No recurring charges, ever.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}