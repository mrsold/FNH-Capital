import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, ShieldCheck, Calendar, ScrollText, ArrowRight, ChevronDown, X } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function Investors() {
  const { t } = useLanguage();
  const { profile } = useUser();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showFaqModal, setShowFaqModal] = useState(false);
  
  const icons = [TrendingUp, ShieldCheck, Calendar, ScrollText];

  useEffect(() => {
    const handleOpenFaq = () => setShowFaqModal(true);
    window.addEventListener('open-faq', handleOpenFaq);
    return () => window.removeEventListener('open-faq', handleOpenFaq);
  }, []);

  return (
    <section id="investors" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-12">
          {/* ... existing content ... */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {t.investors.badge}
            </div>
            
            <h2 className="text-5xl md:text-6xl font-serif font-light text-slate-900 leading-tight mb-8 whitespace-pre-line">
              {t.investors.title}
            </h2>
            
            <p className="text-xl text-slate-500 font-light leading-relaxed mb-10 max-w-xl">
              {t.investors.desc}
            </p>

          <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate(profile ? '#contact' : '/signup')}
                className="px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
              >
                {t.investors.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setShowFaqModal(true)}
                className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-medium hover:border-amber-700/30 transition-all flex items-center justify-center gap-2 group"
              >
                {t.investors.secondaryCta}
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {t.investors.benefits.map((benefit: any, i: number) => {
              const Icon = icons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100/50 hover:border-amber-700/20 hover:bg-white hover:shadow-xl transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-amber-700 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {benefit.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {showFaqModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFaqModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between p-8 border-b border-slate-100">
                  <h2 className="text-3xl font-serif font-bold text-slate-900">
                    Investor <span className="text-amber-700">FAQ</span>
                  </h2>
                  <button 
                    onClick={() => setShowFaqModal(false)}
                    className="p-3 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-900"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="overflow-y-auto p-8 bg-slate-50/50">
                  <div className="grid gap-4">
                    {t.investors.faq.map((item: any, i: number) => (
                      <div 
                        key={i}
                        className={`rounded-2xl border transition-all duration-300 ${
                          openFaq === i 
                            ? 'bg-white border-amber-700/20 shadow-lg' 
                            : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full px-8 py-6 flex items-center justify-between text-left group"
                        >
                          <span className={`font-serif font-bold text-lg md:text-xl transition-colors ${
                            openFaq === i ? 'text-amber-700' : 'text-slate-800'
                          }`}>
                            {item.q}
                          </span>
                          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                            openFaq === i ? 'text-amber-700 rotate-180' : 'text-slate-400 group-hover:text-slate-600'
                          }`} />
                        </button>
                        <AnimatePresence>
                          {openFaq === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-8 pb-8 text-slate-500 leading-relaxed text-sm md:text-base pt-4 border-t border-slate-50">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
