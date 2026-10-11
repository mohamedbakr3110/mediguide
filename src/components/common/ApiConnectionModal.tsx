import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { aspNetCoreDocumentation } from '../../services/aspnetDocs';
import { BackendStatus } from '../../types';
import {
  X,
  Server,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Code2,
  Laptop,
  Globe,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface ApiConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (status: BackendStatus) => void;
}

export const ApiConnectionModal: React.FC<ApiConnectionModalProps> = ({
  isOpen,
  onClose,
  onStatusChange,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [apiUrl, setApiUrl] = useState<string>(api.getBaseUrl());
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [status, setStatus] = useState<BackendStatus>(api.getStatus());
  const [activeTab, setActiveTab] = useState<'status' | 'docs'>('status');
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiUrl(api.getBaseUrl());
      setStatus(api.getStatus());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    api.setBaseUrl(apiUrl);
    const newStatus = await api.checkHealth();
    setStatus(newStatus);
    setIsTesting(false);
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  const handleResetDefault = () => {
    const defaultUrl = 'https://localhost:7123/api';
    setApiUrl(defaultUrl);
    api.setBaseUrl(defaultUrl);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippetIndex(index);
    setTimeout(() => setCopiedSnippetIndex(null), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-teal-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isAr ? 'ربط ASP.NET Core وقاعدة بيانات SQL Server' : 'ASP.NET Core & SQL Server Connection'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr
                  ? 'إدارة الربط بالخادم الخارجي، التحقق من الاتصال، وتصفح كود C#'
                  : 'Manage backend connection, live latency checks, and C# EF Core setup'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'status'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>{isAr ? 'حالة الاتصال والـ API' : 'Connection Status & URL'}</span>
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'docs'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>{isAr ? 'أكواد C# وسلسلة SQL Server' : 'C# Code & SQL Connection String'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'status' ? (
            <>
              {/* Status Banner */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
                  status.connected
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    status.connected ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                  }`}
                >
                  {status.connected ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Radio className="w-5 h-5 animate-pulse" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm">
                      {status.connected
                        ? isAr
                          ? 'متصل بنجاح بخادم ASP.NET Core & SQL Server'
                          : 'Connected to ASP.NET Core & SQL Server API'
                        : isAr
                        ? 'الوضع المحلي نشط (Local Repository Fallback)'
                        : 'Local In-Browser Mode Active'}
                    </span>
                    {status.latencyMs !== undefined && (
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-200/60 text-emerald-800 font-mono font-bold">
                        {status.latencyMs}ms
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                    {status.connected
                      ? isAr
                        ? `البيانات متزامنة مع الخادم على المسار: ${status.baseUrl}`
                        : `Live data synchronized with: ${status.baseUrl}`
                      : isAr
                      ? 'الخادم الخارجي غير متصل حالياً؛ التطبيق يعمل بكامل طاقته محلياً مع حفظ البيانات في المتصفح تلقائياً دون أي انقطاع.'
                      : 'External server is currently offline. The application is running seamlessly on local storage and mock databases with zero downtime.'}
                  </p>
                </div>
              </div>

              {/* URL Input Form */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  {isAr ? 'رابط خادم ASP.NET Core API (Base URL)' : 'ASP.NET Core API Base URL'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="https://localhost:7123/api"
                    className="flex-1 px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    dir="ltr"
                  />
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0 shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isAr ? 'اختبار وحفظ' : 'Test & Save'}</span>
                  </button>
                </div>
                <div className="flex items-center justify-between text-2xs text-slate-500 pt-1">
                  <span>
                    {isAr
                      ? 'الافتراضي المحلي: https://localhost:7123/api'
                      : 'Local default: https://localhost:7123/api'}
                  </span>
                  <button
                    onClick={handleResetDefault}
                    className="text-teal-600 hover:text-teal-800 underline font-medium"
                  >
                    {isAr ? 'استعادة الافتراضي' : 'Reset to default'}
                  </button>
                </div>
              </div>

              {/* Live Preview & Domain Note */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Globe className="w-4 h-4 text-teal-600" />
                  <span>{isAr ? 'الوصول عبر الهاتف والكمبيوتر' : 'Multi-Device & Public Domain Preview'}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-2xs">
                  {isAr
                    ? 'إذا كان خادم ASP.NET Core يعمل على جهاز الكمبيوتر الخاص بك وترغب في ربطه برابط الاستعراض على الهاتف، يمكنك استخدام أداة نفق مثل ngrok أو Visual Studio Dev Tunnels لتوليد رابط https ووضعه في خانة الرابط أعلاه.'
                    : 'If your ASP.NET Core server runs on your local machine and you want to connect from a phone via the public preview URL, use a tunnel tool (such as ngrok or Visual Studio Dev Tunnels) to create an HTTPS URL and paste it above.'}
                </p>
              </div>
            </>
          ) : (
            /* Docs & Code Snippets Tab */
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {isAr
                  ? 'الملفات والأكواد الجاهزة لتشغيل سيرفر C# مع قاعدة بيانات Microsoft SQL Server وتفعيل الـ CORS:'
                  : 'Ready-to-use C# code snippets for running ASP.NET Core with Microsoft SQL Server and configured CORS:'}
              </p>

              {aspNetCoreDocumentation.map((snippet, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-slate-900 text-slate-100 shadow-xs"
                >
                  <div className="flex items-center justify-between px-3.5 py-2 bg-slate-800/90 border-b border-slate-700 text-2xs">
                    <span className="font-mono text-teal-300 font-bold">{snippet.filePath}</span>
                    <button
                      onClick={() => copyToClipboard(snippet.code, idx)}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                      title="Copy code"
                    >
                      {copiedSnippetIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{isAr ? 'نسخ' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre
                    className="p-3 text-2xs font-mono overflow-x-auto max-h-56 leading-relaxed text-slate-300"
                    dir="ltr"
                  >
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xs text-slate-500">
            <Laptop className="w-3.5 h-3.5 text-slate-400" />
            <span>{isAr ? 'التشغيل على المنفذ 3000' : 'Running on Port 3000'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
