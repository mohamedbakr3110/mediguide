import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { EmergencyPage } from './pages/EmergencyPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { VideosPage } from './pages/VideosPage';
import { DoctorsDirectoryPage } from './pages/DoctorsDirectoryPage';
import { AiTriagePage } from './pages/AiTriagePage';
import { AuthPage } from './pages/AuthPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ArticleReaderModal } from './components/knowledge/ArticleReaderModal';
import { EmergencyHotlineModal } from './components/common/EmergencyHotlineModal';
import { ApiConnectionModal } from './components/common/ApiConnectionModal';
import { api } from './services/api';
import {
  MedicalArticle,
  EmergencyProtocol,
  MedicalVideo,
  User,
  UserRole,
  BackendStatus,
  EgyptianDoctor,
} from './types';

const MediGuideApp: React.FC = () => {
  const { language, t } = useLanguage();

  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(() => api.getCurrentUser());
  const [articles, setArticles] = useState<MedicalArticle[]>([]);
  const [videos, setVideos] = useState<MedicalVideo[]>([]);
  const [doctors, setDoctors] = useState<EgyptianDoctor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [protocols, setProtocols] = useState<EmergencyProtocol[]>([]);
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(
    currentUser?.savedArticleIds || []
  );
  const [savedVideoIds, setSavedVideoIds] = useState<string[]>(
    currentUser?.savedVideoIds || ['vid-cpr-01']
  );

  // Modals & Connection Inspector
  const [selectedArticle, setSelectedArticle] = useState<MedicalArticle | null>(null);
  const [isHotlinesOpen, setIsHotlinesOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>(() => api.getStatus());

  useEffect(() => {
    const loadData = async () => {
      const status = await api.checkHealth();
      setBackendStatus(status);

      const artRes = await api.getArticles();
      setArticles(artRes.data);

      const docRes = await api.getDoctors();
      setDoctors(docRes.data);

      const vidRes = await api.getVideos();
      setVideos(vidRes.data);

      const userList = await api.getUsers();
      setUsers(userList);

      const protoRes = await api.getEmergencyProtocols();
      setProtocols(protoRes.data);
    };

    loadData();
  }, []);

  const handleToggleSaveArticle = async (id: string) => {
    const updated = await api.toggleSaveArticle(id);
    setSavedArticleIds(updated);
    if (currentUser) {
      setCurrentUser({ ...currentUser, savedArticleIds: updated });
    }
  };

  const handleToggleSaveVideo = async (id: string) => {
    const updated = await api.toggleSaveVideo(id);
    setSavedVideoIds(updated);
    if (currentUser) {
      setCurrentUser({ ...currentUser, savedVideoIds: updated });
    }
  };

  // Article Management & Approvals
  const handleCreateArticle = async (newArt: Omit<MedicalArticle, 'id' | 'viewCount'>) => {
    const res = await api.createArticle(newArt);
    setArticles([res.data, ...articles]);
  };

  const handleUpdateArticle = async (id: string, updates: Partial<MedicalArticle>) => {
    const res = await api.updateArticle(id, updates);
    setArticles(articles.map((a) => (a.id === id ? res.data : a)));
    if (selectedArticle?.id === id) {
      setSelectedArticle(res.data);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    await api.deleteArticle(id);
    setArticles(articles.filter((a) => a.id !== id));
    if (selectedArticle?.id === id) {
      setSelectedArticle(null);
    }
  };

  const handleApproveArticle = async (id: string) => {
    const approved = await api.approveArticle(id);
    setArticles(articles.map((a) => (a.id === id ? approved : a)));
  };

  const handleRejectArticle = async (id: string, reason: string) => {
    const rejected = await api.rejectArticle(id, reason);
    setArticles(articles.map((a) => (a.id === id ? rejected : a)));
  };

  // Video Management & Approvals
  const handleCreateVideo = async (newVid: Omit<MedicalVideo, 'id' | 'views' | 'likes'>) => {
    const res = await api.createVideo(newVid);
    setVideos([res.data, ...videos]);
  };

  const handleApproveVideo = async (id: string) => {
    const approved = await api.approveVideo(id);
    setVideos(videos.map((v) => (v.id === id ? approved : v)));
  };

  const handleRejectVideo = async (id: string, reason: string) => {
    const rejected = await api.rejectVideo(id, reason);
    setVideos(videos.map((v) => (v.id === id ? rejected : v)));
  };

  const handleDeleteVideo = async (id: string) => {
    await api.deleteVideo(id);
    setVideos(videos.filter((v) => v.id !== id));
  };

  // User Management
  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    const updated = await api.updateUserRole(userId, newRole);
    setUsers(users.map((u) => (u.id === userId ? updated : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(updated);
    }
  };

  // Auth Handling
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setSavedArticleIds(user.savedArticleIds || []);
    setSavedVideoIds(user.savedVideoIds || []);
    if (user.role === 'Admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('mediguide_jwt');
    setCurrentPage('home');
  };

  const savedArticlesList = articles.filter((a) => savedArticleIds.includes(a.id));
  const savedVideosList = videos.filter((v) => savedVideoIds.includes(v.id));

  // Count pending approvals
  const pendingApprovalsCount =
    articles.filter((a) => a.status === 'UnderReview').length +
    videos.filter((v) => v.status === 'UnderReview').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Main Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        currentUser={currentUser}
        onOpenHotlines={() => setIsHotlinesOpen(true)}
        pendingApprovalsCount={pendingApprovalsCount}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        isBackendConnected={backendStatus.connected}
      />

      {/* Page Routing */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={setCurrentPage}
            articles={articles}
            protocols={protocols}
            videos={videos}
            doctors={doctors}
            onSelectArticle={setSelectedArticle}
            onOpenHotlines={() => setIsHotlinesOpen(true)}
          />
        )}

        {currentPage === 'emergency' && (
          <EmergencyPage
            protocols={protocols}
            onOpenHotlines={() => setIsHotlinesOpen(true)}
          />
        )}

        {currentPage === 'knowledge' && (
          <KnowledgeBasePage
            articles={articles}
            savedArticleIds={savedArticleIds}
            onSelectArticle={setSelectedArticle}
            onToggleSave={handleToggleSaveArticle}
          />
        )}

        {currentPage === 'videos' && (
          <VideosPage
            videos={videos}
            savedVideoIds={savedVideoIds}
            currentUser={currentUser}
            onToggleSaveVideo={handleToggleSaveVideo}
            onSubmitVideo={handleCreateVideo}
            onNavigateToAuth={() => setCurrentPage('auth')}
          />
        )}

        {currentPage === 'doctors' && (
          <DoctorsDirectoryPage
            doctors={doctors}
            onNavigateHome={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'assistant' && (
          <AiTriagePage
            onOpenHotlines={() => setIsHotlinesOpen(true)}
          />
        )}

        {currentPage === 'auth' && (
          <AuthPage
            onSuccessAuth={handleAuthSuccess}
          />
        )}

        {currentPage === 'dashboard' && currentUser && (
          <UserDashboardPage
            user={currentUser}
            savedArticles={savedArticlesList}
            savedVideos={savedVideosList}
            onSelectArticle={setSelectedArticle}
            onRemoveSavedArticle={handleToggleSaveArticle}
            onRemoveSavedVideo={handleToggleSaveVideo}
            onSignOut={handleSignOut}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboardPage
            articles={articles}
            videos={videos}
            users={users}
            currentUser={currentUser}
            onCreateArticle={handleCreateArticle}
            onUpdateArticle={handleUpdateArticle}
            onDeleteArticle={handleDeleteArticle}
            onApproveArticle={handleApproveArticle}
            onRejectArticle={handleRejectArticle}
            onCreateVideo={handleCreateVideo}
            onApproveVideo={handleApproveVideo}
            onRejectVideo={handleRejectVideo}
            onDeleteVideo={handleDeleteVideo}
            onUpdateUserRole={handleUpdateUserRole}
            onSelectArticle={setSelectedArticle}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={setCurrentPage}
      />

      {/* Modals */}
      <ArticleReaderModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        isSaved={selectedArticle ? savedArticleIds.includes(selectedArticle.id) : false}
        onToggleSave={handleToggleSaveArticle}
      />

      <EmergencyHotlineModal
        isOpen={isHotlinesOpen}
        onClose={() => setIsHotlinesOpen(false)}
      />

      <ApiConnectionModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onStatusChange={setBackendStatus}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <MediGuideApp />
    </LanguageProvider>
  );
}
