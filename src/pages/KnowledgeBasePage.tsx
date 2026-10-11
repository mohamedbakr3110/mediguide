import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MedicalArticle, ArticleCategory } from '../types';
import { Search, Filter, Bookmark, BookmarkCheck, BookOpen, UserCheck, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { MedicalVisualPlaceholder } from '../components/common/MedicalVisualPlaceholder';
import { SearchWithHistory } from '../components/common/SearchWithHistory';

interface KnowledgeBaseProps {
  articles: MedicalArticle[];
  savedArticleIds: string[];
  onSelectArticle: (article: MedicalArticle) => void;
  onToggleSave: (id: string) => void;
}

export const KnowledgeBasePage: React.FC<KnowledgeBaseProps> = ({
  articles,
  savedArticleIds,
  onSelectArticle,
  onToggleSave,
}) => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const categories = [
    { id: 'All', labelEn: 'All Topics', labelAr: 'الكل' },
    { id: 'Cardiology', labelEn: 'Cardiology', labelAr: 'أمراض القلب' },
    { id: 'Neurology', labelEn: 'Neurology', labelAr: 'المخ والأعصاب' },
    { id: 'Pediatrics', labelEn: 'Pediatrics', labelAr: 'طب الأطفال' },
    { id: 'FirstAid', labelEn: 'First Aid', labelAr: 'الإسعافات الأولية' },
    { id: 'Nutrition', labelEn: 'Clinical Nutrition', labelAr: 'التغذية العلاجية' },
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || article.difficulty === selectedDifficulty;
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.titleAr.includes(searchTerm) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summaryAr.includes(searchTerm) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 uppercase tracking-wide">
            <BookOpen className="w-4 h-4" />
            <span>{isAr ? 'الموسوعة الطبية المحكمة' : 'Peer-Reviewed Clinical Library'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.kbHeading}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t.kbSubheading}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="w-full sm:max-w-md">
            <SearchWithHistory
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              storageKey="mediguide_kb_search_history"
              placeholder={t.searchArticlesPlaceholder}
              accentColor="teal"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>{isAr ? 'المستوى السريري:' : 'Level:'}</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="All">{isAr ? 'جميع المستويات' : 'All Levels'}</option>
              <option value="Basic">{isAr ? 'مبتدئ / عام' : 'Basic'}</option>
              <option value="Intermediate">{isAr ? 'متوسط سريري' : 'Intermediate'}</option>
              <option value="Clinical">{isAr ? 'تخصصي متقدم' : 'Clinical'}</option>
            </select>
          </div>
        </div>

        {/* Category Pills/Buttons (Segmented controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
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

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => {
          const title = isAr ? article.titleAr : article.title;
          const summary = isAr ? article.summaryAr : article.summary;
          const reviewer = isAr ? article.reviewedBy.nameAr : article.reviewedBy.name;
          const isSaved = savedArticleIds.includes(article.id);

          return (
            <div
              key={article.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div
                onClick={() => onSelectArticle(article)}
                className="cursor-pointer"
              >
                <MedicalVisualPlaceholder
                  type={
                    article.category === 'Cardiology'
                      ? 'cardiology'
                      : article.category === 'Pediatrics'
                      ? 'pediatrics'
                      : article.category === 'Neurology'
                      ? 'neurology'
                      : 'general'
                  }
                  title={title}
                  className="h-40 rounded-none border-x-0 border-t-0"
                />

                <div className="p-5">
                  {/* Clean unboxed metadata with separators */}
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

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {summary}
                  </p>
                </div>
              </div>

              {/* Card Footer with Save button & Reviewer info */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate max-w-[170px]" title={reviewer}>
                    {t.reviewedBy} <strong className="text-slate-700">{reviewer}</strong>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(article.id);
                      }}
                      className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${
                        isSaved ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={isSaved ? t.articleSaved : t.saveArticle}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4 fill-teal-100" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => onSelectArticle(article)}
                      className="p-1 text-teal-700 hover:text-teal-800 font-semibold inline-flex items-center gap-1"
                    >
                      <span>{t.readArticle}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">
            {isAr ? 'لم نتمكن من إيجاد مقالات تطابق هذا البحث' : 'No articles match your criteria'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isAr ? 'جرب البحث بكلمات أخرى أو اختر تخصصاً مختلفاً من القائمة.' : 'Try adjusting your search terms or filter by a different clinical specialty.'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
          >
            {isAr ? 'إعادة ضبط الفلاتر' : 'Reset All Filters'}
          </button>
        </div>
      )}
    </div>
  );
};
