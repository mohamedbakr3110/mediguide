import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MedicalArticle, EmergencyProtocol, MedicalVideo, EgyptianDoctor } from '../types';
import {
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  HeartPulse,
  Brain,
  Baby,
  Stethoscope,
  Activity,
  PhoneCall,
  Sparkles,
  CheckCircle,
  FileText,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  Video,
  Play,
  Clock,
  Eye,
  Building,
  MapPin,
  Star,
} from 'lucide-react';
import { MedicalVisualPlaceholder } from '../components/common/MedicalVisualPlaceholder';
import { mockEgyptianDoctors } from '../services/doctorsData';


interface HomePageProps {
  onNavigate: (page: string) => void;
  articles: MedicalArticle[];
  protocols: EmergencyProtocol[];
  videos?: MedicalVideo[];
  doctors?: EgyptianDoctor[];
  onSelectArticle: (article: MedicalArticle) => void;
  onOpenHotlines: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  articles,
  protocols,
  videos = [],
  doctors = mockEgyptianDoctors,
  onSelectArticle,
  onOpenHotlines,
}) => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;

  const featuredArticles = articles.filter((a) => a.isFeatured).slice(0, 3);
  const featuredVideos = videos.slice(0, 3);

  const categories = [
    { id: 'Cardiology', label: t.filterCardiology, icon: HeartPulse, count: '14' },
    { id: 'Neurology', label: t.filterNeurology, icon: Brain, count: '9' },
    { id: 'Pediatrics', label: t.filterPediatrics, icon: Baby, count: '18' },
    { id: 'FirstAid', label: t.filterFirstAid, icon: Activity, count: '12' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left/Right Text Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-50 px-3 py-1 rounded-md border border-teal-200/60">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>{t.heroBadge}</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2]"
                style={{ textWrap: 'balance' }}
              >
                {t.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {t.heroDescription}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('emergency')}
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm transition-colors flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>{t.heroPrimaryCta}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('videos')}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <Video className="w-4 h-4 text-teal-400" />
                  <span>{t.heroSecondaryCta}</span>
                </button>
              </div>

              {/* Trust & Academic Validation Points */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-xs text-slate-600">
                <div>
                  <div className="font-bold text-slate-900 text-base">100%</div>
                  <div className="text-slate-500">{t.heroStatReview}</div>
                </div>
                <div>
                  <div className="font-bold text-rose-600 text-base">AHA 2026</div>
                  <div className="text-slate-500">{t.heroStatProtocols}</div>
                </div>
                <div>
                  <div className="font-bold text-teal-700 text-base">
                    {isAr ? 'مرئيات سريرية' : 'Video Guides'}
                  </div>
                  <div className="text-slate-500">
                    {isAr ? 'شروحات تطبيقية' : 'Clinical Demonstrations'}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Graphic Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <MedicalVisualPlaceholder
                type="hero"
                title={
                  isAr
                    ? 'منظومة فرز طبي وإسعافي متطورة بمقاطع تدريبية محكمة ومراجعة سريرية'
                    : 'Evidence-Based Clinical Guidance & Procedural Video Framework'
                }
                className="h-72 shadow-lg"
              />

              {/* Quick Dial Emergency Card */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <PhoneCall className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-rose-950">
                      {isAr ? 'أرقام الطوارئ السريعة' : 'Instant Emergency Dispatch'}
                    </h4>
                    <p className="text-[11px] text-rose-700">
                      {isAr ? 'مصر: 123 · السعودية: 997 · الإمارات: 998' : 'Egypt: 123 · KSA: 997 · UAE: 998 · US: 911'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenHotlines}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shrink-0"
                >
                  {isAr ? 'عرض الأرقام' : 'View Hotlines'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Fast-Track Triage Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {t.emergencyQuickTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {t.emergencyQuickDesc}
            </p>
          </div>
          <button
            onClick={() => onNavigate('emergency')}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 shrink-0"
          >
            <span>{isAr ? 'جميع البروتوكولات الإسعافية' : 'All Emergency Topics'}</span>
            <ChevronIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {protocols.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => onNavigate('emergency')}
              className="p-5 bg-white rounded-xl border border-slate-200 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-rose-600 font-semibold mb-2">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{p.code}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500 font-normal">{p.category}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                  {isAr ? p.titleAr : p.title}
                </h3>

                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {isAr ? p.warningSignsAr[0] : p.warningSignsEn[0]}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-rose-600 font-semibold">
                <span>{isAr ? 'عرض خطوات التدخل' : 'View Protocol Steps'}</span>
                <ChevronIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Clinical Videos Section */}
      {featuredVideos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wide mb-1">
                <Video className="w-4 h-4" />
                <span>{isAr ? 'المرئيات والشروحات السريرية' : 'Clinical Demonstrations'}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {isAr ? 'شروحات عملية بالفيديو لأطباء استشاريين' : 'Physician-Led Practical Video Demonstrations'}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('videos')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 shrink-0"
            >
              <span>{isAr ? 'جميع مقاطع الفيديو' : 'View All Videos'}</span>
              <ChevronIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVideos.map((vid) => {
              const title = isAr ? vid.titleAr : vid.title;
              const instructor = isAr ? vid.instructor.nameAr : vid.instructor.name;

              return (
                <div
                  key={vid.id}
                  onClick={() => onNavigate('videos')}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className={`relative h-44 bg-gradient-to-br ${vid.thumbnailGradient} p-4 flex flex-col justify-between text-white`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs text-[11px] font-semibold">
                        {vid.category}
                      </span>
                      <span className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-mono">
                        <Clock className="w-3 h-3 text-teal-300" />
                        <span>{vid.duration}</span>
                      </span>
                    </div>

                    <div className="my-auto mx-auto w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all">
                      <Play className="w-4 h-4 fill-current ml-0.5 rtl:mr-0.5 rtl:ml-0" />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-white/70">
                      <span>{instructor}</span>
                      <span className="font-mono">{vid.views} views</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                      {isAr ? vid.descriptionAr : vid.description}
                    </p>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-bold">
                      <span>{t.watchVideo}</span>
                      <ChevronIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Prominent Egyptian Doctors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wide mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t.doctorsBadge}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {t.doctorsHeading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              {isAr
                ? 'نخبة كبار الاستشاريين والرواد في مصر مع بيانات جهات العمل والمستشفيات والعيادات الخاصة وأرقام الحجز المعتمدة.'
                : 'Pioneering consultants and verified medical leaders in Egypt with hospital affiliations, private clinics, and official booking details.'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('doctors')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto border border-teal-200/60"
          >
            <span>{isAr ? 'استعراض جميع أطباء مصر' : 'Browse All Doctors in Egypt'}</span>
            <ChevronIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {doctors.slice(0, 4).map((doc) => {
            const name = isAr ? doc.nameAr : doc.name;
            const title = isAr ? doc.titleAr : doc.title;
            const specialty = isAr ? doc.specialtyAr : doc.specialtyEn;
            const workplace = isAr ? doc.workplaceAr : doc.workplaceEn;
            const clinic = isAr ? doc.clinicAddressAr : doc.clinicAddressEn;

            return (
              <div
                key={doc.id}
                onClick={() => onNavigate('doctors')}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-black text-base group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      {doc.initials}
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md text-[11px] font-bold text-amber-700">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-teal-700 block mb-1">
                    {specialty}
                  </span>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug line-clamp-1">
                    {name}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                    {title}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-[11px]">
                    <div className="flex items-start gap-1.5 text-slate-700">
                      <Building className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1 font-medium">{workplace}</span>
                    </div>

                    {doc.hasClinic && clinic && (
                      <div className="flex items-start gap-1.5 text-emerald-800 bg-emerald-50/60 p-1.5 rounded-lg border border-emerald-100">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1 text-[10px]">{clinic}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-teal-700 group-hover:text-teal-900">
                  <span>{isAr ? 'عرض العيادة والحجز' : 'View Clinic & Booking'}</span>
                  <ChevronIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* AI Assistant Interactive Mini-Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 rounded-2xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg border border-teal-800/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-300 bg-teal-900/60 px-3 py-1 rounded-md border border-teal-700/50">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.mockEngineBadge}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                {t.aiAssistantHeading}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                {t.aiAssistantNotice}
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => onNavigate('assistant')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-slate-200 transition-colors text-left rtl:text-right"
                >
                  "{t.aiSuggestedPrompt1}"
                </button>
                <button
                  onClick={() => onNavigate('assistant')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-slate-200 transition-colors text-left rtl:text-right"
                >
                  "{t.aiSuggestedPrompt2}"
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('assistant')}
                  className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors inline-flex items-center gap-2"
                >
                  <span>{isAr ? 'فتح جلسة فرز طبي جديدة' : 'Start Triage Session'}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-950/80 rounded-xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span>{isAr ? 'فرز سريري مبدئي ذكي' : 'Clinical Triage Evaluation'}</span>
                <span className="text-teal-400 font-mono text-[10px]">VERIFIED PROTOCOL</span>
              </div>
              <div className="p-3 bg-teal-900/30 rounded-lg border border-teal-500/20 text-xs text-teal-200 space-y-1">
                <span className="font-semibold text-white block">
                  {isAr ? 'المستخدم: كيفية التعامل مع جرح ينزف؟' : 'User: How to treat a bleeding laceration?'}
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isAr
                    ? '1. الضغط المباشر المستمر لمدة 10 دقائق · 2. رفع الطرف أعلى من مستوى القلب · 3. تثبيت الضمادة الضاغطة دون فك الشاش الأولي.'
                    : '1. Continuous direct pressure for 10 min · 2. Elevate limb above heart · 3. Secure pressure bandage without peeling initial gauze.'}
                </p>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                <span>{isAr ? 'فحص تلقائي لأعراض الخطر الفورية' : 'Automated Red-Flag Escalation Filter'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Peer-Reviewed Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {t.kbHeading}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {t.kbSubheading}
            </p>
          </div>
          <button
            onClick={() => onNavigate('knowledge')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 shrink-0"
          >
            <span>{isAr ? 'تصفح كل المقالات' : 'Browse All Articles'}</span>
            <ChevronIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArticles.map((article) => {
            const title = isAr ? article.titleAr : article.title;
            const summary = isAr ? article.summaryAr : article.summary;
            const reviewer = isAr ? article.reviewedBy.nameAr : article.reviewedBy.name;

            return (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <MedicalVisualPlaceholder
                    type={article.category === 'Cardiology' ? 'cardiology' : article.category === 'Pediatrics' ? 'pediatrics' : 'cpr'}
                    title={title}
                    className="h-44 rounded-none border-x-0 border-t-0"
                  />

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-teal-700">{article.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.readTimeMinutes} {t.readTime}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.difficulty}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
                      {title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate max-w-[180px]">
                      {t.reviewedBy} <strong className="text-slate-700">{reviewer}</strong>
                    </span>
                    <span className="text-teal-700 font-semibold group-hover:underline">
                      {t.readArticle}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Specialties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
          {isAr ? 'التخصصات الطبية المدعومة' : 'Supported Clinical Specialties'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onNavigate('knowledge')}
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500 transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-teal-50 group-hover:bg-teal-600 transition-colors flex items-center justify-center text-teal-700 group-hover:text-white mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {cat.label}
                </h4>
                <span className="text-xs text-slate-500 mt-1 block">
                  {cat.count} {isAr ? 'مقال سريري' : 'Clinical Guides'}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
