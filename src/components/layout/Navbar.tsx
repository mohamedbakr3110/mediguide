import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PhoneCall, Globe, UserCheck, Shield, Menu, X, Video, ShieldAlert, Database } from 'lucide-react';
import { User } from '../../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser: User | null;
  onOpenHotlines: () => void;
  pendingApprovalsCount?: number;
  onOpenApiModal?: () => void;
  isBackendConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onOpenHotlines,
  pendingApprovalsCount = 0,
  onOpenApiModal,
  isBackendConnected = false,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t.navHome },
    { id: 'emergency', label: t.navEmergency },
    { id: 'knowledge', label: t.navKnowledge },
    { id: 'videos', label: t.navVideos },
    { id: 'doctors', label: t.navDoctors },
    { id: 'assistant', label: t.navAssistant },
  ];

  // If user is Admin or Doctor, show Admin Panel link in nav
  const isAdminOrDoctor = currentUser?.role === 'Admin' || currentUser?.role === 'Doctor';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left rtl:text-right group flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs group-hover:bg-teal-700 transition-colors">
            MG
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
            {language === 'ar' ? 'دليل الصحة MediGuide' : 'MediGuide Health'}
          </span>
        </button>

        {/* Zone 2: 4–5 single-line clean text links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                  isActive
                    ? 'text-teal-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-teal-600 rounded-full" />
                )}
              </button>
            );
          })}

          {isAdminOrDoctor && (
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                currentPage === 'admin'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t.adminPanel}</span>
              {pendingApprovalsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          )}
        </nav>

        {/* Zone 3: Primary action + Utilities */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Emergency Hotline Button */}
          <button
            onClick={onOpenHotlines}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            aria-label="Call emergency ambulance"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">{t.emergencyCallBtn}</span>
            <span className="sm:hidden">997/123</span>
          </button>

          {/* External Backend / SQL Server Status & Config Trigger */}
          {onOpenApiModal && (
            <button
              onClick={onOpenApiModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                isBackendConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title={
                isBackendConnected
                  ? 'ASP.NET Core & SQL Server: Connected'
                  : 'ASP.NET Core & SQL Server: Local Repository Mode'
              }
              aria-label="ASP.NET Core and SQL Server Connection Settings"
            >
              <Database className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden xl:inline text-2xs font-mono">
                {isBackendConnected ? 'SQL: Live' : 'SQL: Local'}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title={language === 'ar' ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'ar' ? 'English' : 'عربي'}</span>
          </button>

          {/* Auth / Account Profile */}
          {currentUser ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-teal-700 transition-colors p-1.5 rounded-xl hover:bg-slate-100 whitespace-nowrap shrink-0 border border-slate-200/80"
            >
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {currentUser.role === 'Admin' ? 'A' : currentUser.role === 'Doctor' ? 'د' : 'م'}
              </div>
              <span className="hidden md:inline font-bold text-slate-800">
                {language === 'ar' ? currentUser.fullNameAr : currentUser.fullName}
              </span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 hover:text-teal-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>{t.login}</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left rtl:text-right px-3 py-2 text-sm rounded-lg transition-colors ${
                currentPage === link.id
                  ? 'bg-teal-50 text-teal-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}

          {isAdminOrDoctor && (
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left rtl:text-right px-3 py-2 text-sm rounded-lg transition-colors font-bold ${
                currentPage === 'admin'
                  ? 'bg-teal-600 text-white'
                  : 'bg-teal-50 text-teal-800'
              }`}
            >
              {t.adminPanel}
              {pendingApprovalsCount > 0 && ` (${pendingApprovalsCount})`}
            </button>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                onNavigate(currentUser ? 'dashboard' : 'auth');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-slate-700 font-semibold px-3 py-2"
            >
              {currentUser ? t.dashboard : t.login}
            </button>

            {onOpenApiModal && (
              <button
                onClick={() => {
                  onOpenApiModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
              >
                <Database className="w-3.5 h-3.5 text-teal-600" />
                <span>{isBackendConnected ? 'SQL: Live' : 'SQL: Local'}</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
