import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Building2, 
  Trash2, 
  Edit3, 
  Search,
  Mail,
  ArrowLeft,
  Briefcase,
  Plus,
  Phone,
  Calendar,
  DollarSign,
  FileText,
  X,
  FilePlus,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  UserPlus,
  Download,
  AlertCircle
} from 'lucide-react';
import { compressImage } from '../lib/imageUtils';
import { 
  getBorrowers, 
  getInvestors, 
  getLoans, 
  upsertBorrower, 
  upsertInvestor, 
  deleteBorrower, 
  deleteInvestor,
  createLoan,
  updateLoan,
  deleteLoan,
  getLoanDocs,
  addLoanDoc,
  deleteLoanDoc,
  subscribeToLoanDocs,
  subscribeToLoans,
  updateLoanDocStats,
  syncAllLoanDocStats,
  Borrower,
  Investor,
  Loan,
  LoanDocument
} from '../services/adminService';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

type Tab = 'loans' | 'borrowers' | 'investors';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('loans');
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedLoanForDocs, setSelectedLoanForDocs] = useState<Loan | null>(null);
  const [selectedLoanDocs, setSelectedLoanDocs] = useState<LoanDocument[]>([]);
  const [previewDoc, setPreviewDoc] = useState<LoanDocument | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isModalOpen && editingItem && activeTab === 'loans') {
      setPendingImages(editingItem.images || []);
    } else if (isModalOpen && !editingItem) {
      setPendingImages([]);
    }
  }, [isModalOpen, editingItem, activeTab]);

  useEffect(() => {
    fetchData();
    const unsubscribe = subscribeToLoans((updatedLoans) => {
      // Sort loans: Active > Funding > Closed
      const statusWeight = { 'Active': 0, 'Funding': 1, 'Closed': 2 };
      const sortedLoans = [...updatedLoans].sort((a, b) => {
        const weightA = statusWeight[a.status] ?? 3;
        const weightB = statusWeight[b.status] ?? 3;
        return weightA - weightB;
      });
      setLoans(sortedLoans);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (isDocumentModalOpen && selectedLoanForDocs?.id) {
      unsubscribe = subscribeToLoanDocs(selectedLoanForDocs.id, (docs) => {
        setSelectedLoanDocs(docs);
      });
    } else {
      setSelectedLoanDocs([]);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isDocumentModalOpen, selectedLoanForDocs]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [b, i] = await Promise.all([
        getBorrowers(),
        getInvestors(),
      ]);
      setBorrowers(b);
      setInvestors(i);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBorrower = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Borrower = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
    };
    await upsertBorrower(data);
    setIsModalOpen(false);
    fetchData();
  };

  const handleSaveInvestor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Investor = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
    };
    await upsertInvestor(data);
    setIsModalOpen(false);
    fetchData();
  };

  const handleSaveLoan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Get multi-selected investors
    const selectedInvestors = Array.from(e.currentTarget.querySelectorAll('input[name="investors"]:checked'))
      .map((input: any) => (input as HTMLInputElement).value);

    // Get selected borrower
    const borrowerEmail = formData.get('borrowerEmail') as string;
    const borrower = borrowers.find(b => b.email === borrowerEmail);

    const loanData: Omit<Loan, 'id'> = {
      address: formData.get('address') as string,
      loanAmount: Number(formData.get('loanAmount')),
      interestRate: Number(formData.get('interestRate')),
      monthlyPayment: Number(formData.get('monthlyPayment')),
      maturityDate: formData.get('maturityDate') as string,
      arv: formData.get('arv') ? Number(formData.get('arv')) : 0,
      amountRaised: formData.get('amountRaised') ? Number(formData.get('amountRaised')) : 0,
      isFeatured: formData.get('isFeatured') === 'on',
      images: pendingImages,
      borrowerEmail: borrowerEmail,
      borrowerName: borrower?.name || '',
      investorEmails: selectedInvestors,
      status: (formData.get('status') as any) || 'Active',
    };

    setIsSaving(true);
    try {
      if (editingItem?.id) {
        await updateLoan(editingItem.id, loanData);
      } else {
        await createLoan(loanData);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setPendingImages([]);
      fetchData();
    } catch (error) {
      console.error('Error saving loan:', error);
      alert('Failed to save loan. The images might be too large or there was a connection issue.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (tab: Tab, id: string) => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    if (tab === 'borrowers') await deleteBorrower(id);
    if (tab === 'investors') await deleteInvestor(id);
    if (tab === 'loans') await deleteLoan(id);
    fetchData();
  };

  const handleAddDocuments = async (loanId: string, newDocs: { name: string, url: string }[]) => {
    setIsUploading(true);
    try {
      const docsToSave: Omit<LoanDocument, 'id'>[] = newDocs.map(doc => ({
        name: doc.name,
        url: doc.url,
        uploadedAt: new Date().toISOString()
      }));
      
      const promises = docsToSave.map(doc => addLoanDoc(loanId, doc));
      await Promise.all(promises);
      
      // Calculate updated stats locally to ensure UI consistency
      const updatedDocs = [...selectedLoanDocs, ...docsToSave];
      await updateLoanDocStats(loanId, updatedDocs as LoanDocument[]);
    } catch (error) {
      console.error("Document upload failed:", error);
      alert("Failed to save documents. They may be too large or you might have lost your session. Please ensure each file is under 500KB.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveDocument = async (loanId: string, docId: string) => {
    if (!window.confirm("Remove this document? This cannot be undone.")) return;
    setIsUploading(true);
    try {
      await deleteLoanDoc(loanId, docId);
      const updatedDocs = selectedLoanDocs.filter(d => d.id !== docId);
      await updateLoanDocStats(loanId, updatedDocs);
    } catch (error) {
      console.error("Document deletion failed:", error);
      alert("Could not delete the document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-3 bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-all">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Admin Terminal</h1>
              <p className="text-sm text-slate-500 font-medium">Control center for FNH Capital</p>
            </div>
          </div>
          
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => setActiveTab('loans')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${activeTab === 'loans' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <Briefcase className="w-4 h-4" />
              Loans
            </button>
            <button 
              onClick={() => setActiveTab('borrowers')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${activeTab === 'borrowers' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <Users className="w-4 h-4" />
              Borrowers
            </button>
            <button 
              onClick={() => setActiveTab('investors')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${activeTab === 'investors' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <TrendingUp className="w-4 h-4" />
              Investors
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-medium shadow-sm"
            />
          </div>
            <button 
              onClick={async () => {
                setIsSyncing(true);
                try {
                  await syncAllLoanDocStats();
                } finally {
                  setIsSyncing(false);
                }
              }}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-amber-600 hover:border-amber-200 transition-all disabled:opacity-50"
            >
              <FileText className={`w-3.5 h-3.5 ${isSyncing ? 'animate-pulse' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Doc Counts'}
            </button>
            <button 
              onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add {activeTab.slice(0, -1)}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'loans' && (
              <div className="grid grid-cols-1 gap-6">
                {loans.filter(l => l.address.toLowerCase().includes(searchTerm.toLowerCase())).map((loan) => (
                  <div key={loan.id} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-[5rem] -mr-8 -mt-8 transition-all group-hover:scale-110" />
                    
                    <div className="flex flex-col lg:flex-row justify-between gap-8 relative">
                      <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                              loan.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              loan.status === 'Funding' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              'bg-slate-50 text-slate-700 border-slate-100'
                            }`}>
                              {loan.status}
                            </span>
                            {loan.isFeatured && (
                              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                <TrendingUp className="w-3 h-3" />
                                Featured
                              </span>
                            )}
                            <button 
                              onClick={() => {
                                setSelectedLoanForDocs(loan);
                                setIsDocumentModalOpen(true);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-amber-600 transition-all shadow-sm"
                            >
                              <FileText className="w-3 h-3" />
                              Manage Files
                            </button>
                          </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2 truncate group-hover:text-amber-700 transition-colors">
                          {loan.address}
                        </h3>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Amount</p>
                            <p className="text-lg font-bold text-slate-900">${loan.loanAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">ARV</p>
                            <p className="text-lg font-bold text-emerald-600">${(loan.arv || 0).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Raised</p>
                            <p className="text-lg font-bold text-amber-600">${(loan.amountRaised || 0).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Rate</p>
                            <p className="text-lg font-bold text-slate-900">{loan.interestRate}%</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Monthly</p>
                            <p className="text-lg font-bold text-slate-900">${loan.monthlyPayment.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Maturity</p>
                            <p className="text-lg font-bold text-slate-900">{new Date(loan.maturityDate).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-slate-100">
                          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-bold text-slate-900">{loan.borrowerName}</span>
                            <span className="text-[10px] text-slate-400 font-medium">({loan.borrowerEmail})</span>
                          </div>
                          <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl">
                            <TrendingUp className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-bold text-amber-700">{loan.investorEmails?.length || 0} Investors</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-72 space-y-6">
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                              <FileText className="w-3 h-3 text-slate-400" />
                              Documents
                            </h4>
                            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                              {loan.documentCount || 0} {loan.documentCount === 1 ? 'File' : 'Files'}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {loan.lastDocs?.map((name, i) => (
                              <p key={i} className="text-[9px] text-slate-500 font-medium truncate max-w-[180px] flex items-center gap-1">
                                <span className="w-1 h-1 bg-amber-400 rounded-full" />
                                {name}
                              </p>
                            ))}
                            {(!loan.lastDocs || loan.lastDocs.length === 0) && (
                              <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                                No files uploaded yet.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button 
                            onClick={async () => {
                              const updatedLoan = { ...loan, isFeatured: !loan.isFeatured };
                              delete updatedLoan.id;
                              await updateLoan(loan.id!, updatedLoan as any);
                              fetchData();
                            }}
                            className={`p-3 rounded-xl transition-all hover:shadow-md active:scale-95 border ${
                              loan.isFeatured ? 'bg-amber-600 text-white border-amber-500' : 'bg-white text-slate-400 border-slate-200 hover:border-amber-200'
                            }`}
                            title={loan.isFeatured ? "Remove from Featured" : "Add to Featured"}
                          >
                            <TrendingUp className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setEditingItem(loan); setIsModalOpen(true); }}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
                          >
                            <Edit3 className="w-4 h-4" />
                            Details
                          </button>
                          <button 
                            onClick={() => handleDelete('loans', loan.id!)}
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all hover:shadow-md hover:shadow-red-500/10 active:scale-95"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'borrowers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {borrowers.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.email.toLowerCase().includes(searchTerm.toLowerCase())).map((b) => (
                  <div key={b.email} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-[4rem] -mr-4 -mt-4 transition-all group-hover:bg-amber-50" />
                    <div className="flex items-center gap-4 mb-6 relative">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                        <span className="text-xl font-bold text-amber-700">{b.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 truncate pr-4">{b.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                           <Mail className="w-3 h-3" />
                           {b.email}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 pb-6">
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <Phone className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-medium">{b.phone || 'No phone'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <Briefcase className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-medium">
                          {loans.filter(l => l.borrowerEmail === b.email).length} Properties
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <button 
                        onClick={() => { setEditingItem(b); setIsModalOpen(true); }}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors group/edit"
                      >
                        Edit Details
                        <ChevronRight className="w-3 h-3 group-hover/edit:translate-x-1 transition-transform" />
                      </button>
                      <button 
                        onClick={() => handleDelete('borrowers', b.email)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'investors' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investors.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.email.toLowerCase().includes(searchTerm.toLowerCase())).map((inv) => (
                   <div key={inv.email} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-[4rem] -mr-4 -mt-4 transition-all group-hover:bg-amber-50" />
                   <div className="flex items-center gap-4 mb-6 relative">
                     <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                       <span className="text-xl font-bold text-indigo-700">{inv.name.charAt(0)}</span>
                     </div>
                     <div className="flex-1 min-w-0">
                       <h4 className="font-bold text-slate-900 truncate pr-4">{inv.name}</h4>
                       <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium tracking-tight">
                          <Mail className="w-3 h-3" />
                          {inv.email}
                       </div>
                     </div>
                   </div>
                   <div className="space-y-3 pb-6">
                     <div className="flex items-center gap-3 text-slate-600">
                       <div className="p-2 bg-slate-50 rounded-lg">
                         <Phone className="w-3 h-3" />
                       </div>
                       <span className="text-sm font-medium">{inv.phone || 'No phone'}</span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-600">
                       <div className="p-2 bg-slate-50 rounded-lg">
                         <TrendingUp className="w-3 h-3" />
                       </div>
                       <span className="text-sm font-medium">
                         Invested in {loans.filter(l => l.investorEmails?.includes(inv.email)).length} deals
                       </span>
                     </div>
                   </div>
                   <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                     <button 
                        onClick={() => { setEditingItem(inv); setIsModalOpen(true); }}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors group/edit"
                      >
                       Manage Record
                       <ChevronRight className="w-3 h-3 group-hover/edit:translate-x-1 transition-transform" />
                     </button>
                     <button 
                       onClick={() => handleDelete('investors', inv.email)}
                       className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-700">
                    {activeTab === 'loans' ? <Briefcase className="w-5 h-5" /> : 
                     activeTab === 'borrowers' ? <Users className="w-5 h-5" /> : 
                     <TrendingUp className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-slate-900">
                      {editingItem ? 'Edit' : 'New'} {activeTab.slice(0, -1)}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Admin Record System</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form 
                onSubmit={activeTab === 'loans' ? handleSaveLoan : activeTab === 'borrowers' ? handleSaveBorrower : handleSaveInvestor}
                className="overflow-y-auto p-8 custom-scrollbar"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeTab === 'loans' ? (
                    <>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Property Address</label>
                        <input name="address" required defaultValue={editingItem?.address} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Loan Amount ($)</label>
                        <input name="loanAmount" type="number" required defaultValue={editingItem?.loanAmount} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">ARV ($)</label>
                        <input name="arv" type="number" defaultValue={editingItem?.arv || 0} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Amount Raised ($)</label>
                        <input name="amountRaised" type="number" defaultValue={editingItem?.amountRaised || 0} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Interest Rate (%)</label>
                        <input name="interestRate" type="number" step="0.1" required defaultValue={editingItem?.interestRate} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Monthly Payment ($)</label>
                        <input name="monthlyPayment" type="number" required defaultValue={editingItem?.monthlyPayment} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Maturity Date</label>
                        <input name="maturityDate" type="date" required defaultValue={editingItem?.maturityDate} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Status</label>
                        <select name="status" required defaultValue={editingItem?.status || 'Active'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium text-sm">
                          <option value="Active">Active</option>
                          <option value="Funding">Funding</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                          <input 
                            name="isFeatured" 
                            type="checkbox" 
                            defaultChecked={editingItem?.isFeatured}
                            className="w-5 h-5 rounded-lg text-amber-600 focus:ring-amber-500 border-amber-200"
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-800">Featured Deal</p>
                            <p className="text-[10px] text-amber-700/70 font-medium">Display this case in the featured gallery on the homepage.</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Property Images</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {pendingImages.map((img, i) => (
                              <div key={i} className="relative aspect-video rounded-xl overflow-hidden group">
                                <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                <button 
                                  type="button"
                                  onClick={() => setPendingImages(prev => prev.filter((_, idx) => idx !== i))}
                                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.multiple = true;
                                input.accept = 'image/*';
                                input.onchange = async (e: any) => {
                                  const files = Array.from(e.target.files as FileList);
                                  const newImages = await Promise.all(files.map(file => {
                                    return new Promise<string>((resolve) => {
                                      const reader = new FileReader();
                                      reader.onload = async () => {
                                        const result = reader.result as string;
                                        const compressed = await compressImage(result);
                                        resolve(compressed);
                                      };
                                      reader.readAsDataURL(file);
                                    });
                                  }));
                                  setPendingImages(prev => [...prev, ...newImages]);
                                };
                                input.click();
                              }}
                              className="aspect-video rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-all gap-1"
                            >
                              <FilePlus className="w-6 h-6" />
                              <span className="text-[10px] font-bold uppercase">Upload</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Borrower</label>
                        <select name="borrowerEmail" required defaultValue={editingItem?.borrowerEmail} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium text-sm">
                          <option value="">Select a borrower</option>
                          {borrowers.map(b => (
                            <option key={b.email} value={b.email}>{b.name} ({b.email})</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-3">
                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Investors</label>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 max-h-40 overflow-y-auto custom-scrollbar">
                           {investors.map(inv => (
                             <label key={inv.email} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-all cursor-pointer">
                               <input 
                                 type="checkbox" 
                                 name="investors" 
                                 value={inv.email} 
                                 defaultChecked={editingItem?.investorEmails?.includes(inv.email)}
                                 className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                               />
                               <span className="text-xs font-medium text-slate-700 truncate">{inv.name}</span>
                             </label>
                           ))}
                         </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                        <input name="name" required defaultValue={editingItem?.name} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium text-sm" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                        <input name="email" type="email" required readOnly={!!editingItem} defaultValue={editingItem?.email} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium text-sm read-only:opacity-50" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                        <input name="phone" defaultValue={editingItem?.phone} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium text-sm" />
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-12 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSaving} className="flex-1 px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all shadow-sm active:scale-95 disabled:opacity-50">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Manager Modal */}
      <AnimatePresence>
        {isDocumentModalOpen && selectedLoanForDocs && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden max-h-[95vh] flex flex-col"
            >
              {/* Uploading Overlay */}
              <AnimatePresence>
                {isUploading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[120] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center"
                  >
                    <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-slate-900 font-bold">Processing Documents...</p>
                    <p className="text-xs text-slate-500 mt-2 font-medium uppercase tracking-widest">Saving to database</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-700">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-slate-900 truncate max-w-[350px]">
                      {selectedLoanForDocs.address}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Project Files & Due Diligence</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setIsDocumentModalOpen(false); setSelectedLoanForDocs(null); fetchData(); }} 
                  className="p-2 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
                <div className="flex items-center justify-between mb-8">
                   <div>
                     <h3 className="text-sm font-bold text-slate-900">Document Repository</h3>
                     <p className="text-xs text-slate-400 mt-1">Manage files for this loan session ({selectedLoanDocs.length}).</p>
                   </div>
                   <button 
                     disabled={isUploading}
                     onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.multiple = true;
                        input.accept = '.pdf,.doc,.docx,.jpg,.png';
                        input.onchange = async (e: any) => {
                          const files = Array.from(e.target.files as FileList);
                          if (files.length > 0) {
                            const uploadPromises = files.map(file => {
                              return new Promise<{name: string, url: string} | null>((resolve) => {
                                if (file.size > 500000) {
                                  alert(`File "${file.name}" is too large (max 500KB).`);
                                  resolve(null);
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onload = () => resolve({ name: file.name, url: reader.result as string });
                                reader.onerror = () => resolve(null);
                                reader.readAsDataURL(file);
                              });
                            });
                            const results = await Promise.all(uploadPromises);
                            const uploads = results.filter((r): r is { name: string, url: string } => r !== null);
                            if (uploads.length > 0) {
                              await handleAddDocuments(selectedLoanForDocs.id!, uploads);
                            }
                          }
                        };
                        input.click();
                     }}
                     className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-amber-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                   >
                     <FilePlus className="w-5 h-5" />
                     ADD DOCUMENTS
                   </button>
                </div>

                <div className="grid gap-4">
                  {selectedLoanDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-amber-200 hover:bg-white transition-all shadow-sm">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-amber-600 border border-slate-100 transition-colors shadow-sm">
                            <FileText className="w-6 h-6" />
                         </div>
                         <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate max-w-[300px]">{doc.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                              Added {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 pr-2">
                         <button 
                           onClick={() => setPreviewDoc(doc)}
                           className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-slate-600 hover:text-amber-700 border border-slate-100 transition-all hover:shadow-md hover:border-amber-200"
                         >
                            <span className="text-[10px] font-bold uppercase tracking-wider">Preview</span>
                            <ExternalLink className="w-4 h-4" />
                         </button>
                         <button 
                           disabled={isUploading}
                           onClick={() => handleRemoveDocument(selectedLoanForDocs.id!, doc.id!)}
                           className="p-3 bg-white rounded-xl text-slate-400 hover:text-red-500 border border-slate-100 transition-all hover:shadow-md hover:border-red-100 disabled:opacity-50"
                           title="Delete Document"
                         >
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  ))}
                  {selectedLoanDocs.length === 0 && (
                    <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                        <FilePlus className="w-10 h-10 text-slate-300" />
                      </div>
                      <p className="text-slate-900 font-bold text-lg">Empty Repository</p>
                      <p className="text-sm text-slate-400 mt-2 font-medium">Click "Add Documents" to start building the project files.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/30 flex justify-center">
                 <button 
                   onClick={() => { setIsDocumentModalOpen(false); setSelectedLoanForDocs(null); fetchData(); }}
                   className="px-12 py-4 bg-slate-900 text-white rounded-[1.5rem] font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs"
                 >
                   Save Repository State & Close
                 </button>
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
    </div>
  );
}

