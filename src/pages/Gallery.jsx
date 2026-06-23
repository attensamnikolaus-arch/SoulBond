import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import AnimalCard from "../components/AnimalCard";

const speciesFilters = ["All", "Dog", "Cat", "Rabbit", "Bird", "Other"];

export default function Gallery() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecies, setSelectedSpecies] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadAnimals = async () => {
      const data = await base44.entities.Animal.list("-created_date", 50);
      setAnimals(data);
      setLoading(false);
    };
    loadAnimals();
  }, []);

  const filteredAnimals = animals.filter((animal) => {
    const matchesSpecies = selectedSpecies === "All" || animal.species === selectedSpecies;
    const matchesSearch =
      !searchQuery ||
      animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.trait?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.breed?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecies && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-body font-medium tracking-[0.2em] uppercase text-accent mb-3">
              The Kinship Gallery
            </p>
            <h1 className="font-heading text-3xl md:text-5xl font-semibold text-foreground mb-4">
              Every Soul Deserves a Bond
            </h1>
            <p className="text-muted-foreground font-body max-w-lg mx-auto leading-relaxed mb-10">
              Browse the animals waiting for a connection. Each one is unique, each one matters.
            </p>
          </motion.div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, breed, or trait..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border font-body text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Species Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {speciesFilters.map((species) => (
              <button
                key={species}
                onClick={() => setSelectedSpecies(species)}
                className={`px-5 py-2 rounded-full text-sm font-body font-medium transition-all ${
                  selectedSpecies === species
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {species}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-muted border-t-accent rounded-full animate-spin" />
            </div>
          ) : filteredAnimals.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-body text-lg">
                No animals found matching your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredAnimals.map((animal, i) => (
                <AnimalCard key={animal.id} animal={animal} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}