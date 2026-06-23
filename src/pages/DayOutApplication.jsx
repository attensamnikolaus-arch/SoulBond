import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, AlertCircle, Shield } from "lucide-react";

const STEPS = ["Your Details", "Eligibility", "Agreement"];

function getAge(dobString) {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (isNaN(dob)) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

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

function YesNo({ value, onChange, hasError }) {
  return (
    <div className={`flex gap-3 rounded-xl p-0.5 ${hasError ? "ring-2 ring-red-400" : ""}`}>
      {[true, false].map((v) => (
        <button
          type="button"
          key={String(v)}
          onClick={() => onChange(v)}
          className={`flex-1 py-3 rounded-xl text-sm font-body font-medium transition-all ${
            value === v ? "bg-accent text-accent-foreground" : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          {v ? "Yes" : "No"}
        </button>
      ))}
    </div>
  );
}

export default function DayOutApplication() {
  const { animalId, animalName } = useParams();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showMinorModal, setShowMinorModal] = useState(false);
  const [minorAcknowledged, setMinorAcknowledged] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    first_name: "", last_name: "", co_applicant: "",
    street_address: "", city: "", state: "", zip: "",
    primary_phone: "", secondary_phone: "",
    date_of_birth: "", preferred_date: "",
    household_members: "", pets_in_household: "",
    pets_vaccinated: "", planned_activities: "", dog_housing: "",
    can_administer_medication: null, has_transport: null,
    comfortable_high_energy: null, energy_preference: "",
    emergency_contact: "", agreed_to_terms: false,
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const err = (key) => !!fieldErrors[key];

  const handleDobChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
    if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5);
    if (val.length > 10) val = val.slice(0, 10);
    set("date_of_birth", val);
    setMinorAcknowledged(false);
  };

  const handleDobBlur = () => {
    const age = getAge(form.date_of_birth);
    if (age !== null && age < 18 && !minorAcknowledged) {
      setShowMinorModal(true);
    }
  };

  const getStep0Errors = () => {
    const e = {};
    if (!form.first_name) e.first_name = true;
    if (!form.last_name) e.last_name = true;
    if (!form.street_address) e.street_address = true;
    if (!form.city) e.city = true;
    if (!form.state) e.state = true;
    if (!form.zip) e.zip = true;
    if (!form.primary_phone) e.primary_phone = true;
    if (!form.date_of_birth) e.date_of_birth = true;
    if (!form.preferred_date) e.preferred_date = true;
    const age = getAge(form.date_of_birth);
    if (form.date_of_birth && age === null) e.date_of_birth = true;
    return e;
  };

  const getStep1Errors = () => {
    const e = {};
    if (!form.household_members) e.household_members = true;
    if (!form.pets_in_household) e.pets_in_household = true;
    if (!form.pets_vaccinated) e.pets_vaccinated = true;
    if (!form.planned_activities) e.planned_activities = true;
    if (!form.dog_housing) e.dog_housing = true;
    if (!form.emergency_contact) e.emergency_contact = true;
    if (form.can_administer_medication === null) e.can_administer_medication = true;
    if (form.has_transport === null) e.has_transport = true;
    if (form.comfortable_high_energy === null) e.comfortable_high_energy = true;
    return e;
  };

  const handleNext = () => {
    const errors = step === 0 ? getStep0Errors() : getStep1Errors();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    if (step === 0) {
      const age = getAge(form.date_of_birth);
      if (age !== null && age < 18 && !minorAcknowledged) {
        setShowMinorModal(true);
        return;
      }
    }
    setFieldErrors({});
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (!form.agreed_to_terms) {
      setFieldErrors({ agreed_to_terms: true });
      return;
    }
    setLoading(true);
    await base44.entities.DayOutApplication.create({
      ...form,
      animal_id: animalId || "general",
      animal_name: animalName ? decodeURIComponent(animalName) : "Not specified",
      status: "pending",
    });
    setSuccess(true);
    setLoading(false);
  };

  const MinorModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl border border-border p-7 max-w-md w-full shadow-2xl"
      >
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
          <Shield className="w-6 h-6 text-amber-600" />
        </div>
        <h3 className="font-heading text-xl font-semibold mb-2">Guardian Required</h3>
        <p className="text-sm font-body text-muted-foreground leading-relaxed mb-4">
          Because you are under 18, a parent or legal guardian <strong className="text-foreground">must be present</strong> to pick up the dog and accompany you throughout the outing. The guardian:
        </p>
        <ul className="text-sm font-body text-muted-foreground space-y-1.5 mb-5">
          {[
            "Must be 18 or older",
            "Must be present at pickup and drop-off",
            "Bears full legal responsibility for the dog during the outing",
            "Must agree to all shelter rules and the liability waiver on your behalf",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2"><span className="text-accent mt-0.5">✦</span>{item}</li>
          ))}
        </ul>
        <label className="flex items-start gap-3 cursor-pointer mb-5">
          <input type="checkbox" id="minor-ack" className="accent-accent mt-0.5" />
          <span className="text-sm font-body text-foreground leading-relaxed">
            I understand and acknowledge that a supervising guardian will be present and will carry full responsibility for the dog.
          </span>
        </label>
        <Button
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-body"
          onClick={() => {
            const cb = document.getElementById("minor-ack");
            if (!cb.checked) { alert("Please check the box to acknowledge."); return; }
            setMinorAcknowledged(true);
            setShowMinorModal(false);
          }}
        >
          I Acknowledge & Continue
        </Button>
      </motion.div>
    </div>
  );

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-accent" />
          </div>
          <h2 className="font-heading text-3xl font-semibold mb-3">Application Submitted!</h2>
          <p className="text-muted-foreground font-body text-base leading-relaxed mb-6">
            Thank you! We'll review your Day Out application and be in touch within 1–2 business days to confirm your visit.
          </p>
          <Link to="/gallery" className="text-accent font-body font-medium hover:underline">← Back to Gallery</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {showMinorModal && <MinorModal />}

      <div className="max-w-2xl mx-auto px-6 py-6">
        <Link to={animalId ? `/animal/${animalId}` : "/gallery"} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-body transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        <div className="mb-8">
          <p className="text-sm font-body font-medium tracking-[0.2em] uppercase text-accent mb-2">Doggie Day Out</p>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-2">
            {animalName ? `Take ${decodeURIComponent(animalName)} for a Day` : "Day Out Application"}
          </h1>
          <p className="text-muted-foreground font-body text-sm leading-relaxed">
            Give a shelter dog a break — and a memory. Complete this short application so we can ensure every outing is safe and wonderful for both of you.
          </p>
        </div>

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

        {/* Validation banner */}
        {Object.keys(fieldErrors).length > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-body mb-5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Please fill in all highlighted fields correctly before continuing.
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="bg-card rounded-2xl border border-border p-6 md:p-8 space-y-5"
          >
            {/* STEP 0 */}
            {step === 0 && (
              <>
                <h2 className="font-heading text-xl font-semibold">Your Contact Information</h2>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" required>
                    <Input hasError={err("first_name")} value={form.first_name} onChange={e => set("first_name", e.target.value)} placeholder="Jane" />
                  </Field>
                  <Field label="Last Name" required>
                    <Input hasError={err("last_name")} value={form.last_name} onChange={e => set("last_name", e.target.value)} placeholder="Smith" />
                  </Field>
                </div>

                <Field label="Spouse / Partner / Roommate to put on record">
                  <Input value={form.co_applicant} onChange={e => set("co_applicant", e.target.value)} placeholder="Optional" />
                </Field>

                <Field label="Street Address" required>
                  <Input hasError={err("street_address")} value={form.street_address} onChange={e => set("street_address", e.target.value)} placeholder="123 Maple Street" />
                </Field>

                <div className="grid grid-cols-3 gap-4">
                  <Field label="City" required>
                    <Input hasError={err("city")} value={form.city} onChange={e => set("city", e.target.value)} placeholder="Your City" />
                  </Field>
                  <Field label="State" required>
                    <Input hasError={err("state")} value={form.state} onChange={e => set("state", e.target.value)} placeholder="State" />
                  </Field>
                  <Field label="Zip / Postal Code" required>
                    <Input hasError={err("zip")} value={form.zip} onChange={e => set("zip", e.target.value)} placeholder="00000" />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Primary Phone" required>
                    <Input hasError={err("primary_phone")} value={form.primary_phone} onChange={e => set("primary_phone", e.target.value)} placeholder="+1 (000) 000-0000" />
                  </Field>
                  <Field label="Secondary Phone">
                    <Input value={form.secondary_phone} onChange={e => set("secondary_phone", e.target.value)} placeholder="Optional" />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Date of Birth" required>
                    <Input
                      hasError={err("date_of_birth")}
                      type="text"
                      value={form.date_of_birth}
                      onChange={handleDobChange}
                      onBlur={handleDobBlur}
                      placeholder="MM/DD/YYYY"
                      maxLength={10}
                    />
                  </Field>
                  <Field label="Preferred Day Out Date" required>
                    <Input hasError={err("preferred_date")} type="date" value={form.preferred_date} onChange={e => set("preferred_date", e.target.value)} />
                  </Field>
                </div>

                {(() => {
                  const age = getAge(form.date_of_birth);
                  return age !== null && age < 18 ? (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-body text-amber-800">
                      <Shield className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                      <span>{minorAcknowledged ? "✓ Guardian requirement acknowledged." : "You appear to be under 18. A guardian acknowledgment is required."}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground font-body">You must be 18 or older to take a dog out on your own. Minors require a supervising guardian.</p>
                  );
                })()}
              </>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <h2 className="font-heading text-xl font-semibold">Eligibility Questions</h2>

                <Field label="Household members & ages" required>
                  <Textarea hasError={err("household_members")} value={form.household_members} onChange={e => set("household_members", e.target.value)}
                    placeholder="List all people living with you, including ages. Include any regular visitors who may meet the dog." />
                </Field>

                <Field label="All pets in your household" required>
                  <Textarea hasError={err("pets_in_household")} value={form.pets_in_household} onChange={e => set("pets_in_household", e.target.value)}
                    placeholder="Dogs, cats, rabbits, etc. If none, enter N/A." />
                </Field>

                <Field label="Vaccination & sterilisation status of your pets" required>
                  <Textarea hasError={err("pets_vaccinated")} value={form.pets_vaccinated} onChange={e => set("pets_vaccinated", e.target.value)}
                    placeholder="Are your pets vaccinated and spayed/neutered? If no pets, enter N/A." />
                </Field>

                <Field label="Planned activities & places to visit" required>
                  <Textarea hasError={err("planned_activities")} value={form.planned_activities} onChange={e => set("planned_activities", e.target.value)}
                    placeholder="e.g. A walk in the park, a pet-friendly café, home garden. Note: dog parks and off-leash contact with other dogs are not permitted." />
                </Field>

                <Field label="Where will the dog be housed during their time with you?" required>
                  <Textarea hasError={err("dog_housing")} value={form.dog_housing} onChange={e => set("dog_housing", e.target.value)}
                    placeholder="Describe your home setup. If the dog won't be left alone, enter N/A." />
                </Field>

                <Field label="Are you willing to administer medication if necessary?" required>
                  <YesNo hasError={err("can_administer_medication")} value={form.can_administer_medication} onChange={v => set("can_administer_medication", v)} />
                </Field>

                <Field label="Do you have your own reliable transportation?" required>
                  <YesNo hasError={err("has_transport")} value={form.has_transport} onChange={v => set("has_transport", v)} />
                  <p className="text-xs text-muted-foreground font-body mt-1.5">
                    Public transport, ride-shares, and taxis are not permitted for transporting shelter animals.
                  </p>
                </Field>

                <Field label="Are you comfortable handling high-energy dogs?" required>
                  <YesNo hasError={err("comfortable_high_energy")} value={form.comfortable_high_energy} onChange={v => set("comfortable_high_energy", v)} />
                </Field>

                {form.comfortable_high_energy === false && (
                  <Field label="What energy level would you prefer?">
                    <div className="flex gap-2">
                      {["Low", "Moderate"].map(lvl => (
                        <button type="button" key={lvl} onClick={() => set("energy_preference", lvl)}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-body font-medium transition-all ${
                            form.energy_preference === lvl ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
                          }`}>
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </Field>
                )}

                <Field label="Emergency Contact" required>
                  <Input hasError={err("emergency_contact")} value={form.emergency_contact} onChange={e => set("emergency_contact", e.target.value)}
                    placeholder="Name, phone number, and relationship to you" />
                </Field>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <h2 className="font-heading text-xl font-semibold">Volunteer Agreement & Release</h2>

                <div className="p-4 rounded-xl bg-muted/60 border border-border text-xs font-body text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    <strong className="text-foreground">Liability Waiver.</strong> I understand that handling animals and performing volunteer activities may involve risks, including but not limited to injury to myself, other persons, or damage to property. On behalf of myself and my heirs, I hereby release, discharge, and hold harmless SoulBond and its partner shelter, their directors, officers, employees and agents from any and all claims arising out of or in connection with my participation in the Doggie Day Out programme.
                  </p>
                  <p>
                    <strong className="text-foreground">Health & Vaccination Declaration.</strong> I certify that any pets in my home are healthy, up-to-date on vaccinations, and spayed/neutered if applicable. I understand that while every precaution is taken, participation involves inherent risks.
                  </p>
                  <p>
                    <strong className="text-foreground">Rules of the Day.</strong> I agree to keep the dog on leash in public at all times, avoid dog parks and unsupervised contact with other animals, and return the dog to the shelter by the agreed time. I understand only approved applicants may handle the leash while off shelter grounds.
                  </p>
                </div>

                <label className={`flex items-start gap-3 cursor-pointer mt-2 p-3 rounded-xl transition-colors ${err("agreed_to_terms") ? "bg-red-50 ring-2 ring-red-400" : ""}`}>
                  <input
                    type="checkbox"
                    checked={form.agreed_to_terms}
                    onChange={e => set("agreed_to_terms", e.target.checked)}
                    className="accent-accent mt-0.5"
                  />
                  <span className="text-sm font-body text-foreground leading-relaxed">
                    I have read, understood, and agree to the terms, liability waiver, and rules outlined above. <span className="text-accent">*</span>
                  </span>
                </label>
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
          ) : <div />}

          {step < STEPS.length - 1 ? (
            <Button onClick={handleNext} className="bg-accent hover:bg-accent/90 text-accent-foreground font-body">
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="bg-accent hover:bg-accent/90 text-accent-foreground font-body">
              {loading ? (
                <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
              ) : (
                <><Check className="w-4 h-4 mr-2" /> Submit Application</>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}