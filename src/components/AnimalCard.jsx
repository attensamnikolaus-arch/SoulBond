import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function AnimalCard({ animal, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <Link
        to={`/animal/${animal.id}`}
        className="group block"
      >
        <div className="relative overflow-hidden rounded-2xl bg-card shadow-sm hover:shadow-xl transition-shadow duration-500">
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={animal.photo_url || "/placeholder.jpg"}
              alt={`${animal.name} - ${animal.species}`}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
            
            {/* Species badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 text-xs font-body font-medium bg-background/80 backdrop-blur-sm rounded-full text-foreground">
                {animal.species}
              </span>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="font-heading text-2xl font-semibold text-white mb-1">
                {animal.name}
              </h3>
              <div className="flex items-center gap-3 text-white/80">
                <span className="text-sm font-body">{animal.age} · {animal.gender}</span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span className="text-sm font-body flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {animal.location}
                </span>
              </div>
            </div>
          </div>

          {/* Trait - handwritten style */}
          <div className="px-5 py-4 border-t border-border/30">
            <p className="font-handwritten text-xl text-accent -rotate-1 leading-tight" aria-label={animal.trait}>
              "{animal.trait}"
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}