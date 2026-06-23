import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Heart, Eye, Clock } from "lucide-react";
import DonationWidget from "../components/DonationWidget";
import VisitRequestForm from "../components/VisitRequestForm";
import AnimalJourney from "../components/AnimalJourney";
import KeeperNote from "../components/KeeperNote";

export default function AnimalProfile() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVisitForm, setShowVisitForm] = useState(false);

  useEffect(() => {
    const loadAnimal = async () => {
      const animals = await base44.entities.Animal.filter({ id });
      if (animals.length > 0) setAnimal(animals[0]);
      setLoading(false);
    };
    loadAnimal();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-muted border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <h2 className="font-heading text-2xl font-semibold mb-2">Animal Not Found</h2>
        <p className="text-muted-foreground font-body mb-6">This soul may have already found their forever home.</p>
        <Link to="/gallery" className="text-accent font-body font-medium hover:underline">← Back to Gallery</Link>
      </div>
    );
  }

  const allPhotos = [animal.photo_url, ...(animal.gallery_urls || [])].filter(Boolean);

  return (
    <div className="min-h-screen pb-20">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-body transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left: Story & Photos */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Photo */}
              <div className="rounded-2xl overflow-hidden mb-4">
                <img
                  src={animal.photo_url || "/placeholder.jpg"}
                  alt={animal.name}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>

              {/* Gallery */}
              {allPhotos.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {allPhotos.slice(1, 4).map((url, i) => (
                    <div key={i} className="rounded-xl overflow-hidden">
                      <img
                        src={url}
                        alt={`${animal.name} photo ${i + 2}`}
                        className="w-full aspect-square object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Rescue Story */}
              {animal.rescue_story && (
                <div className="mt-10 p-6 rounded-2xl bg-muted/60 border-l-4 border-accent">
                  <p className="text-xs font-body font-medium tracking-[0.15em] uppercase text-accent mb-3">
                    How {animal.name} Came to Us
                  </p>
                  <p className="font-body text-base leading-relaxed text-foreground/80">{animal.rescue_story}</p>
                  {animal.rescue_date && (
                    <p className="font-body text-xs text-muted-foreground mt-3">
                      Arrived {new Date(animal.rescue_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                  )}
                </div>
              )}

              {/* Bio Section */}
              <div className="mt-10">
                <h2 className="font-heading text-2xl font-semibold mb-4">About {animal.name}</h2>
                <p className="text-muted-foreground font-body leading-relaxed text-base">
                  {animal.bio || `${animal.name} is a wonderful ${animal.age} old ${animal.gender?.toLowerCase()} ${animal.species?.toLowerCase()} looking for a connection. Every day in the shelter is a day closer to an uncertain future. Your virtual adoption can change that.`}
                </p>

                {animal.personality_tags && animal.personality_tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-heading text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">
                      Personality
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {animal.personality_tags.map((tag) => (
                        <span key={tag} className="px-3 py-1.5 bg-accent/10 text-accent font-body text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Keeper's Note */}
              <div className="mt-8">
                <KeeperNote note={animal.keeper_note} keeperName={animal.keeper_name} animalName={animal.name} />
              </div>

              {/* Update Preview */}
              <div className="mt-10 p-6 rounded-2xl bg-muted/50 border border-border">
                <h3 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-accent" />
                  What You'll Receive
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: "📸", label: "Photo Updates", desc: "Regular photos of daily life" },
                    { icon: "🎥", label: "Video Moments", desc: "Play time, walks & adventures" },
                    { icon: "📋", label: "Health Reports", desc: "Vet visits & milestones" },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-4">
                      <span className="text-2xl mb-2 block">{item.icon}</span>
                      <p className="font-body font-medium text-sm">{item.label}</p>
                      <p className="font-body text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Sticky Sidebar */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Animal Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <h1 className="font-heading text-3xl font-bold mb-1">{animal.name}</h1>
                <p className="font-handwritten text-xl text-accent -rotate-1 mb-4" aria-label={animal.trait}>
                  "{animal.trait}"
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm font-body">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{animal.age} · {animal.gender}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-body">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{animal.location}</span>
                  </div>
                  {animal.breed && (
                    <div className="flex items-center gap-3 text-sm font-body">
                      <Heart className="w-4 h-4 text-muted-foreground" />
                      <span>{animal.breed} · {animal.species}</span>
                    </div>
                  )}
                  {animal.weight && (
                    <div className="flex items-center gap-3 text-sm font-body">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{animal.weight}</span>
                    </div>
                  )}
                </div>
                {animal.virtual_adopters_count > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground font-body">
                      <span className="text-accent font-semibold">{animal.virtual_adopters_count}</span> virtual parents bonded
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Journey Milestones */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
              >
                <AnimalJourney
                  milestones={animal.milestones}
                  rescueDate={animal.rescue_date}
                  name={animal.name}
                />
              </motion.div>

              {/* Donation Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <DonationWidget animal={animal} onAdopted={() => {
                  setAnimal(prev => ({ ...prev, virtual_adopters_count: (prev.virtual_adopters_count || 0) + 1 }));
                }} />
              </motion.div>

              {/* Visit / Physical Adoption */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <h3 className="font-heading text-lg font-semibold mb-2">
                  Want to Meet {animal.name}?
                </h3>
                <p className="text-sm text-muted-foreground font-body mb-4 leading-relaxed">
                  Schedule a visit to meet in person, take them out for a day,
                  or inquire about giving them their forever home.
                </p>
                {showVisitForm ? (
                  <VisitRequestForm animal={animal} onClose={() => setShowVisitForm(false)} />
                ) : (
                  <button
                    onClick={() => setShowVisitForm(true)}
                    className="w-full py-3 rounded-xl border-2 border-primary text-primary font-body font-medium text-sm hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    Schedule a Visit
                  </button>
                )}
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}