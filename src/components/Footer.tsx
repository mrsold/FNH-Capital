import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <a href="#" className="inline-block text-2xl font-serif font-bold tracking-tight text-slate-900 mb-6">
              FNH <span className="text-amber-700">CAPITAL</span>
            </a>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              {t.footer.description}
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-6">{t.footer.quickLinks}</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#services" className="hover:text-amber-700 transition-colors">{t.services.items.residential.title}</a></li>
              <li><a href="#services" className="hover:text-amber-700 transition-colors">{t.services.items.commercial.title}</a></li>
              <li><a href="#services" className="hover:text-amber-700 transition-colors">{t.services.items.bridge.title}</a></li>
              <li><a href="#investors" className="hover:text-amber-700 transition-colors">{t.nav.investors}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-6">{t.footer.legal}</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-amber-700 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-amber-700 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-amber-700 transition-colors">Compliance</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-6">{t.footer.contact}</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>info@fnhcapital.com</li>
              <li>408-800-5326</li>
              <li className="flex items-center gap-2">
                <span className="font-bold text-slate-700">WeChat:</span> SFBroker
              </li>
              <li>{t.footer.hours}</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 flex flex-col md:row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © {currentYear} FNH Capital Group. {t.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">{t.footer.equalHousing}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
