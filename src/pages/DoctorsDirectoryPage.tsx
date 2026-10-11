import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { EgyptianDoctor, DoctorSpecialty } from '../types';
import { mockEgyptianDoctors } from '../services/doctorsData';
import { DoctorDetailModal } from '../components/doctors/DoctorDetailModal';
import { SearchWithHistory } from '../components/common/SearchWithHistory';
import {
  Stethoscope,
  Building,
  MapPin,
  Phone,
  Sparkles,
  Star,
  ShieldCheck,
  CheckCircle2,
  Filter,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  Award,
  Clock,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface DoctorsDirectoryPageProps {
  onNavigateHome?: () => void;
  doctors?: EgyptianDoctor[];
}

export const DoctorsDirectoryPage: React.FC<DoctorsDirectoryPageProps> = ({
  onNavigateHome,
  doctors = mockEgyptianDoctors,
}) => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('All');
  const [onlyWithClinic, setOnlyWithClinic] = useState<boolean>(false);
  const [onlyPioneers, setOnlyPioneers] = useState<boolean>(false);
  const [activeDoctorModal, setActiveDoctorModal] = useState<EgyptianDoctor | null>(null);

  const specialties = [
    { id: 'All', labelEn: 'All Specialties', labelAr: 'جميع التخصصات' },
    { id: 'Cardiology', labelEn: 'Cardiology & Surgery', labelAr: 'القلب والأوعية الدموية' },
    { id: 'Nephrology', labelEn: 'Nephrology & Urology', labelAr: 'الكلى والمسالك البولية' },
    { id: 'CriticalCare', labelEn: 'Critical Care & Internal', labelAr: 'الحالات الحرجة والباطنة' },
    { id: 'Pulmonology', labelEn: 'Chest & Respiratory', labelAr: 'الصدر والجهاز التنفسي' },
    { id: 'Dermatology', labelEn: 'Dermatology & Laser', labelAr: 'الجلدية والليزر' },
    { id: 'Bariatric', labelEn: 'Bariatric & Laparoscopy', labelAr: 'جراحات السمنة والمناظير' },
    { id: 'Orthopedics', labelEn: 'Orthopedics & Joints', labelAr: 'العظام والمفاصل الصناعية' },
    { id: 'Psychiatry', labelEn: 'Psychiatry', labelAr: 'الطب النفسي والسلوكي' },
    { id: 'Ophthalmology', labelEn: 'Ophthalmology & Lasik', labelAr: 'العيون والليزك' },
    { id: 'ENT', labelEn: 'ENT & Head/Neck', labelAr: 'الأنف والأذن والحنجرة' },
    { id: 'Pediatrics', labelEn: 'Pediatrics & Hematology', labelAr: 'الأطفال وأمراض الدم' },
  ];

  const governorates = [
    { id: 'All', labelEn: 'All Governorates', labelAr: 'جميع المحافظات' },
    { id: 'Cairo', labelEn: 'Cairo', labelAr: 'القاهرة' },
    { id: 'Giza', labelEn: 'Giza', labelAr: 'الجيزة' },
    { id: 'Dakahlia', labelEn: 'Dakahlia (Mansoura)', labelAr: 'الدقهلية (المنصورة)' },
    { id: 'Alexandria', labelEn: 'Alexandria', labelAr: 'الإسكندرية' },
    { id: 'Aswan', labelEn: 'Aswan', labelAr: 'أسوان' },
  ];

  // Filtering
  const filteredDoctors = doctors.filter((doc) => {
    // Specialty match
    const matchesSpecialty =
      selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;

    // Governorate match
    const matchesGovernorate =
      selectedGovernorate === 'All' ||
      (selectedGovernorate === 'Cairo' && (doc.governorateEn.includes('Cairo') || doc.governorateAr.includes('القاهرة'))) ||
      (selectedGovernorate === 'Giza' && (doc.governorateEn.includes('Giza') || doc.governorateAr.includes('الجيزة'))) ||
      (selectedGovernorate === 'Dakahlia' && (doc.governorateEn.includes('Mansoura') || doc.governorateAr.includes('المنصورة') || doc.governorateAr.includes('الدقهلية'))) ||
      (selectedGovernorate === 'Alexandria' && (doc.governorateEn.includes('Alexandria') || doc.governorateAr.includes('الإسكندرية'))) ||
      (selectedGovernorate === 'Aswan' && (doc.governorateEn.includes('Aswan') || doc.governorateAr.includes('أسوان')));

    // Clinic toggle
    const matchesClinic = !onlyWithClinic || doc.hasClinic;

    // Pioneer toggle
    const matchesPioneer = !onlyPioneers || doc.isPioneer;

    // Search query
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      doc.name.toLowerCase().includes(query) ||
      doc.nameAr.includes(query) ||
      doc.specialtyAr.includes(query) ||
      doc.specialtyEn.toLowerCase().includes(query) ||
      doc.workplaceAr.includes(query) ||
      doc.workplaceEn.toLowerCase().includes(query) ||
      (doc.clinicAddressAr && doc.clinicAddressAr.includes(query)) ||
      (doc.clinicAddressEn && doc.clinicAddressEn.toLowerCase().includes(query)) ||
      doc.tagsAr.some((tag) => tag.includes(query)) ||
      doc.tagsEn.some((tag) => tag.toLowerCase().includes(query));

    return matchesSpecialty && matchesGovernorate && matchesClinic && matchesPioneer && matchesSearch;
  });

  const totalRegistered = mockEgyptianDoctors.length;
  const totalPioneers = mockEgyptianDoctors.filter((d) => d.isPioneer).length;
  const totalWithClinics = mockEgyptianDoctors.filter((d) => d.hasClinic).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-teal-700/50">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-200 bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.doctorsBadge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t.doctorsHeading}
          </h1>

          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            {t.doctorsSubheading}
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black text-white">
                {totalRegistered}
              </div>
              <div className="text-teal-200 text-[11px] mt-0.5">
                {isAr ? 'طبيباً استشارياً مسجلاً' : 'Registered Consultants'}
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black text-amber-300">
                {totalPioneers}
              </div>
              <div className="text-teal-200 text-[11px] mt-0.5">
                {isAr ? 'رواد الطب وجراحة الأعضاء' : 'Clinical Pioneers'}
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black text-emerald-300">
                {totalWithClinics}
              </div>
              <div className="text-teal-200 text-[11px] mt-0.5">
                {isAr ? 'عيادة ومركز تخصصي' : 'Specialized Clinics'}
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black text-white flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>4.9</span>
              </div>
              <div className="text-teal-200 text-[11px] mt-0.5">
                {isAr ? 'تقييم الرعاية السريرية' : 'Clinical Care Rating'}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Search Bar with LocalStorage History */}
          <div className="lg:col-span-5">
            <SearchWithHistory
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              storageKey="mediguide_doctors_search_history"
              placeholder={t.searchDoctorsPlaceholder}
              accentColor="teal"
            />
          </div>

          {/* Specialty Dropdown */}
          <div className="lg:col-span-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            >
              {specialties.map((s) => (
                <option key={s.id} value={s.id}>
                  {isAr ? s.labelAr : s.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Governorate Dropdown */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedGovernorate}
              onChange={(e) => setSelectedGovernorate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            >
              {governorates.map((g) => (
                <option key={g.id} value={g.id}>
                  {isAr ? g.labelAr : g.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggles & Segmented Badges */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Pioneer toggle */}
            <button
              onClick={() => setOnlyPioneers(!onlyPioneers)}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                onlyPioneers
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'الرواد والأعلام فقط' : 'Pioneers Only'}</span>
            </button>

            {/* Has clinic toggle */}
            <button
              onClick={() => setOnlyWithClinic(!onlyWithClinic)}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                onlyWithClinic
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>{t.hasClinicFilter}</span>
            </button>
          </div>

          <div className="text-slate-500 text-xs">
            {isAr
              ? `عرض ${filteredDoctors.length} من أصل ${totalRegistered} طبيباً مسجلاً`
              : `Showing ${filteredDoctors.length} of ${totalRegistered} registered doctors`}
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {isAr ? 'لم يتم العثور على أطباء مطابقين' : 'No matching doctors found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isAr
              ? 'جرّب تعديل كلمات البحث أو إلغاء تحديد بعض الفلاتر لاستعراض قائمة الأطباء المعتمدين.'
              : 'Try adjusting your search criteria or resetting filters to browse all verified physicians.'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSpecialty('All');
              setSelectedGovernorate('All');
              setOnlyWithClinic(false);
              setOnlyPioneers(false);
            }}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            {isAr ? 'إعادة ضبط كل الفلاتر' : 'Reset All Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => {
            const name = isAr ? doc.nameAr : doc.name;
            const title = isAr ? doc.titleAr : doc.title;
            const specialty = isAr ? doc.specialtyAr : doc.specialtyEn;
            const workplace = isAr ? doc.workplaceAr : doc.workplaceEn;
            const clinicAddress = isAr ? doc.clinicAddressAr : doc.clinicAddressEn;

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top Banner */}
                <div>
                  <div className="p-5 pb-3 border-b border-slate-100">
                    <div className="flex items-start gap-3.5">
                      {/* Initials badge */}
                      <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-black text-lg shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        {doc.initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 text-[11px] font-semibold">
                            {specialty}
                          </span>
                          {doc.isPioneer && (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200/70 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                              <span>{isAr ? 'رائد طبي' : 'Pioneer'}</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                          {name}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1 line-clamp-1 leading-snug">
                          {title}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Details Body */}
                  <div className="p-5 space-y-3.5 text-xs text-slate-600">
                    {/* Workplace */}
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-teal-600" />
                        <span>{t.workplaceLabel}</span>
                      </div>
                      <div className="font-medium text-slate-800 line-clamp-2">
                        {workplace}
                      </div>
                    </div>

                    {/* Private Clinic info */}
                    {doc.hasClinic ? (
                      <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-emerald-800 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span>{t.clinicLabel}</span>
                          </span>
                          {doc.clinicPhone && (
                            <span className="font-mono text-[11px] font-semibold text-emerald-900">
                              {doc.clinicPhone}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed">
                          {clinicAddress}
                        </p>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 text-[11px] italic">
                        {isAr ? 'العمل الأساسي عبر المستشفيات والمراكز الجامعية' : 'Primary practice via university hospital center'}
                      </div>
                    )}

                    {/* Rating & Experience */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-500">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{doc.rating}</span>
                        <span className="text-slate-400 font-normal">({doc.reviewCount})</span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px]">
                        <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                        <span>+{doc.experienceYears} {isAr ? 'سنة خبرة' : 'yrs exp'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveDoctorModal(doc)}
                      className="flex-1 py-2 px-3 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors flex items-center justify-center gap-1"
                    >
                      <span>{t.viewDoctorProfile}</span>
                      <ChevronIcon className="w-3.5 h-3.5" />
                    </button>

                    {doc.clinicPhone && (
                      <a
                        href={`tel:${doc.clinicPhone.replace(/[^0-9]/g, '')}`}
                        className="py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 shrink-0"
                        title={doc.clinicPhone}
                      >
                        <Phone className="w-3 h-3" />
                        <span>{t.callNow}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Doctor Details Modal */}
      <DoctorDetailModal
        doctor={activeDoctorModal}
        onClose={() => setActiveDoctorModal(null)}
      />
    </div>
  );
};
