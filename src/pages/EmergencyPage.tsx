import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { EmergencyProtocol } from '../types';
import {
  ShieldAlert,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PhoneCall,
  Clock,
  HelpCircle,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { CprMetronome } from '../components/emergency/CprMetronome';
import { SearchWithHistory } from '../components/common/SearchWithHistory';

interface EmergencyPageProps {
  protocols: EmergencyProtocol[];
  onOpenHotlines: () => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ protocols, onOpenHotlines }) => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>(protocols[0]?.id || '');

  const categories = [
    { id: 'All', labelEn: 'All Emergencies', labelAr: 'جميع حالات الطوارئ' },
    { id: 'Cardiac', labelEn: 'Cardiac & Arrest', labelAr: 'القلب والإنعاش' },
    { id: 'Respiratory', labelEn: 'Airway & Choking', labelAr: 'التنفس والغصة' },
    { id: 'Trauma', labelEn: 'Trauma & Bleeding', labelAr: 'النزيف والإصابات' },
  ];

  const filteredProtocols = protocols.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const titleMatch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.titleAr.includes(searchTerm) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && titleMatch;
  });

  const activeProtocol =
    protocols.find((p) => p.id === selectedProtocolId) || filteredProtocols[0] || protocols[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wide">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>{isAr ? 'بروتوكولات الطوارئ والإنعاش الفوري' : 'Critical First-Aid & Resuscitation'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.emergencyTopicsTitle}
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            {t.emergencyHotlineNotice}
          </p>
        </div>

        <button
          onClick={onOpenHotlines}
          className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2.5 shrink-0 self-start md:self-center"
        >
          <PhoneCall className="w-4 h-4 animate-pulse" />
          <span>{isAr ? 'أرقام الطوارئ السريعة' : 'Emergency Hotlines'}</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:max-w-md">
          <SearchWithHistory
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            storageKey="mediguide_emergency_search_history"
            placeholder={isAr ? 'ابحث في حالات الطوارئ (مثل: إنعاش، غصة، نزيف)...' : 'Search protocols (CPR, choking, burn, bleeding)...'}
            accentColor="rose"
          />
        </div>

        {/* Interactive Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto w-full sm:w-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAr ? c.labelAr : c.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Protocol Selector & Interactive Protocol Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: List of Protocols (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            {isAr ? 'اختر الحالة الإسعافية' : 'Select Emergency Protocol'}
          </h3>

          <div className="space-y-2">
            {filteredProtocols.map((p) => {
              const isSelected = p.id === activeProtocol.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProtocolId(p.id)}
                  className={`w-full text-left rtl:text-right p-4 rounded-xl border transition-all block ${
                    isSelected
                      ? 'bg-rose-50 border-rose-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-rose-600 font-mono">
                      {p.code}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {p.category}
                    </span>
                  </div>

                  <h4 className={`text-sm font-bold ${isSelected ? 'text-rose-950' : 'text-slate-900'}`}>
                    {isAr ? p.titleAr : p.title}
                  </h4>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {isAr ? p.immediateActionsAr[0] : p.immediateActionsEn[0]}
                  </p>
                </button>
              );
            })}

            {filteredProtocols.length === 0 && (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
                {isAr ? 'لم يتم العثور على بروتوكول مطابق للبحث' : 'No emergency protocols matched your query.'}
              </div>
            )}
          </div>

          {/* CPR Metronome block when viewing CPR or always accessible */}
          {activeProtocol?.cprMetronomeAvailable && (
            <div className="mt-6">
              <CprMetronome />
            </div>
          )}
        </div>

        {/* Right Column: Detailed Step-by-Step Protocol (8 cols) */}
        {activeProtocol && (
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs">
            {/* Header of selected protocol */}
            <div className="border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2 text-xs text-rose-600 font-bold mb-2">
                <span>{activeProtocol.code}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-500 font-medium">{activeProtocol.category}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-rose-700 font-semibold">{activeProtocol.severity}</span>
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900">
                {isAr ? activeProtocol.titleAr : activeProtocol.title}
              </h2>
            </div>

            {/* Warning Signs */}
            <div className="p-5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{t.warningSignsLabel}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-amber-950 pl-2 rtl:pr-2 leading-relaxed">
                {(isAr ? activeProtocol.warningSignsAr : activeProtocol.warningSignsEn).map((sign, i) => (
                  <li key={i}>{sign}</li>
                ))}
              </ul>
            </div>

            {/* Immediate Actions Strip */}
            <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wide">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>{t.immediateActionsLabel}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-rose-950 pl-2 rtl:pr-2 leading-relaxed">
                {(isAr ? activeProtocol.immediateActionsAr : activeProtocol.immediateActionsEn).map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>

            {/* Step-by-Step Numbered Guide */}
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-900">
                {t.protocolStepsLabel}
              </h3>

              <div className="space-y-4">
                {activeProtocol.steps.map((step) => {
                  const stepTitle = isAr ? step.titleAr : step.titleEn;
                  const stepInst = isAr ? step.instructionAr : step.instructionEn;
                  const cautionary = isAr ? step.cautionaryNoteAr : step.cautionaryNoteEn;

                  return (
                    <div
                      key={step.stepNumber}
                      className="p-5 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {stepTitle}
                        </h4>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-10 rtl:pr-10 rtl:pl-0">
                        {stepInst}
                      </p>

                      {cautionary && (
                        <div className="ml-10 rtl:mr-10 rtl:ml-0 p-2.5 bg-amber-50 rounded-lg text-xs text-amber-900 border border-amber-200/60 flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{cautionary}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* What NOT to do (Contraindications) */}
            <div className="p-5 bg-red-50/60 border border-red-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-red-900 font-bold text-xs uppercase tracking-wide">
                <XCircle className="w-4 h-4 text-red-600" />
                <span>{t.whatNotToDoLabel}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-red-950 pl-2 rtl:pr-2 leading-relaxed">
                {(isAr ? activeProtocol.whatNotToDoAr : activeProtocol.whatNotToDoEn).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
