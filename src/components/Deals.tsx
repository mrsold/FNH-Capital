import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  MapPin, 
  Building,
  Percent 
} from 'lucide-react';
import { getDeals, createDeal, updateDeal, deleteDeal, Deal } from '../services/dealService';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Deals() {
  const { t } = useLanguage();
  const { profile } = useUser();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Active' as const,
    loanAmount: '',
    interestRate: '',
    loanPeriod: '',
    location: '',
    propertyType: 'Residential (1-4 Units)',
    imageUrl: '',
    fundingProgress: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const data = await getDeals();
      setDeals(data);
    } catch (error) {
      console.error("Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = profile?.role === 'admin';

  const closeAndReset = () => {
    setShowModal(false);
    setEditingDealId(null);
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      title: '',
      description: '',
      status: 'Active',
      loanAmount: '',
      interestRate: '',
      loanPeriod: '',
      location: '',
      propertyType: 'Residential (1-4 Units)',
      imageUrl: '',
      fundingProgress: ''
    });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800000) { // Limit to ~800KB for Base64 in Firestore
        alert("Image is too large. Please select an image under 800KB.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isAdmin) return;
    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.imageUrl;
      
      // If a new file is selected, use its preview (Base64)
      if (imagePreview) {
        finalImageUrl = imagePreview;
      }

      const dealData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        loanAmount: formData.loanAmount ? parseFloat(formData.loanAmount) : undefined,
        interestRate: formData.interestRate,
        loanPeriod: formData.loanPeriod,
        location: formData.location,
        propertyType: formData.propertyType,
        fundingProgress: formData.fundingProgress ? parseFloat(formData.fundingProgress) : 0,
        imageUrl: finalImageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop'
      };

      if (editingDealId) {
        await updateDeal(editingDealId, dealData);
      } else {
        await createDeal(dealData);
      }

      closeAndReset();
      fetchDeals();
    } catch (error) {
      console.error("Error saving deal:", error);
      alert("Error saving deal. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (deal: Deal) => {
    setEditingDealId(deal.id!);
    setFormData({
      title: deal.title,
      description: deal.description,
      status: deal.status,
      loanAmount: deal.loanAmount?.toString() || '',
      interestRate: deal.interestRate || '',
      loanPeriod: deal.loanPeriod || '',
      location: deal.location || '',
      propertyType: deal.propertyType || 'Residential (1-4 Units)',
      imageUrl: deal.imageUrl || '',
      fundingProgress: deal.fundingProgress?.toString() || ''
    });
    setImagePreview(deal.imageUrl || null);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) return;
    try {
      await deleteDeal(id);
      fetchDeals();
    } catch (error) {
      console.error("Error deleting deal:", error);
    }
  };

  return (
    <section id="deals" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-sm font-bold text-amber-700 uppercase tracking-[0.2em] mb-4">{t.deals.title}</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-slate-900">{t.deals.subtitle}</h3>
          </div>
          
          {isAdmin && (
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-amber-700 text-white rounded-full font-bold hover:bg-amber-800 transition-all shadow-lg shadow-amber-900/20"
            >
              <Plus className="w-5 h-5" />
              {t.deals.addBtn}
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No deals posted yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal) => (
              <motion.div
                key={deal.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img 
                    src={deal.imageUrl} 
                    alt={deal.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4">
                    <StatusBadge status={deal.status} t={t} />
                  </div>
                  {isAdmin && (
                    <div className="absolute top-4 left-4 flex gap-2">
                      <button 
                        onClick={() => handleDelete(deal.id!)}
                        className="p-2 bg-white/90 backdrop-blur rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                        title={t.deals.deleteBtn}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(deal)}
                        className="p-2 bg-white/90 backdrop-blur rounded-full text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-50"
                        title={t.deals.editBtn}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="text-xl font-bold text-slate-900 mb-2 truncate">{deal.title}</h4>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{deal.description}</p>
                  
                  {(deal.status === 'Funding' || (deal.fundingProgress !== undefined && deal.fundingProgress > 0)) && (
                    <div className="mb-6 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-slate-400">{t.deals.form.progressLabel}</span>
                        <span className="text-amber-700">{deal.fundingProgress || 0}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.min(100, deal.fundingProgress || 0)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.3)]"
                        />
                      </div>
                      <div className="flex justify-end">
                        <span className="text-[9px] text-slate-400 font-medium">
                          {deal.fundingProgress && deal.fundingProgress >= 100 ? (
                            <span className="text-green-600 font-bold uppercase">{t.deals.form.fullyFunded}</span>
                          ) : (
                            <span>{100 - (deal.fundingProgress || 0)}% {t.deals.stillNeeded}</span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                      <span className="font-semibold text-slate-700">
                        {deal.loanAmount ? `$${deal.loanAmount.toLocaleString()}` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Building className="w-3.5 h-3.5 text-amber-600" />
                      <span className="truncate">{deal.propertyType || 'Residential'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span className="truncate">{deal.location || 'Undisclosed'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{deal.loanPeriod || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Percent className="w-3.5 h-3.5 text-amber-600" />
                      <span>{deal.interestRate || 'Competitive'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Post Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAndReset}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-2xl font-serif font-bold text-slate-900">
                    {editingDealId ? t.deals.form.editTitle : t.deals.form.newTitle}
                  </h4>
                  <button onClick={closeAndReset} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.deals.form.titleLabel}</label>
                      <input 
                        required
                        type="text" 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. $1.2M Multi-Family Bridge" 
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.deals.form.statusLabel}</label>
                      <select 
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value as any})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all appearance-none"
                      >
                        <option value="Active">{t.deals.form.statusActive}</option>
                        <option value="Funding">{t.deals.form.statusFunding}</option>
                        <option value="Closed">{t.deals.form.statusClosed}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.deals.form.descLabel}</label>
                    <textarea 
                      required
                      rows={3} 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Details about the loan and property..." 
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all resize-none" 
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.deals.form.amountLabel}</label>
                      <input 
                        type="number" 
                        value={formData.loanAmount}
                        onChange={e => setFormData({...formData, loanAmount: e.target.value})}
                        placeholder="1200000" 
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all font-mono" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.deals.form.rateLabel}</label>
                      <input 
                        type="text" 
                        value={formData.interestRate}
                        onChange={e => setFormData({...formData, interestRate: e.target.value})}
                        placeholder="e.g. 7.5%" 
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.deals.form.periodLabel}</label>
                      <select 
                        value={formData.loanPeriod}
                        onChange={e => setFormData({...formData, loanPeriod: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all appearance-none"
                      >
                        <option value="">Select Period</option>
                        <option value="6 Months">6 Months</option>
                        <option value="1 Year">1 Year</option>
                        <option value="2 Years">2 Years</option>
                        <option value="3 Years+">3 Years+</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.deals.form.locationLabel}</label>
                      <input 
                        type="text" 
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        placeholder="City, State" 
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.deals.form.progressLabel}</label>
                      <input 
                        type="number" 
                        min="0"
                        max="100"
                        value={formData.fundingProgress}
                        onChange={e => setFormData({...formData, fundingProgress: e.target.value})}
                        placeholder="e.g. 60" 
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all font-mono" 
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.deals.form.typeLabel}</label>
                      <select 
                        value={formData.propertyType}
                        onChange={e => setFormData({...formData, propertyType: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-amber-700/30 transition-all appearance-none"
                      >
                        <option value="Residential (1-4 Units)">Residential (1-4 Units)</option>
                        <option value="Multi-Family">Multi-Family</option>
                        <option value="Commercial Office">Commercial Office</option>
                        <option value="Mixed-Use">Mixed-Use</option>
                        <option value="Shopping Mall">Shopping Mall</option>
                        <option value="Land / Ground-up">Land / Ground-up</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.deals.form.imageLabel}</label>
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden" 
                          id="deal-image-upload"
                        />
                        <label 
                          htmlFor="deal-image-upload" 
                          className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 border-dashed hover:border-amber-700/30 cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            {imagePreview ? (
                              <div className="flex items-center gap-2">
                                <img src={imagePreview} className="w-8 h-8 rounded object-cover" alt="Preview" />
                                <span className="text-amber-700 font-medium">{t.deals.form.change}</span>
                              </div>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                <span>{t.deals.form.upload}</span>
                              </>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full py-5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : editingDealId ? t.deals.form.updateBtn : t.deals.form.saveBtn}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function StatusBadge({ status, t }: { status: string; t: any }) {
  const styles: any = {
    Active: "bg-green-50 text-green-700 border-green-100",
    Funding: "bg-amber-50 text-amber-700 border-amber-100",
    Closed: "bg-slate-50 text-slate-600 border-slate-200"
  };
  
  const labelMap: any = {
    Active: t.deals.form.statusActive,
    Funding: t.deals.form.statusFunding,
    Closed: t.deals.form.statusClosed
  };

  return (
    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
      {labelMap[status]}
    </div>
  );
}
