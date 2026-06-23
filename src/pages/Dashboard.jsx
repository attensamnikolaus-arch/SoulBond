import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import ManageBondModal from "../components/ManageBondModal";
import { motion } from "framer-motion";
import { Heart, ArrowRight, Calendar, DollarSign } from "lucide-react";
import UpdateTimeline from "../components/UpdateTimeline";
import moment from "moment";

export default function Dashboard() {
  const [adoptions, setAdoptions] = useState([]);
  const [animals, setAnimals] = useState({});
  const [updates, setUpdates] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnimalId, setSelectedAnimalId] = useState(null);
  const [managingAdoption, setManagingAdoption] = useState(null);

  const loadData = async () => {
      const user = await base44.auth.me();
      const myAdoptions = await base44.entities.VirtualAdoption.filter(
        { donor_email: user.email, status: "active" },
        "-created_date"
      );
      setAdoptions(myAdoptions);

      const animalMap = {};
      for (const adoption of myAdoptions) {
        const animalData = await base44.entities.Animal.filter({ id: adoption.animal_id });
        if (animalData.length > 0) animalMap[adoption.animal_id] = animalData[0];
      }
      setAnimals(animalMap);

      if (myAdoptions.length > 0) {
        setSelectedAnimalId(myAdoptions[0].animal_id);
        const allUpdates = await base44.entities.AnimalUpdate.filter(
          { animal_id: myAdoptions[0].animal_id },
          "-created_date",
          20
        );
        setUpdates(allUpdates);
      }

      const myVisits = await base44.entities.VisitRequest.filter(
        { visitor_email: user.email },
        "-created_date"
      );
      setVisits(myVisits);
      setLoading(false);
    };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectAnimal = async (animalId) => {
    setSelectedAnimalId(animalId);
    const animalUpdates = await base44.entities.AnimalUpdate.filter(
      { animal_id: animalId },
      "-created_date",
      20
    );
    setUpdates(animalUpdates);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-muted border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (adoptions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-accent" />
          </div>
          <h1 className="font-heading text-3xl font-semibold mb-3">No Bonds Yet</h1>
          <p className="text-muted-foreground font-body max-w-md leading-relaxed mb-8">
            You haven't virtually adopted any animals yet. Browse our gallery to find 
            the soul that speaks to your heart.
          </p>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-body font-medium rounded-full hover:bg-accent/90 transition-all"
          >
            Browse Animals
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  const selectedAnimal = animals[selectedAnimalId];
  const selectedAdoption = adoptions.find(a => a.animal_id === selectedAnimalId);

  return (
    <div className="min-h-screen pb-20">
      {managingAdoption && (
        <ManageBondModal
          adoption={managingAdoption}
          animal={animals[managingAdoption.animal_id]}
          onClose={() => setManagingAdoption(null)}
          onUpdated={() => { setManagingAdoption(null); loadData(); }}
        />
      )}
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm font-body font-medium tracking-[0.2em] uppercase text-accent mb-2">
            Your Bonds
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-8">
            The Nexus Dashboard
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar: Adopted Animals */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              My Animals
            </h3>
            {adoptions.map((adoption) => {
              const animal = animals[adoption.animal_id];
              const isSelected = selectedAnimalId === adoption.animal_id;
              return (
                <button
                  key={adoption.id}
                  onClick={() => handleSelectAnimal(adoption.animal_id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                    isSelected
                      ? "bg-accent/10 border-2 border-accent"
                      : "bg-card border border-border hover:border-accent/30"
                  }`}
                >
                  <img
                    src={animal?.photo_url || "/placeholder.jpg"}
                    alt={adoption.animal_name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-sm font-semibold truncate">{adoption.animal_name}</p>
                    <p className="text-xs text-muted-foreground font-body">
                      ${adoption.monthly_amount}/mo · {adoption.update_frequency}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* Visit Requests */}
            {visits.length > 0 && (
              <div className="mt-8">
                <h3 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Visit Requests
                </h3>
                {visits.map((visit) => (
                  <div key={visit.id} className="p-3 bg-card rounded-xl border border-border mb-2">
                    <p className="font-body text-sm font-medium">{visit.animal_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-body">
                        {moment(visit.preferred_date).format("MMM D, YYYY")}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-body capitalize ${
                        visit.status === "approved" ? "bg-green-100 text-green-700" :
                        visit.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {visit.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main: Selected Animal Details & Updates */}
          <div className="lg:col-span-3">
            {selectedAnimal && (
              <motion.div
                key={selectedAnimalId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Animal Header */}
                <div className="bg-card rounded-2xl border border-border p-6 mb-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <img
                      src={selectedAnimal.photo_url || "/placeholder.jpg"}
                      alt={selectedAnimal.name}
                      className="w-full sm:w-40 h-40 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h2 className="font-heading text-2xl font-bold mb-1">{selectedAnimal.name}</h2>
                      <p className="font-handwritten text-lg text-accent mb-3" aria-label={selectedAnimal.trait}>
                        "{selectedAnimal.trait}"
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-accent" />
                          <div>
                            <p className="font-body text-xs text-muted-foreground">Monthly</p>
                            <p className="font-body text-sm font-semibold">${selectedAdoption?.monthly_amount}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-accent" />
                          <div>
                            <p className="font-body text-xs text-muted-foreground">Bonded Since</p>
                            <p className="font-body text-sm font-semibold">
                              {moment(selectedAdoption?.created_date).format("MMM D, YYYY")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <Link
                          to={`/animal/${selectedAnimalId}`}
                          className="text-xs font-body font-medium text-accent hover:underline"
                        >
                          View Full Profile →
                        </Link>
                        <button
                          onClick={() => setManagingAdoption(selectedAdoption)}
                          className="text-xs font-body font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Manage Bond
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Updates Timeline */}
                <div>
                  <h3 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                    Timeline of Impact
                  </h3>
                  <UpdateTimeline updates={updates} />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}