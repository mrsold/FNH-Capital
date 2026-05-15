import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LogIn, 
  UserPlus, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  Lock, 
  User,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { auth, signInWithGoogle } from '../lib/firebase';
import { createUserProfile } from '../services/userService';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function InvestorAuthPage() {
  const { t } = useLanguage();
  const { refreshProfile, profile } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<'investor' | 'borrower'>('investor');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [investAmount, setInvestAmount] = useState('');
  const [isAccredited, setIsAccredited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'signup') {
      setMode('signup');
    }
    if (profile) {
      navigate('/');
    }
  }, [location, profile, navigate]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setStep(2);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!isAccredited && role === 'investor') {
          setError('You must certify that you are an accredited investor.');
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName });
        
        await createUserProfile({
          uid: user.uid,
          email: user.email!,
          displayName: displayName,
          role: role,
          investAmount: role === 'investor' ? investAmount : undefined,
          isAccredited: role === 'investor' ? isAccredited : undefined,
        });
        
        await refreshProfile();
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        await refreshProfile();
      }
      navigate('/');
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === 'auth/email-already-in-use') setError('Email already in use.');
      else if (err.code === 'auth/wrong-password') setError('Incorrect password.');
      else if (err.code === 'auth/user-not-found') setError('No account found with this email.');
      else setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Left Decoration side */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-700/20 to-transparent" />
        
        <div className="relative z-10 px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-6xl font-serif font-bold text-white mb-6 whitespace-pre-line">
              {t.auth.heroTitle}
            </h1>
            <p className="text-slate-300 text-xl max-w-md leading-relaxed">
              {t.auth.heroSubtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8">
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
              <TrendingUp className="w-8 h-8 text-amber-500 mb-4" />
              <h3 className="text-white font-bold text-lg mb-1">8.25% - 11%</h3>
              <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">{t.auth.targetReturns}</p>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
              <ShieldCheck className="w-8 h-8 text-amber-500 mb-4" />
              <h3 className="text-white font-bold text-lg mb-1">{t.auth.securedBy}</h3>
              <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">1st Trust Deeds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form side */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-12 text-center lg:text-left relative">
            <button 
              onClick={() => navigate('/')}
              className="absolute -top-12 -right-4 lg:right-auto lg:-left-12 p-3 text-slate-400 hover:text-slate-900 transition-colors"
              title="Back to Home"
            >
              <X className="w-6 h-6" />
            </button>
            <button 
              onClick={() => navigate('/')}
              className="text-2xl font-serif font-bold tracking-tight text-slate-900 mb-12 block"
            >
              FNH <span className="text-amber-700">CAPITAL</span>
            </button>
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-3 uppercase tracking-tight">
              {mode === 'signin' ? t.auth.signInTitle : t.auth.signUpTitle}
            </h2>
            <p className="text-slate-500 font-medium">
              {mode === 'signin' ? t.auth.signInDesc : t.auth.signUpDesc}
            </p>
          </div>

          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl mb-8">
            <button 
              onClick={() => { setMode('signin'); setStep(1); }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {t.auth.switchSignIn}
            </button>
            <button 
              onClick={() => { setMode('signup'); setStep(1); }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {t.auth.switchSignUp}
            </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={mode === 'signup' && step === 1 ? handleNextStep : handleAuth} className="space-y-5">
            {mode === 'signup' && step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <button 
                    type="button"
                    onClick={() => setRole('borrower')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${role === 'borrower' ? 'border-amber-700 bg-amber-50/50' : 'border-slate-50 hover:border-slate-100 bg-slate-50/50'}`}
                  >
                    <Briefcase className={`w-4 h-4 ${role === 'borrower' ? 'text-amber-700' : 'text-slate-400'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${role === 'borrower' ? 'text-slate-900' : 'text-slate-500'}`}>{t.auth.borrowerRole}</span>
                    {role === 'borrower' && <CheckCircle2 className="w-3 h-3 text-amber-700 ml-auto" />}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole('investor')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${role === 'investor' ? 'border-amber-700 bg-amber-50/50' : 'border-slate-50 hover:border-slate-100 bg-slate-50/50'}`}
                  >
                    <TrendingUp className={`w-4 h-4 ${role === 'investor' ? 'text-amber-700' : 'text-slate-400'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${role === 'investor' ? 'text-slate-900' : 'text-slate-500'}`}>{t.auth.investorRole}</span>
                    {role === 'investor' && <CheckCircle2 className="w-3 h-3 text-amber-700 ml-auto" />}
                  </button>
                </div>

                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="text"
                    placeholder={t.auth.nameLabel}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-14 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm font-medium"
                  />
                </div>
              </>
            )}

            {mode === 'signup' && step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                {role === 'investor' ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t.auth.investCapacity}</label>
                      <select 
                        required
                        value={investAmount}
                        onChange={(e) => setInvestAmount(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm font-bold text-slate-700"
                      >
                        <option value="">Select Amount</option>
                        {t.contact.form.investAmountOptions.map((opt: string) => (
                           <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-amber-50/50 rounded-2xl border border-amber-100 group transition-all hover:bg-amber-50">
                      <input 
                        type="checkbox" 
                        id="accredited-page"
                        required
                        checked={isAccredited}
                        onChange={(e) => setIsAccredited(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded-lg border-amber-200 text-amber-600 focus:ring-amber-500/20 cursor-pointer"
                      />
                      <label htmlFor="accredited-page" className="text-xs font-bold text-slate-700 cursor-pointer select-none leading-relaxed">
                        {t.auth.accreditedCert}
                      </label>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-100">
                     <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                     <p className="text-sm text-slate-600 font-medium">Borrower profiles are finalized through our application flow. Continue to finish your account setup.</p>
                  </div>
                )}
              </motion.div>
            )}

            {(mode === 'signin' || step === 1) && (
              <>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="email"
                    placeholder={t.auth.emailLabel}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm font-medium"
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="password"
                    placeholder={t.auth.passwordLabel}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm font-medium"
                  />
                </div>
              </>
            )}

            <button 
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-amber-700 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? t.auth.signInBtn : step === 1 ? t.auth.nextStep : t.auth.signUpBtn}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            
            {mode === 'signup' && step === 2 && (
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-4 text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
              >
                {t.auth.goBack}
              </button>
            )}
          </form>

          {step === 1 && (
            <div className="mt-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.auth.googleAuth}</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <button 
                type="button"
                onClick={async () => {
                  setError(null);
                  try {
                    await signInWithGoogle();
                    navigate('/');
                  } catch (err: any) {
                    setError('Google sign-in failed.');
                  }
                }}
                className="w-full py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.94 0 3.68.67 5.05 1.97l3.77-3.77C18.52 1.15 15.38 0 12 0 7.35 0 3.32 2.67 1.28 6.59l4.41 3.42C6.73 7.15 9.14 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.8-.07-1.56-.19-2.3H12v4.35h6.44c-.28 1.47-1.11 2.71-2.35 3.55l3.65 2.84c2.14-1.97 3.39-4.87 3.39-8.44z" />
                  <path fill="#34A853" d="M5.69 14.17C5.44 13.43 5.3 12.63 5.3 11.8s.14-1.63.39-2.37L1.28 6.01C.46 7.69 0 9.57 0 11.5s.46 3.81 1.28 5.49l4.41-3.42c-.25-.74-.39-1.54-.39-2.37z" />
                  <path fill="#FBBC05" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.65-2.84c-1.11.75-2.54 1.19-4.3 1.19-3.32 0-6.14-2.24-7.15-5.24l-4.41 3.42C3.32 21.33 7.35 24 12 24z" />
                </svg>
                Google Account
              </button>
            </div>
          )}

          <p className="mt-12 text-center text-[10px] text-slate-400 font-medium">
            {t.auth.termsNote}
          </p>
        </div>
      </div>
    </div>
  );
}
