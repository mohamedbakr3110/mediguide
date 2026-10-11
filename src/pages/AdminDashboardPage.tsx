import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  MedicalArticle,
  MedicalVideo,
  ArticleCategory,
  ArticleStatus,
  ArticleDifficulty,
  VideoCategory,
  VideoStatus,
  User,
  UserRole,
} from '../types';
import { VideoPlayerModal } from '../components/videos/VideoPlayerModal';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Video,
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  X,
  Check,
  Send,
  MessageSquare,
  Sparkles,
  HardDrive,
  UploadCloud,
  FileVideo,
  Link as LinkIcon,
} from 'lucide-react';

interface AdminDashboardProps {
  articles: MedicalArticle[];
  videos: MedicalVideo[];
  users: User[];
  currentUser: User | null;
  onCreateArticle: (art: Omit<MedicalArticle, 'id' | 'viewCount'>) => Promise<void>;
  onUpdateArticle: (id: string, updates: Partial<MedicalArticle>) => Promise<void>;
  onDeleteArticle: (id: string) => Promise<void>;
  onApproveArticle: (id: string) => Promise<void>;
  onRejectArticle: (id: string, reason: string) => Promise<void>;
  onCreateVideo?: (video: Omit<MedicalVideo, 'id' | 'views' | 'likes'>) => Promise<void>;
  onApproveVideo: (id: string) => Promise<void>;
  onRejectVideo: (id: string, reason: string) => Promise<void>;
  onDeleteVideo: (id: string) => Promise<void>;
  onUpdateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  onSelectArticle: (article: MedicalArticle) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardProps> = ({
  articles,
  videos,
  users,
  currentUser,
  onCreateArticle,
  onUpdateArticle,
  onDeleteArticle,
  onApproveArticle,
  onRejectArticle,
  onCreateVideo,
  onApproveVideo,
  onRejectVideo,
  onDeleteVideo,
  onUpdateUserRole,
  onSelectArticle,
}) => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'approvals' | 'articles' | 'videos' | 'users'>('approvals');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Approval / Rejection Dialog States
  const [rejectingItem, setRejectingItem] = useState<{
    id: string;
    type: 'article' | 'video';
    title: string;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Delete Dialog State
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{
    id: string;
    type: 'article' | 'video';
    title: string;
  } | null>(null);

  // Preview Video Modal State
  const [previewVideoItem, setPreviewVideoItem] = useState<MedicalVideo | null>(null);

  // Video Filter State
  const [videoSearchTerm, setVideoSearchTerm] = useState('');
  const [videoStatusFilter, setVideoStatusFilter] = useState<string>('All');

  // Video Create Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isSubmittingVideo, setIsSubmittingVideo] = useState(false);
  const [videoUploadSource, setVideoUploadSource] = useState<'device' | 'url'>('device');
  const [videoUploadedFile, setVideoUploadedFile] = useState<File | null>(null);
  const [videoLocalPreviewUrl, setVideoLocalPreviewUrl] = useState<string | null>(null);
  const [isVideoDragging, setIsVideoDragging] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);

  const [videoFormData, setVideoFormData] = useState({
    title: '',
    titleAr: '',
    videoUrl: '',
    category: 'FirstAid' as VideoCategory,
    duration: '03:45',
    description: '',
    descriptionAr: '',
    instructorName: currentUser ? currentUser.fullName : 'Dr. Tarek Mansour',
    instructorNameAr: currentUser ? currentUser.fullNameAr : 'د. طارق منصور',
    instructorTitle: 'Consultant Emergency Physician',
    instructorTitleAr: 'استشاري طب الطوارئ',
    hospital: 'Kasr Al-Ainy University Hospital',
    hospitalAr: 'مستشفيات قصر العيني الجامعية',
    keyPointsText: '',
    status: 'Published' as VideoStatus,
  });

  // Article Create/Edit Modal State
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    slug: '',
    category: 'Cardiology' as ArticleCategory,
    summary: '',
    summaryAr: '',
    content: '',
    contentAr: '',
    difficulty: 'Intermediate' as ArticleDifficulty,
    readTimeMinutes: 5,
    authorName: 'Dr. Tarek Mansour',
    authorNameAr: 'د. طارق منصور',
    reviewerName: 'Dr. Mona Abdel-Aziz',
    reviewerNameAr: 'د. منى عبد العزيز',
    reviewerLicense: 'LIC-MED-2026',
    status: 'Published' as ArticleStatus,
  });

  // Items awaiting medical board approval
  const pendingArticles = articles.filter((a) => a.status === 'UnderReview');
  const pendingVideos = videos.filter((v) => v.status === 'UnderReview');
  const totalPending = pendingArticles.length + pendingVideos.length;

  const handleOpenCreateArticle = () => {
    setEditingArticleId(null);
    setFormData({
      title: '',
      titleAr: '',
      slug: '',
      category: 'Cardiology',
      summary: '',
      summaryAr: '',
      content: '',
      contentAr: '',
      difficulty: 'Intermediate',
      readTimeMinutes: 5,
      authorName: currentUser ? currentUser.fullName : 'Dr. Tarek Mansour',
      authorNameAr: currentUser ? currentUser.fullNameAr : 'د. طارق منصور',
      reviewerName: 'Dr. Mona Abdel-Aziz',
      reviewerNameAr: 'د. منى عبد العزيز',
      reviewerLicense: 'LIC-MED-2026',
      status: 'Published',
    });
    setIsArticleModalOpen(true);
  };

  const handleOpenEditArticle = (art: MedicalArticle) => {
    setEditingArticleId(art.id);
    setFormData({
      title: art.title,
      titleAr: art.titleAr,
      slug: art.slug,
      category: art.category,
      summary: art.summary,
      summaryAr: art.summaryAr,
      content: art.content,
      contentAr: art.contentAr,
      difficulty: art.difficulty,
      readTimeMinutes: art.readTimeMinutes,
      authorName: art.author.name,
      authorNameAr: art.author.nameAr,
      reviewerName: art.reviewedBy.name,
      reviewerNameAr: art.reviewedBy.nameAr,
      reviewerLicense: art.reviewedBy.license,
      status: art.status,
    });
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingArticle(true);

    try {
      if (editingArticleId) {
        await onUpdateArticle(editingArticleId, {
          title: formData.title,
          titleAr: formData.titleAr,
          slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
          category: formData.category,
          summary: formData.summary,
          summaryAr: formData.summaryAr,
          content: formData.content,
          contentAr: formData.contentAr,
          difficulty: formData.difficulty,
          readTimeMinutes: Number(formData.readTimeMinutes),
          status: formData.status,
        });
      } else {
        await onCreateArticle({
          slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
          title: formData.title,
          titleAr: formData.titleAr,
          category: formData.category,
          summary: formData.summary,
          summaryAr: formData.summaryAr,
          content: formData.content,
          contentAr: formData.contentAr,
          author: {
            name: formData.authorName,
            nameAr: formData.authorNameAr,
            role: 'Clinical Contributor',
            roleAr: 'مساهم سريري معتمد',
            institution: 'University Hospital',
            institutionAr: 'المستشفى الجامعي',
          },
          reviewedBy: {
            name: formData.reviewerName,
            nameAr: formData.reviewerNameAr,
            title: 'Consultant Reviewer',
            titleAr: 'استشاري مراجع',
            license: formData.reviewerLicense,
          },
          readTimeMinutes: Number(formData.readTimeMinutes),
          difficulty: formData.difficulty,
          tags: [formData.category],
          tagsAr: [formData.category],
          sources: [
            {
              title: 'Clinical Practice Guideline 2026',
              url: 'https://who.int',
              publisher: 'World Health Organization',
            },
          ],
          publishedAt: new Date().toISOString().split('T')[0],
          isFeatured: false,
          status: formData.status,
        });
      }
      setIsArticleModalOpen(false);
    } finally {
      setIsSubmittingArticle(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleProcessVideoFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert(isAr ? 'يرجى اختيار ملف فيديو صالح' : 'Please select a valid video file');
      return;
    }
    const url = URL.createObjectURL(file);
    setVideoUploadedFile(file);
    setVideoLocalPreviewUrl(url);
    setVideoFormData((prev) => ({
      ...prev,
      videoUrl: url,
      title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      titleAr: prev.titleAr || (isAr ? `شرح سريري: ${file.name.replace(/\.[^/.]+$/, '')}` : ''),
    }));

    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = url;
    tempVideo.onloadedmetadata = () => {
      if (tempVideo.duration && !isNaN(tempVideo.duration)) {
        const totalSec = Math.floor(tempVideo.duration);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        setVideoFormData((prev) => ({ ...prev, duration: formatted }));
      }
    };
  };

  const handleOpenCreateVideo = () => {
    setVideoUploadedFile(null);
    setVideoLocalPreviewUrl(null);
    setVideoFormData({
      title: '',
      titleAr: '',
      videoUrl: '',
      category: 'FirstAid',
      duration: '03:45',
      description: '',
      descriptionAr: '',
      instructorName: currentUser ? currentUser.fullName : 'Dr. Tarek Mansour',
      instructorNameAr: currentUser ? currentUser.fullNameAr : 'د. طارق منصور',
      instructorTitle: 'Consultant Emergency Physician',
      instructorTitleAr: 'استشاري طب الطوارئ',
      hospital: 'Kasr Al-Ainy University Hospital',
      hospitalAr: 'مستشفيات قصر العيني الجامعية',
      keyPointsText: '',
      status: 'Published',
    });
    setIsVideoModalOpen(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateVideo) return;
    if (videoUploadSource === 'device' && !videoUploadedFile && !videoFormData.videoUrl) {
      alert(isAr ? 'يرجى اختيار ملف فيديو من جهازك أولاً' : 'Please select a video file from your device first');
      return;
    }
    setIsSubmittingVideo(true);
    try {
      const keyPointsListAr = videoFormData.keyPointsText
        ? videoFormData.keyPointsText.split('\n').filter((l) => l.trim().length > 0)
        : [isAr ? 'إجراءات السلامة وتقييم المصاب' : 'Scene safety assessment'];

      await onCreateVideo({
        title: videoFormData.title,
        titleAr: videoFormData.titleAr,
        description: videoFormData.description,
        descriptionAr: videoFormData.descriptionAr,
        category: videoFormData.category,
        videoUrl: videoFormData.videoUrl,
        thumbnailGradient: 'from-teal-950 via-slate-900 to-sky-950',
        duration: videoFormData.duration || '03:45',
        instructor: {
          name: videoFormData.instructorName,
          nameAr: videoFormData.instructorNameAr,
          title: videoFormData.instructorTitle,
          titleAr: videoFormData.instructorTitleAr,
          hospital: videoFormData.hospital,
          hospitalAr: videoFormData.hospitalAr,
        },
        publishedAt: new Date().toISOString().split('T')[0],
        status: videoFormData.status,
        tags: [videoFormData.category],
        tagsAr: [videoFormData.category],
        keyPointsAr: keyPointsListAr,
        keyPointsEn: keyPointsListAr,
        isLocalUpload: videoUploadSource === 'device',
        fileName: videoUploadedFile?.name,
        fileSize: videoUploadedFile ? formatFileSize(videoUploadedFile.size) : undefined,
      });
      setIsVideoModalOpen(false);
    } finally {
      setIsSubmittingVideo(false);
    }
  };

  const handleConfirmRejection = async () => {
    if (!rejectingItem) return;
    if (rejectingItem.type === 'article') {
      await onRejectArticle(rejectingItem.id, rejectionReason);
    } else {
      await onRejectVideo(rejectingItem.id, rejectionReason);
    }
    setRejectingItem(null);
    setRejectionReason('');
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;
    if (deleteConfirmItem.type === 'article') {
      await onDeleteArticle(deleteConfirmItem.id);
    } else {
      await onDeleteVideo(deleteConfirmItem.id);
    }
    setDeleteConfirmItem(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Super Admin Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>{isAr ? 'الإدارة المركزية والاعتماد الطبي' : 'Master Platform Control'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.adminDashboardTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            {t.adminDashboardSub}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateArticle}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newArticleBtn}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Approvals KPI Card */}
        <div
          onClick={() => setActiveTab('approvals')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'approvals'
              ? 'bg-amber-500/10 border-amber-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-2">
            <span>{t.adminStatsPendingApprovals}</span>
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalPending}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {isAr ? 'مقالات وفيديوهات بانتظار الاعتماد' : 'Pending medical review'}
          </span>
        </div>

        {/* Total Articles KPI Card */}
        <div
          onClick={() => setActiveTab('articles')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'articles'
              ? 'bg-teal-500/10 border-teal-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-teal-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-teal-800 font-semibold mb-2">
            <span>{t.adminStatsTotalArticles}</span>
            <FileText className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {articles.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {articles.filter((a) => a.status === 'Published').length} {isAr ? 'منشور للعامة' : 'Live & Published'}
          </span>
        </div>

        {/* Total Videos KPI Card */}
        <div
          onClick={() => setActiveTab('videos')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'videos'
              ? 'bg-sky-500/10 border-sky-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-sky-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-sky-800 font-semibold mb-2">
            <span>{t.adminStatsTotalVideos}</span>
            <Video className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {videos.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {videos.filter((v) => v.status === 'Published').length} {isAr ? 'شرح مرئي متاح' : 'Live Video Tutorials'}
          </span>
        </div>

        {/* Registered Physicians & Users KPI Card */}
        <div
          onClick={() => setActiveTab('users')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-indigo-500/10 border-indigo-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-indigo-800 font-semibold mb-2">
            <span>{t.adminStatsVerifiedDoctors}</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {users.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {users.filter((u) => u.role === 'Doctor').length} {isAr ? 'طبيب ومراجع معتمد' : 'Verified Doctors'}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-medium overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`pb-3 relative transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'approvals' ? 'text-amber-800 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-600" />
          <span>{t.adminTabPendingApprovals}</span>
          {totalPending > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold text-xs font-mono">
              {totalPending}
            </span>
          )}
          {activeTab === 'approvals' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-3 relative transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'articles' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.adminTabArticles}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
            {articles.length}
          </span>
          {activeTab === 'articles' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-teal-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`pb-3 relative transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'videos' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>{t.adminTabVideos}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
            {videos.length}
          </span>
          {activeTab === 'videos' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-teal-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 relative transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'users' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.adminTabUsers}</span>
          {activeTab === 'users' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-teal-600 rounded-full" />
          )}
        </button>
      </div>

      {/* TAB 1: PENDING APPROVALS QUEUE */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs text-amber-950">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {isAr
                  ? 'هذه القائمة تضم المقالات والفيديوهات التي قدمها الأطباء والباحثون وتتطلب مراجعة واعتماداً قبل ظهورها للجمهور.'
                  : 'Items submitted by physicians & researchers awaiting medical board clearance.'}
              </span>
            </div>
            <span className="font-bold font-mono text-amber-800">
              {totalPending} {isAr ? 'عنصر قيد المراجعة' : 'Pending Items'}
            </span>
          </div>

          {/* Pending Articles List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              <span>{isAr ? 'مقالات تنتظر الاعتماد' : 'Articles Awaiting Approval'}</span>
              <span className="text-slate-400">({pendingArticles.length})</span>
            </h3>

            {pendingArticles.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-xl border-2 border-amber-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-semibold text-[11px]">
                      {art.category}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 font-mono text-[11px]">{art.publishedAt}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 text-xs">
                      {isAr ? art.author.nameAr : art.author.name} ({isAr ? art.author.institutionAr : art.author.institution})
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    {isAr ? art.titleAr : art.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {isAr ? art.summaryAr : art.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onSelectArticle(art)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isAr ? 'معاينة' : 'Preview'}</span>
                  </button>

                  <button
                    onClick={() =>
                      setRejectingItem({
                        id: art.id,
                        type: 'article',
                        title: isAr ? art.titleAr : art.title,
                      })
                    }
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{t.rejectAction}</span>
                  </button>

                  <button
                    onClick={() => onApproveArticle(art.id)}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.approveAction}</span>
                  </button>
                </div>
              </div>
            ))}

            {pendingArticles.length === 0 && (
              <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                {isAr ? 'لا توجد مقالات معلقة بانتظار الموافقة.' : 'No articles currently awaiting approval.'}
              </div>
            )}
          </div>

          {/* Pending Videos List */}
          <div className="space-y-3 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-sky-600" />
              <span>{isAr ? 'فيديوهات تنتظر الاعتماد' : 'Videos Awaiting Approval'}</span>
              <span className="text-slate-400">({pendingVideos.length})</span>
            </h3>

            {pendingVideos.map((vid) => (
              <div
                key={vid.id}
                className="bg-white rounded-xl border-2 border-amber-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 font-semibold text-[11px]">
                      {vid.category}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 font-mono text-[11px]">{vid.duration}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 text-xs">
                      {isAr ? vid.instructor.nameAr : vid.instructor.name} ({isAr ? vid.instructor.hospitalAr : vid.instructor.hospital})
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    {isAr ? vid.titleAr : vid.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {isAr ? vid.descriptionAr : vid.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => setPreviewVideoItem(vid)}
                    className="px-3 py-1.5 text-xs text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isAr ? 'معاينة الفيديو' : 'Preview Video'}</span>
                  </button>

                  <button
                    onClick={() =>
                      setRejectingItem({
                        id: vid.id,
                        type: 'video',
                        title: isAr ? vid.titleAr : vid.title,
                      })
                    }
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{t.rejectAction}</span>
                  </button>

                  <button
                    onClick={() => onApproveVideo(vid.id)}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.approveAction}</span>
                  </button>
                </div>
              </div>
            ))}

            {pendingVideos.length === 0 && (
              <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                {isAr ? 'لا توجد فيديوهات معلقة بانتظار الموافقة.' : 'No videos currently awaiting approval.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ARTICLES REPOSITORY */}
      {activeTab === 'articles' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isAr ? 'بحث في مقالات الموسوعة...' : 'Search articles...'}
                className="w-full pl-9 rtl:pr-9 rtl:pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto text-xs w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
              >
                <option value="All">{isAr ? 'جميع الحالات' : 'All Statuses'}</option>
                <option value="Published">{t.statusPublished}</option>
                <option value="UnderReview">{t.statusUnderReview}</option>
                <option value="Rejected">{t.statusRejected}</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4">{t.tableTitle}</th>
                    <th className="py-3 px-4">{t.tableCategory}</th>
                    <th className="py-3 px-4">{t.tableStatus}</th>
                    <th className="py-3 px-4">{t.tableAuthor}</th>
                    <th className="py-3 px-4 text-center">{t.tableActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {articles
                    .filter(
                      (a) =>
                        (statusFilter === 'All' || a.status === statusFilter) &&
                        (a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.titleAr.includes(searchTerm))
                    )
                    .map((art) => (
                      <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 max-w-xs">
                          <span className="font-semibold text-slate-900 block truncate">
                            {isAr ? art.titleAr : art.title}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-mono">
                            {art.slug}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          {art.category}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          {art.status === 'Published' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>{t.statusPublished}</span>
                            </span>
                          )}
                          {art.status === 'UnderReview' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>{t.statusUnderReview}</span>
                            </span>
                          )}
                          {art.status === 'Rejected' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>{t.statusRejected}</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          <div className="font-medium text-slate-800">
                            {isAr ? art.author.nameAr : art.author.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {isAr ? art.reviewedBy.nameAr : art.reviewedBy.name}
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => onSelectArticle(art)}
                              className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title={t.readArticle}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleOpenEditArticle(art)}
                              className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title={t.editAction}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() =>
                                setDeleteConfirmItem({
                                  id: art.id,
                                  type: 'article',
                                  title: isAr ? art.titleAr : art.title,
                                })
                              }
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title={t.deleteAction}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VIDEOS REPOSITORY */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={videoSearchTerm}
                onChange={(e) => setVideoSearchTerm(e.target.value)}
                placeholder={isAr ? 'بحث في الفيديوهات والشروحات...' : 'Search clinical videos...'}
                className="w-full pl-9 rtl:pr-9 rtl:pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto text-xs w-full sm:w-auto justify-between sm:justify-end">
              <select
                value={videoStatusFilter}
                onChange={(e) => setVideoStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
              >
                <option value="All">{isAr ? 'جميع الحالات' : 'All Statuses'}</option>
                <option value="Published">{t.statusPublished}</option>
                <option value="UnderReview">{t.statusUnderReview}</option>
                <option value="Rejected">{t.statusRejected}</option>
              </select>

              {onCreateVideo && (
                <button
                  onClick={handleOpenCreateVideo}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.adminAddVideoBtn}</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4">{t.tableTitle}</th>
                    <th className="py-3 px-4">{t.tableCategory}</th>
                    <th className="py-3 px-4">{t.tableStatus}</th>
                    <th className="py-3 px-4">{t.tableAuthor}</th>
                    <th className="py-3 px-4 text-center">{t.tableActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {videos
                    .filter(
                      (vid) =>
                        (videoStatusFilter === 'All' || vid.status === videoStatusFilter) &&
                        (vid.title.toLowerCase().includes(videoSearchTerm.toLowerCase()) ||
                          vid.titleAr.includes(videoSearchTerm) ||
                          vid.instructor.name.toLowerCase().includes(videoSearchTerm.toLowerCase()) ||
                          vid.instructor.nameAr.includes(videoSearchTerm))
                    )
                    .map((vid) => (
                    <tr key={vid.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-slate-900 block truncate">
                            {isAr ? vid.titleAr : vid.title}
                          </span>
                          {vid.isLocalUpload && (
                            <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 text-[10px] font-semibold border border-teal-200 inline-flex items-center gap-1 shrink-0">
                              <HardDrive className="w-2.5 h-2.5 text-teal-600" />
                              <span>{isAr ? 'من الجهاز' : 'Device'}</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 block font-mono">
                          {vid.duration} · {vid.views} {isAr ? 'مشاهدة' : 'views'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {vid.category}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {vid.status === 'Published' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>{t.statusPublished}</span>
                          </span>
                        )}
                        {vid.status === 'UnderReview' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>{t.statusUnderReview}</span>
                          </span>
                        )}
                        {vid.status === 'Rejected' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>{t.statusRejected}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        <div className="font-medium text-slate-800">
                          {isAr ? vid.instructor.nameAr : vid.instructor.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isAr ? vid.instructor.hospitalAr : vid.instructor.hospital}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setPreviewVideoItem(vid)}
                            className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title={isAr ? 'معاينة الفيديو' : 'Preview Video'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {vid.status === 'UnderReview' && (
                            <button
                              onClick={() => onApproveVideo(vid.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 cursor-pointer"
                            >
                              {isAr ? 'اعتماد' : 'Approve'}
                            </button>
                          )}

                          <button
                            onClick={() =>
                              setDeleteConfirmItem({
                                id: vid.id,
                                type: 'video',
                                title: isAr ? vid.titleAr : vid.title,
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Delete Video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: USERS & PHYSICIANS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">{isAr ? 'اسم المستخدم' : 'User'}</th>
                  <th className="py-3 px-4">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th className="py-3 px-4">{isAr ? 'الدور / الصفة' : 'Role'}</th>
                  <th className="py-3 px-4">{isAr ? 'تاريخ التسجيل' : 'Registered Date'}</th>
                  <th className="py-3 px-4 text-center">{isAr ? 'ترقية / تعديل الدور' : 'Change Role'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {isAr ? u.fullNameAr || u.fullName : u.fullName}
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {u.email}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                          u.role === 'Admin'
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : u.role === 'Doctor'
                            ? 'bg-teal-100 text-teal-900 border border-teal-200'
                            : u.role === 'Student'
                            ? 'bg-sky-100 text-sky-900 border border-sky-200'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <select
                        value={u.role}
                        onChange={(e) => onUpdateUserRole(u.id, e.target.value as UserRole)}
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700"
                      >
                        <option value="Patient">{isAr ? 'مستخدم / مريض' : 'Patient'}</option>
                        <option value="Student">{isAr ? 'طالب طب' : 'Student'}</option>
                        <option value="Doctor">{isAr ? 'طبيب مراجع' : 'Doctor'}</option>
                        <option value="Admin">{isAr ? 'مدير نظام' : 'Admin'}</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-rose-200 p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 font-bold text-sm">
              <XCircle className="w-5 h-5 shrink-0" />
              <span>{t.rejectAction}</span>
            </div>

            <p className="text-xs text-slate-600">
              {isAr ? 'العنصر المرفوض:' : 'Target item:'}{' '}
              <strong className="text-slate-900">{rejectingItem.title}</strong>
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.rejectionReasonLabel}
              </label>
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={t.rejectionReasonPlaceholder}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingItem(null)}
                className="px-4 py-2 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleConfirmRejection}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg"
              >
                {isAr ? 'تأكيد الرفض وإشعار الكاتب' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-rose-200 p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{t.deleteConfirmTitle}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.deleteConfirmDesc} ({deleteConfirmItem.title})
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                {t.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT ARTICLE MODAL */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {editingArticleId
                  ? isAr ? 'تعديل المقال الطبي' : 'Edit Medical Article'
                  : t.newArticleBtn}
              </h3>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isAr ? 'العنوان باللغة العربية' : 'Arabic Title'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isAr ? 'العنوان باللغة الإنجليزية' : 'English Title'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.tableCategory}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as ArticleCategory })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="FirstAid">First Aid</option>
                    <option value="Nutrition">Nutrition</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.tableStatus}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as ArticleStatus })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Published">{t.statusPublished}</option>
                    <option value="UnderReview">{t.statusUnderReview}</option>
                    <option value="Draft">{t.statusDraft}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isAr ? 'وقت القراءة (دقائق)' : 'Read Time (min)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.readTimeMinutes}
                    onChange={(e) =>
                      setFormData({ ...formData, readTimeMinutes: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isAr ? 'الملخص التنفيذي (عربي)' : 'Arabic Summary'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.summaryAr}
                  onChange={(e) => setFormData({ ...formData, summaryAr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isAr ? 'الملخص التنفيذي (إنجليزي)' : 'English Summary'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isAr ? 'المحتوى الطبي الكامل (عربي)' : 'Full Article Content (Arabic)'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.contentAr}
                  onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isAr ? 'المحتوى الطبي الكامل (إنجليزي)' : 'Full Article Content (English)'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  dir="ltr"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingArticle}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg shadow-xs cursor-pointer"
                >
                  {isSubmittingArticle ? (isAr ? 'جاري الحفظ...' : 'Saving...') : t.saveChanges}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Creation Modal with Device Upload */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Video className="w-4 h-4 text-teal-400" />
                <span>{isAr ? 'إضافة فيديو سريري جديد (لوحة الإدارة)' : 'Add Clinical Video (Admin)'}</span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Video Source Selection Tabs */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  {t.videoSourceType}
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setVideoUploadSource('device')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      videoUploadSource === 'device'
                        ? 'bg-white text-teal-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <HardDrive className="w-4 h-4 text-teal-600" />
                    <span>{t.uploadFromDevice}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoUploadSource('url')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      videoUploadSource === 'url'
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
              {videoUploadSource === 'device' && (
                <div className="space-y-3">
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime,video/mkv,video/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleProcessVideoFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />

                  {!videoUploadedFile ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsVideoDragging(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setIsVideoDragging(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsVideoDragging(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleProcessVideoFile(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => videoFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                        isVideoDragging
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
                              {videoUploadedFile.name}
                            </span>
                            <span className="text-[11px] text-teal-800 font-mono">
                              {formatFileSize(videoUploadedFile.size)} · {videoFormData.duration}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (videoLocalPreviewUrl) URL.revokeObjectURL(videoLocalPreviewUrl);
                            setVideoUploadedFile(null);
                            setVideoLocalPreviewUrl(null);
                            setVideoFormData((prev) => ({ ...prev, videoUrl: '' }));
                            if (videoFileInputRef.current) videoFileInputRef.current.value = '';
                          }}
                          className="px-2.5 py-1 text-xs text-rose-700 hover:bg-rose-100 rounded-lg transition-colors shrink-0 cursor-pointer font-medium"
                        >
                          {t.changeFile}
                        </button>
                      </div>

                      {/* Live Local Video Preview */}
                      {videoLocalPreviewUrl && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-semibold text-teal-900 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-teal-600" />
                            <span>{t.videoPreviewBadge}</span>
                          </span>
                          <div className="rounded-lg overflow-hidden bg-black aspect-video max-h-48 border border-slate-700 flex items-center justify-center">
                            <video
                              src={videoLocalPreviewUrl}
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
              {videoUploadSource === 'url' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.videoUrlLabel}
                  </label>
                  <input
                    type="url"
                    value={videoFormData.videoUrl}
                    onChange={(e) => setVideoFormData({ ...videoFormData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube-nocookie.com/embed/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
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
                    value={videoFormData.titleAr}
                    onChange={(e) => setVideoFormData({ ...videoFormData, titleAr: e.target.value })}
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
                    value={videoFormData.title}
                    onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                    placeholder="Clinical Hemorrhage Protocol..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.videoCategoryLabel}
                  </label>
                  <select
                    value={videoFormData.category}
                    onChange={(e) =>
                      setVideoFormData({ ...videoFormData, category: e.target.value as VideoCategory })
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
                    {isAr ? 'مدة المقطع' : 'Duration'}
                  </label>
                  <input
                    type="text"
                    value={videoFormData.duration}
                    onChange={(e) => setVideoFormData({ ...videoFormData, duration: e.target.value })}
                    placeholder="04:30"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.tableStatus}
                  </label>
                  <select
                    value={videoFormData.status}
                    onChange={(e) =>
                      setVideoFormData({ ...videoFormData, status: e.target.value as VideoStatus })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Published">{t.statusPublished}</option>
                    <option value="UnderReview">{t.statusUnderReview}</option>
                    <option value="Draft">{t.statusDraft}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.videoDescArLabel} *
                </label>
                <textarea
                  rows={2}
                  required
                  value={videoFormData.descriptionAr}
                  onChange={(e) => setVideoFormData({ ...videoFormData, descriptionAr: e.target.value })}
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
                  value={videoFormData.description}
                  onChange={(e) => setVideoFormData({ ...videoFormData, description: e.target.value })}
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
                  rows={2}
                  value={videoFormData.keyPointsText}
                  onChange={(e) => setVideoFormData({ ...videoFormData, keyPointsText: e.target.value })}
                  placeholder={
                    isAr
                      ? "1. التحقق من أمان المكان أولاً\n2. تطبيق الضغط المباشر"
                      : "1. Scene safety assessment\n2. Direct continuous pressure"
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingVideo}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmittingVideo ? (
                    <span>{isAr ? 'جاري الحفظ...' : 'Saving...'}</span>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{isAr ? 'نشر الفيديو' : 'Publish Video'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shared Video Player Modal for Admin Preview */}
      <VideoPlayerModal
        video={previewVideoItem}
        onClose={() => setPreviewVideoItem(null)}
      />
    </div>
  );
};
