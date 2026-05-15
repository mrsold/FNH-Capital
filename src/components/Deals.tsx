import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  MapPin, 
  Building,
  Percent,
  FileText,
  TrendingUp,
  User,
  ChevronRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { where, or } from 'firebase/firestore';
import { getLoans, getLoanDocs, subscribeToLoanDocs, subscribeToLoans, Loan, LoanDocument } from '../services/adminService';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface DealCardProps {
  loan: Loan;
  idx: number;
  profile: any;
  onSelect: () => void;
  key?: any;
}

function DealCard({ loan, idx, profile, onSelect }: DealCardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (loan.images && loan.images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIdx(prev => (prev + 1) % loan.images!.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [loan.images]);

  const progress = Math.min(100, Math.round(((loan.amountRaised || 0) / loan.loanAmount) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <AnimatePresence mode="wait">
          {loan.images && loan.images.length > 0 ? (
            <motion.img 
              key={currentIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={loan.images[currentIdx]} 
              alt={loan.address}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building className="w-12 h-12 text-slate-200" />
            </div>
          )}
        </AnimatePresence>
        
        {/* Status Overlay */}
        <div className="absolute top-6 right-6">
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md shadow-lg ${
            loan.status === 'Active' ? 'bg-emerald-500/90 text-white' : 
            loan.status === 'Funding' ? 'bg-amber-500/90 text-white' : 
            'bg-slate-900/90 text-white'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              loan.status === 'Active' ? 'bg-white' : 
              loan.status === 'Funding' ? 'bg-white' : 
              'bg-slate-400'
            }`} />
            {loan.status}
          </div>
        </div>

        {loan.isFeatured && (
          <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-amber-600 text-white rounded-full text-[9px] font-black uppercase tracking-tighter shadow-xl">
            <TrendingUp className="w-3.5 h-3.5" />
            FEATURED
          </div>
        )}

        {loan.images && loan.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
            {loan.images.map((_, i) => (
              <div key={i} className={`w-1 h-1 rounded-full transition-all ${i === currentIdx ? 'bg-white w-3' : 'bg-white/40'}`} />
            ))}
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col flex-1">
        <h4 className="text-xl font-serif font-bold text-slate-900 mb-6 group-hover:text-amber-700 transition-colors uppercase tracking-tight line-clamp-1">
          {loan.address}
        </h4>

        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Amount</p>
            <p className="text-lg font-bold text-slate-900">${loan.loanAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Raised</p>
            <p className="text-lg font-bold text-amber-600">${(loan.amountRaised || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Yield</p>
            <p className="text-lg font-bold text-slate-900">{loan.interestRate}%</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Maturity</p>
            <p className="text-sm font-bold text-slate-600">{new Date(loan.maturityDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
            <span className="text-xs font-bold text-amber-700">{progress}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              className="h-full bg-amber-500 rounded-full"
            />
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-50 flex flex-col gap-4">
          <button 
            onClick={profile ? onSelect : () => navigate('/signup')}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-lg flex items-center justify-center gap-2 group/btn"
          >
            <TrendingUp className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            I WANT TO INVEST
          </button>
          
          <button 
            onClick={profile ? onSelect : () => navigate('/login')}
            className="w-full text-[10px] font-black text-slate-400 hover:text-amber-700 tracking-[0.2em] uppercase transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Deals() {
  const { t } = useLanguage();
  const { profile } = useUser();
  const navigate = useNavigate();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [selectedLoanDocs, setSelectedLoanDocs] = useState<LoanDocument[]>([]);
  const [previewDoc, setPreviewDoc] = useState<LoanDocument | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (selectedLoan) {
      setCurrentImageIndex(0);
    }
  }, [selectedLoan]);

  useEffect(() => {
    setLoading(true);
    const isAdmin = profile?.role === 'admin';
    const constraints = isAdmin ? [] : profile ? [] : [
      or(
        where('status', 'in', ['Active', 'Funding']),
        where('isFeatured', '==', true)
      )
    ];
    
    const unsubscribe = subscribeToLoans((data) => {
      // Show Active and Funding loans first, then Closed
      const statusWeight = { 'Active': 0, 'Funding': 1, 'Closed': 2 };
      const sorted = [...data].sort((a, b) => {
        const weightA = statusWeight[a.status] ?? 3;
        const weightB = statusWeight[b.status] ?? 3;
        return weightA - weightB;
      });
      setLoans(sorted);
      setLoading(false);
    }, constraints, (error) => {
      console.error("Subscription error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [profile]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (selectedLoan?.id && profile) {
      unsubscribe = subscribeToLoanDocs(selectedLoan.id, (docs) => {
        setSelectedLoanDocs(docs);
      });
    } else {
      setSelectedLoanDocs([]);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedLoan, profile]);

  const fetchLoans = async () => {
    try {
      const data = await getLoans();
      // Show Active and Funding loans first, then Closed
      const statusWeight = { 'Active': 0, 'Funding': 1, 'Closed': 2 };
      const sorted = [...data].sort((a, b) => {
        const weightA = statusWeight[a.status] ?? 3;
        const weightB = statusWeight[b.status] ?? 3;
        return weightA - weightB;
      });
      setLoans(sorted);
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = profile?.role === 'admin';

  const filteredLoans = loans.filter(loan => {
    if (isAdmin) return true;
    if (profile) {
      // Logged in investor: can see all active/funding, and closed ones they are part of OR featured closed ones
      if (loan.status !== 'Closed') return true;
      return loan.investorEmails?.includes(profile.email) || loan.isFeatured;
    }
    // Guest: see active/funding deals, and only FEATURED closed deals
    if (loan.status !== 'Closed') return true;
    return loan.isFeatured;
  });

  return (
    <section id="deals" className="py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-12 h-[1px] bg-amber-700" />
              <span className="text-sm font-bold text-amber-700 uppercase tracking-[0.3em]">{t.deals.title}</span>
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight"
            >
              {t.deals.subtitle}
            </motion.h3>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-500 font-medium max-w-sm"
          >
            {t.deals.trackRecord}
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-12 h-12 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold text-lg">{t.deals.noCases}</p>
            <p className="text-slate-400 text-sm mt-2">{t.deals.matchingOpp}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredLoans.map((loan: Loan, idx: number) => (
              <DealCard 
                key={loan.id || idx} 
                loan={loan} 
                idx={idx} 
                profile={profile}
                onSelect={() => setSelectedLoan(loan)}
              />
            ))}
          </div>
        )}

        <div className="mt-20 text-center">
           <p className="text-slate-400 text-sm font-medium mb-4">{t.deals.investQuery}</p>
           <button 
             onClick={() => navigate('/signup')}
             className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-xl hover:shadow-2xl active:scale-95"
           >
             {t.deals.joinNetwork}
           </button>
        </div>
      </div>

      {/* Case Details Modal */}
      <AnimatePresence>
        {selectedLoan && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLoan(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 md:p-12">
                <div className="flex items-center justify-between mb-10">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                         <Building className="w-6 h-6 text-amber-700" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-serif font-bold text-slate-900">{selectedLoan.address}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Case Record</span>
                        </div>
                      </div>
                   </div>
                   <button onClick={() => setSelectedLoan(null)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                     <X className="w-6 h-6 text-slate-400" />
                   </button>
                </div>

                {selectedLoan.images && selectedLoan.images.length > 0 && (
                  <div className="mb-10 group/carousel relative">
                    <div className="aspect-video rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 relative">
                      <AnimatePresence mode="wait">
                        <motion.img 
                          key={currentImageIndex}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          src={selectedLoan.images[currentImageIndex]} 
                          alt={`Property view ${currentImageIndex + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </AnimatePresence>

                      {selectedLoan.images.length > 1 && (
                        <>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(prev => (prev === 0 ? selectedLoan.images!.length - 1 : prev - 1));
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-md rounded-full text-slate-900 shadow-lg hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100"
                          >
                            <ChevronRight className="w-5 h-5 rotate-180" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(prev => (prev === selectedLoan.images!.length - 1 ? 0 : prev + 1));
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-md rounded-full text-slate-900 shadow-lg hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 p-2 bg-black/20 backdrop-blur-md rounded-full">
                        {selectedLoan.images.map((_, i) => (
                          <button 
                            key={i}
                            onClick={() => setCurrentImageIndex(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/40'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Basic Details visible to everyone */}
                <div className="grid md:grid-cols-2 gap-12 mb-10">
                   <div className="space-y-6">
                       <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                         <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Financial Overview</h5>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-200/50">
                               <span className="text-sm font-medium text-slate-500">Loan Amount</span>
                               <span className="font-bold text-slate-900">${selectedLoan.loanAmount.toLocaleString()}</span>
                            </div>
                            {profile && (
                              <div className="flex justify-between items-center pb-3 border-b border-slate-200/50">
                                 <span className="text-sm font-medium text-slate-500">ARV (After Repair Value)</span>
                                 <span className="font-bold text-emerald-600">${(selectedLoan.arv || 0).toLocaleString()}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center pb-3 border-b border-slate-200/50">
                               <span className="text-sm font-medium text-slate-500">Amount Raised</span>
                               <span className="font-bold text-amber-600">${(selectedLoan.amountRaised || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-slate-200/50">
                               <span className="text-sm font-medium text-slate-500">Interest Rate</span>
                               <span className="font-bold text-emerald-600">{selectedLoan.interestRate}% P.A</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-sm font-medium text-slate-500">Monthly Yield</span>
                               <span className="font-bold text-slate-900">${selectedLoan.monthlyPayment.toLocaleString()}</span>
                            </div>
                         </div>
                       </div>

                       <div className="flex items-center gap-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                          <Clock className="w-5 h-5 text-amber-700" />
                          <div>
                             <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Maturity Date</p>
                             <p className="text-sm font-bold text-slate-800">{new Date(selectedLoan.maturityDate).toLocaleDateString()}</p>
                          </div>
                       </div>
                   </div>

                   <div className="flex flex-col justify-center">
                      {!profile ? (
                        <div className="h-full py-8 px-6 text-center bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col justify-center">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Clock className="w-8 h-8 text-amber-600" />
                          </div>
                          <h5 className="text-xl font-serif font-bold text-slate-900 mb-3">Investor Access Only</h5>
                          <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed mb-8">
                            Documents and borrower details are only available to registered FNH Capital investors.
                          </p>
                          <div className="flex flex-col gap-3">
                            <button 
                              onClick={() => {
                                setSelectedLoan(null);
                                navigate('/signup');
                              }}
                              className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-sm"
                            >
                              Register Now
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedLoan(null);
                                navigate('/login');
                              }}
                              className="w-full py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold hover:border-slate-900 transition-all text-sm"
                            >
                              Investor Login
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                           <div>
                             <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Associated Documents ({selectedLoanDocs.length})</h5>
                             <div className="space-y-3">
                               {selectedLoanDocs.map((doc, i) => (
                                 <button 
                                   key={doc.id || i}
                                   onClick={() => setPreviewDoc(doc)}
                                   className="w-full flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-amber-200 hover:shadow-md transition-all group text-left"
                                 >
                                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-amber-700 group-hover:bg-amber-50 transition-colors">
                                     <FileText className="w-5 h-5" />
                                   </div>
                                   <div className="flex-1 min-w-0">
                                     <p className="text-sm font-bold text-slate-900 truncate">{doc.name}</p>
                                     <p className="text-[10px] text-slate-400">Project Document • {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                   </div>
                                   <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-700 group-hover:ml-1 transition-all" />
                                 </button>
                               ))}
                               {selectedLoanDocs.length === 0 && (
                                 <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-xs text-slate-400 font-medium italic">No documents available.</p>
                                 </div>
                               )}
                             </div>
                           </div>

                           <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <User className="w-5 h-5 text-slate-400" />
                              <div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Borrower</p>
                                 <p className="text-sm font-bold text-slate-800">{selectedLoan.borrowerName}</p>
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                </div>

                <div className="flex justify-center border-t border-slate-100 pt-10">
                   <button 
                     onClick={() => setSelectedLoan(null)}
                     className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                   >
                     Close Explorer
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* File Previewer Lightbox */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden h-[90vh] flex flex-col"
            >
               <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-700">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900 truncate max-w-[400px]">{previewDoc.name}</span>
                  </div>
                  <button 
                    onClick={() => setPreviewDoc(null)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
               </div>
               <div className="flex-1 bg-slate-100 flex items-center justify-center overflow-hidden relative">
                  <div className="w-full h-full p-8 flex flex-col items-center justify-center gap-6">
                    {previewDoc.url.startsWith('data:image') ? (
                      <div className="relative flex-1 w-full flex items-center justify-center">
                        <img src={previewDoc.url} alt={previewDoc.name} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
                      </div>
                    ) : (
                      <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-slate-200 max-w-md">
                        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <AlertCircle className="w-10 h-10 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Review Mode</h3>
                        <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                          For security reasons, some browsers block direct previews of multi-page documents in restricted windows.
                        </p>
                        <p className="text-xs text-slate-400 mb-8 italic">
                          Tip: Try opening the application in a new tab if you need full browser capabilities.
                        </p>
                        <button 
                           onClick={() => {
                             const base64 = previewDoc.url.split(',')[1];
                             const mime = previewDoc.url.split(',')[0].split(':')[1].split(';')[0];
                             const bytes = atob(base64);
                             const arr = new Uint8Array(bytes.length);
                             for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
                             const blob = new Blob([arr], { type: mime });
                             const url = URL.createObjectURL(blob);
                             const a = document.createElement('a');
                             a.href = url;
                             a.download = previewDoc.name;
                             a.click();
                             URL.revokeObjectURL(url);
                           }}
                           className="inline-flex items-center gap-3 px-8 py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-xl active:scale-95"
                        >
                          <Download className="w-5 h-5" />
                          DOWNLOAD & REVIEW
                        </button>
                      </div>
                    )}
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
