import { motion } from "motion/react";
import { Zap, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  
  const stats = [
    { label: t.about.stats.experience, icon: Zap, value: "24y+" },
    { label: t.about.stats.quote, icon: TrendingUp, value: "48h" },
    { label: t.about.stats.close, icon: ShieldCheck, value: "14d" },
  ];

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square rounded-[3rem] overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop" 
                alt="Office luxury" 
                className="object-cover w-full h-full"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-amber-900/10" />
            </motion.div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-amber-700 uppercase tracking-[0.2em] mb-4">{t.about.badge}</h2>
            <h3 className="text-4xl md:text-5xl font-serif leading-tight text-slate-900 mb-8 whitespace-pre-line">
              {t.about.title}
            </h3>
            
            <div className="mb-8">
              <h4 className="text-xl font-serif font-bold text-slate-900 mb-2">{t.about.philosophy}</h4>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t.about.philosophyText}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center md:text-left">
                  <div className="text-4xl font-serif font-bold text-slate-900 mb-2">{stat.value}</div>
                  <div className="text-xs uppercase tracking-widest text-slate-400 font-medium leading-relaxed">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
