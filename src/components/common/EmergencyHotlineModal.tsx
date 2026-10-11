import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X, PhoneCall, AlertOctagon, ShieldAlert } from 'lucide-react';
import { emergencyHotlines } from '../../services/mockData';

interface HotlinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyHotlineModal: React.FC<HotlinesModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-rose-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hotline-title"
      >
        {/* Urgent Red Header */}
        <div className="bg-rose-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 id="hotline-title" className="text-base font-bold">
                {language === 'ar' ? 'أرقام طوارئ الإسعاف والإنقاذ' : 'Emergency & EMS Hotlines'}
              </h3>
              <p className="text-xs text-rose-100">
                {language === 'ar' ? 'اتصل فوراً لطلب الدعم في الحالات المهددة للحياة' : 'Call immediately for life-threatening medical emergencies'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close hotline dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p>
              {language === 'ar'
                ? 'إذا كان المصاب فاقداً للوعي أو لا يتنفس أو ينزف بغزارة، لا تتردد في الاتصال بالإسعاف فوراً أثناء تقديم الإسعافات الأولية.'
                : 'If the patient is unconscious, not breathing, or hemorrhaging severely, dial EMS immediately while beginning first-aid compressions.'}
            </p>
          </div>

          <div className="space-y-2.5 divide-y divide-slate-100">
            {emergencyHotlines.map((hotline, idx) => (
              <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">{hotline.country}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{language === 'ar' ? 'الإسعاف' : 'Ambulance'}:</span>
                    <span className="font-bold text-rose-600 font-mono text-sm">{hotline.ambulance}</span>
                    {hotline.police && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{language === 'ar' ? 'الشرطة' : 'Police'}: {hotline.police}</span>
                      </>
                    )}
                  </div>
                </div>

                <a
                  href={`tel:${hotline.ambulance}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'اتصال' : 'Dial'} {hotline.ambulance}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};
