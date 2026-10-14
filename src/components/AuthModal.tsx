import React, { useState } from 'react';
import { User } from '../types';
import { loginUser, registerUser } from '../services/api';
import { X, LogIn, UserPlus, Sparkles, Lock, Mail, User as UserIcon, Building, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [username, setUsername] = useState('');
  const [university, setUniversity] = useState('Yiwu Industrial & Commercial College');
  const [city, setCity] = useState('Yiwu');
  const [role, setRole] = useState<'student' | 'senior_helper'>('student');
  const [bio, setBio] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('English');
  const [learningLanguage, setLearningLanguage] = useState('Chinese (Mandarin)');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(loginEmail, loginPassword);
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await loginUser(demoEmail, 'password123');
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError('Please fill in all required fields (Name, Email, Password).');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        fullName,
        email: regEmail,
        password: regPassword,
        username: username || regEmail.split('@')[0],
        university,
        city,
        role,
        bio,
        nativeLanguages: [nativeLanguage],
        learningLanguages: [learningLanguage]
      });
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#FEFEFE] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 relative max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-800 p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider bg-[#CB0000]/10 text-[#CB0000] px-2.5 py-1 rounded-md">
              Real JWT Authentication
            </span>
          </div>
          <h2 className="text-2xl font-black font-display text-neutral-900">
            {mode === 'login' ? 'Log in to LINK UP' : 'Join LINK UP Platform'}
          </h2>
          <p className="text-xs text-neutral-600 font-normal">
            Connect with international students, housing, market trading, and campus channels in China.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'login' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'register' ? 'bg-[#CB0000] text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold animate-in fade-in">
            {error}
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Email or Username</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. amina.k@student.yicc.edu.cn"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-[#CB0000]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-[#CB0000]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#000000] text-white text-xs font-bold rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating JWT...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Log In to Account</span>
                </>
              )}
            </button>

            {/* Quick Demo Login Preset Buttons */}
            <div className="pt-3 border-t border-neutral-100 space-y-2">
              <div className="text-[10px] font-extrabold uppercase text-neutral-400 tracking-wider">
                Instant Demo Logins (Click to Log In)
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('amina.k@student.yicc.edu.cn')}
                  className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-left transition-all cursor-pointer"
                >
                  <div className="font-bold text-neutral-900 truncate">Amina (Yiwu Student)</div>
                  <div className="text-[10px] text-neutral-500 truncate">amina.k@student.yicc.edu.cn</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('weichen.senior@zju.edu.cn')}
                  className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-left transition-all cursor-pointer"
                >
                  <div className="font-bold text-neutral-900 truncate">Wei Chen (Senior Helper)</div>
                  <div className="text-[10px] text-neutral-500 truncate">weichen.senior@zju.edu.cn</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('samuel@fudan.edu.cn')}
                  className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-left transition-all cursor-pointer"
                >
                  <div className="font-bold text-neutral-900 truncate">Samuel (Shanghai Student)</div>
                  <div className="text-[10px] text-neutral-500 truncate">samuel@fudan.edu.cn</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin@linkup.cn')}
                  className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-left transition-all cursor-pointer"
                >
                  <div className="font-bold text-[#CB0000] truncate">System Admin</div>
                  <div className="text-[10px] text-neutral-500 truncate">admin@linkup.cn</div>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Marcus Johnson"
                  className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-[#CB0000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. marcus_yiwu"
                  className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-[#CB0000]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Email Address *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="marcus@university.edu.cn"
                  className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-[#CB0000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Password *</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-[#CB0000]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Role</label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none font-semibold cursor-pointer"
                >
                  <option value="student">International Student</option>
                  <option value="senior_helper">Senior Student Helper</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">City in China</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none font-semibold cursor-pointer"
                >
                  <option value="Yiwu">Yiwu</option>
                  <option value="Hangzhou">Hangzhou</option>
                  <option value="Shanghai">Shanghai</option>
                  <option value="Beijing">Beijing</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">University / College</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. Yiwu Industrial & Commercial College"
                className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-[#CB0000]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Bio / Introduction</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief intro about your major, interests, or what help you need in China..."
                rows={2}
                className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-[#CB0000]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#CB0000] text-white text-xs font-bold rounded-xl hover:bg-[#a60000] disabled:opacity-50 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Registering & Signing JWT Token...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Complete Real Registration</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
