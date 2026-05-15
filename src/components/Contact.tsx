import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, Send, Info } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const [role, setRole] = useState<"borrower" | "investor">("borrower");
  const [isAccredited, setIsAccredited] = useState(false);
  const [activeModal, setActiveModal] = useState<"accredited" | "terms" | null>(null);
  const [investAmount, setInvestAmount] = useState("");
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userSum, setUserSum] = useState("");
  const [isHuman, setIsHuman] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error" | "loading">("idle");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loanType, setLoanType] = useState("");
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [propertyValue, setPropertyValue] = useState<string>("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const ltv = (amount && propertyValue) ? (parseFloat(amount) / parseFloat(propertyValue)) * 100 : 0;
  const showLTVWarning = role === "borrower" && ltv > 70;

  useEffect(() => {
    generateCatpcha();
  }, []);

  const generateCatpcha = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setUserSum("");
    setIsHuman(false);
  };

  const checkHuman = (val: string) => {
    setUserSum(val);
    if (parseInt(val) === num1 + num2) {
      setIsHuman(true);
    } else {
      setIsHuman(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!acceptedTerms) {
      setFormError(role === "borrower" ? t.contact.form.humanError : t.contact.form.humanError); // Using existing error key or could add more specific ones
      return;
    }

    if (!isHuman) {
      setFormError(t.contact.form.humanError);
      return;
    }
    
    setFormStatus("loading");
    console.log("Submitting contact form...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          name,
          email,
          type: role === "borrower" ? (loanType || t.services.items.residential.title) : undefined,
          duration: role === "borrower" ? duration : undefined,
          amount,
          propertyValue,
          investAmount,
          isAccredited,
          message
        })
      });

      if (response.ok) {
        setFormStatus("success");
        setShowSuccessModal(true);
        setName("");
        setEmail("");
        setLoanType("");
        setDuration("");
        setMessage("");
        setAmount("");
        setPropertyValue("");
        setIsAccredited(false);
        setInvestAmount("");
        setAcceptedTerms(false);
        generateCatpcha();
      } else {
        const errorData = await response.json().catch(() => ({ message: "Unknown server error" }));
        setFormStatus("error");
        setFormError(`Submission Failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setFormStatus("error");
      setFormError("A network error occurred. Please try again later.");
    } finally {
      if (formStatus !== "success") {
        setTimeout(() => setFormStatus("idle"), 3000);
      }
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Abstract Shapes */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-700/10 skew-x-12 translate-x-20" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-sm font-bold text-amber-500 uppercase tracking-[0.2em] mb-4">{t.contact.title}</h2>
            <h3 className="text-4xl md:text-5xl font-serif leading-tight mb-8 whitespace-pre-line">
              {t.contact.subtitle}
            </h3>
            
            <p className="text-slate-400 text-lg mb-12 max-w-md">
              {t.contact.desc}
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-amber-500 border border-white/10">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">{t.contact.email}</div>
                  <div className="text-xl font-medium">info@fnhcapital.com</div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-amber-500 border border-white/10">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">{t.contact.wechat}</div>
                  <div className="text-xl font-medium">SFBroker</div>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-amber-500 border border-white/10">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">{t.contact.phone}</div>
                  <div className="text-xl font-medium">408-800-5326</div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-amber-500 border border-white/10">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">{t.contact.office}</div>
                  <div className="text-xl font-medium">Milpitas, CA 95035</div>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 bg-white rounded-[2.5rem] text-slate-900"
          >
            <h4 className="text-2xl font-serif font-bold mb-8 text-slate-800">{t.contact.form.title}</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.contact.form.roleLabel}</label>
                <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                  <button
                    type="button"
                    onClick={() => setRole("borrower")}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${role === "borrower" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    {t.contact.form.roleBorrower}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("investor")}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${role === "investor" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    {t.contact.form.roleInvestor}
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.contact.form.nameLabel}</label>
                  <input 
                    required 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe" 
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.contact.form.emailLabel}</label>
                  <input 
                    required 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com" 
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm" 
                  />
                </div>
              </div>
              
              {role === "borrower" ? (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.contact.form.typeLabel}</label>
                      <select 
                        required
                        value={loanType || t.services.items.residential.title}
                        onChange={(e) => setLoanType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all appearance-none text-sm"
                      >
                        <option>{t.services.items.residential.title}</option>
                        <option>{t.services.items.commercial.title}</option>
                        <option>{t.services.items.bridge.title}</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.contact.form.durationLabel}</label>
                      <select 
                        required 
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all appearance-none text-sm"
                      >
                        <option value="">{t.contact.form.durationLabel}</option>
                        {t.contact.form.durationOptions.map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.contact.form.amountLabel}</label>
                      <input 
                        required 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="1,200,000" 
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.contact.form.valueLabel}</label>
                      <input 
                        required 
                        type="number" 
                        value={propertyValue}
                        onChange={(e) => setPropertyValue(e.target.value)}
                        placeholder="1,800,000" 
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm" 
                      />
                    </div>
                  </div>

                  {showLTVWarning && (
                    <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-[11px] text-red-700 font-medium">
                      {t.contact.form.ltvWarning} (LTV: {ltv.toFixed(1)}%)
                    </div>
                  )}
                </>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.contact.form.investAmountLabel}</label>
                      <select 
                        required
                        value={investAmount}
                        onChange={(e) => setInvestAmount(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all appearance-none text-sm"
                      >
                        <option value="">{t.contact.form.selectAmount}</option>
                        {t.contact.form.investAmountOptions.map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <input 
                        type="checkbox" 
                        id="accredited"
                        checked={isAccredited}
                        onChange={(e) => setIsAccredited(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-amber-700 focus:ring-amber-500/20"
                      />
                      <div className="flex items-center gap-1.5">
                        <label htmlFor="accredited" className="text-xs font-medium text-slate-600 cursor-pointer">
                          {t.contact.form.accreditedLabel}
                        </label>
                        <button 
                          type="button"
                          onClick={() => setActiveModal("accredited")}
                          className="text-slate-400 hover:text-amber-600 transition-colors"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.contact.form.msgLabel}</label>
                <textarea 
                  required 
                  rows={2} 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={role === "borrower" ? t.contact.form.msgPlaceholder : t.contact.form.msgPlaceholderInvestor} 
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all resize-none text-sm" 
                />
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-amber-700 focus:ring-amber-500/20"
                />
                <div className="flex items-center gap-1.5">
                  <label htmlFor="terms" className="text-[11px] leading-relaxed text-slate-500 cursor-pointer">
                    {role === "borrower" ? t.contact.form.termsLabel : t.contact.form.termsLabelInvestor}
                  </label>
                  <button 
                    type="button"
                    onClick={() => setActiveModal("terms")}
                    className="text-slate-400 hover:text-amber-600 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Human Check */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-800 flex justify-between items-center">
                  <span>{t.contact.form.humanCheck}</span>
                  {isHuman && <span className="text-green-600 flex items-center gap-1"><Send className="w-3 h-3" /> {t.contact.form.verified}</span>}
                </label>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold font-serif text-slate-900 bg-white px-4 py-2 rounded-lg border border-amber-100">
                    {num1} + {num2} = ?
                  </div>
                  <input 
                    type="number" 
                    value={userSum}
                    onChange={(e) => checkHuman(e.target.value)}
                    placeholder="Result"
                    className="w-24 px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900"
                  />
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-xs text-red-600 font-medium animate-shake">
                  {formError}
                </div>
              )}

              <button 
                type="submit"
                disabled={formStatus === "success" || formStatus === "loading"}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formStatus === "loading" ? t.contact.form.sending : formStatus === "success" ? t.contact.form.success : t.contact.form.submit}
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Info Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-8 text-slate-900"
            >
              <h4 className="text-xl font-serif font-bold text-slate-900 mb-4 uppercase tracking-wider text-amber-700">
                {activeModal === 'accredited' ? t.contact.form.accreditedTitle : t.contact.form.termsTitle}
              </h4>
              <div className="text-sm text-slate-600 leading-relaxed space-y-4">
                {activeModal === 'accredited' ? (
                  <p>{t.contact.form.accreditedDesc}</p>
                ) : (
                  <div className="whitespace-pre-line">{t.contact.form.termsContent}</div>
                )}
              </div>
              <button 
                type="button"
                onClick={() => setActiveModal(null)}
                className="mt-8 w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                {t.contact.form.modalClose}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-amber-900/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-serif font-bold text-slate-900 mb-2">{t.contact.form.successModalTitle}</h4>
              <p className="text-slate-600 mb-8">
                {t.contact.form.successModalDesc}
              </p>
              <button 
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 bg-amber-700 text-white rounded-xl font-bold hover:bg-amber-800 transition-all shadow-lg"
              >
                {t.contact.form.successModalBtn}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
