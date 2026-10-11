import React from 'react';
import { HeartPulse, Brain, Baby, Flame, ShieldAlert, BookOpen, Stethoscope, Sparkles } from 'lucide-react';

interface MedicalVisualProps {
  type: 'cpr' | 'cardiology' | 'pediatrics' | 'neurology' | 'burns' | 'hero' | 'general';
  title?: string;
  className?: string;
}

export const MedicalVisualPlaceholder: React.FC<MedicalVisualProps> = ({ type, title, className = '' }) => {
  const getTheme = () => {
    switch (type) {
      case 'cpr':
        return {
          bg: 'bg-gradient-to-br from-rose-900 via-red-800 to-slate-900',
          accent: 'text-rose-300',
          icon: ShieldAlert,
          label: 'Emergency Resuscitation Protocol',
          sub: 'AHA Life Support Guidelines 2026',
        };
      case 'cardiology':
        return {
          bg: 'bg-gradient-to-br from-cyan-950 via-sky-900 to-slate-900',
          accent: 'text-cyan-300',
          icon: HeartPulse,
          label: 'Cardiovascular Clinical Review',
          sub: 'Hemodynamic & Arterial Workup',
        };
      case 'pediatrics':
        return {
          bg: 'bg-gradient-to-br from-teal-950 via-emerald-900 to-slate-900',
          accent: 'text-emerald-300',
          icon: Baby,
          label: 'Pediatric Clinical Care',
          sub: 'Evidence-Based Weight Dosing',
        };
      case 'neurology':
        return {
          bg: 'bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-900',
          accent: 'text-indigo-300',
          icon: Brain,
          label: 'Neurological Assessment & Stroke',
          sub: 'F.A.S.T. Acute Recognition Protocol',
        };
      case 'burns':
        return {
          bg: 'bg-gradient-to-br from-amber-950 via-orange-900 to-slate-900',
          accent: 'text-amber-300',
          icon: Flame,
          label: 'Thermal Burn First-Aid',
          sub: '20-Minute Water Cooling Protocol',
        };
      case 'hero':
        return {
          bg: 'bg-gradient-to-br from-sky-900 via-teal-900 to-slate-950',
          accent: 'text-teal-300',
          icon: Stethoscope,
          label: 'MediGuide Clinical Intelligence',
          sub: 'ASP.NET Core Web API Integration',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900',
          accent: 'text-teal-300',
          icon: BookOpen,
          label: 'Medical Knowledge Archive',
          sub: 'Peer-Reviewed Clinical Literature',
        };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-white/10 ${theme.bg} p-6 text-white flex flex-col justify-between select-none shadow-sm ${className}`}
      style={{ minHeight: '160px' }}
    >
      {/* Subtle graphic background grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <Icon className={`w-4 h-4 ${theme.accent}`} />
          </div>
          <span className="text-xs font-medium tracking-wide text-white/80">
            {theme.label}
          </span>
        </div>
        <Sparkles className="w-3.5 h-3.5 text-white/30" />
      </div>

      <div className="relative z-10 my-auto py-2">
        {title ? (
          <h4 className="text-base font-semibold leading-snug text-white line-clamp-2">
            {title}
          </h4>
        ) : (
          <p className="text-xs text-white/70 line-clamp-1">{theme.sub}</p>
        )}
      </div>

      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-white/60">
        <span>MediGuide Clinical Repository</span>
        <span className="font-mono text-[10px]">VERIFIED 2026</span>
      </div>
    </div>
  );
};
