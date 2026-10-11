import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Heart, AlertTriangle, Video, BookOpen, Activity } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Safety & Educational Disclaimer Bar */}
      <div className="bg-slate-950/70 border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-300 font-semibold">{t.medicalDisclaimerHeading}:</strong>{' '}
            {t.medicalDisclaimerText}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Wordmark & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-xs shadow-xs">
                MG
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                {language === 'ar' ? 'دليل الصحة الطبي · MediGuide' : 'MediGuide Medical Platform'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
              {language === 'ar'
                ? 'منصة المعرفة الطبية والإرشاد الإسعافي والمرئي الشامل. تهدف إلى توفير بروتوكولات الإسعاف الأولي الطارئة، وشروحات الفيديو السريرية، وموسوعة طبية محكمة باللغتين العربية والإنجليزية.'
                : 'A comprehensive medical guidance, emergency first-aid, and clinical video learning platform. Adheres to evidence-based protocols in Arabic and English.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>AHA, WHO & Mayo Clinic Clinical Guidelines Adherence</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              {language === 'ar' ? 'أقسام المنصة' : 'Platform Navigation'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  {t.navHome}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('emergency')}
                  className="hover:text-white transition-colors"
                >
                  {t.navEmergency}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('knowledge')}
                  className="hover:text-white transition-colors"
                >
                  {t.navKnowledge}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('videos')}
                  className="hover:text-white transition-colors"
                >
                  {t.navVideos}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('doctors')}
                  className="hover:text-white transition-colors"
                >
                  {t.navDoctors}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('assistant')}
                  className="hover:text-white transition-colors"
                >
                  {t.navAssistant}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Medical Services & Standards */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              {language === 'ar' ? 'الخدمات السريرية' : 'Clinical Modules'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-400" />
                <span>{language === 'ar' ? 'ميترونوم الإنعاش القلبي (110 BPM)' : 'CPR Metronome (110 BPM)'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-sky-400" />
                <span>{language === 'ar' ? 'المكتبة المرئية والمناورات السريرية' : 'Procedural Clinical Videos'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                <span>{language === 'ar' ? 'الموسوعة الطبية المحكمة' : 'Peer-Reviewed Articles'}</span>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-teal-400 hover:text-teal-300 font-semibold underline mt-1"
                >
                  {t.adminPanel}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiet Copyright Row */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span>{t.footerCopyright}</span>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Clinical Informatics & Emergency Guidance Framework</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
