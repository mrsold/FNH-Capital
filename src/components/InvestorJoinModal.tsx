import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, CheckCircle2, UserPlus, Phone, Mail, User } from 'lucide-react';
import { upsertInvestor } from '../services/adminService';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';

interface InvestorJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InvestorJoinModal({ isOpen, onClose }: InvestorJoinModalProps) {
  const { t } = useLanguage();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await upsertInvestor({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        isAccredited: formData.get('isAccredited') === 'on',
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error joining as investor:", error);
      alert(t.deals.joinModal.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden"
          >
            {isSuccess ? (
              <div className="p-12 text-center py-24">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">{t.deals.joinModal.successTitle}</h3>
                <p className="text-slate-500 font-medium pb-8">{t.deals.joinModal.successSubtitle}</p>
              </div>
            ) : (
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-700 border border-amber-100 shadow-sm">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">{t.deals.joinModal.title}</h2>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">{t.deals.joinModal.subtitle}</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t.deals.joinModal.fullName}</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        name="name" 
                        required 
                        defaultValue={user?.displayName || ''}
                        placeholder="e.g. John Smith"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium text-sm" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t.deals.joinModal.email}</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        name="email" 
                        type="email" 
                        required 
                        defaultValue={user?.email || ''}
                        placeholder="john@example.com"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium text-sm" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t.deals.joinModal.phone}</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        name="phone" 
                        required 
                        placeholder="(555) 000-0000"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium text-sm" 
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-5 bg-amber-50/50 rounded-2xl border border-amber-100 group">
                    <input 
                      type="checkbox" 
                      id="accredited-join"
                      name="isAccredited"
                      required
                      className="mt-1 w-5 h-5 rounded-lg border-amber-200 text-amber-600 focus:ring-amber-500/20"
                    />
                    <label htmlFor="accredited-join" className="text-[11px] font-bold text-slate-700 cursor-pointer select-none leading-relaxed">
                      {t.deals.joinModal.accreditedCert}
                    </label>
                  </div>

                  <p className="text-[10px] text-slate-400 italic text-center px-6">
                    {t.deals.joinModal.terms}
                  </p>

                  <button 
                    disabled={isSubmitting}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-xl hover:shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <TrendingUp className="w-5 h-5" />
                        {t.deals.joinModal.submit}
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
