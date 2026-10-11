import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X, Bookmark, BookmarkCheck, Share2, Printer, ExternalLink, ShieldCheck, Clock, UserCheck } from 'lucide-react';
import { MedicalArticle } from '../../types';
import { MedicalVisualPlaceholder } from '../common/MedicalVisualPlaceholder';

interface ArticleReaderProps {
  article: MedicalArticle | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderProps> = ({
  article,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  const { t, language } = useLanguage();

  if (!article) return null;

  const isAr = language === 'ar';
  const title = isAr ? article.titleAr : article.title;
  const summary = isAr ? article.summaryAr : article.summary;
  const content = isAr ? article.contentAr : article.content;
  const authorName = isAr ? article.author.nameAr : article.author.name;
  const authorRole = isAr ? article.author.roleAr : article.author.role;
  const authorInst = isAr ? article.author.institutionAr : article.author.institution;
  const reviewerName = isAr ? article.reviewedBy.nameAr : article.reviewedBy.name;
  const reviewerTitle = isAr ? article.reviewedBy.titleAr : article.reviewedBy.title;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert(isAr ? 'تم نسخ رابط المقال إلى الحافظة' : 'Article link copied to clipboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-title"
      >
        {/* Top Action Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 print:hidden">
          {/* Metadata without pills: clean unboxed text with typographic dot separators */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-teal-700">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTimeMinutes} {t.readTime}</span>
            <span aria-hidden="true">·</span>
            <span>{article.difficulty}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(article.id)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? 'bg-teal-50 border-teal-300 text-teal-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title={isSaved ? t.articleSaved : t.saveArticle}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-teal-600" /> : <Bookmark className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSaved ? t.articleSaved : t.saveArticle}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 text-xs transition-colors"
              title={t.shareArticle}
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 text-xs transition-colors"
              title="Print Article"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Visual Header */}
          <MedicalVisualPlaceholder
            type={article.category === 'Cardiology' ? 'cardiology' : article.category === 'Pediatrics' ? 'pediatrics' : article.category === 'FirstAid' ? 'cpr' : 'general'}
            title={title}
            className="mb-4"
          />

          {/* Title */}
          <div>
            <h1
              id="article-title"
              className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug"
              style={{ textWrap: 'balance' }}
            >
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed font-medium">
              {summary}
            </p>
          </div>

          {/* Author & Reviewer Attribution Strip */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-start gap-2.5">
              <UserCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[11px]">{isAr ? 'الكاتب السريري:' : 'Clinical Author:'}</span>
                <span className="font-semibold text-slate-800">{authorName}</span>
                <span className="block text-slate-500 text-[11px]">{authorRole} · {authorInst}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[11px]">{isAr ? 'المراجعة الطبية المعتمدة:' : 'Peer Review Verification:'}</span>
                <span className="font-semibold text-slate-800">{reviewerName}</span>
                <span className="block text-slate-500 text-[11px]">{reviewerTitle} ({article.reviewedBy.license})</span>
              </div>
            </div>
          </div>

          {/* Main Article Content with Markdown-style Paragraphs */}
          <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4">
            {content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-base font-bold text-slate-900 pt-3 border-b border-slate-100 pb-1">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n- ');
                return (
                  <ul key={index} className="list-disc list-inside space-y-1 text-slate-700 pl-2 rtl:pr-2">
                    {items.map((item, i) => (
                      <li key={i}>{item.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.match(/^\d+\. /)) {
                const items = paragraph.split(/\n\d+\. /);
                return (
                  <ol key={index} className="list-decimal list-inside space-y-1 text-slate-700 pl-2 rtl:pr-2">
                    {items.map((item, i) => (
                      <li key={i}>{item.replace(/^\d+\. /, '')}</li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={index} className="text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Verified Sources & References Section */}
          <div className="pt-6 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <span>{t.sourcesAndRefs}</span>
            </h4>
            <div className="space-y-2">
              {article.sources.map((src, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-medium text-slate-800 block">{src.title}</span>
                    <span className="text-[11px] text-slate-500">{src.publisher} {src.doi ? `· DOI: ${src.doi}` : ''}</span>
                  </div>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 shrink-0 font-medium ml-2 rtl:mr-2"
                  >
                    <span>{isAr ? 'المصدر' : 'Source'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 print:hidden">
          <span>{isAr ? `تاريخ النشر: ${article.publishedAt}` : `Published: ${article.publishedAt}`}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isAr ? 'إغلاق القراءة' : 'Close Article'}
          </button>
        </div>
      </div>
    </div>
  );
};
