import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MedicalVideo } from '../../types';
import {
  X,
  Video,
  Clock,
  Eye,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  HardDrive,
  Building,
  UserCheck,
} from 'lucide-react';

interface VideoPlayerModalProps {
  video: MedicalVideo | null;
  onClose: () => void;
  onToggleSave?: (id: string) => void;
  isSaved?: boolean;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  onClose,
  onToggleSave,
  isSaved = false,
}) => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  if (!video) return null;

  const isDirectVideo =
    Boolean(video.isLocalUpload) ||
    video.videoUrl.startsWith('blob:') ||
    video.videoUrl.startsWith('data:') ||
    /\.(mp4|webm|ogg|mov|mkv)($|\?)/i.test(video.videoUrl) ||
    (!video.videoUrl.includes('youtube') &&
      !video.videoUrl.includes('vimeo') &&
      !video.videoUrl.includes('embed'));

  const title = isAr ? video.titleAr : video.title;
  const description = isAr ? video.descriptionAr : video.description;
  const instructorName = isAr ? video.instructor.nameAr : video.instructor.name;
  const instructorTitle = isAr ? video.instructor.titleAr : video.instructor.title;
  const instructorHospital = isAr ? video.instructor.hospitalAr : video.instructor.hospital;
  const keyPoints = isAr ? video.keyPointsAr : video.keyPointsEn;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-4xl bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/90">
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold min-w-0">
            <Video className="w-4 h-4 shrink-0 text-teal-400" />
            <span className="truncate">{title}</span>
            {video.isLocalUpload && (
              <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-medium flex items-center gap-1">
                <HardDrive className="w-3 h-3" />
                <span>{isAr ? 'ملف محمل من الجهاز' : 'Local Device Video'}</span>
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Display Area */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {isDirectVideo ? (
            <video
              src={video.videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain bg-black"
            >
              {isAr ? 'متصفحك لا يدعم تشغيل هذا المقطع مباشرة.' : 'Your browser does not support the video tag.'}
            </video>
          ) : (
            <iframe
              src={video.videoUrl}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* Video Metadata & Clinical Content Details */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-300 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-semibold text-[11px] border border-teal-500/30">
                  {video.category}
                </span>
                <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{video.duration}</span>
                </span>
                <span className="text-slate-600">·</span>
                <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                  <Eye className="w-3 h-3" />
                  <span>{video.views} {isAr ? 'مشاهدة' : 'views'}</span>
                </span>
                {video.fileSize && (
                  <>
                    <span className="text-slate-600">·</span>
                    <span className="text-emerald-400 font-mono text-[11px]">
                      {video.fileSize}
                    </span>
                  </>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
                {title}
              </h2>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400 text-xs">
                <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
                  <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>{instructorName}</span>
                </span>
                <span className="text-slate-600">·</span>
                <span>{instructorTitle}</span>
                <span className="text-slate-600">·</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Building className="w-3.5 h-3.5" />
                  <span>{instructorHospital}</span>
                </span>
              </div>
            </div>

            {onToggleSave && (
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <button
                  onClick={() => onToggleSave(video.id)}
                  className={`px-3.5 py-2 rounded-xl border text-xs flex items-center gap-2 transition-colors font-medium ${
                    isSaved
                      ? 'bg-teal-500 text-slate-950 font-bold border-teal-400'
                      : 'border-slate-700 bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-4 h-4 text-slate-950" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-slate-300" />
                  )}
                  <span>{isSaved ? (isAr ? 'تم الحفظ' : 'Saved') : (isAr ? 'حفظ الفيديو' : 'Save Video')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {isAr ? 'الملخص السريري للشرح' : 'Clinical Overview'}
            </h4>
            <p className="leading-relaxed text-slate-300 text-xs sm:text-sm">
              {description}
            </p>
          </div>

          {/* Key Clinical Points */}
          {keyPoints && keyPoints.length > 0 && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>{t.videoKeyPoints}</span>
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-slate-300 pl-2 rtl:pr-2 leading-relaxed">
                {keyPoints.map((pt, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
