import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { User, UserRole } from '../types';
import { api } from '../services/api';
import {
  Lock,
  Mail,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Stethoscope,
  GraduationCap,
  User as UserIcon,
} from 'lucide-react';

interface AuthPageProps {
  onSuccessAuth: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccessAuth }) => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('Doctor');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg(isAr ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
      return;
    }

    if (mode !== 'forgot' && (!password || password.length < 6)) {
      setErrorMsg(
        isAr ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.' : 'Password must be at least 6 characters.'
      );
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login(email, password);
        onSuccessAuth(res.user);
      } else if (mode === 'register') {
        const res = await api.register({
          fullName,
          fullNameAr: fullName,
          email,
          password,
          role,
        });
        onSuccessAuth(res.user);
      } else {
        await new Promise((r) => setTimeout(r, 600));
        setSuccessMsg(
          isAr
            ? 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.'
            : 'Password reset link has been dispatched to your email address.'
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication operation failed.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (selectedRole: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('SecurePass2026!');
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.login(demoEmail, 'SecurePass2026!');
      onSuccessAuth(res.user);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-md">
          MG
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {mode === 'login'
            ? t.loginTitle
            : mode === 'register'
            ? t.registerTitle
            : t.forgotPasswordTitle}
        </h1>
        <p className="text-xs text-slate-500">
          {isAr
            ? 'بوابة الدخول الموحدة للأطباء، الطلاب، والمستخدمين في منصة دليل الصحة'
            : 'Unified healthcare access portal for physicians, students, and patients'}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex p-1 bg-slate-200/80 rounded-xl text-xs font-medium">
        <button
          onClick={() => {
            setMode('login');
            setErrorMsg('');
          }}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            mode === 'login' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.login}
        </button>
        <button
          onClick={() => {
            setMode('register');
            setErrorMsg('');
          }}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            mode === 'register' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.register}
        </button>
        <button
          onClick={() => {
            setMode('forgot');
            setErrorMsg('');
          }}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            mode === 'forgot' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.forgotPasswordLink}
        </button>
      </div>

      {/* Fast Demo Access Card */}
      {mode === 'login' && (
        <div className="p-4 bg-white rounded-2xl border border-teal-100 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-bold text-slate-800">
              {isAr ? 'تسجيل دخول سريع للتجربة:' : 'Fast Role Switcher:'}
            </span>
            <span className="text-[11px] text-teal-700 font-medium">
              {isAr ? '1-نقرة للدخول' : '1-click access'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('Admin', 'admin@mediguide.platform')}
              className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold transition-all flex items-center gap-2 text-left rtl:text-right"
            >
              <Shield className="w-4 h-4 text-purple-600 shrink-0" />
              <div>
                <span className="block leading-tight">{isAr ? 'مدير المنصة' : 'Admin'}</span>
                <span className="text-[10px] text-purple-700 font-normal">
                  {isAr ? 'صلاحيات كاملة' : 'Full Access'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('Doctor', 'tarek.mansour@student.cu.edu.eg')}
              className="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 font-bold transition-all flex items-center gap-2 text-left rtl:text-right"
            >
              <Stethoscope className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <span className="block leading-tight">{isAr ? 'طبيب مراجع' : 'Doctor'}</span>
                <span className="text-[10px] text-teal-700 font-normal">
                  {isAr ? 'اعتماد محتوى' : 'Reviewer'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('Student', 'karim.med@student.cu.edu.eg')}
              className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 font-bold transition-all flex items-center gap-2 text-left rtl:text-right"
            >
              <GraduationCap className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <span className="block leading-tight">{isAr ? 'طالب طب' : 'Student'}</span>
                <span className="text-[10px] text-sky-700 font-normal">
                  {isAr ? 'مساهم سريري' : 'Contributor'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('Patient', 'nour.hassan@gmail.com')}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold transition-all flex items-center gap-2 text-left rtl:text-right"
            >
              <UserIcon className="w-4 h-4 text-slate-600 shrink-0" />
              <div>
                <span className="block leading-tight">{isAr ? 'مستخدم / مريض' : 'Patient'}</span>
                <span className="text-[10px] text-slate-600 font-normal">
                  {isAr ? 'ملف شخصي' : 'Standard'}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Main Authentication Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {mode === 'register' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.fullNameLabel}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isAr ? 'د. محمد بكر' : 'Dr. Mohamed Bakr'}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {t.emailLabel}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@mediguide.platform"
              className="w-full pl-9 rtl:pr-9 rtl:pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
            />
          </div>
        </div>

        {mode !== 'forgot' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.passwordLabel}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 rtl:pr-9 rtl:pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {mode === 'register' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.roleLabel}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Doctor">{t.roleDoctor}</option>
              <option value="Student">{t.roleStudent}</option>
              <option value="Patient">{t.rolePatient}</option>
              <option value="Admin">{t.roleAdmin}</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-xs"
        >
          {loading
            ? isAr
              ? 'جاري التحقق...'
              : 'Authenticating...'
            : mode === 'login'
            ? t.submitLogin
            : mode === 'register'
            ? t.submitRegister
            : t.resetPasswordSubmit}
        </button>
      </form>
    </div>
  );
};
