import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Building2, 
  Trash2, 
  Edit3, 
  Search,
  Mail,
  Shield,
  ArrowLeft
} from 'lucide-react';
import { getAllUsers, UserProfile, updateUserProfile } from '../services/userService';
import { getDeals, Deal, deleteDeal } from '../services/dealService';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'users' | 'deals'>('users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allUsers, allDeals] = await Promise.all([
        getAllUsers(),
        getDeals()
      ]);
      setUsers(allUsers);
      setDeals(allDeals);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (uid: string, newRole: any) => {
    try {
      await updateUserProfile(uid, { role: newRole });
      fetchData();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDeleteDeal = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteDeal(id);
      fetchData();
    } catch (error) {
      console.error("Error deleting deal:", error);
    }
  };

  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeals = deals.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Admin Dashboard</h1>
          </div>
          
          <div className="flex bg-white p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'users' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Users className="w-4 h-4" />
              Users
            </button>
            <button 
              onClick={() => setActiveTab('deals')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'deals' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Building2 className="w-4 h-4" />
              Deals
            </button>
          </div>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder={activeTab === 'users' ? "Search by email or name..." : "Search by title or location..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:border-amber-700/30 transition-all shadow-sm"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeTab === 'users' ? (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">User</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Joined</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <React.Fragment key={user.uid}>
                    <tr 
                      className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${expandedUserId === user.uid ? 'bg-slate-50' : ''}`}
                      onClick={() => setExpandedUserId(expandedUserId === user.uid ? null : user.uid)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                            {user.displayName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{user.displayName}</div>
                            <div className="text-sm text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={user.role}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                          className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border bg-transparent focus:outline-none ${
                            user.role === 'admin' ? 'text-amber-700 border-amber-200 bg-amber-50' : 
                            user.role === 'investor' ? 'text-blue-700 border-blue-200 bg-blue-50' : 
                            'text-green-700 border-green-200 bg-green-50'
                          }`}
                        >
                          <option value="borrower">Borrower</option>
                          <option value="investor">Investor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'New'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={(e) => { e.stopPropagation(); /* delete logic? */ }}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    {expandedUserId === user.uid && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={4} className="px-6 py-8 border-t border-slate-100">
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {user.role === 'investor' ? (
                              <>
                                <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Invest Capacity</div>
                                  <div className="font-bold text-slate-900">{user.investAmount || 'N/A'}</div>
                                </div>
                                <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Accredited</div>
                                  <div className={`font-bold ${user.isAccredited ? 'text-green-600' : 'text-slate-500'}`}>
                                    {user.isAccredited ? 'YES' : 'NO'}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Loan Type</div>
                                  <div className="font-bold text-slate-900">{user.loanType || 'N/A'}</div>
                                </div>
                                <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Loan Amount</div>
                                  <div className="font-bold text-slate-900">${user.loanAmount?.toLocaleString() || 'N/A'}</div>
                                </div>
                                <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Property Value</div>
                                  <div className="font-bold text-slate-900">${user.propertyValue?.toLocaleString() || 'N/A'}</div>
                                </div>
                                <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Term</div>
                                  <div className="font-bold text-slate-900">{user.duration || 'N/A'}</div>
                                </div>
                              </>
                            )}
                            <div className="md:col-span-2 lg:col-span-4">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Experience / Notes</div>
                              <p className="text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-100 italic">
                                {user.experience || "No additional information provided."}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm group">
                <div className="aspect-video relative">
                  <img src={deal.imageUrl} alt={deal.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                    {deal.status}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-slate-900 mb-1">{deal.title}</h4>
                  <p className="text-sm text-slate-500 mb-4 truncate">{deal.location}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="text-xs font-bold text-amber-700">${deal.loanAmount?.toLocaleString()}</div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => handleDeleteDeal(deal.id!)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
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
      </div>
    </div>
  );
}
