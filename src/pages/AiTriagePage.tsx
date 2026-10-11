import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Send,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Download,
  ShieldAlert,
  Bot,
  User as UserIcon,
  PhoneCall,
  CheckCircle,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { ChatMessage, ChatSession } from '../types';
import { api } from '../services/api';
import { initialChatSessions } from '../services/mockData';

interface AiTriageProps {
  onOpenHotlines: () => void;
}

export const AiTriagePage: React.FC<AiTriageProps> = ({ onOpenHotlines }) => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  const [sessions, setSessions] = useState<ChatSession[]>(initialChatSessions);
  const [activeSessionId, setActiveSessionId] = useState<string>(initialChatSessions[0]?.id || 'default');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession =
    sessions.find((s) => s.id === activeSessionId) || {
      id: 'default',
      title: 'Current Triage Session',
      titleAr: 'جلسة الفرز الحالية',
      createdAt: new Date().toISOString(),
      messages: [],
    };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession.messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      textAr: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMock: true,
    };

    // Update session state with user message
    const updatedMessages = [...activeSession.messages, userMessage];
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSession.id ? { ...s, messages: updatedMessages } : s))
    );

    if (!customText) setInputText('');
    setIsLoading(true);

    try {
      const assistantMessage = await api.sendTriageMessage(textToSend, updatedMessages, language);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id
            ? { ...s, messages: [...updatedMessages, assistantMessage] }
            : s
        )
      );
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: `chat-${Date.now()}`,
      title: isAr ? 'استشارة فرز جديدة' : 'New Triage Consultation',
      titleAr: 'استشارة فرز جديدة',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'assistant',
          text: `Hello! I am the MediGuide Medical Triage Assistant.\n\nPlease describe your symptoms, when they started, and any existing medical conditions. If you are experiencing chest pain, difficulty breathing, or severe bleeding, please call emergency services immediately.`,
          textAr: `مرحباً بك! أنا مساعد الفرز الطبي الذكي في منصة دليل الصحة (MediGuide).\n\nصف لي استفسارك أو الأعراض التي تشعر بها مع ذكر توقيت بدئها. تنبيه: في حال وجود ألم بالصدر أو صعوبة حادة بالتنفس، يرجى طلب الإسعاف فوراً دون انتظار.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedFollowUps: [
            'First aid for second-degree burn',
            'Tension headache vs migraine',
            'Signs of dehydration in infants',
          ],
          suggestedFollowUpsAr: [
            'خطوات إسعاف حرق من الدرجة الثانية',
            'الفرق بين الصداع النصفي والتوتري',
            'أعراض الجفاف لدى الرضع',
          ],
          isMock: true,
        },
      ],
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const handleExportSummary = () => {
    const transcript = activeSession.messages
      .map((m) => {
        const speaker = m.sender === 'user' ? (isAr ? 'المستخدم' : 'Patient') : (isAr ? 'المساعد الطبي' : 'MediGuide Assistant');
        const text = isAr ? m.textAr || m.text : m.text;
        return `[${m.timestamp}] ${speaker}:\n${text}\n-------------------`;
      })
      .join('\n\n');

    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MediGuide-Triage-Summary-${activeSession.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Top Disclaimer Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold">{isAr ? 'تنبيه سريري هام:' : 'Clinical Disclaimer:'}</strong>{' '}
            {t.aiAssistantNotice}
          </p>
        </div>
      </div>

      {/* Main Chat Interface Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px] max-h-[80vh]">
        {/* Left Column: Conversation Sessions Sidebar (4 cols) */}
        <div className="hidden lg:flex lg:col-span-4 bg-white rounded-2xl border border-slate-200 flex-col overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {isAr ? 'سجل جلسات الفرز' : 'Triage History'}
              </span>
            </div>

            <button
              onClick={handleNewSession}
              className="px-2.5 py-1 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
            >
              + {t.clearChat}
            </button>
          </div>

          <div className="p-3 overflow-y-auto space-y-1.5 flex-1">
            {sessions.map((sess) => {
              const isSelected = sess.id === activeSession.id;
              return (
                <button
                  key={sess.id}
                  onClick={() => setActiveSessionId(sess.id)}
                  className={`w-full text-left rtl:text-right p-3 rounded-xl text-xs transition-colors block ${
                    isSelected
                      ? 'bg-teal-50 text-teal-950 font-semibold border border-teal-200'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="truncate">{isAr ? sess.titleAr : sess.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(sess.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1">
              <Bot className="w-3.5 h-3.5 text-teal-600" />
              <span>{t.mockEngineBadge}</span>
            </div>
            <p>
              {isAr
                ? 'نظام الفرز الطبي الذكي مبني على أسس التقييم السريري المعتمدة لحالات الطوارئ.'
                : 'Intelligent triage guidance grounded in accredited emergency medical frameworks.'}
            </p>
          </div>
        </div>

        {/* Right Column: Chat Stream Area (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-xs">
          {/* Chat Header */}
          <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isAr ? 'مساعد الفرز الطبي الذكي' : 'MediGuide AI Triage Assistant'}
                </h3>
                <span className="text-[11px] text-teal-700 font-medium">
                  {isAr ? 'جاهز للاستشارة السريرية المبدئية' : 'Ready for initial clinical assessment'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportSummary}
                className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                title={t.exportChat}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.exportChat}</span>
              </button>

              <button
                onClick={handleNewSession}
                className="lg:hidden p-1.5 text-slate-500 hover:text-slate-900 rounded-lg"
                title={t.clearChat}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/30">
            {activeSession.messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const text = isAr ? msg.textAr || msg.text : msg.text;

              if (msg.isEmergencyAlert) {
                return (
                  <div
                    key={msg.id}
                    className="p-5 bg-rose-50 border-2 border-rose-500 rounded-2xl text-rose-950 space-y-3 animate-in fade-in duration-200 shadow-md"
                  >
                    <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                      <div className="flex items-center gap-2 font-bold text-rose-700 text-sm">
                        <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
                        <span>{isAr ? 'تنبيه طوارئ حرج ومباشر' : 'CRITICAL EMERGENCY ALERT'}</span>
                      </div>
                      <span className="text-xs font-mono text-rose-600 font-bold">{msg.emergencyCode}</span>
                    </div>

                    <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed font-medium">
                      {text}
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={onOpenHotlines}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{isAr ? 'الاتصال بالإسعاف فوراً (997/123)' : 'Call Ambulance Hotline Now'}</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser ? 'bg-slate-900 text-white' : 'bg-teal-600 text-white'
                    }`}
                  >
                    {isUser ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`space-y-2 max-w-[85%] ${isUser ? 'items-end' : ''}`}>
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-slate-900 text-white rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none shadow-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line">{text}</div>
                    </div>

                    <span className="text-[10px] text-slate-400 block px-1">
                      {msg.timestamp}
                    </span>

                    {/* Follow-up suggestions */}
                    {!isUser && msg.suggestedFollowUps && (
                      <div className="pt-2 space-y-1">
                        <span className="text-[11px] text-slate-400 font-medium block">
                          {isAr ? 'أسئلة متابعة مقترحة:' : 'Suggested follow-up inquiries:'}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(isAr ? msg.suggestedFollowUpsAr || msg.suggestedFollowUps : msg.suggestedFollowUps).map(
                            (suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSendMessage(suggestion)}
                                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200/80 text-left rtl:text-right"
                              >
                                {suggestion}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3 text-slate-400 text-xs py-2">
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-xl">
                  <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-2 rtl:mr-2 text-slate-500 font-medium">
                    {isAr ? 'جاري تحليل الأعراض والفرز الطبي...' : 'Analyzing symptoms and clinical triage...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-6 py-2 bg-slate-50 border-t border-slate-100 overflow-x-auto flex items-center gap-2 text-xs">
            <span className="text-slate-400 shrink-0 font-medium text-[11px]">
              {isAr ? 'اقتراحات سريعة:' : 'Quick Prompts:'}
            </span>
            <button
              onClick={() => handleSendMessage(t.aiSuggestedPrompt1)}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-600 shrink-0 whitespace-nowrap text-[11px]"
            >
              {t.aiSuggestedPrompt1}
            </button>
            <button
              onClick={() => handleSendMessage(t.aiSuggestedPrompt4)}
              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md text-rose-700 shrink-0 whitespace-nowrap text-[11px] font-semibold"
            >
              {t.aiSuggestedPrompt4}
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.aiPlaceholder}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>{t.aiSend}</span>
                <Send className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
