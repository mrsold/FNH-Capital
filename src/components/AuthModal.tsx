import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Github, 
  AlertCircle,
  Briefcase,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { auth, signInWithGoogle } from '../lib/firebase';
import { createUserProfile } from '../services/userService';
import { useUser } from '../contexts/UserContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { refreshProfile } = useUser();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<'investor' | 'borrower'>('borrower');
  
  // Step 1 fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  // Step 2 fields - Investor
  const [investAmount, setInvestAmount] = useState('');
  const [isAccredited, setIsAccredited] = useState(false);
  
  // Step 2 fields - Borrower
  const [loanType, setLoanType] = useState('Residential');
  const [loanAmount, setLoanAmount] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
  const [duration, setDuration] = useState('');
  
  // Common
  const [experience, setExperience] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName });
        
        // Create profile with all collected data
        await createUserProfile({
          uid: user.uid,
          email: user.email!,
          displayName: displayName,
          role: role,
          investAmount: role === 'investor' ? investAmount : undefined,
          isAccredited: role === 'investor' ? isAccredited : undefined,
          loanType: role === 'borrower' ? loanType : undefined,
          loanAmount: role === 'borrower' ? Number(loanAmount) : undefined,
          propertyValue: role === 'borrower' ? Number(propertyValue) : undefined,
          duration: role === 'borrower' ? duration : undefined,
          experience: experience
        });
        
        await refreshProfile();
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        await refreshProfile();
      }
      onClose();
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

  const handleGoogleAuth = async () => {
    setError(null);
    try {
      await signInWithGoogle();
      onClose();
      // Role selection will handle the profile creation for Google users
    } catch (err: any) {
      console.error("Google auth error:", err);
      setError('Google sign-in failed.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-10 pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">
              {mode === 'signin' ? 'Welcome Back' : step === 1 ? 'Create Account' : `${role.charAt(0).toUpperCase() + role.slice(1)} Details`}
            </h2>
            <p className="text-slate-500 text-sm">
              {mode === 'signin' 
                ? 'Access your investment dashboard and deals.' 
                : step === 1 
                  ? 'Join FNH Capital to start your journey.'
                  : 'Tell us a bit about your background.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={mode === 'signup' && step === 1 ? handleNextStep : handleEmailAuth} className="space-y-4">
            {mode === 'signup' && step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <button 
                    type="button"
                    onClick={() => setRole('borrower')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${role === 'borrower' ? 'border-amber-700 bg-amber-50/50' : 'border-slate-50 hover:border-slate-100 bg-slate-50/50'}`}
                  >
                    <Briefcase className={`w-4 h-4 ${role === 'borrower' ? 'text-amber-700' : 'text-slate-400'}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${role === 'borrower' ? 'text-slate-900' : 'text-slate-500'}`}>Borrower</span>
                    {role === 'borrower' && <CheckCircle2 className="w-3 h-3 text-amber-700 ml-auto" />}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole('investor')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${role === 'investor' ? 'border-amber-700 bg-amber-50/50' : 'border-slate-50 hover:border-slate-100 bg-slate-50/50'}`}
                  >
                    <TrendingUp className={`w-4 h-4 ${role === 'investor' ? 'text-amber-700' : 'text-slate-400'}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${role === 'investor' ? 'text-slate-900' : 'text-slate-500'}`}>Investor</span>
                    {role === 'investor' && <CheckCircle2 className="w-3 h-3 text-amber-700 ml-auto" />}
                  </button>
                </div>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="text"
                    placeholder="Full Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm"
                  />
                </div>
              </>
            )}

            {mode === 'signup' && step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {role === 'investor' ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Investment Capacity</label>
                      <select 
                        required
                        value={investAmount}
                        onChange={(e) => setInvestAmount(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm"
                      >
                        <option value="">Select Amount</option>
                        <option value="$100k - $250k">$100k - $250k</option>
                        <option value="$250k - $500k">$250k - $500k</option>
                        <option value="$500k - $1M">$500k - $1M</option>
                        <option value="$1M+">$1M+</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <input 
                        type="checkbox" 
                        id="accredited-signup"
                        checked={isAccredited}
                        onChange={(e) => setIsAccredited(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-amber-700 focus:ring-amber-500/20"
                      />
                      <label htmlFor="accredited-signup" className="text-xs font-medium text-slate-600 cursor-pointer">
                        I am an Accredited Investor
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Loan Type</label>
                        <select 
                          required
                          value={loanType}
                          onChange={(e) => setLoanType(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm"
                        >
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Bridge">Bridge</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Term Needed</label>
                        <select 
                          required
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm"
                        >
                          <option value="">Select Term</option>
                          <option value="6-12 Months">6-12 Months</option>
                          <option value="12-24 Months">12-24 Months</option>
                          <option value="2-3 Years">2-3 Years</option>
                          <option value="5+ Years">5+ Years</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Loan Amount</label>
                        <input 
                          required
                          type="number"
                          placeholder="e.g. 500000"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Property Value</label>
                        <input 
                          required
                          type="number"
                          placeholder="e.g. 750000"
                          value={propertyValue}
                          onChange={(e) => setPropertyValue(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm"
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Experience / Notes</label>
                  <textarea 
                    rows={2}
                    placeholder="Briefly describe your background or goals..."
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm resize-none"
                  />
                </div>
              </div>
            )}

            {(mode === 'signin' || step === 1) && (
              <>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm"
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3">
              {mode === 'signup' && step === 2 && (
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Back
                </button>
              )}
              <button 
                disabled={loading}
                type="submit"
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'signin' ? 'Sign In' : step === 1 ? 'Next Step' : 'Complete Signup'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {step === 1 && (
            <>
              <div className="my-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              <button 
                type="button"
                onClick={handleGoogleAuth}
                className="w-full py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.94 0 3.68.67 5.05 1.97l3.77-3.77C18.52 1.15 15.38 0 12 0 7.35 0 3.32 2.67 1.28 6.59l4.41 3.42C6.73 7.15 9.14 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.8-.07-1.56-.19-2.3H12v4.35h6.44c-.28 1.47-1.11 2.71-2.35 3.55l3.65 2.84c2.14-1.97 3.39-4.87 3.39-8.44z" />
                  <path fill="#34A853" d="M5.69 14.17C5.44 13.43 5.3 12.63 5.3 11.8s.14-1.63.39-2.37L1.28 6.01C.46 7.69 0 9.57 0 11.5s.46 3.81 1.28 5.49l4.41-3.42c-.25-.74-.39-1.54-.39-2.37z" />
                  <path fill="#FBBC05" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.65-2.84c-1.11.75-2.54 1.19-4.3 1.19-3.32 0-6.14-2.24-7.15-5.24l-4.41 3.42C3.32 21.33 7.35 24 12 24z" />
                </svg>
                Google Account
              </button>
            </>
          )}

          <p className="mt-8 text-center text-sm text-slate-500">
            {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setStep(1);
              }}
              className="font-bold text-amber-700 hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
