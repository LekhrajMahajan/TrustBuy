import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate(); // ✅ Hook Initialized

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success("Successfully Logged In!", {
        description: "Welcome back!",
      });
      navigate('/');
    } else {
      toast.error("Login Failed", {
        description: result.message,
      });
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Redirecting to Google Login...");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-sm">

        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              TB
            </div>
            <Link to="/register" className="text-sm font-medium text-yellow-600 hover:underline underline-offset-4">
              Sign Up
            </Link>
          </div>
          <h3 className="text-2xl font-semibold leading-none tracking-tight text-slate-900">Login to your account</h3>
          <p className="text-sm text-gray-500">
            Enter your email below to login to your account
          </p>
        </div>

        <div className="p-6 pt-0">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600 h-10 w-full shadow-md transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col gap-2 p-6 pt-0">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or continue with</span></div>
          </div>
          <button type="button" onClick={handleGoogleLogin} className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-200 bg-white hover:bg-gray-100 h-10 w-full transition-colors">
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;