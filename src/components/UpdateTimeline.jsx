import { motion } from "framer-motion";
import { Camera, Heart, Activity, Star } from "lucide-react";
import moment from "moment";

const typeIcons = {
  photo: Camera,
  video: Camera,
  milestone: Star,
  health: Activity,
  general: Heart,
};

export default function UpdateTimeline({ updates }) {
  if (!updates || updates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground font-body text-sm">
          Updates will appear here once your bond is active.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* The narrative thread line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-6">
        {updates.map((update, i) => {
          const Icon = typeIcons[update.update_type] || Heart;
          return (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative pl-12"
            >
              {/* Timeline dot */}
              <div className="absolute left-3 top-1 w-4 h-4 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
                <Icon className="w-2 h-2 text-accent" />
              </div>

              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-body text-muted-foreground">
                    {moment(update.created_date).fromNow()}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-body bg-muted rounded-full capitalize">
                    {update.update_type}
                  </span>
                </div>
                <h4 className="font-heading text-base font-semibold mb-1">{update.title}</h4>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{update.content}</p>
                
                {update.photo_urls && update.photo_urls.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {update.photo_urls.map((url, j) => (
                      <img
                        key={j}
                        src={url}
                        alt={`Update photo ${j + 1}`}
                        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}