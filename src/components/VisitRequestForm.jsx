import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const visitTypes = [
  { value: "meet_and_greet", label: "Meet & Greet" },
  { value: "day_out", label: "Take for a Day Out" },
  { value: "pack_walk", label: "Join Paws in Motion" },
  { value: "physical_adoption_inquiry", label: "Physical Adoption Inquiry" },
];

export default function VisitRequestForm({ animal, onClose }) {
  const [visitType, setVisitType] = useState("meet_and_greet");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = await base44.auth.me();
    await base44.entities.VisitRequest.create({
      animal_id: animal.id,
      animal_name: animal.name,
      visitor_email: user.email,
      visitor_name: user.full_name || user.email,
      preferred_date: date,
      visit_type: visitType,
      message,
      status: "pending",
    });
    setSuccess(true);
    setLoading(false);
  };

  // Day Out → dedicated multi-step application
  if (visitType === "day_out") {
    return (
      <div className="space-y-3">
        <p className="text-sm font-body text-muted-foreground leading-relaxed">
          Taking a shelter dog for a day requires a short formal application — so we can ensure a safe, wonderful experience for you both.
        </p>
        <Link
          to={`/day-out/${animal.id}/${encodeURIComponent(animal.name)}`}
          className="block w-full py-3 text-center rounded-xl bg-accent text-accent-foreground font-body font-semibold text-sm hover:bg-accent/90 transition-all"
        >
          Start Day Out Application →
        </Link>
        <button type="button" onClick={onClose} className="w-full text-xs text-muted-foreground font-body hover:text-foreground">Cancel</button>
      </div>
    );
  }

  // Pack Walk → dedicated sign-up page
  if (visitType === "pack_walk") {
    return (
      <div className="space-y-3">
        <p className="text-sm font-body text-muted-foreground leading-relaxed">
          Paws in Motion are group outings led by shelter staff — a wonderful way to connect with our dogs.
        </p>
        <Link
          to="/pack-walk"
          className="block w-full py-3 text-center rounded-xl bg-accent text-accent-foreground font-body font-semibold text-sm hover:bg-accent/90 transition-all"
        >
          View Paws in Motion Dates & Sign Up →
        </Link>
        <button type="button" onClick={onClose} className="w-full text-xs text-muted-foreground font-body hover:text-foreground">Cancel</button>
      </div>
    );
  }

  // Physical Adoption → dedicated adoption page
  if (visitType === "physical_adoption_inquiry") {
    return (
      <div className="space-y-3">
        <p className="text-sm font-body text-muted-foreground leading-relaxed">
          Ready to give {animal.name} a forever home? Start your adoption application — our team will guide you through every step.
        </p>
        <Link
          to="/adopt"
          className="block w-full py-3 text-center rounded-xl bg-accent text-accent-foreground font-body font-semibold text-sm hover:bg-accent/90 transition-all"
        >
          Start Adoption Application →
        </Link>
        <button type="button" onClick={onClose} className="w-full text-xs text-muted-foreground font-body hover:text-foreground">Cancel</button>
      </div>
    );
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-accent" />
        </div>
        <p className="font-body text-sm font-medium">Visit request submitted!</p>
        <p className="font-body text-xs text-muted-foreground mt-1">The shelter will contact you to confirm.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Visit Type */}
      <div>
        <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider block mb-2">
          Visit Type
        </label>
        <div className="space-y-2">
          {visitTypes.map((vt) => (
            <button
              type="button"
              key={vt.value}
              onClick={() => setVisitType(vt.value)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-body transition-all ${
                visitType === vt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {vt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider block mb-2">
          Preferred Date
        </label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 font-body text-sm focus:ring-2 focus:ring-accent outline-none"
        />
      </div>

      {/* Message */}
      <div>
        <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider block mb-2">
          Message (Optional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Tell us about yourself..."
          className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 font-body text-sm focus:ring-2 focus:ring-accent outline-none resize-none"
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={loading || !date}
          className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-body"
        >
          {loading ? "Submitting..." : "Request Visit"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="font-body">
          Cancel
        </Button>
      </div>
    </form>
  );
}