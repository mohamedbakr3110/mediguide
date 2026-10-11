import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { User, MedicalArticle, MedicalVideo } from '../types';
import { VideoPlayerModal } from '../components/videos/VideoPlayerModal';
import {
  User as UserIcon,
  Bookmark,
  MessageSquare,
  PhoneCall,
  LogOut,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Plus,
  Trash2,
  BookOpen,
  Video,
  Play,
  Clock,
  HardDrive,
} from 'lucide-react';

interface UserDashboardProps {
  user: User;
  savedArticles: MedicalArticle[];
  savedVideos?: MedicalVideo[];
  onSelectArticle: (article: MedicalArticle) => void;
  onRemoveSavedArticle: (id: string) => void;
  onRemoveSavedVideo?: (id: string) => void;
  onSignOut: () => void;
  onNavigate: (page: string) => void;
}

export const UserDashboardPage: React.FC<UserDashboardProps> = ({
  user,
  savedArticles,
  savedVideos = [],
  onSelectArticle,
  onRemoveSavedArticle,
  onRemoveSavedVideo,
  onSignOut,
  onNavigate,
}) => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'saved' | 'videos' | 'consultations' | 'contacts'>('saved');
  const [activeVideo, setActiveVideo] = useState<MedicalVideo | null>(null);
  const [contacts, setContacts] = useState(user.emergencyContacts);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;

    const updated = [
      ...contacts,
      {
        name: newContactName,
        relationship: newContactRelation || 'Contact',
        phone: newContactPhone,
      },
    ];
    setContacts(updated);
    setNewContactName('');
    setNewContactRelation('');
    setNewContactPhone('');
  };

  const handleRemoveContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-xs">
            {user.fullName.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {isAr ? user.fullNameAr || user.fullName : user.fullName}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-semibold border border-teal-200">
                {user.role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-mono">{user.email}</p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {isAr ? 'عضوية مسجلة منذ:' : 'Member since:'}{' '}
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'Admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.adminPanel}</span>
            </button>
          )}

          <button
            onClick={onSignOut}
            className="px-4 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4 rtl:rotate-180" />
            <span>{t.logout}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-medium overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 relative transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'saved' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>{t.savedArticlesTab}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
            {savedArticles.length}
          </span>
          {activeTab === 'saved' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-teal-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`pb-3 relative transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'videos' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>{t.savedVideosTab}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
            {savedVideos.length}
          </span>
          {activeTab === 'videos' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-teal-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('consultations')}
          className={`pb-3 relative transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'consultations' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t.recentConsultationsTab}</span>
          {activeTab === 'consultations' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-teal-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`pb-3 relative transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'contacts' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>{t.myEmergencyContactsTab}</span>
          {activeTab === 'contacts' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-teal-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Tab 1: Saved Articles */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedArticles.map((art) => (
                <div
                  key={art.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-teal-700">{art.category}</span>
                      <span>{art.readTimeMinutes} {t.readTime}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                      {isAr ? art.titleAr : art.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                      {isAr ? art.summaryAr : art.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onSelectArticle(art)}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
                    >
                      <span>{t.readArticle}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onRemoveSavedArticle(art.id)}
                      className="text-xs text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title={isAr ? 'إلغاء الحفظ' : 'Remove bookmark'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-600">{t.noSavedArticles}</p>
              <button
                onClick={() => onNavigate('knowledge')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                {isAr ? 'تصفح الموسوعة الطبية' : 'Browse Medical Library'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Videos */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          {savedVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedVideos.map((vid) => (
                <div
                  key={vid.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-sky-700">{vid.category}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{vid.duration}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                      {isAr ? vid.titleAr : vid.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                      {isAr ? vid.descriptionAr : vid.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setActiveVideo(vid)}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{t.watchVideo}</span>
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>

                    {onRemoveSavedVideo && (
                      <button
                        onClick={() => onRemoveSavedVideo(vid.id)}
                        className="text-xs text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Remove video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
              <Video className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-600">{t.noSavedVideos}</p>
              <button
                onClick={() => onNavigate('videos')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                {isAr ? 'تصفح المكتبة المرئية' : 'Browse Video Hub'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Consultations */}
      {activeTab === 'consultations' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isAr ? 'استشارات الفرز السريري الذكي المحفوظة' : 'Archived Clinical Triage Sessions'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr ? 'سجل المحادثات والملاحظات الطبية المبدئية' : 'History of user triage interactions'}
              </p>
            </div>

            <button
              onClick={() => onNavigate('assistant')}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold"
            >
              {isAr ? 'بدء استشارة جديدة' : 'Start New Session'}
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>{isAr ? 'إسعافات أولية لحرق سطحي في اليد' : 'First-Aid for Minor Burn'}</span>
              <span className="text-[11px] text-slate-400 font-mono">2026-03-10</span>
            </div>
            <p className="text-slate-600">
              {isAr
                ? 'استشارة حول حروق الماء الساخن. تم تقديم بروتوكول التبريد بماء الصنبور لمدة 20 دقيقة، وتنبيهات مراجعة الطوارئ.'
                : 'Inquiry regarding hot water scald. Advised 20-minute tap water cooling and urgent clinic criteria.'}
            </p>
            <div className="pt-2 flex items-center justify-between text-teal-700 font-semibold">
              <button onClick={() => onNavigate('assistant')} className="hover:underline">
                {isAr ? 'متابعة الجلسة في المساعد الذكي' : 'Open in AI Assistant'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Emergency Contacts */}
      {activeTab === 'contacts' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              {isAr ? 'أرقام الطوارئ المخصصة للمستخدم' : 'Personal Emergency Contacts'}
            </h3>

            <div className="space-y-3">
              {contacts.map((c, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">{c.name}</span>
                    <span className="text-[11px] text-slate-500 block">{c.relationship}</span>
                    <span className="text-xs font-mono font-bold text-rose-700">{c.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${c.phone}`}
                      className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
                      title="Call"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleRemoveContact(i)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200/50 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-teal-600" />
              <span>{isAr ? 'إضافة جهة اتصال طوارئ' : 'Add Emergency Contact'}</span>
            </h3>

            <form onSubmit={handleAddContact} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {isAr ? 'الاسم' : 'Contact Name'}
                </label>
                <input
                  type="text"
                  required
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder={isAr ? 'د. سارة كمال' : 'Dr. Sarah Kamel'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {isAr ? 'صلة القرابة / الصفة' : 'Relationship'}
                </label>
                <input
                  type="text"
                  value={newContactRelation}
                  onChange={(e) => setNewContactRelation(e.target.value)}
                  placeholder={isAr ? 'طبيب الأسرة' : 'Family Doctor / Guardian'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {isAr ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  required
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  placeholder="+20 100 000 0000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors mt-2 cursor-pointer"
              >
                {isAr ? 'حفظ جهة الاتصال' : 'Save Contact'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Video Player Modal for Saved Videos */}
      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
        onToggleSave={onRemoveSavedVideo}
        isSaved={true}
      />
    </div>
  );
};
