import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Search, History, X, Trash2, ArrowUpLeft, ArrowUpRight } from 'lucide-react';

interface SearchWithHistoryProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  storageKey: string;
  placeholder: string;
  accentColor?: 'teal' | 'rose' | 'sky';
  maxHistory?: number;
  className?: string;
}

export const SearchWithHistory: React.FC<SearchWithHistoryProps> = ({
  searchTerm,
  onSearchChange,
  storageKey,
  placeholder,
  accentColor = 'teal',
  maxHistory = 6,
  className = '',
}) => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowUpLeft : ArrowUpRight;

  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync history to localStorage whenever it changes
  const updateHistory = (newHistory: string[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newHistory));
    } catch {
      // localStorage quota or disabled
    }
  };

  // Add a query to history
  const addToHistory = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;

    // Remove duplicates (case-insensitive) and prepend to top
    const filtered = history.filter(
      (item) => item.toLowerCase() !== trimmed.toLowerCase()
    );
    const updated = [trimmed, ...filtered].slice(0, maxHistory);
    updateHistory(updated);
  };

  // Remove a single item from history
  const removeItem = (e: React.MouseEvent, itemToRemove: string) => {
    e.stopPropagation();
    const updated = history.filter((item) => item !== itemToRemove);
    updateHistory(updated);
  };

  // Clear all history
  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateHistory([]);
  };

  // Click query to apply
  const applyQuery = (query: string) => {
    onSearchChange(query);
    addToHistory(query);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Save query when user presses Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchTerm.trim()) {
        addToHistory(searchTerm);
      }
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Debounce-save queries when typing 3+ chars
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onSearchChange(val);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (val.trim().length >= 3) {
      saveTimeoutRef.current = setTimeout(() => {
        addToHistory(val);
      }, 1800);
    }
  };

  const handleInputBlur = () => {
    if (searchTerm.trim().length >= 2) {
      addToHistory(searchTerm);
    }
  };

  // Determine focus ring style based on accent color
  const ringColor =
    accentColor === 'rose'
      ? 'focus:ring-rose-500 focus:border-rose-400'
      : accentColor === 'sky'
      ? 'focus:ring-sky-500 focus:border-sky-400'
      : 'focus:ring-teal-500 focus:border-teal-400';

  const badgeBg =
    accentColor === 'rose'
      ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
      : accentColor === 'sky'
      ? 'bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-200'
      : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200';

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 pointer-events-none" />
        
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-9 rtl:pr-9 rtl:pl-16 pr-16 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 shadow-2xs transition-all ${ringColor}`}
        />

        <div className="absolute right-2.5 rtl:left-2.5 rtl:right-auto top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                setIsOpen(false);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
              title={isAr ? 'مسح النص' : 'Clear text'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                isOpen ? 'text-teal-700 bg-teal-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={t.recentSearches}
            >
              <History className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Menu for Recent Searches */}
      {isOpen && history.length > 0 && (
        <div className="absolute z-30 mt-1.5 inset-x-0 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold flex items-center gap-1.5 text-slate-700">
              <History className="w-3 h-3 text-slate-400" />
              <span>{t.recentSearches}</span>
            </span>

            <button
              type="button"
              onClick={clearAll}
              className="text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer font-medium"
            >
              <Trash2 className="w-3 h-3" />
              <span>{t.clearSearchHistory}</span>
            </button>
          </div>

          <div className="p-1 divide-y divide-slate-50 max-h-56 overflow-y-auto">
            {history.map((query, index) => (
              <div
                key={index}
                onClick={() => applyQuery(query)}
                className="group flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <History className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0 transition-colors" />
                  <span className="truncate group-hover:text-slate-900 font-medium">
                    {query}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => removeItem(e, query)}
                    className="p-1 text-slate-300 hover:text-rose-600 rounded-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    title={isAr ? 'حذف من السجل' : 'Remove from history'}
                  >
                    <X className="w-3 h-3" />
                  </button>

                  <ArrowIcon className="w-3 h-3 text-slate-300 group-hover:text-slate-600 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accessible Quick Chips Below Input */}
      {history.length > 0 && (
        <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[11px]">
          <span className="text-slate-400 font-medium flex items-center gap-1 shrink-0">
            <History className="w-3 h-3" />
            <span>{isAr ? 'عمليات بحث سابقة:' : 'Recent:'}</span>
          </span>

          {history.slice(0, 4).map((query, idx) => (
            <div
              key={idx}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-medium transition-all ${badgeBg}`}
            >
              <button
                type="button"
                onClick={() => applyQuery(query)}
                className="cursor-pointer hover:underline"
              >
                {query}
              </button>
              <button
                type="button"
                onClick={(e) => removeItem(e, query)}
                className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-0.5 -mr-1 rtl:-mr-0 rtl:-ml-1"
                title={isAr ? 'حذف' : 'Remove'}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}

          {history.length > 4 && (
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-slate-800 text-[10px] font-semibold cursor-pointer underline px-1"
            >
              +{history.length - 4} {isAr ? 'المزيد' : 'more'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
