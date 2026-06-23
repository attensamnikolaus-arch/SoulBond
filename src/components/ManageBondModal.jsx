import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { X, PauseCircle, Repeat, HeartOff, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ManageBondModal({ adoption, animal, onClose, onUpdated }) {
  const [view, setView] = useState("menu"); // menu | pause | transfer | cancel | done
  const [doneMessage, setDoneMessage] = useState("");
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (view === "transfer") {
      base44.entities.Animal.filter({ adoption_status: "available" }, "-created_date", 30)
        .then(data => setAnimals(data.filter(a => a.id !== adoption.animal_id)));
    }
  }, [view]);

  const handlePause = async () => {
    setLoading(true);
    await base44.entities.VirtualAdoption.update(adoption.id, { status: "paused" });
    setDoneMessage(`Your bond with ${animal?.name} has been paused. They'll be right here whenever you're ready to return. 🐾`);
    setView("done");
    setLoading(false);
    onUpdated();
  };

  const handleTransfer = async () => {
    if (!selectedAnimal) return;
    setLoading(true);
    // Cancel current bond
    await base44.entities.VirtualAdoption.update(adoption.id, { status: "cancelled" });
    // Create new bond with same settings
    await base44.entities.VirtualAdoption.create({
      animal_id: selectedAnimal.id,
      animal_name: selectedAnimal.name,
      donor_email: adoption.donor_email,
      donor_name: adoption.donor_name,
      monthly_amount: adoption.monthly_amount,
      update_frequency: adoption.update_frequency,
      status: "active",
      total_donated: 0,
    });
    setDoneMessage(`Your bond has been transferred to ${selectedAnimal.name}. A new journey begins — and ${animal?.name} still has their community cheering for them. 💛`);
    setView("done");
    setLoading(false);
    onUpdated();
  };

  const handleCancel = async () => {
    setLoading(true);
    await base44.entities.VirtualAdoption.update(adoption.id, { status: "cancelled" });
    setDoneMessage(`Thank you for every single day you were part of ${animal?.name}'s story. The love you gave was real, and it made a difference. 🌿`);
    setView("done");
    setLoading(false);
    onUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card rounded-2xl border border-border p-7 max-w-md w-full shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-heading text-xl font-semibold">Manage Your Bond</h3>
            <p className="text-sm text-muted-foreground font-body mt-0.5">
              {animal?.name} · ${adoption.monthly_amount} {adoption.update_frequency}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">

          {/* MENU */}
          {view === "menu" && (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <p className="text-sm font-body text-muted-foreground leading-relaxed mb-4">
                We understand that life changes. Whatever you need, we're here. Every bond — even a paused one — has already made a difference.
              </p>

              <button onClick={() => setView("pause")}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent/50 hover:bg-accent/5 transition-all text-left">
                <PauseCircle className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <p className="font-body text-sm font-semibold">Pause My Bond</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">Temporarily stop payments & updates. Resume anytime.</p>
                </div>
              </button>

              <button onClick={() => setView("transfer")}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent/50 hover:bg-accent/5 transition-all text-left">
                <Repeat className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <p className="font-body text-sm font-semibold">Transfer to Another Animal</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">Keep your donation going — just redirect it to a new companion.</p>
                </div>
              </button>

              <button onClick={() => setView("cancel")}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-red-200 hover:bg-red-50 transition-all text-left">
                <HeartOff className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-body text-sm font-semibold text-muted-foreground">Cancel Bond</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">End your virtual adoption and stop future donations.</p>
                </div>
              </button>
            </motion.div>
          )}

          {/* PAUSE CONFIRM */}
          {view === "pause" && (
            <motion.div key="pause" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <p className="text-sm font-body text-muted-foreground leading-relaxed">
                Pausing your bond means payments and updates are put on hold — but your connection with <strong className="text-foreground">{animal?.name}</strong> isn't gone. You can reactivate at any time from your dashboard.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setView("menu")} className="flex-1 font-body">Back</Button>
                <Button onClick={handlePause} disabled={loading} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-body">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Yes, Pause Bond"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* TRANSFER */}
          {view === "transfer" && (
            <motion.div key="transfer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <p className="text-sm font-body text-muted-foreground leading-relaxed">
                Choose an available animal to transfer your bond to. Your donation amount and frequency stay the same.
              </p>
              {animals.length === 0 ? (
                <p className="text-sm font-body text-muted-foreground text-center py-4">No other animals are available right now.</p>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {animals.map(a => (
                    <button key={a.id} onClick={() => setSelectedAnimal(a)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                        selectedAnimal?.id === a.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/40"
                      }`}>
                      <img src={a.photo_url || "/placeholder.jpg"} alt={a.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      <div>
                        <p className="font-body text-sm font-semibold">{a.name}</p>
                        <p className="font-body text-xs text-muted-foreground">{a.species} · {a.age}</p>
                      </div>
                      {selectedAnimal?.id === a.id && <Check className="w-4 h-4 text-accent ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setView("menu")} className="flex-1 font-body">Back</Button>
                <Button onClick={handleTransfer} disabled={loading || !selectedAnimal} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-body">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Transfer <ArrowRight className="w-3 h-3 ml-1" /></>}
                </Button>
              </div>
            </motion.div>
          )}

          {/* CANCEL CONFIRM */}
          {view === "cancel" && (
            <motion.div key="cancel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/60 text-sm font-body text-muted-foreground leading-relaxed">
                We're sad to see you go. Remember — even if others are also bonded with <strong className="text-foreground">{animal?.name}</strong>, your support has been a real part of their journey and will never be forgotten.
              </div>
              <p className="text-sm font-body text-muted-foreground">Are you sure you want to cancel your bond?</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setView("menu")} className="flex-1 font-body">Keep My Bond</Button>
                <Button onClick={handleCancel} disabled={loading} variant="destructive" className="flex-1 font-body">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Yes, Cancel"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* DONE */}
          {view === "done" && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 text-accent" />
              </div>
              <p className="text-sm font-body text-muted-foreground leading-relaxed">{doneMessage}</p>
              <Button onClick={onClose} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-body">Close</Button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}