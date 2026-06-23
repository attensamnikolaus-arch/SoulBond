import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import moment from "moment";

export default function AnimalJourney({ milestones, rescueDate, name }) {
  const defaultMilestones = [
    { label: "Arrived at Shelter", date: rescueDate, completed: true },
    { label: "Health Assessment", completed: true },
    { label: "Vaccinations Complete", completed: true },
    { label: "Behavioural Assessment", completed: false },
    { label: "Ready for Adoption", completed: false },
  ];

  const items = (milestones && milestones.length > 0) ? milestones : defaultMilestones;
  const completedCount = items.filter(m => m.completed).length;
  const progress = Math.round((completedCount / items.length) * 100);

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-heading text-lg font-semibold">{name}'s Journey</h3>
        <span className="text-xs font-body font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
          {progress}% complete
        </span>
      </div>
      <p className="text-sm text-muted-foreground font-body mb-6">
        Every step forward is a step closer to a forever home.
      </p>

      {/* Progress Bar */}
      <div className="h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="h-full bg-accent rounded-full"
        />
      </div>

      {/* Milestones */}
      <div className="relative space-y-4">
        <div className="absolute left-3 top-3 bottom-3 w-px bg-border" />
        {items.map((milestone, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="relative flex items-start gap-4 pl-8"
          >
            <div className={`absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center ${
              milestone.completed ? "bg-accent" : "bg-muted border-2 border-border"
            }`}>
              {milestone.completed
                ? <Check className="w-3 h-3 text-white" />
                : <Circle className="w-2.5 h-2.5 text-muted-foreground" />
              }
            </div>
            <div className="flex-1">
              <p className={`font-body text-sm font-medium ${
                milestone.completed ? "text-foreground" : "text-muted-foreground"
              }`}>
                {milestone.label}
              </p>
              {milestone.date && (
                <p className="font-body text-xs text-muted-foreground mt-0.5">
                  {moment(milestone.date).format("MMMM D, YYYY")}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}