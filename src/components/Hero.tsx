import { motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-50 rounded-full blur-3xl opacity-60" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              {t.hero.badge}
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-light leading-[0.9] text-slate-900 mb-8 whitespace-pre-line">
              {t.hero.title}
            </h1>
            
            <p className="text-xl text-slate-600 font-light max-w-xl mb-10 leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#contact"
                className="px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
              >
                {t.hero.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#services"
                className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-medium hover:bg-slate-50 transition-all text-center"
              >
                {t.hero.secondaryCta}
              </a>
            </div>
            
            <div className="mt-12 flex items-center gap-8">
              <div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-slate-900">24y+</div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-slate-400 font-medium whitespace-nowrap">{t.about.stats.experience}</div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-slate-900">48h</div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-slate-400 font-medium whitespace-nowrap">{t.about.stats.quote}</div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-slate-900">14d</div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-slate-400 font-medium whitespace-nowrap">{t.about.stats.close}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
               <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
                alt="Modern commercial building" 
                className="object-cover w-full h-full"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-900/10" />
            </div>
            
            {/* Floating Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[240px]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                  <ArrowRight className="w-5 h-5 -rotate-45" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 whitespace-nowrap">{t.hero.fastClosing}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t.hero.fastClosingSubtitle}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">
                {t.hero.fastClosingDesc}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-slate-300" />
      </div>
    </section>
  );
}
