import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userService } from '../services/api';
import { Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', birthDate: '', address: '', city: '', pincode: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        const formattedDate = data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '';
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          birthDate: formattedDate,
          address: data.address || '',
          city: data.city || '',
          pincode: data.pincode || ''
        });
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.updateProfile(formData);
      setEditing(false);
      toast.success("Profile Updated");
    } catch (error) {
      toast.error("Update Failed");
    } finally {
      setSaving(false);
    }
  };

  // Minimalist "Underline" Input Style
  const inputClass = "w-full border-b border-gray-200 dark:border-gray-700 py-3 text-sm focus:border-black dark:border-white focus:outline-none bg-transparent placeholder:text-gray-300 transition-colors disabled:opacity-50 disabled:border-transparent";
  const labelClass = "block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1";

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid md:grid-cols-12 gap-12">

          {/* Left: Sidebar / Header */}
          <div className="md:col-span-4">
            <h1 className="text-4xl font-extrabold uppercase tracking-tighter mb-4">Account<br />Settings</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Manage your personal data and shipping preferences.</p>

            <div className="hidden md:block space-y-2">
              <div className="w-12 h-1 bg-[#fdc600]"></div>
            </div>
          </div>

          {/* Right: The Form */}
          <div className="md:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-10">

              {/* Section 1: Identity */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold uppercase tracking-tight border-b border-black dark:border-white pb-2 mb-6">Personal Details</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input type="text" disabled={!editing} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input type="email" disabled value={formData.email} className={`${inputClass} text-gray-400 cursor-not-allowed`} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input type="tel" disabled={!editing} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input type="date" disabled={!editing} value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Section 2: Shipping */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold uppercase tracking-tight border-b border-black dark:border-white pb-2 mb-6">Shipping Address</h3>
                <div>
                  <label className={labelClass}>Address Line</label>
                  <input type="text" disabled={!editing} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={inputClass} placeholder="Street, Sector, Apt..." />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelClass}>City</label>
                    <input type="text" disabled={!editing} value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Pincode</label>
                    <input type="text" disabled={!editing} value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-8 flex justify-end gap-4">
                {!editing ? (
                  <button type="button" onClick={() => setEditing(true)} className="px-8 py-3 bg-black dark:bg-gray-800 text-white dark:text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button type="button" onClick={() => setEditing(false)} className="px-6 py-3 bg-transparent text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-black dark:hover:text-white transition-all">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} className="px-8 py-3 bg-[#fdc600] text-black dark:text-black text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 transition-all">
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;