import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Sparkles, User, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const result = login({ username, password });
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Login failed');
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#334155] via-[#475569] to-[#1e293b] p-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Material Library</h1>
          <p className="text-white/60 mt-2 text-sm">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-[#0f172a] mb-1">Welcome back</h2>
          <p className="text-sm text-[#64748b] mb-6">Enter your credentials to continue</p>

          {error && (
            <div className="mb-4 p-3 bg-[#fee2e2] border border-[#fecaca] rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#dc2626] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#dc2626]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-6 border-t border-[#e2e8f0]">
            <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-2">
              Demo Accounts
            </p>
            <div className="space-y-2 text-xs text-[#64748b]">
              <div className="flex items-center justify-between bg-[#f8fafc] rounded p-2">
                <div>
                  <span className="font-medium text-[#0f172a]">Admin</span>
                  <span className="mx-2">·</span>
                  <span>admin / admin123</span>
                </div>
                <span className="text-[#3b82f6]">Full access</span>
              </div>
              <div className="flex items-center justify-between bg-[#f8fafc] rounded p-2">
                <div>
                  <span className="font-medium text-[#0f172a]">Supplier (NYLtex)</span>
                  <span className="mx-2">·</span>
                  <span>nyltex / nyltex123</span>
                </div>
                <span className="text-[#f59e0b]">Limited</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-white/50 mt-6">
          Material Library v1.0 · Powered by AI
        </p>
      </div>
    </div>
  );
}
