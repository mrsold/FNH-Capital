import { motion } from "motion/react";
import { Home, Building2, Landmark, CheckCircle2, Zap, Globe, ArrowRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Services() {
  const { t } = useLanguage();

  const programs = [
    {
      title: t.services.items.residential.title,
      description: t.services.items.residential.desc,
      icon: Home,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      features: t.services.items.residential.points
    },
    {
      title: t.services.items.commercial.title,
      description: t.services.items.commercial.desc,
      icon: Building2,
      image: "https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=2070&auto=format&fit=crop",
      features: t.services.items.commercial.points
    },
    {
      title: t.services.items.bridge.title,
      description: t.services.items.bridge.desc,
      icon: Zap,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop",
      features: t.services.items.bridge.points
    }
  ];

  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold text-amber-700 uppercase tracking-[0.2em] mb-4">{t.services.title}</h2>
            <p className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight">
              {t.services.subtitle}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img 
                  src={program.image} 
                  alt={program.title} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center text-slate-900 shadow-lg">
                  <program.icon className="w-5 h-5" />
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">{program.title}</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed flex-grow">
                  {program.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {program.features.map(feature => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <a 
                  href="#contact"
                  className="w-full py-3 border border-slate-200 rounded-full text-slate-900 text-sm font-medium hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 group"
                >
                  {t.services.getStarted}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
