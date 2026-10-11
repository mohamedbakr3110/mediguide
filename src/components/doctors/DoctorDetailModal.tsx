import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { EgyptianDoctor } from '../../types';
import {
  X,
  Stethoscope,
  Building,
  MapPin,
  Phone,
  Clock,
  Award,
  ShieldCheck,
  Star,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface DoctorDetailModalProps {
  doctor: EgyptianDoctor | null;
  onClose: () => void;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({ doctor, onClose }) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  if (!doctor) return null;

  const name = isAr ? doctor.nameAr : doctor.name;
  const title = isAr ? doctor.titleAr : doctor.title;
  const specialty = isAr ? doctor.specialtyAr : doctor.specialtyEn;
  const subSpecialty = isAr ? doctor.subSpecialtyAr : doctor.subSpecialtyEn;
  const workplace = isAr ? doctor.workplaceAr : doctor.workplaceEn;
  const clinicAddress = isAr ? doctor.clinicAddressAr : doctor.clinicAddressEn;
  const clinicHours = isAr ? doctor.clinicBookingHoursAr : doctor.clinicBookingHoursEn;
  const bio = isAr ? doctor.bioAr : doctor.bioEn;
  const achievements = isAr ? doctor.achievementsAr : doctor.achievementsEn;
  const governorate = isAr ? doctor.governorateAr : doctor.governorateEn;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 ltr:right-4 rtl:left-4 p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors"
            aria-label="Close doctor details"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            {/* Avatar / Badge */}
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-teal-200 font-extrabold text-2xl shrink-0 shadow-md">
              {doctor.initials}
            </div>

            <div className="space-y-1.5 flex-1 pr-6 rtl:pr-0 rtl:pl-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-200 text-xs font-semibold border border-teal-300/30">
                  {specialty}
                </span>
                {doctor.isPioneer && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold border border-amber-300/30">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{t.verifiedPioneer}</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {name}
              </h2>

              <p className="text-xs sm:text-sm text-teal-100/90 leading-snug">
                {title}
              </p>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-white/10 rounded-xl p-2 backdrop-blur-xs">
              <div className="font-extrabold text-white text-sm sm:text-base flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{doctor.rating}</span>
              </div>
              <div className="text-teal-200 text-[11px] mt-0.5">
                {doctor.reviewCount} {isAr ? 'تقييم موثق' : 'verified reviews'}
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-2 backdrop-blur-xs">
              <div className="font-extrabold text-white text-sm sm:text-base">
                +{doctor.experienceYears} {isAr ? 'عاماً' : 'Years'}
              </div>
              <div className="text-teal-200 text-[11px] mt-0.5">
                {t.experienceYearsLabel}
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-2 backdrop-blur-xs">
              <div className="font-extrabold text-white text-sm sm:text-base flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'نقابة الأطباء' : 'Syndicate'}</span>
              </div>
              <div className="text-teal-200 text-[11px] mt-0.5 font-mono">
                {doctor.syndicateRegistrationNumber || 'EGY-REG-DOC'}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Sub-specialty highlight */}
          {subSpecialty && (
            <div className="p-3 bg-teal-50 border border-teal-200/70 rounded-xl flex items-center gap-2.5 text-xs text-teal-900">
              <Stethoscope className="w-4 h-4 text-teal-700 shrink-0" />
              <div>
                <span className="font-bold">{isAr ? 'التخصص الدقيق:' : 'Sub-Specialty:'}</span>{' '}
                <span>{subSpecialty}</span>
              </div>
            </div>
          )}

          {/* Workplace & Hospital */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-600" />
              <span>{t.workplaceLabel}</span>
            </h3>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-sm font-bold text-slate-900">
                {workplace}
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{isAr ? `المحافظة / المدينة: ${governorate}` : `Governorate / City: ${governorate}`}</span>
              </div>
            </div>
          </div>

          {/* Private Clinic Details */}
          {doctor.hasClinic && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{t.clinicLabel}</span>
              </h3>
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
                {clinicAddress && (
                  <div>
                    <div className="text-xs font-semibold text-emerald-900 mb-0.5">
                      {t.clinicAddressLabel}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {clinicAddress}
                    </div>
                  </div>
                )}

                {clinicHours && (
                  <div className="flex items-start gap-2 text-xs text-slate-600 pt-2 border-t border-emerald-100">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800">
                        {t.clinicHoursLabel}:
                      </span>{' '}
                      <span>{clinicHours}</span>
                    </div>
                  </div>
                )}

                {doctor.clinicPhone && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-emerald-100">
                    <div className="flex items-center gap-2 text-xs">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-800">
                        {t.clinicPhoneLabel}:
                      </span>
                      <span className="font-mono text-sm font-bold text-emerald-800">
                        {doctor.clinicPhone}
                      </span>
                    </div>

                    <a
                      href={`tel:${doctor.clinicPhone.replace(/[^0-9]/g, '')}`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t.callNow}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Clinical Bio */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>{t.doctorCardBio}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {bio}
            </p>
          </div>

          {/* Key Achievements */}
          {achievements && achievements.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{t.doctorKeyAchievements}</span>
              </h3>
              <ul className="space-y-2">
                {achievements.map((ach, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-amber-50/40 p-2.5 rounded-lg border border-amber-200/50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          <div className="pt-2 flex flex-wrap gap-1.5">
            {(isAr ? doctor.tagsAr : doctor.tagsEn).map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            {isAr
              ? 'البيانات مستقاة من السجلات الأكاديمية ونقابة الأطباء المصرية.'
              : 'Data verified via Egyptian Medical Syndicate records and academic directories.'}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors shrink-0"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
