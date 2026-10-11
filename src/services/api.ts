import {
  MedicalArticle,
  EmergencyProtocol,
  User,
  ChatMessage,
  BackendStatus,
  MedicalVideo,
  UserRole,
  EgyptianDoctor,
} from '../types';
import {
  mockArticles,
  mockEmergencyProtocols,
  initialCurrentUser,
  mockVideos,
  pendingReviewArticle,
  mockUsersList,
} from './mockData';
import { mockEgyptianDoctors } from './doctorsData';

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) || 'https://localhost:7123/api';

class ApiService {
  private baseUrl: string = API_BASE_URL;
  private token: string | null = null;
  private isConnectedToBackend: boolean = false;
  private lastHealthCheck: BackendStatus = {
    connected: false,
    baseUrl: API_BASE_URL,
    checkedAt: new Date().toISOString(),
    message: 'Active repository',
  };

  // Local state storage for interactive experience
  private localArticles: MedicalArticle[] = [pendingReviewArticle, ...mockArticles];
  private localVideos: MedicalVideo[] = [...mockVideos];
  private localUsers: User[] = [...mockUsersList];
  private currentUser: User = { ...initialCurrentUser };

  constructor() {
    const savedUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('mediguide_api_base_url') : null;
    if (savedUrl) {
      this.baseUrl = savedUrl;
      this.lastHealthCheck.baseUrl = savedUrl;
    }
    const savedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('mediguide_jwt') : null;
    if (savedToken) {
      this.token = savedToken;
    }
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/+$/, '');
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mediguide_api_base_url', this.baseUrl);
    }
    this.lastHealthCheck.baseUrl = this.baseUrl;
  }

  public async checkHealth(): Promise<BackendStatus> {
    const start = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      let response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      }).catch(() => null);

      if (!response || !response.ok) {
        response = await fetch(`${this.baseUrl}/api/health`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        }).catch(() => null);
      }
      clearTimeout(timeoutId);

      const latency = Math.round(performance.now() - start);
      if (response && response.ok) {
        this.isConnectedToBackend = true;
        this.lastHealthCheck = {
          connected: true,
          baseUrl: this.baseUrl,
          checkedAt: new Date().toISOString(),
          latencyMs: latency,
          message: `Connected (${latency}ms)`,
        };
      } else {
        this.isConnectedToBackend = false;
        this.lastHealthCheck = {
          connected: false,
          baseUrl: this.baseUrl,
          checkedAt: new Date().toISOString(),
          message: 'Server offline (Using local repository)',
        };
      }
    } catch {
      this.isConnectedToBackend = false;
      this.lastHealthCheck = {
        connected: false,
        baseUrl: this.baseUrl,
        checkedAt: new Date().toISOString(),
        message: 'Local repository active',
      };
    }
    return this.lastHealthCheck;
  }

  public getStatus(): BackendStatus {
    return this.lastHealthCheck;
  }

  public isLiveBackend(): boolean {
    return this.isConnectedToBackend;
  }

  // Auth Methods
  public async login(email: string, password: string): Promise<{ user: User; token: string; isMock: boolean }> {
    if (this.isConnectedToBackend) {
      const res = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Authentication failed');
      }
      const data = await res.json();
      this.token = data.token;
      localStorage.setItem('mediguide_jwt', data.token);
      return { user: data.user, token: data.token, isMock: false };
    }

    // Match existing user if available
    await new Promise((resolve) => setTimeout(resolve, 300));
    const matchedUser = this.localUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const userToUse = matchedUser || {
      ...this.currentUser,
      email,
      role: email.includes('admin') ? ('Admin' as UserRole) : ('Doctor' as UserRole),
    };

    const mockToken = `jwt-${Date.now()}`;
    this.token = mockToken;
    this.currentUser = userToUse;
    return {
      user: userToUse,
      token: mockToken,
      isMock: true,
    };
  }

  public async register(payload: {
    fullName: string;
    fullNameAr: string;
    email: string;
    password: string;
    role: string;
  }): Promise<{ user: User; token: string; isMock: boolean }> {
    if (this.isConnectedToBackend) {
      const res = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }
      const data = await res.json();
      return { user: data.user, token: data.token, isMock: false };
    }

    await new Promise((resolve) => setTimeout(resolve, 350));
    const newUser: User = {
      id: `usr-${Date.now()}`,
      fullName: payload.fullName,
      fullNameAr: payload.fullNameAr || payload.fullName,
      email: payload.email,
      role: (payload.role as UserRole) || 'Patient',
      createdAt: new Date().toISOString(),
      savedArticleIds: [],
      emergencyContacts: [],
    };
    this.currentUser = newUser;
    this.localUsers.unshift(newUser);
    const token = `jwt-${Date.now()}`;
    return { user: newUser, token, isMock: true };
  }

  // Articles API
  public async getArticles(): Promise<{ data: MedicalArticle[]; isMock: boolean }> {
    if (this.isConnectedToBackend) {
      const res = await fetch(`${this.baseUrl}/articles`, {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return { data, isMock: false };
      }
    }
    return { data: [...this.localArticles], isMock: true };
  }

  public async getArticleById(id: string): Promise<{ data: MedicalArticle | null; isMock: boolean }> {
    if (this.isConnectedToBackend) {
      const res = await fetch(`${this.baseUrl}/articles/${id}`, {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return { data, isMock: false };
      }
    }
    const found = this.localArticles.find((a) => a.id === id) || null;
    return { data: found, isMock: true };
  }

  public async createArticle(article: Omit<MedicalArticle, 'id' | 'viewCount'>): Promise<{ data: MedicalArticle; isMock: boolean }> {
    if (this.isConnectedToBackend) {
      const res = await fetch(`${this.baseUrl}/articles`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(article),
      });
      if (res.ok) {
        const data = await res.json();
        return { data, isMock: false };
      }
    }

    const newArticle: MedicalArticle = {
      ...article,
      id: `art-${Date.now()}`,
      viewCount: 1,
    };
    this.localArticles.unshift(newArticle);
    return { data: newArticle, isMock: true };
  }

  public async updateArticle(id: string, updates: Partial<MedicalArticle>): Promise<{ data: MedicalArticle; isMock: boolean }> {
    if (this.isConnectedToBackend) {
      const res = await fetch(`${this.baseUrl}/articles/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        return { data, isMock: false };
      }
    }

    const index = this.localArticles.findIndex((a) => a.id === id);
    if (index !== -1) {
      this.localArticles[index] = { ...this.localArticles[index], ...updates };
      return { data: this.localArticles[index], isMock: true };
    }
    throw new Error('Article not found');
  }

  public async deleteArticle(id: string): Promise<{ success: boolean; isMock: boolean }> {
    if (this.isConnectedToBackend) {
      const res = await fetch(`${this.baseUrl}/articles/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      return { success: res.ok, isMock: false };
    }

    this.localArticles = this.localArticles.filter((a) => a.id !== id);
    return { success: true, isMock: true };
  }

  // Article Approvals
  public async approveArticle(id: string): Promise<MedicalArticle> {
    const res = await this.updateArticle(id, { status: 'Published', rejectedReason: undefined });
    return res.data;
  }

  public async rejectArticle(id: string, reason: string): Promise<MedicalArticle> {
    const res = await this.updateArticle(id, { status: 'Rejected', rejectedReason: reason });
    return res.data;
  }

  // Videos API
  public async getVideos(): Promise<{ data: MedicalVideo[]; isMock: boolean }> {
    if (this.isConnectedToBackend) {
      const res = await fetch(`${this.baseUrl}/videos`, {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return { data, isMock: false };
      }
    }
    return { data: [...this.localVideos], isMock: true };
  }

  public async createVideo(video: Omit<MedicalVideo, 'id' | 'views' | 'likes'>): Promise<{ data: MedicalVideo; isMock: boolean }> {
    if (this.isConnectedToBackend) {
      const res = await fetch(`${this.baseUrl}/videos`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(video),
      });
      if (res.ok) {
        const data = await res.json();
        return { data, isMock: false };
      }
    }

    const newVideo: MedicalVideo = {
      ...video,
      id: `vid-${Date.now()}`,
      views: 1,
      likes: 0,
    };
    this.localVideos.unshift(newVideo);
    return { data: newVideo, isMock: true };
  }

  public async updateVideo(id: string, updates: Partial<MedicalVideo>): Promise<{ data: MedicalVideo; isMock: boolean }> {
    if (this.isConnectedToBackend) {
      const res = await fetch(`${this.baseUrl}/videos/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        return { data, isMock: false };
      }
    }

    const index = this.localVideos.findIndex((v) => v.id === id);
    if (index !== -1) {
      this.localVideos[index] = { ...this.localVideos[index], ...updates };
      return { data: this.localVideos[index], isMock: true };
    }
    throw new Error('Video not found');
  }

  public async deleteVideo(id: string): Promise<{ success: boolean; isMock: boolean }> {
    if (this.isConnectedToBackend) {
      const res = await fetch(`${this.baseUrl}/videos/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      return { success: res.ok, isMock: false };
    }

    this.localVideos = this.localVideos.filter((v) => v.id !== id);
    return { success: true, isMock: true };
  }

  public async approveVideo(id: string): Promise<MedicalVideo> {
    const res = await this.updateVideo(id, { status: 'Published', rejectedReason: undefined });
    return res.data;
  }

  public async rejectVideo(id: string, reason: string): Promise<MedicalVideo> {
    const res = await this.updateVideo(id, { status: 'Rejected', rejectedReason: reason });
    return res.data;
  }

  // Users Management
  public async getUsers(): Promise<User[]> {
    return [...this.localUsers];
  }

  public async updateUserRole(userId: string, newRole: UserRole): Promise<User> {
    const userIndex = this.localUsers.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      this.localUsers[userIndex] = { ...this.localUsers[userIndex], role: newRole };
      if (this.currentUser.id === userId) {
        this.currentUser = { ...this.currentUser, role: newRole };
      }
      return this.localUsers[userIndex];
    }
    throw new Error('User not found');
  }

  // Emergency Protocols
  public async getEmergencyProtocols(): Promise<{ data: EmergencyProtocol[]; isMock: boolean }> {
    if (this.isConnectedToBackend) {
      const res = await fetch(`${this.baseUrl}/emergency/protocols`);
      if (res.ok) {
        const data = await res.json();
        return { data, isMock: false };
      }
    }
    return { data: mockEmergencyProtocols, isMock: true };
  }

  // Doctors API (Connected to ASP.NET Core SQL Server or Local Directory)
  public async getDoctors(): Promise<{ data: EgyptianDoctor[]; isMock: boolean }> {
    if (this.isConnectedToBackend) {
      try {
        const res = await fetch(`${this.baseUrl}/doctors`, {
          headers: this.getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          return { data, isMock: false };
        }
      } catch {
        // Fallback to local Egyptian doctors registry
      }
    }
    return { data: [...mockEgyptianDoctors], isMock: true };
  }

  // AI Triage API
  public async sendTriageMessage(
    userText: string,
    history: ChatMessage[],
    lang: 'ar' | 'en'
  ): Promise<ChatMessage> {
    const lower = userText.toLowerCase();
    const isCardiacRedFlag =
      lower.includes('chest pain') ||
      lower.includes('heart attack') ||
      lower.includes('crushing pain') ||
      lower.includes('ألم في الصدر') ||
      lower.includes('جلطة') ||
      lower.includes('نوبة قلبية') ||
      lower.includes('صدري بيوجعني');

    const isChokingRedFlag =
      lower.includes('choking') ||
      lower.includes('cannot breathe') ||
      lower.includes('can\'t breathe') ||
      lower.includes('يختنق') ||
      lower.includes('غصة') ||
      lower.includes('شرقان') ||
      lower.includes('مكتوم النفس');

    const isStrokeRedFlag =
      lower.includes('face drooping') ||
      lower.includes('slurred speech') ||
      lower.includes('arm weakness') ||
      lower.includes('سكتة دماغية') ||
      lower.includes('اعوجاج بالفم') ||
      lower.includes('ثقل باللسان');

    if (isCardiacRedFlag || isChokingRedFlag || isStrokeRedFlag) {
      let code = 'RED-FLAG-GENERAL';
      let alertEn = '';
      let alertAr = '';

      if (isCardiacRedFlag) {
        code = 'CARDIO-ACS';
        alertEn = `🚨 **CRITICAL RED-FLAG ALERT: SUSPECTED CARDIAC EVENT**\n\nSymptoms of chest pain or crushing sensation radiating to the arm/jaw represent a potential life-threatening emergency.\n\n**Mandatory Immediate Actions:**\n1. **Call Emergency Medical Services (997 / 123 / 911) right now!**\n2. Have the patient sit down at absolute rest.\n3. If conscious, chew 300mg of Aspirin if not allergic.\n4. Do NOT attempt to drive to the hospital yourself.`;
        alertAr = `🚨 **تنبيه خطر حرج: اشتباه في أزمة قلبية حادة**\n\nأعراض ألم الصدر الضاغط أو الممتد للذراع/الفك تمثل حالة طارئة مهددة للحياة تستدعي الإسعاف الفوري.\n\n**الإجراءات الفورية الإلزامية:**\n1. **اتصل بالإسعاف فوراً (123 أو 997 أو 911) دون أي تأخير!**\n2. اجعل المصاب يجلس بوضعية مريحة وتوقف تام عن الحركة.\n3. مضغ قرص أسبرين (300 مجم) في حال عدم وجود حساسية.\n4. لا تقد السيارة بنفسك إلى المستشفى أبداً.`;
      } else if (isChokingRedFlag) {
        code = 'CHOKING-HEM';
        alertEn = `🚨 **CRITICAL RED-FLAG ALERT: AIRWAY OBSTRUCTION / CHOKING**\n\nSevere airway obstruction requires instant mechanical intervention before loss of consciousness occurs.\n\n**Action Steps:**\n1. Deliver 5 sharp back blows between the shoulder blades.\n2. Perform 5 abdominal thrusts (Heimlich maneuver).\n3. If victim becomes unresponsive, begin CPR chest compressions immediately!`;
        alertAr = `🚨 **تنبيه خطر حرج: انسداد مجرى التنفس (غصة واختناق)**\n\nانسداد مجرى الهواء يتطلب تدخلاً فورياً قبل فقدان المصاب لوعيه.\n\n**خطوات الإنقاذ:**\n1. وجّه 5 ضربات ظهرية قوية بين لوحي الكتف.\n2. طبق 5 ضغطات بطنية سريعة للداخل ولأعلى (مناورة هيمليك).\n3. إذا فقد المصاب الوعي، ابدأ فوراً بالإنعاش القلبي الرئوي (CPR)!`;
      } else {
        code = 'STROKE-FAST';
        alertEn = `🚨 **CRITICAL RED-FLAG ALERT: SUSPECTED ACUTE STROKE**\n\nSudden facial asymmetry, slurred speech, or arm weakness indicate ischemic stroke. Every minute lost damages brain tissue ("Time is Brain").\n\n**Call EMS immediately (123 / 997 / 911)** and report exact onset time!`;
        alertAr = `🚨 **تنبيه خطر حرج: اشتباه بسكتة دماغية حادة**\n\nظهور ارتخاء في الوجه أو ثقل بالكلام أو ضعف بالذراع مؤشر لجلطة دماغية. الوقت حاسم لإنقاذ خلايا المخ.\n\n**اتصل بالإسعاف فوراً (123 / 997 / 911)** وسجل توقيت بدء الأعراض بدقة!`;
      }

      return {
        id: `msg-alert-${Date.now()}`,
        sender: 'assistant',
        text: alertEn,
        textAr: alertAr,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergencyAlert: true,
        emergencyCode: code,
        suggestedFollowUps: ['View step-by-step CPR guide', 'Find nearest emergency hotline'],
        suggestedFollowUpsAr: ['عرض خطوات الإنعاش القلبي خطوة بخطوة', 'أرقام هواتف الطوارئ'],
        isMock: true,
      };
    }

    if (this.isConnectedToBackend) {
      try {
        const res = await fetch(`${this.baseUrl}/triage/query`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ prompt: userText, conversationHistory: history, language: lang }),
        });
        if (res.ok) {
          const data = await res.json();
          return {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: data.replyEn || data.reply,
            textAr: data.replyAr || data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedFollowUps: data.suggestedQuestionsEn,
            suggestedFollowUpsAr: data.suggestedQuestionsAr,
            isMock: false,
          };
        }
      } catch {
        // Fallback
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (lower.includes('burn') || lower.includes('حرق') || lower.includes('حروق')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `### Clinical Guidance for Thermal Burns\n\n1. **Cool with Tap Water**: Flush with cool, running water for **20 minutes**. Do not use ice, which worsens tissue ischemia.\n2. **Protect the Area**: Cover gently with non-adherent sterile dressing or clean cling film.\n3. **Do NOT Pop Blisters**: The blister roof is a natural biological barrier against pathogenic bacteria.\n\n*Educational Triage Note: For burns crossing joints, involving the face, or covering large areas, seek immediate hospital attention.*`,
        textAr: `### الإرشادات السريرية للتعامل مع الحروق الحرارية\n\n1. **التبريد بماء الصنبور**: ضع موضع الحرق تحت ماء بارد جارٍ لمدة **20 دقيقة**. تجنب الثلج تماماً لأنه يسبب تلفاً إضافياً بالأنسجة.\n2. **حماية موضع الحرق**: غطِّ الحرق بشاش معقم غير لاصق أو بنايلون شفاف نظيف.\n3. **لا تفقع الفقاقيع المائية**: سقف الفقاعة غشاء حيوي طبيعي يحمي من العدوى البكتيرية.\n\n*ملاحظة الفرز الطبي: إذا كان الحرق يغطي المفاصل أو الوجه أو بمساحة واسعة، توجه فوراً لأقرب مركز حروق.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: ['What over-the-counter creams are safe for burns?', 'When is a tetanus shot needed?'],
        suggestedFollowUpsAr: ['ما هي المراهم الطبية الآمنة للحروق؟', 'متى يحتاج المصاب لمصل التيتانوس؟'],
        isMock: true,
      };
    }

    if (lower.includes('headache') || lower.includes('صداع') || lower.includes('migraine') || lower.includes('نصفي')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `### Clinical Differentiation: Tension vs. Migraine Headache\n\n- **Tension Headache**: Bilateral, dull band-like ache around forehead/temples. Not aggravated by routine physical activity. Responds well to hydration, rest, and simple analgesics (Paracetamol).\n- **Migraine**: Unilateral, throbbing/pulsating moderate-to-severe pain, often accompanied by photophobia, nausea, or visual aura.\n\n⚠️ **"Thunderclap" Red Flag Warning:**\nA sudden headache that peaks within 60 seconds ("worst headache of your life"), or headache accompanied by neck stiffness, fever, or confusion requires immediate emergency room evaluation to rule out subarachnoid hemorrhage.`,
        textAr: `### التفريق السريري: الصداع التوتري مقابل الصداع النصفي (الشقيقة)\n\n- **الصداع التوتري**: ألم ضاغط يشبه طوقاً يحيط بالرأس أو الجبهة، على الجانبين معاً. لا يزداد بالحركة العادية ويستجيب للراحة وشرب الماء والباراسيتامول.\n- **الصداع النصفي**: ألم نابض في جانب واحد من الرأس، شديد إلى متوسط، غالباً مصحوب بحساسية للضوء وغثيان أو ومضات بصرية (Aura).\n\n⚠️ **علامة الخطر القصوى (صداع قصف الرعد):**\nأي صداع مفاجئ وعنيف يبلغ ذروته خلال ثوانٍ معدودة ("أشد صداع في حياتك")، أو المصحوب بتصلب الرقبة والحرارة، يستدعي الذهاب الفوري للطوارئ لاستبعاد نزيف تحت العنكبوتية.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: ['What triggers migraines?', 'When should I see a neurologist?'],
        suggestedFollowUpsAr: ['ما هي محفزات نوبات الصداع النصفي؟', 'متى تجب مراجعة طبيب المخ والأعصاب؟'],
        isMock: true,
      };
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `Thank you for consulting the MediGuide Clinical Triage Assistant.\n\nBased on your inquiry, standard clinical protocols recommend monitoring associated symptoms (fever, local tenderness, vitals). Maintain adequate hydration, avoid unverified remedies, and consult a board-certified physician for personalized clinical evaluation.`,
      textAr: `شكراً لاستشارتك مساعد دليل الصحة الطبي (MediGuide).\n\nبناءً على استفسارك، توصي البروتوكولات الطبية المعتمدة بمراقبة الأعراض المصاحبة بدقة (مثل درجة الحرارة، أي آلام موضعية)، والحرص على شرب السوائل الكافية، وتجنب الوصفات العشوائية. استشر طبيباً مرخصاً للحصول على تشخيص سريري دقيق.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: ['How to check normal vital signs at home?', 'First-aid kit essentials checklist'],
      suggestedFollowUpsAr: ['كيفية فحص العلامات الحيوية في المنزل؟', 'محتويات حقيبة الإسعافات الأولية الأساسية'],
      isMock: true,
    };
  }

  // Saved Articles & Videos Methods
  public async toggleSaveArticle(articleId: string): Promise<string[]> {
    const exists = this.currentUser.savedArticleIds.includes(articleId);
    if (exists) {
      this.currentUser.savedArticleIds = this.currentUser.savedArticleIds.filter((id) => id !== articleId);
    } else {
      this.currentUser.savedArticleIds.push(articleId);
    }
    return [...this.currentUser.savedArticleIds];
  }

  public async toggleSaveVideo(videoId: string): Promise<string[]> {
    if (!this.currentUser.savedVideoIds) this.currentUser.savedVideoIds = [];
    const exists = this.currentUser.savedVideoIds.includes(videoId);
    if (exists) {
      this.currentUser.savedVideoIds = this.currentUser.savedVideoIds.filter((id) => id !== videoId);
    } else {
      this.currentUser.savedVideoIds.push(videoId);
    }
    return [...this.currentUser.savedVideoIds];
  }

  public getCurrentUser(): User {
    return { ...this.currentUser };
  }

  public setCurrentUser(user: User) {
    this.currentUser = { ...user };
  }

  private getAuthHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }
}

export const api = new ApiService();
