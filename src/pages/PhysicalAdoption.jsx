import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Home, Phone, Mail, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = ["Choose an Animal", "Your Details", "Home & Lifestyle", "Agreement"];

const adoptionSteps = [
  {
    num: "01",
    title: "Browse & Choose",
    desc: "Browse available animals below and select the one you'd like to adopt. Read their story, meet their personality, and find your match.",
  },
  {
    num: "02",
    title: "Submit This Application",
    desc: "Complete the online application — it takes about 5 minutes. This helps us understand your lifestyle so we can ensure a great match.",
  },
  {
    num: "03",
    title: "Application Review",
    desc: "Our team reviews your application within 1–2 business days. We may reach out with a few follow-up questions.",
  },
  {
    num: "04",
    title: "Meet & Greet (In Person)",
    desc: "If approved, we'll schedule an in-person meet-and-greet at the shelter. This is where the real magic happens.",
  },
  {
    num: "05",
    title: "Finalise at the Shelter",
    desc: "The final steps — paperwork, adoption fee, and taking your new family member home — are completed in person at the shelter.",
  },
];

const adoptionFees = [
  { label: "Puppies (under 5 months)", fee: "$295" },
  { label: "Medium & Large Adult Dogs (over 5 months)", fee: "$175" },
  { label: "Small Breed Adults (under 25 lbs, over 5 months)", fee: "$300" },
];

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ hasError, ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-xl bg-muted border-2 font-body text-sm focus:ring-2 focus:ring-accent outline-none transition-colors ${
        hasError ? "border-red-400 bg-red-50 focus:ring-red-400" : "border-transparent"
      }`}
    />
  );
}

function Textarea({ hasError, ...props }) {
  return (
    <textarea
      {...props}
      rows={3}
      className={`w-full px-4 py-3 rounded-xl bg-muted border-2 font-body text-sm focus:ring-2 focus:ring-accent outline-none resize-none transition-colors ${
        hasError ? "border-red-400 bg-red-50 focus:ring-red-400" : "border-transparent"
      }`}
    />
  );
}

function Select({ hasError, children, ...props }) {
  return (
    <select
      {...props}
      className={`w-full px-4 py-3 rounded-xl bg-muted border-2 font-body text-sm focus:ring-2 focus:ring-accent outline-none transition-colors ${
        hasError ? "border-red-400 bg-red-50 focus:ring-red-400" : "border-transparent"
      }`}
    >
      {children}
    </select>
  );
}

function YesNo({ value, onChange, hasError }) {
  return (
    <div className={`flex gap-3 rounded-xl p-0.5 ${hasError ? "ring-2 ring-red-400" : ""}`}>
      {[true, false].map((v) => (
        <button type="button" key={String(v)} onClick={() => onChange(v)}
          className={`flex-1 py-3 rounded-xl text-sm font-body font-medium transition-all ${
            value === v ? "bg-accent text-accent-foreground" : "bg-muted text-foreground hover:bg-muted/80"
          }`}>
          {v ? "Yes" : "No"}
        </button>
      ))}
    </div>
  );
}

export default function PhysicalAdoption() {
  const [animals, setAnimals] = useState([]);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showFees, setShowFees] = useState(false);

  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "",
    street_address: "", city: "", state: "", zip: "",
    housing_type: "", own_or_rent: "",
    landlord_allows_pets: null,
    household_adults: "", household_children: "",
    current_pets: "", previous_pets: "",
    reason_for_adoption: "", hours_alone_per_day: "",
    emergency_contact: "", agreed_to_terms: false,
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const err = (k) => !!fieldErrors[k];

  useEffect(() => {
    base44.entities.Animal.filter({ adoption_status: "available" }, "-created_date", 30)
      .then(data => { setAnimals(data); setLoadingAnimals(false); });
  }, []);

  const validateStep = () => {
    let e = {};
    if (step === 0 && !selectedAnimal) return { animal: true };
    if (step === 1) {
      if (!form.first_name) e.first_name = true;
      if (!form.last_name) e.last_name = true;
      if (!form.email) e.email = true;
      if (!form.phone) e.phone = true;
      if (!form.street_address) e.street_address = true;
      if (!form.city) e.city = true;
      if (!form.state) e.state = true;
      if (!form.zip) e.zip = true;
    }
    if (step === 2) {
      if (!form.housing_type) e.housing_type = true;
      if (!form.own_or_rent) e.own_or_rent = true;
      if (form.own_or_rent === "rent" && form.landlord_allows_pets === null) e.landlord_allows_pets = true;
      if (!form.household_adults) e.household_adults = true;
      if (!form.reason_for_adoption) e.reason_for_adoption = true;
      if (!form.hours_alone_per_day) e.hours_alone_per_day = true;
      if (!form.emergency_contact) e.emergency_contact = true;
    }
    if (step === 3 && !form.agreed_to_terms) e.agreed_to_terms = true;
    return e;
  };

  const handleNext = () => {
    const errors = validateStep();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    const errors = validateStep();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setLoading(true);
    await base44.entities.PhysicalAdoptionApplication.create({
      ...form,
      animal_id: selectedAnimal.id,
      animal_name: selectedAnimal.name,
      status: "pending",
    });
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-accent" />
          </div>
          <h2 className="font-heading text-3xl font-semibold mb-3">Application Received!</h2>
          <p className="text-muted-foreground font-body text-base leading-relaxed mb-4">
            Thank you for applying to adopt <strong>{selectedAnimal?.name}</strong>. Our team will review your application within 1–2 business days and be in touch to discuss next steps.
          </p>
          <p className="text-sm text-muted-foreground font-body mb-6">
            The final steps — paperwork, adoption fee, and bringing your new companion home — will be completed <strong>in person at the shelter</strong>. We can't wait to meet you!
          </p>
          <div className="p-4 rounded-xl bg-muted text-sm font-body text-muted-foreground mb-6 text-left space-y-1">
            <p className="font-medium text-foreground mb-2">Questions? Contact us:</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-accent" /> 352-373-5855</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-accent" /> info@humanesocietyncfl.org</p>
          </div>
          <Link to="/gallery" className="text-accent font-body font-medium hover:underline">← Back to Gallery</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="pt-14 pb-10 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">
          <p className="text-sm font-body font-medium tracking-[0.2em] uppercase text-accent mb-3">Give Them a Forever Home</p>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground leading-tight mb-5">
            Physical <span className="italic text-accent">Adoption</span>
          </h1>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            Ready to make it official? Browse our available animals, complete this application to start the process, and our team will guide you through every step to bring them home.
          </p>
        </motion.div>
      </section>

      {/* Process Steps */}
      <section className="py-12 bg-primary text-primary-foreground px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-body uppercase tracking-widest text-accent mb-10">The Adoption Journey</p>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
            {adoptionSteps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center">
                <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center mx-auto mb-3">
                  <span className="text-accent font-heading font-bold text-sm">{s.num}</span>
                </div>
                <h3 className="font-heading text-sm font-semibold mb-2">{s.title}</h3>
                <p className="text-xs text-primary-foreground/65 font-body leading-relaxed">{s.desc}</p>
                {i < adoptionSteps.length - 1 && (
                  <div className="hidden sm:block absolute" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Important note */}
          <div className="mt-10 p-5 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 max-w-2xl mx-auto text-center">
            <p className="text-sm font-body text-primary-foreground/80 leading-relaxed">
              <strong className="text-primary-foreground">Please note:</strong> The final completion of your adoption — signing paperwork, paying the adoption fee, and taking your pet home — <strong className="text-accent">must be done in person at the shelter</strong>. This application starts the process. For exceptions or special circumstances, please contact us directly.
            </p>
          </div>
        </div>
      </section>

      {/* Adoption Fees Accordion */}
      <section className="py-8 px-6 max-w-2xl mx-auto">
        <button
          onClick={() => setShowFees(!showFees)}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border font-body text-sm font-medium hover:border-accent/40 transition-colors"
        >
          <span className="flex items-center gap-2"><Home className="w-4 h-4 text-accent" /> View Adoption Fees</span>
          {showFees ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        <AnimatePresence>
          {showFees && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="p-4 border border-t-0 border-border rounded-b-xl bg-card space-y-3">
                {adoptionFees.map((f, i) => (
                  <div key={i} className="flex justify-between items-center text-sm font-body">
                    <span className="text-muted-foreground">{f.label}</span>
                    <span className="font-semibold text-accent">{f.fee}</span>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground font-body pt-2 border-t border-border">
                  All animals are spayed/neutered, microchipped, heartworm tested (if over 1 year), and up-to-date on vaccinations.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Application */}
      <div className="max-w-2xl mx-auto px-6">
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-body font-semibold transition-all ${
                i < step ? "bg-accent text-white" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-xs font-body hidden sm:block ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{label}</span>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border" />}
            </div>
          ))}
        </div>

        {Object.keys(fieldErrors).length > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-body mb-5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Please fill in all highlighted fields before continuing.
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
            className="bg-card rounded-2xl border border-border p-6 md:p-8 space-y-5">

            {/* STEP 0: Choose Animal */}
            {step === 0 && (
              <>
                <h2 className="font-heading text-xl font-semibold">Who Would You Like to Adopt?</h2>
                <p className="text-sm text-muted-foreground font-body">Select the animal you'd like to apply to adopt. Only animals currently available are shown.</p>

                {fieldErrors.animal && (
                  <p className="text-xs text-red-500 font-body">Please select an animal to continue.</p>
                )}

                {loadingAnimals ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-4 border-muted border-t-accent rounded-full animate-spin" />
                  </div>
                ) : animals.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground font-body">No animals are currently listed as available for adoption.</p>
                    <p className="text-xs text-muted-foreground font-body mt-2">Please check back soon or contact us directly.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {animals.map(animal => (
                      <button
                        key={animal.id}
                        type="button"
                        onClick={() => setSelectedAnimal(animal)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                          selectedAnimal?.id === animal.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/40"
                        }`}
                      >
                        <img src={animal.photo_url || "/placeholder.jpg"} alt={animal.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-heading text-base font-semibold">{animal.name}</p>
                          <p className="text-xs text-muted-foreground font-body mt-0.5">{animal.breed || animal.species} · {animal.age} · {animal.gender}</p>
                          {animal.trait && <p className="font-handwritten text-sm text-accent mt-0.5">"{animal.trait}"</p>}
                        </div>
                        {selectedAnimal?.id === animal.id && <Check className="w-5 h-5 text-accent shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* STEP 1: Contact */}
            {step === 1 && (
              <>
                <h2 className="font-heading text-xl font-semibold">Your Contact Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" required><Input hasError={err("first_name")} value={form.first_name} onChange={e => set("first_name", e.target.value)} placeholder="Jane" /></Field>
                  <Field label="Last Name" required><Input hasError={err("last_name")} value={form.last_name} onChange={e => set("last_name", e.target.value)} placeholder="Smith" /></Field>
                </div>
                <Field label="Email Address" required><Input hasError={err("email")} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="jane@email.com" /></Field>
                <Field label="Phone Number" required><Input hasError={err("phone")} type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+1 (000) 000-0000" /></Field>
                <Field label="Street Address" required><Input hasError={err("street_address")} value={form.street_address} onChange={e => set("street_address", e.target.value)} placeholder="123 Maple Street" /></Field>
                <div className="grid grid-cols-3 gap-4">
                  <Field label="City" required><Input hasError={err("city")} value={form.city} onChange={e => set("city", e.target.value)} placeholder="City" /></Field>
                  <Field label="State" required><Input hasError={err("state")} value={form.state} onChange={e => set("state", e.target.value)} placeholder="FL" /></Field>
                  <Field label="Zip" required><Input hasError={err("zip")} value={form.zip} onChange={e => set("zip", e.target.value)} placeholder="00000" /></Field>
                </div>
              </>
            )}

            {/* STEP 2: Home & Lifestyle */}
            {step === 2 && (
              <>
                <h2 className="font-heading text-xl font-semibold">Home & Lifestyle</h2>

                <Field label="Type of Home" required>
                  <Select hasError={err("housing_type")} value={form.housing_type} onChange={e => set("housing_type", e.target.value)}>
                    <option value="">Select...</option>
                    <option value="house_with_yard">House with yard</option>
                    <option value="house_no_yard">House without yard</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="other">Other</option>
                  </Select>
                </Field>

                <Field label="Do you own or rent?" required>
                  <div className="flex gap-3">
                    {["own", "rent"].map(v => (
                      <button type="button" key={v} onClick={() => set("own_or_rent", v)}
                        className={`flex-1 py-3 rounded-xl text-sm font-body font-medium capitalize transition-all ${
                          form.own_or_rent === v ? "bg-accent text-accent-foreground" : "bg-muted text-foreground hover:bg-muted/80"
                        } ${err("own_or_rent") ? "ring-2 ring-red-400" : ""}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </Field>

                {form.own_or_rent === "rent" && (
                  <Field label="Does your landlord allow pets?" required>
                    <YesNo hasError={err("landlord_allows_pets")} value={form.landlord_allows_pets} onChange={v => set("landlord_allows_pets", v)} />
                  </Field>
                )}

                <Field label="Number of adults in household" required>
                  <Input hasError={err("household_adults")} value={form.household_adults} onChange={e => set("household_adults", e.target.value)} placeholder="e.g. 2 adults" />
                </Field>

                <Field label="Children in household (include ages)">
                  <Input value={form.household_children} onChange={e => set("household_children", e.target.value)} placeholder="e.g. 2 children, ages 6 and 9 — or None" />
                </Field>

                <Field label="Current pets in your home">
                  <Textarea value={form.current_pets} onChange={e => set("current_pets", e.target.value)} placeholder="List any dogs, cats, or other pets. If none, write None." />
                </Field>

                <Field label="Previous experience with pets">
                  <Textarea value={form.previous_pets} onChange={e => set("previous_pets", e.target.value)} placeholder="Tell us about your history with pets — breeds, how long, what happened to them, etc." />
                </Field>

                <Field label="Why do you want to adopt?" required>
                  <Textarea hasError={err("reason_for_adoption")} value={form.reason_for_adoption} onChange={e => set("reason_for_adoption", e.target.value)} placeholder="Tell us about your lifestyle and why you feel ready to adopt." />
                </Field>

                <Field label="How many hours per day would the dog be alone?" required>
                  <Input hasError={err("hours_alone_per_day")} value={form.hours_alone_per_day} onChange={e => set("hours_alone_per_day", e.target.value)} placeholder="e.g. 3–4 hours on weekdays" />
                </Field>

                <Field label="Emergency Contact (Name, Phone, Relationship)" required>
                  <Input hasError={err("emergency_contact")} value={form.emergency_contact} onChange={e => set("emergency_contact", e.target.value)} placeholder="e.g. Sarah Smith, 555-1234, sister" />
                </Field>
              </>
            )}

            {/* STEP 3: Agreement */}
            {step === 3 && (
              <>
                <h2 className="font-heading text-xl font-semibold">Agreement & Next Steps</h2>

                <div className="p-4 rounded-xl bg-muted/60 border border-border text-xs font-body text-muted-foreground leading-relaxed space-y-3">
                  <p><strong className="text-foreground">This is the beginning of the process.</strong> Submitting this application does not guarantee adoption. Our team will review your information and contact you within 1–2 business days.</p>
                  <p><strong className="text-foreground">In-Person Requirement.</strong> All final steps — including signing the adoption agreement, paying the adoption fee, and taking your new pet home — must be completed in person at our shelter. No exceptions can be made to this requirement.</p>
                  <p><strong className="text-foreground">Meet-and-Greet.</strong> If your application is approved, we will schedule a supervised meet-and-greet between you and the animal at the shelter before finalising the adoption.</p>
                  <p><strong className="text-foreground">Questions or Exceptions.</strong> For special circumstances, accessibility needs, or any other questions, please contact us at <span className="text-foreground font-medium">352-373-5855</span> or <span className="text-foreground font-medium">info@humanesocietyncfl.org</span>. If you reach our voicemail, we will return your call within 24 hours.</p>
                </div>

                <label className={`flex items-start gap-3 cursor-pointer mt-2 p-3 rounded-xl transition-colors ${err("agreed_to_terms") ? "bg-red-50 ring-2 ring-red-400" : ""}`}>
                  <input type="checkbox" checked={form.agreed_to_terms} onChange={e => set("agreed_to_terms", e.target.checked)} className="accent-accent mt-0.5" />
                  <span className="text-sm font-body text-foreground leading-relaxed">
                    I understand that this application starts the adoption process and that finalising the adoption requires an in-person visit to the shelter. I agree that all information provided is accurate. <span className="text-accent">*</span>
                  </span>
                </label>

                {/* Contact block */}
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 space-y-2">
                  <p className="text-xs font-body font-medium text-foreground uppercase tracking-wider">Need help? Contact us</p>
                  <a href="tel:3523735855" className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                    <Phone className="w-4 h-4 text-accent" /> 352-373-5855
                  </a>
                  <a href="mailto:info@humanesocietyncfl.org" className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                    <Mail className="w-4 h-4 text-accent" /> info@humanesocietyncfl.org
                  </a>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 0 ? (
            <Button variant="outline" onClick={() => { setFieldErrors({}); setStep(s => s - 1); }} className="font-body">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          ) : (
            <Link to="/gallery">
              <Button variant="outline" className="font-body"><ArrowLeft className="w-4 h-4 mr-2" /> Gallery</Button>
            </Link>
          )}

          {step < STEPS.length - 1 ? (
            <Button onClick={handleNext} className="bg-accent hover:bg-accent/90 text-accent-foreground font-body">
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="bg-accent hover:bg-accent/90 text-accent-foreground font-body">
              {loading ? <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" /> : <><Check className="w-4 h-4 mr-2" /> Submit Application</>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}