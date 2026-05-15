import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  Languages, 
  ChevronDown, 
  LayoutDashboard, 
  Calculator,
  UserPlus
} from "lucide-react";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useUser } from "../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import CalculatorModal from "./CalculatorModal";
import InvestorJoinModal from "./InvestorJoinModal";

export default function Navbar() {
  const { scrollYProgress } = useScroll();
  const { language, setLanguage, t } = useLanguage();
  const { user, profile } = useUser();
  const navigate = useNavigate();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const isAdmin = profile?.role === 'admin';

  const [isInvestorsOpen, setIsInvestorsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isInvestorJoinOpen, setIsInvestorJoinOpen] = useState(false);

  useEffect(() => {
    const handleOpenJoin = () => navigate('/signup');
    const handleOpenAuth = () => navigate('/login');
    
    window.addEventListener('open-investor-join', handleOpenJoin);
    window.addEventListener('open-auth-modal', handleOpenAuth);
    
    return () => {
      window.removeEventListener('open-investor-join', handleOpenJoin);
      window.removeEventListener('open-auth-modal', handleOpenAuth);
    };
  }, [navigate]);

  const navItems = [
    { label: t.nav.services, id: "services" },
    { 
      label: t.nav.investors, 
      id: "investors",
      subItems: [
        { label: t.investors.badge, id: "investors" },
        { label: t.nav.joinNetwork, id: "join-investor", icon: <UserPlus className="w-4 h-4" /> },
        { label: t.nav.deals, id: "deals" },
        { label: t.nav.calculator, id: "calculator" },
        { label: t.nav.faq, id: "faq" }
      ]
    },
    { label: t.nav.about, id: "about" },
    { label: t.nav.contact, id: "contact" },
  ];

  const handleNavClick = (id: string, isFaq?: boolean) => {
    if (id === 'calculator') {
      setIsCalculatorOpen(true);
      return;
    }
    if (id === 'join-investor') {
      navigate('/signup');
      return;
    }
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        if (isFaq) {
          window.dispatchEvent(new CustomEvent('open-faq'));
        } else {
          const element = document.getElementById(id);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    if (isFaq) {
      window.dispatchEvent(new CustomEvent('open-faq'));
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100"
    >
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-700 origin-left"
        style={{ scaleX }}
      />
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-serif font-bold tracking-tight text-slate-900">
            FNH <span className="text-amber-700">CAPITAL</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <div key={item.id} className="relative group/item">
              {item.subItems ? (
                <div 
                  className="flex items-center gap-1 cursor-pointer py-2"
                  onMouseEnter={() => setIsInvestorsOpen(true)}
                  onMouseLeave={() => setIsInvestorsOpen(false)}
                >
                  <button 
                    onClick={() => handleNavClick(item.id)}
                    className="text-sm font-medium text-slate-600 hover:text-amber-700 transition-colors"
                  >
                    {item.label}
                  </button>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover/item:text-amber-700 transition-colors" />
                  
                  <AnimatePresence>
                    {isInvestorsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 mt-1"
                      >
                        {item.subItems.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => handleNavClick(sub.id, sub.id === 'faq')}
                            className="w-full text-left px-6 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-amber-700 transition-all font-medium"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button 
                  onClick={() => handleNavClick(item.id)}
                  className="text-sm font-medium text-slate-600 hover:text-amber-700 transition-colors"
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}
          
          <div className="flex items-center gap-2 border-l border-slate-200 pl-8">
            <button 
              onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-amber-700 transition-colors"
            >
              <Languages className="w-4 h-4" />
              <span>{language === 'zh' ? 'EN' : '中文'}</span>
            </button>
          </div>

          <div className="relative">
            {user ? (
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
                  <span className="text-xs font-bold text-amber-700">
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </span>
                </div>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 mt-1"
                    >
                      <div className="px-4 py-3 border-b border-slate-50 mb-2">
                        <div className="text-sm font-bold text-slate-900 truncate">{user.displayName}</div>
                        <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                        {profile?.role && (
                          <div className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-bold uppercase rounded-md border border-amber-100">
                            {profile.role}
                          </div>
                        )}
                      </div>
                      
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-amber-700 transition-all font-medium rounded-xl mb-1"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          {t.nav.admin}
                        </Link>
                      )}

                      <button
                        onClick={() => signOut(auth)}
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all font-medium rounded-xl"
                      >
                        <LogOut className="w-4 h-4" />
                        {t.nav.signOut}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-900 hover:text-amber-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                {t.nav.signIn}
              </button>
            )}
          </div>

          <button 
            onClick={() => handleNavClick('contact')}
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-colors"
          >
            {t.nav.apply}
          </button>
        </div>
        
        {/* Mobile menu icon (simplified) */}
        <div className="md:hidden">
          <button className="p-2 text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
    <AuthModal 
      isOpen={isAuthModalOpen} 
      onClose={() => setIsAuthModalOpen(false)} 
    />
    <CalculatorModal
      isOpen={isCalculatorOpen}
      onClose={() => setIsCalculatorOpen(false)}
    />
    <InvestorJoinModal
      isOpen={isInvestorJoinOpen}
      onClose={() => setIsInvestorJoinOpen(false)}
    />
    </>
  );
}
