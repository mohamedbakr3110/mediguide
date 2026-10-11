import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MedicalVideo, VideoCategory, User } from '../types';
import { VideoPlayerModal } from '../components/videos/VideoPlayerModal';
import {
  Play,
  Search,
  Plus,
  Clock,
  Eye,
  UserCheck,
  CheckCircle2,
  X,
  Bookmark,
  BookmarkCheck,
  Video,
  UploadCloud,
  HardDrive,
  Link as LinkIcon,
  FileVideo,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface VideosPageProps {
  videos: MedicalVideo[];
  savedVideoIds?: string[];
  currentUser: User | null;
  onToggleSaveVideo: (id: string) => void;
  onSubmitVideo: (video: Omit<MedicalVideo, 'id' | 'views' | 'likes'>) => Promise<void>;
  onNavigateToAuth: () => void;
}

export const VideosPage: React.FC<VideosPageProps> = ({
  videos,
  savedVideoIds = [],
  currentUser,
  onToggleSaveVideo,
  onSubmitVideo,
  onNavigateToAuth,
}) => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeVideo, setActiveVideo] = useState<MedicalVideo | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  // Upload Method Tab: 'device' or 'url'
  const [uploadSource, setUploadSource] = useState<'device' | 'url'>('device');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [localVideoPreviewUrl, setLocalVideoPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Publish Form State
  const [formData, setFormData] = useState({
    titleAr: '',
    title: '',
    videoUrl: '',
    category: 'FirstAid' as VideoCategory,
    duration: '03:45',
    descriptionAr: '',
    description: '',
    instructorNameAr: currentUser ? currentUser.fullNameAr : 'د. طارق منصور',
    instructorNameEn: currentUser ? currentUser.fullName : 'Dr. Tarek Mansour',
    instructorTitle: 'Consultant Emergency Physician',
    instructorTitleAr: 'استشاري طب الطوارئ',
    hospital: 'Kasr Al-Ainy University Hospital',
    hospitalAr: 'مستشفيات قصر العيني الجامعية',
    keyPointsText: '',
  });

  const categories = [
    { id: 'All', labelEn: 'All Videos', labelAr: 'الكل' },
    { id: 'Resuscitation', labelEn: 'CPR & Resuscitation', labelAr: 'الإنعاش القلبي' },
    { id: 'FirstAid', labelEn: 'First Aid', labelAr: 'الإسعافات الأولية' },
    { id: 'Trauma', labelEn: 'Trauma & Bleeding', labelAr: 'الإصابات والنزيف' },
    { id: 'Pediatrics', labelEn: 'Pediatric Care', labelAr: 'طب الأطفال' },
  ];

  // Only display Published videos to general users
  const publishedVideos = videos.filter((v) => v.status === 'Published');

  const filteredVideos = publishedVideos.filter((v) => {
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesSearch =
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.titleAr.includes(searchTerm) ||
      v.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.descriptionAr.includes(searchTerm) ||
      v.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.instructor.nameAr.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const handleOpenPublish = () => {
    if (!currentUser) {
      onNavigateToAuth();
      return;
    }
    setIsPublishModalOpen(true);
  };

  // Helper to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Process selected video file from user's device
  const handleProcessFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert(isAr ? 'يرجى اختيار ملف فيديو صالح (MP4, WebM, MOV)' : 'Please select a valid video file (MP4, WebM, MOV)');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUploadedFile(file);
    setLocalVideoPreviewUrl(objectUrl);
    setFormData((prev) => ({
      ...prev,
      videoUrl: objectUrl,
      // Suggest titles if currently empty
      title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      titleAr: prev.titleAr || (isAr ? `شرح سريري: ${file.name.replace(/\.[^/.]+$/, '')}` : ''),
    }));

    // Auto-calculate video duration using temporary HTMLVideoElement
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = objectUrl;
    tempVideo.onloadedmetadata = () => {
      if (tempVideo.duration && !isNaN(tempVideo.duration)) {
        const totalSec = Math.floor(tempVideo.duration);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        setFormData((prev) => ({ ...prev, duration: formatted }));
      }
    };
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveUploadedFile = () => {
    if (localVideoPreviewUrl) {
      URL.revokeObjectURL(localVideoPreviewUrl);
    }
    setUploadedFile(null);
    setLocalVideoPreviewUrl(null);
    setFormData((prev) => ({ ...prev, videoUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadSource === 'device' && !uploadedFile && !formData.videoUrl) {
      alert(isAr ? 'يرجى اختيار ملف فيديو من جهازك أولاً' : 'Please select a video file from your device first');
      return;
    }

    if (uploadSource === 'url' && !formData.videoUrl) {
      alert(isAr ? 'يرجى إدخال رابط الفيديو' : 'Please enter a video URL');
      return;
    }

    setIsSubmitting(true);

    try {
      const keyPointsListAr = formData.keyPointsText
        ? formData.keyPointsText.split('\n').filter((l) => l.trim().length > 0)
        : [
            isAr
              ? 'تطبيق خطوات الأمان وتفقد وعي المصاب أولاً'
              : 'Assess scene safety and responsiveness first',
          ];

      await onSubmitVideo({
        title: formData.title,
        titleAr: formData.titleAr,
        description: formData.description,
        descriptionAr: formData.descriptionAr,
        category: formData.category,
        videoUrl: formData.videoUrl,
        thumbnailGradient:
          formData.category === 'Resuscitation'
            ? 'from-rose-950 via-slate-900 to-teal-950'
            : formData.category === 'Trauma'
            ? 'from-amber-950 via-slate-900 to-sky-950'
            : 'from-teal-950 via-slate-900 to-sky-950',
        duration: formData.duration || '03:45',
        instructor: {
          name: formData.instructorNameEn,
          nameAr: formData.instructorNameAr,
          title: formData.instructorTitle,
          titleAr: formData.instructorTitleAr,
          hospital: formData.hospital,
          hospitalAr: formData.hospitalAr,
        },
        publishedAt: new Date().toISOString().split('T')[0],
        status: 'UnderReview', // Automatically routed to admin review queue!
        tags: [formData.category],
        tagsAr: [formData.category],
        keyPointsAr: keyPointsListAr,
        keyPointsEn: keyPointsListAr,
        isLocalUpload: uploadSource === 'device',
        fileName: uploadedFile?.name,
        fileSize: uploadedFile ? formatFileSize(uploadedFile.size) : undefined,
      });

      setIsPublishModalOpen(false);
      setUploadedFile(null);
      setLocalVideoPreviewUrl(null);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 6000);
    } catch {
      // error handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-2xl p-6 sm:p-10 text-white border border-teal-800/30 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30">
              <Video className="w-3.5 h-3.5" />
              <span>{isAr ? 'المكتبة المرئية السريرية' : 'Verified Clinical Video Hub'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.videosHeading}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t.videosSubheading}
            </p>
          </div>

          <button
            onClick={handleOpenPublish}
            className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-colors shrink-0 self-start md:self-center cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.publishVideoBtn}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{t.videoSubmitSuccess}</span>
          </div>
          <button
            onClick={() => setSuccessNotice(false)}
            className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search and Category Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchVideosPlaceholder}
            className="w-full pl-9 rtl:pr-9 rtl:pl-4 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {isAr ? c.labelAr : c.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => {
          const title = isAr ? video.titleAr : video.title;
          const description = isAr ? video.descriptionAr : video.description;
          const instructorName = isAr ? video.instructor.nameAr : video.instructor.name;
          const instructorHospital = isAr ? video.instructor.hospitalAr : video.instructor.hospital;
          const isSaved = savedVideoIds.includes(video.id);

          return (
            <div
              key={video.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Visual Thumbnail Frame */}
                <div
                  onClick={() => setActiveVideo(video)}
                  className={`relative w-full h-48 bg-gradient-to-br ${video.thumbnailGradient} p-5 flex flex-col justify-between text-white cursor-pointer overflow-hidden select-none`}
                >
                  <div className="flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-xs font-semibold text-[11px] border border-white/10">
                        {video.category}
                      </span>
                      {video.isLocalUpload && (
                        <span className="px-2 py-0.5 rounded-md bg-teal-500/80 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-2xs">
                          <HardDrive className="w-3 h-3" />
                          <span>{isAr ? 'ملف محلي' : 'Local File'}</span>
                        </span>
                      )}
                    </div>

                    <span className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-mono shrink-0">
                      <Clock className="w-3 h-3 text-teal-300" />
                      <span>{video.duration}</span>
                    </span>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="my-auto mx-auto w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all duration-200 shadow-lg">
                    <Play className="w-5 h-5 fill-current ml-0.5 rtl:mr-0.5 rtl:ml-0" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-white/70">
                    <span className="truncate max-w-[180px]">{instructorHospital}</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Eye className="w-3 h-3" />
                      <span>{video.views}</span>
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-3">
                  <h3
                    onClick={() => setActiveVideo(video)}
                    className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug cursor-pointer"
                  >
                    {title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {description}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
                    <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">
                      {instructorName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onToggleSaveVideo(video.id)}
                    className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-teal-50 border-teal-200 text-teal-800 font-semibold'
                        : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                    }`}
                    title={isSaved ? 'Saved' : 'Bookmark Video'}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-3.5 h-3.5 text-teal-600" />
                    ) : (
                      <Bookmark className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[11px]">{isSaved ? (isAr ? 'محفوظ' : 'Saved') : (isAr ? 'حفظ' : 'Save')}</span>
                  </button>

                  <button
                    onClick={() => setActiveVideo(video)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>{t.watchVideo}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVideos.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
          {isAr ? 'لم يتم العثور على مقاطع فيديو مطابقة للبحث' : 'No medical videos matched your search criteria.'}
        </div>
      )}

      {/* Shared Video Player Modal */}
      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
        onToggleSave={onToggleSaveVideo}
        isSaved={activeVideo ? savedVideoIds.includes(activeVideo.id) : false}
      />

      {/* Publish Video Submission Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Video className="w-4 h-4 text-teal-400" />
                <span>{t.publishModalTitle}</span>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Video Source Selection Tabs */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  {t.videoSourceType}
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setUploadSource('device')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      uploadSource === 'device'
                        ? 'bg-white text-teal-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <HardDrive className="w-4 h-4 text-teal-600" />
                    <span>{t.uploadFromDevice}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadSource('url')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      uploadSource === 'url'
                        ? 'bg-white text-teal-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4 text-teal-600" />
                    <span>{t.enterVideoUrl}</span>
                  </button>
                </div>
              </div>

              {/* METHOD 1: LOCAL DEVICE UPLOAD */}
              {uploadSource === 'device' && (
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime,video/mkv,video/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {!uploadedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                        isDragging
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-slate-300 hover:border-teal-400 bg-slate-50 hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800 text-xs sm:text-sm">
                          {t.dragDropVideo}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {t.supportedVideoFormats}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-2xs cursor-pointer mt-1"
                      >
                        {isAr ? 'تصفح الملفات من جهازك' : 'Browse Files on Device'}
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileVideo className="w-5 h-5 text-teal-700 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate text-xs">
                              {uploadedFile.name}
                            </span>
                            <span className="text-[11px] text-teal-800 font-mono">
                              {formatFileSize(uploadedFile.size)} · {formData.duration}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveUploadedFile}
                          className="px-2.5 py-1 text-xs text-rose-700 hover:bg-rose-100 rounded-lg transition-colors shrink-0 cursor-pointer font-medium"
                        >
                          {t.changeFile}
                        </button>
                      </div>

                      {/* Live Local Video Preview */}
                      {localVideoPreviewUrl && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-semibold text-teal-900 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-teal-600" />
                            <span>{t.videoPreviewBadge}</span>
                          </span>
                          <div className="rounded-lg overflow-hidden bg-black aspect-video max-h-48 border border-slate-700 flex items-center justify-center">
                            <video
                              src={localVideoPreviewUrl}
                              controls
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* METHOD 2: EXTERNAL URL */}
              {uploadSource === 'url' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.videoUrlLabel}
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube-nocookie.com/embed/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {isAr
                      ? 'يمكنك وضع رابط تضمين يوتيوب، فيميو، أو رابط مباشر لملف فيديو بصيغة mp4.'
                      : 'You can paste a YouTube embed link, Vimeo link, or direct MP4 stream URL.'}
                  </span>
                </div>
              )}

              {/* Titles in Arabic and English */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.videoTitleArLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    placeholder="شرح عملي لإسعاف النزيف..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.videoTitleEnLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Clinical Hemorrhage Protocol..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.videoCategoryLabel}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as VideoCategory })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="FirstAid">{isAr ? 'الإسعافات الأولية' : 'First Aid'}</option>
                    <option value="Resuscitation">{isAr ? 'الإنعاش القلبي' : 'Resuscitation'}</option>
                    <option value="Trauma">{isAr ? 'الإصابات والنزيف' : 'Trauma'}</option>
                    <option value="Pediatrics">{isAr ? 'طب الأطفال' : 'Pediatrics'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isAr ? 'مدة المقطع (دقيقة:ثانية)' : 'Duration (MM:SS)'}
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="04:30"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.videoDescArLabel} *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  placeholder="وصف مختصر للإجراء السريري والهدف منه..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.videoDescEnLabel} *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief clinical overview of the procedure..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.videoKeyPointsLabel}
                </label>
                <textarea
                  rows={3}
                  value={formData.keyPointsText}
                  onChange={(e) => setFormData({ ...formData, keyPointsText: e.target.value })}
                  placeholder={
                    isAr
                      ? "1. التحقق من أمان المكان أولاً\n2. تطبيق الضغط المباشر\n3. تثبيت العاصبة أعلى الجرح"
                      : "1. Scene safety assessment\n2. Direct continuous pressure\n3. Tourniquet placement"
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>{isAr ? 'جاري الإرسال...' : 'Submitting...'}</span>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{t.submitVideoForReview}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
