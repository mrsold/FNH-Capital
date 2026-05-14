import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Briefcase, TrendingUp, CheckCircle2, LogOut, X } from 'lucide-react';
import { createUserProfile } from '../services/userService';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function RoleSelection() {
  const { user, refreshProfile } = useUser();
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<'investor' | 'borrower' | null>(null);
  
  // Background questions
  const [investAmount, setInvestAmount] = useState('');
  const [isAccredited, setIsAccredited] = useState(false);
  const [loanType, setLoanType] = useState('Residential');
  const [loanAmount, setLoanAmount] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
  const [duration, setDuration] = useState('');
  const [experience, setExperience] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [role, investAmount, loanAmount, propertyValue, duration, step]);

  const handleSubmit = async () => {
    if (!user || !role) return;
    
    // Validation
    if (role === 'investor' && !investAmount) {
      setError('Please select an investment capacity.');
      return;
    }
    if (role === 'borrower' && (!loanAmount || !propertyValue || !duration)) {
      setError('Please fill in all loan details.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    console.log("Submitting role selection for user:", user.uid, { role, investAmount, isAccredited, experience });
    
    try {
      await createUserProfile({
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'User',
        role: role,
        investAmount: role === 'investor' ? investAmount : undefined,
        isAccredited: role === 'investor' ? isAccredited : undefined,
        loanType: role === 'borrower' ? loanType : undefined,
        loanAmount: role === 'borrower' ? Number(loanAmount) : undefined,
        propertyValue: role === 'borrower' ? Number(propertyValue) : undefined,
        duration: role === 'borrower' ? duration : undefined,
        experience: experience
      });
      
      console.log("Profile created successfully, refreshing...");
      await refreshProfile();
    } catch (err: any) {
      console.error("Error setting role:", err);
      setError(`Failed to save profile: ${err.message || 'Unknown error'}. Please check your connection and try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md text-slate-900">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl p-10 text-center relative"
      >
        <button 
          onClick={() => signOut(auth)}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all flex items-center gap-2 text-xs font-bold"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit</span>
        </button>

        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Welcome to FNH Capital</h2>
        <p className="text-slate-500 mb-8">
          {step === 1 ? 'Please select your primary role to continue.' : `Tell us more about your ${role} goals.`}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm text-left">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">!</div>
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="grid grid-cols-2 gap-6 mb-10">
            <button 
              onClick={() => setRole('borrower')}
              className={`flex flex-col items-center gap-4 p-8 rounded-3xl border-2 transition-all ${role === 'borrower' ? 'border-amber-700 bg-amber-50/50 shadow-lg shadow-amber-900/5' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${role === 'borrower' ? 'bg-amber-700 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                <Briefcase className="w-8 h-8" />
              </div>
              <div className="font-bold text-slate-900">Borrower</div>
              <div className="text-xs text-slate-500">I am looking for property financing</div>
              {role === 'borrower' && <CheckCircle2 className="w-5 h-5 text-amber-700" />}
            </button>

            <button 
              onClick={() => setRole('investor')}
              className={`flex flex-col items-center gap-4 p-8 rounded-3xl border-2 transition-all ${role === 'investor' ? 'border-amber-700 bg-amber-50/50 shadow-lg shadow-amber-900/5' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${role === 'investor' ? 'bg-amber-700 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="font-bold text-slate-900">Investor</div>
              <div className="text-xs text-slate-500">I want to invest in trust deeds</div>
              {role === 'investor' && <CheckCircle2 className="w-5 h-5 text-amber-700" />}
            </button>
          </div>
        ) : (
          <div className="space-y-4 mb-10 text-left animate-in fade-in slide-in-from-right-4 duration-300">
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
                    id="accredited-role"
                    checked={isAccredited}
                    onChange={(e) => setIsAccredited(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-amber-700 focus:ring-amber-500/20"
                  />
                  <label htmlFor="accredited-role" className="text-xs font-medium text-slate-600 cursor-pointer">
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
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all text-sm resize-none text-slate-900"
              />
            </div>
          </div>
        )}

        <div className="flex gap-4">
          {step === 2 && (
            <button 
              onClick={() => setStep(1)}
              className="px-8 py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all shadow-sm"
            >
              Back
            </button>
          )}
          <button 
            disabled={!role || isSubmitting}
            onClick={step === 1 ? () => setStep(2) : handleSubmit}
            className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? 'Finalizing...' : step === 1 ? 'Continue' : 'Get Started'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
