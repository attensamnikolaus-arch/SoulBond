import { useState } from "react";
import { Heart, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const presetAmounts = [10, 25, 50, 100];

const frequencies = [
  { value: "weekly", label: "Weekly", suffix: "/ week" },
  { value: "biweekly", label: "Bi-Weekly", suffix: "/ 2 weeks" },
  { value: "monthly", label: "Monthly", suffix: "/ month" },
  { value: "yearly", label: "Yearly", suffix: "/ year" },
];

export default function DonationWidget({ animal, onAdopted }) {
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState("weekly");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedAmount = customAmount ? Number(customAmount) : amount;

  const handleAdopt = async () => {
    setLoading(true);
    const user = await base44.auth.me();
    await base44.entities.VirtualAdoption.create({
      animal_id: animal.id,
      animal_name: animal.name,
      donor_email: user.email,
      donor_name: user.full_name || user.email,
      monthly_amount: selectedAmount,
      update_frequency: frequency,
      status: "active",
      total_donated: selectedAmount,
    });
    await base44.entities.Animal.update(animal.id, {
      virtual_adopters_count: (animal.virtual_adopters_count || 0) + 1,
    });
    setSuccess(true);
    setLoading(false);
    if (onAdopted) onAdopted();
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl p-8 border border-border text-center"
      >
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-accent" />
        </div>
        <h3 className="font-heading text-2xl font-semibold mb-2">
          Welcome to your journey with {animal.name} 🐾
        </h3>
        <p className="text-muted-foreground font-body text-sm leading-relaxed">
          Your heart just made a real difference. {animal.name} now has a virtual parent rooting for them every single day — and they don't even know it yet. Your {frequency} updates will begin soon, and we have a feeling this is just the beginning of something beautiful. Together, one bond at a time, we change lives.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
      <h3 className="font-heading text-xl font-semibold mb-1">
        Create Your Bond
      </h3>
      <p className="text-sm text-muted-foreground font-body mb-6">
        Your donation goes directly to the shelter to keep {animal.name} safe and cared for.
      </p>

      {/* Amount Selection */}
      <div className="grid grid-cols-4 gap-2 mb-4">
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
            ${a}
          </button>
        ))}
      </div>

      {/* Custom Amount */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-body">$</span>
        <input
          type="number"
          placeholder="Custom amount"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          className="w-full pl-8 pr-4 py-3 rounded-xl bg-muted border-0 font-body text-sm focus:ring-2 focus:ring-accent outline-none"
        />
      </div>

      {/* Frequency */}
      <div className="mb-6">
        <p className="text-xs text-muted-foreground font-body mb-2 uppercase tracking-wider">Update Frequency</p>
        <div className="grid grid-cols-2 gap-2">
          {frequencies.map((f) => (
            <button
              key={f.value}
              onClick={() => setFrequency(f.value)}
              className={`py-2 rounded-lg text-xs font-medium font-body transition-all ${
                frequency === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Button
        onClick={handleAdopt}
        disabled={loading || selectedAmount <= 0}
        className="w-full py-6 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold text-base shadow-lg shadow-accent/20"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
        ) : (
          <>
            <Heart className="w-4 h-4 mr-2 fill-current" />
            Virtually Adopt {animal.name} — ${selectedAmount} {frequencies.find(f => f.value === frequency)?.suffix}
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-3 font-body">
        100% of your donation goes to the shelter. Cancel anytime.
      </p>
    </div>
  );
}