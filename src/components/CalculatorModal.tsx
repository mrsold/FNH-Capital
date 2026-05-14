import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calculator, ArrowRight, RefreshCw, Info } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalculatorModal({ isOpen, onClose }: CalculatorModalProps) {
  const { t } = useLanguage();
  
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [currentValue, setCurrentValue] = useState<number>(750000);
  const [arv, setArv] = useState<number>(1000000);
  const [points, setPoints] = useState<number>(2);
  const [renovationCost, setRenovationCost] = useState<number>(50000);
  const [closingCosts, setClosingCosts] = useState<number>(15000);
  
  const [results, setResults] = useState({
    monthlyPayment: 0,
    financialCharge: 0,
    ltv: 0,
    arvLtv: 0,
    netProfit: 0,
    roi: 0
  });

  useEffect(() => {
    const monthlyPayment = (loanAmount * (interestRate / 100)) / 12;
    const pointsCost = loanAmount * (points / 100);
    const ltv = (loanAmount / currentValue) * 100;
    const arvLtv = (loanAmount / arv) * 100;
    
    // Assume 12 month hold
    const totalLoanInterest = monthlyPayment * 12;
    const totalCosts = currentValue + renovationCost + closingCosts + pointsCost + totalLoanInterest;
    const netProfit = arv - totalCosts;
    
    const cashInvested = (currentValue - loanAmount) + renovationCost + closingCosts + pointsCost;
    const roi = (netProfit / Math.max(cashInvested, 1)) * 100;
    
    setResults({
      monthlyPayment,
      financialCharge: pointsCost,
      ltv,
      arvLtv,
      netProfit,
      roi
    });
  }, [loanAmount, interestRate, currentValue, arv, points, renovationCost, closingCosts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Inputs Section */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Calculator className="w-5 h-5 text-amber-700" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              {t.calculator.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                {t.calculator.loanAmount}
              </label>
              <input 
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">
                {t.calculator.interestRate}
              </label>
              <div className="relative">
                <input 
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-medium"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">
                {t.calculator.currentValue}
              </label>
              <input 
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">
                {t.calculator.arv}
              </label>
              <input 
                type="number"
                value={arv}
                onChange={(e) => setArv(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">
                {t.calculator.points}
              </label>
              <div className="relative">
                <input 
                  type="number"
                  step="0.5"
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-medium"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">
                {t.calculator.renovationCost}
              </label>
              <input 
                type="number"
                value={renovationCost}
                onChange={(e) => setRenovationCost(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">
                {t.calculator.closingCosts}
              </label>
              <input 
                type="number"
                value={closingCosts}
                onChange={(e) => setClosingCosts(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-medium"
              />
            </div>
            
            <div className="sm:col-span-2 pt-4">
               <button 
                onClick={() => {
                  setLoanAmount(500000);
                  setInterestRate(10);
                  setCurrentValue(750000);
                  setArv(1000000);
                  setPoints(2);
                  setRenovationCost(50000);
                  setClosingCosts(15000);
                }}
                className="flex items-center gap-2 text-slate-400 hover:text-amber-700 transition-colors text-sm font-bold"
               >
                 <RefreshCw className="w-4 h-4" />
                 {t.calculator.reset}
               </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="w-full md:w-[380px] bg-slate-900 p-8 md:p-12 text-white overflow-y-auto">
          <div className="space-y-8">
            <div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                {t.calculator.netProfit}
              </div>
              <div className={`text-4xl font-serif font-bold ${results.netProfit >= 0 ? 'text-amber-500' : 'text-red-500'}`}>
                ${results.netProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-6 border-t border-slate-800">
              <div>
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                  {t.calculator.monthlyPayment}
                </div>
                <div className="text-xl font-bold">
                   ${results.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                  {t.calculator.roi}
                </div>
                <div className={`text-xl font-bold ${results.roi >= 15 ? 'text-emerald-400' : results.roi > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                  {results.roi.toFixed(1)}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    {t.calculator.ltv}
                  </div>
                  <div className={`text-base font-bold ${results.ltv > 75 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {results.ltv.toFixed(1)}%
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    {t.calculator.arvLtv}
                  </div>
                  <div className={`text-base font-bold ${results.arvLtv > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {results.arvLtv.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <button 
                onClick={onClose}
                className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 group"
              >
                {t.contact.form.submit}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                * This calculator is for estimation purposes only. Final terms depend on underwriting and property appraisal.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
