import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Heart, Home, Users, DollarSign } from "lucide-react";

export default function StatsBar() {
  const [stats, setStats] = useState({
    livesSaved: 0,
    foreverHomes: 0,
    virtualParents: 0,
    raised: 0,
  });

  const loadStats = async () => {
    const [animals, virtualAdoptions, donations, physicalApps] = await Promise.all([
      base44.entities.Animal.list("-created_date", 500),
      base44.entities.VirtualAdoption.filter({ status: "active" }, "-created_date", 500),
      base44.entities.Donation.list("-created_date", 500),
      base44.entities.PhysicalAdoptionApplication.filter({ status: "approved" }, "-created_date", 500),
    ]);

    const foreverHomes = animals.filter(a => a.adoption_status === "physically_adopted").length;
    const virtualParents = virtualAdoptions.length;
    const livesSaved = animals.filter(a =>
      a.adoption_status === "physically_adopted" || a.adoption_status === "virtually_adopted"
    ).length;

    const donationTotal = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const virtualTotal = virtualAdoptions.reduce((sum, v) => sum + (v.total_donated || 0), 0);
    const raised = donationTotal + virtualTotal;

    setStats({ livesSaved, foreverHomes, virtualParents, raised });
  };

  useEffect(() => {
    loadStats();

    // Real-time subscriptions — update stats whenever relevant entities change
    const unsubAnimal = base44.entities.Animal.subscribe(() => loadStats());
    const unsubVirtual = base44.entities.VirtualAdoption.subscribe(() => loadStats());
    const unsubDonation = base44.entities.Donation.subscribe(() => loadStats());
    const unsubPhysical = base44.entities.PhysicalAdoptionApplication.subscribe(() => loadStats());

    return () => {
      unsubAnimal();
      unsubVirtual();
      unsubDonation();
      unsubPhysical();
    };
  }, []);

  const formatRaised = (n) => {
    if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
    return `$${n}`;
  };

  const displayStats = [
    { icon: Heart, label: "Lives Saved", value: stats.livesSaved, color: "text-accent" },
    { icon: Home, label: "Forever Homes Found", value: stats.foreverHomes, color: "text-foreground" },
    { icon: Users, label: "Virtual Parents", value: stats.virtualParents, color: "text-secondary" },
    { icon: DollarSign, label: "Raised for Shelter", value: formatRaised(stats.raised), color: "text-accent" },
  ];

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {displayStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <stat.icon className="w-5 h-5 mx-auto mb-3 text-accent" />
              <p className="font-heading text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm font-body text-primary-foreground/60">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}