export type Language = 'ar' | 'en';

export type UserRole = 'Patient' | 'Doctor' | 'Admin' | 'Student';

export interface User {
  id: string;
  fullName: string;
  fullNameAr: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  savedArticleIds: string[];
  savedVideoIds?: string[];
  emergencyContacts: {
    name: string;
    relationship: string;
    phone: string;
  }[];
}

export type ArticleCategory =
  | 'Cardiology'
  | 'Neurology'
  | 'Pediatrics'
  | 'Dermatology'
  | 'FirstAid'
  | 'Preventive'
  | 'Pharmacology'
  | 'Nutrition';

export type ArticleDifficulty = 'Basic' | 'Intermediate' | 'Clinical';

export type ArticleStatus = 'Published' | 'Draft' | 'UnderReview' | 'Rejected';

export interface ArticleSource {
  title: string;
  url: string;
  doi?: string;
  publisher: string;
}

export interface MedicalArticle {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  category: ArticleCategory;
  summary: string;
  summaryAr: string;
  content: string;
  contentAr: string;
  author: {
    name: string;
    nameAr: string;
    role: string;
    roleAr: string;
    institution: string;
    institutionAr: string;
  };
  reviewedBy: {
    name: string;
    nameAr: string;
    title: string;
    titleAr: string;
    license: string;
  };
  readTimeMinutes: number;
  difficulty: ArticleDifficulty;
  tags: string[];
  tagsAr: string[];
  sources: ArticleSource[];
  publishedAt: string;
  isFeatured: boolean;
  status: ArticleStatus;
  viewCount: number;
  rejectedReason?: string;
}

export type VideoCategory =
  | 'FirstAid'
  | 'Resuscitation'
  | 'Pediatrics'
  | 'Cardiology'
  | 'Trauma'
  | 'Preventive';

export type VideoStatus = 'Published' | 'UnderReview' | 'Rejected' | 'Draft';

export interface MedicalVideo {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: VideoCategory;
  videoUrl: string; // Embed or video URL
  thumbnailGradient: string; // Gradient color theme for high quality card
  duration: string; // e.g. "04:35"
  instructor: {
    name: string;
    nameAr: string;
    title: string;
    titleAr: string;
    hospital: string;
    hospitalAr: string;
    avatar?: string;
  };
  views: number;
  likes: number;
  publishedAt: string;
  status: VideoStatus;
  tags: string[];
  tagsAr: string[];
  keyPointsAr: string[];
  keyPointsEn: string[];
  rejectedReason?: string;
  isLocalUpload?: boolean;
  fileName?: string;
  fileSize?: string;
}

export type EmergencySeverity = 'Critical' | 'Urgent' | 'Moderate';

export interface EmergencyStep {
  stepNumber: number;
  titleEn: string;
  titleAr: string;
  instructionEn: string;
  instructionAr: string;
  cautionaryNoteEn?: string;
  cautionaryNoteAr?: string;
  timerSeconds?: number;
}

export interface EmergencyProtocol {
  id: string;
  code: string;
  title: string;
  titleAr: string;
  category: 'Cardiac' | 'Respiratory' | 'Trauma' | 'Toxicology' | 'Environmental';
  severity: EmergencySeverity;
  warningSignsEn: string[];
  warningSignsAr: string[];
  immediateActionsEn: string[];
  immediateActionsAr: string[];
  steps: EmergencyStep[];
  whatNotToDoEn: string[];
  whatNotToDoAr: string[];
  cprMetronomeAvailable?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  textAr?: string;
  timestamp: string;
  isEmergencyAlert?: boolean;
  emergencyCode?: string;
  suggestedFollowUps?: string[];
  suggestedFollowUpsAr?: string[];
  isMock: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  titleAr: string;
  createdAt: string;
  messages: ChatMessage[];
  category?: string;
}

export interface BackendStatus {
  connected: boolean;
  baseUrl: string;
  checkedAt: string;
  latencyMs?: number;
  message: string;
}

export type DoctorSpecialty =
  | 'Cardiology'
  | 'Nephrology'
  | 'CriticalCare'
  | 'Pulmonology'
  | 'Dermatology'
  | 'Bariatric'
  | 'Orthopedics'
  | 'Psychiatry'
  | 'Ophthalmology'
  | 'ENT'
  | 'Pediatrics'
  | 'Oncology'
  | 'Neurology';

export interface EgyptianDoctor {
  id: string;
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  specialty: DoctorSpecialty;
  specialtyAr: string;
  specialtyEn: string;
  subSpecialtyAr?: string;
  subSpecialtyEn?: string;
  governorateAr: string;
  governorateEn: string;
  workplaceAr: string;
  workplaceEn: string;
  hasClinic: boolean;
  clinicAddressAr?: string;
  clinicAddressEn?: string;
  clinicPhone?: string;
  clinicBookingHoursAr?: string;
  clinicBookingHoursEn?: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  achievementsAr: string[];
  achievementsEn: string[];
  bioAr: string;
  bioEn: string;
  syndicateRegistrationNumber?: string;
  isPioneer?: boolean;
  avatarUrl?: string;
  initials: string;
  tagsAr: string[];
  tagsEn: string[];
}

