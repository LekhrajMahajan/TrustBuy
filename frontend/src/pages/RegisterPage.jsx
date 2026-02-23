import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user', address: '', city: '', pincode: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password, formData.role, formData.address, formData.city, formData.pincode, formData.phone);
    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success('Account Created!', { description: 'Please login to continue.' });
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center md:text-left">
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create Account.</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Join us to access exclusive drops and dynamic pricing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full border-b border-gray-300 dark:border-white py-3 text-gray-900 dark:text-white dark:bg-black placeholder:text-gray-300 focus:border-black dark:focus:border-white focus:outline-none transition-colors sm:text-sm"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full border-b border-gray-300 dark:border-white py-3 text-gray-900 dark:text-white dark:bg-black placeholder:text-gray-300 focus:border-black dark:focus:border-white focus:outline-none transition-colors sm:text-sm"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full border-b border-gray-300 dark:border-white py-3 text-gray-900 dark:text-white dark:bg-black placeholder:text-gray-300 focus:border-black dark:focus:border-white focus:outline-none transition-colors sm:text-sm pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="block w-full border-b border-gray-300 dark:border-white py-3 text-gray-900 dark:text-white dark:bg-black placeholder:text-gray-300 focus:border-black dark:focus:border-white focus:outline-none transition-colors sm:text-sm"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Address</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="block w-full border-b border-gray-300 dark:border-white py-3 text-gray-900 dark:text-white dark:bg-black placeholder:text-gray-300 focus:border-black dark:focus:border-white focus:outline-none transition-colors sm:text-sm"
                placeholder="123 Main St"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="block w-full border-b border-gray-300 dark:border-white py-3 text-gray-900 dark:text-white dark:bg-black placeholder:text-gray-300 focus:border-black dark:focus:border-white focus:outline-none transition-colors sm:text-sm"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="block w-full border-b border-gray-300 dark:border-white py-3 text-gray-900 dark:text-white dark:bg-black placeholder:text-gray-300 focus:border-black dark:focus:border-white focus:outline-none transition-colors sm:text-sm"
                  placeholder="400001"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center bg-black dark:bg-black border border-transparent dark:border-white px-4 py-4 text-sm font-bold text-white dark:text-white uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-black dark:text-white hover:underline underline-offset-4">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;