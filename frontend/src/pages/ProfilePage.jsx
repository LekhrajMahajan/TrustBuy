import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userService } from '../services/api';
import { User, Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    city: '',
    pincode: ''
  });

  // 1. Fetch User Data
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
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);



  // 2. Handle Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.updateProfile(formData);
      setEditing(false);
      toast.success("Profile Updated Successfully!", {
        description: "Your changes have been saved."
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.", {
        description: "Please check your network and try again."
      });
    } finally {
      setSaving(false);
    }
  };

  // --- Custom Styles to Mimic the Design ---
  const fieldClass = "space-y-2";
  const labelClass = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900";
  const inputClass = "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-500 transition-all";
  const descriptionClass = "text-[0.8rem] text-slate-500";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 flex justify-center px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl border border-slate-200 shadow-sm">

        <div className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-6">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
            <User className="h-6 w-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Profile Settings</h1>
            <p className="text-sm text-slate-500">Manage your personal information.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Field Group */}
          <div className="grid gap-6">

            {/* Name */}
            <div className={fieldClass}>
              <label htmlFor="form-name" className={labelClass}>Name</label>
              <input
                id="form-name"
                type="text"
                disabled={!editing}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your Name"
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div className={fieldClass}>
              <label htmlFor="form-email" className={labelClass}>Email</label>
              <input
                id="form-email"
                type="email"
                disabled
                value={formData.email}
                className={inputClass}
              />
              <p className={descriptionClass}>
                We'll never share your email with anyone.
              </p>
            </div>

            {/* Grid: Phone & DOB */}
            <div className="grid grid-cols-2 gap-4">
              <div className={fieldClass}>
                <label htmlFor="form-phone" className={labelClass}>Phone</label>
                <input
                  id="form-phone"
                  type="tel"
                  disabled={!editing}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765..."
                  className={inputClass}
                />
              </div>

              <div className={fieldClass}>
                <label htmlFor="form-dob" className={labelClass}>Birth Date</label>
                <input
                  id="form-dob"
                  type="date"
                  disabled={!editing}
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Address */}
            <div className={fieldClass}>
              <label htmlFor="form-address" className={labelClass}>Address</label>
              <input
                id="form-address"
                type="text"
                disabled={!editing}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main St"
                className={inputClass}
              />
            </div>

            {/* Grid: City & Pincode */}
            <div className="grid grid-cols-2 gap-4">
              <div className={fieldClass}>
                <label htmlFor="form-city" className={labelClass}>City</label>
                <input
                  id="form-city"
                  type="text"
                  disabled={!editing}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className={fieldClass}>
                <label htmlFor="form-pincode" className={labelClass}>Pincode</label>
                <input
                  id="form-pincode"
                  type="text"
                  disabled={!editing}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProfilePage;