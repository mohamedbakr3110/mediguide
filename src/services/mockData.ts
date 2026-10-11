import { MedicalArticle, EmergencyProtocol, User, ChatSession } from '../types';

export const initialCurrentUser: User = {
  id: 'usr-101',
  fullName: 'Dr. Tarek Mansour',
  fullNameAr: 'د. طارق منصور',
  email: 'tarek.mansour@student.cu.edu.eg',
  role: 'Doctor',
  createdAt: '2026-01-15T09:00:00Z',
  savedArticleIds: ['art-cpr-01', 'art-cardio-01', 'art-stroke-01'],
  emergencyContacts: [
    { name: 'Dr. Sarah Kamel', relationship: 'Family Physician', phone: '+20 100 123 4567' },
    { name: 'Central Emergency Services', relationship: 'Ambulance Hotline', phone: '123' },
  ],
};

export const emergencyHotlines = [
  { country: 'Egypt (مصر)', ambulance: '123', police: '122', fire: '180' },
  { country: 'Saudi Arabia (السعودية)', ambulance: '997', police: '999', civilDefense: '998' },
  { country: 'UAE (الإمارات)', ambulance: '998', police: '999', civilDefense: '997' },
  { country: 'United States & Canada', ambulance: '911', poisonControl: '1-800-222-1222' },
  { country: 'European Union (الاتحاد الأوروبي)', ambulance: '112', emergency: '112' },
];

export const mockEmergencyProtocols: EmergencyProtocol[] = [
  {
    id: 'em-cpr-01',
    code: 'CPR-ADULT',
    title: 'Adult Cardiopulmonary Resuscitation (CPR)',
    titleAr: 'الإنعاش القلبي الرئوي للبالغين (CPR)',
    category: 'Cardiac',
    severity: 'Critical',
    cprMetronomeAvailable: true,
    warningSignsEn: [
      'Person is unresponsive when shaken or addressed loudly',
      'No normal breathing or only occasional agonal gasping',
      'Absence of carotid pulse within 10 seconds (for trained responders)',
    ],
    warningSignsAr: [
      'المصاب فاقد للوعي تماماً ولا يستجيب للنداء أو الهز الخفيف',
      'انعدام التنفس الطبيعي أو وجود شهقات متقطعة واهنة فقط (Agonal Gasps)',
      'عدم وجود نبض سباتي مؤكد خلال 10 ثوانٍ (للمسعفين المدربين)',
    ],
    immediateActionsEn: [
      'Call Emergency Medical Services (997 / 123 / 911) and shout for an AED immediately.',
      'Place victim flat on their back on a firm, hard surface.',
      'Expose the chest and immediately begin high-quality chest compressions.',
    ],
    immediateActionsAr: [
      'اتصل بالإسعاف فوراً (123 أو 997 أو 911) واطلب إحضار جهاز الصدمات الآلي (AED).',
      'ضع المصاب مستلقياً على ظهره على سطح صلب ومستوٍ تماماً.',
      'اكشف منتصف الصدر وابدأ فوراً بضغطات صدرية منتظمة وقوية.',
    ],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Hand Placement on Lower Sternum',
        titleAr: 'وضعية اليدين على الثلث السفلي لعظم القص',
        instructionEn:
          'Place the heel of one hand in the center of the victim’s chest (lower half of sternum). Interlock your other hand on top, keeping elbows locked straight.',
        instructionAr:
          'ضع كعب إحدى يديك في منتصف صدر المصاب تماماً (النصف السفلي من عظم القص). شبّك أصابع يدك الأخرى فوقها، واجعل ذراعيك مستقيمتين ومفصلي المرفقين مقفلين.',
        cautionaryNoteEn: 'Ensure shoulders are positioned directly above your hands.',
        cautionaryNoteAr: 'تأكد أن كتفيك يعلوان يديك رأسياً تماماً لنقل وزن الجسم إلى الضغطات.',
      },
      {
        stepNumber: 2,
        titleEn: 'Deliver 30 High-Quality Compressions',
        titleAr: 'تطبيق 30 ضغطة صدرية متتالية بجودة عالية',
        instructionEn:
          'Compress hard and fast at a depth of 5 to 6 cm (2 to 2.4 inches) and a cadence of 100 to 120 compressions per minute. Allow full chest recoil between compressions without lifting hands.',
        instructionAr:
          'اضغط بقوة وسرعة بعمق 5 إلى 6 سم، وبمعدل 100 إلى 120 ضغطة في الدقيقة. اسمح للصدر بالارتداد الكامل لأعلى بعد كل ضغطة دون رفع يديك عن الجلد.',
        cautionaryNoteEn: 'Do not lean on the chest between compressions.',
        cautionaryNoteAr: 'تجنب الاستناد أو الاتكاء بثقلك على الصدر أثناء مرحلة الارتداد.',
        timerSeconds: 18,
      },
      {
        stepNumber: 3,
        titleEn: 'Open Airway & Provide 2 Rescue Breaths',
        titleAr: 'فتح مجرى التنفس وإعطاء نَفَسين إنقاذيين',
        instructionEn:
          'Tilt head back and lift chin. Pinch the nose closed and deliver 2 rescue breaths (1 second each) watching for visible chest rise. (If untrained, continue continuous compression-only CPR).',
        instructionAr:
          'قم بإمالة الرأس للخلف ورفع الذقن لأعلى. أغلق فتحتي الأنف بيدك وأعطِ نفسين إنقاذيين (ثانية واحدة لكل نفس) مع مراقبة ارتفاع الصدر. (إذا لم تكن مدرباً، استمر بالضغطات الصدرية المستمرة دون توقف).',
        cautionaryNoteEn: 'Minimize interruptions to compressions to less than 10 seconds.',
        cautionaryNoteAr: 'قلل فترة توقف الضغطات إلى أقل من 10 ثوانٍ كحد أقصى.',
      },
      {
        stepNumber: 4,
        titleEn: 'Deploy Automated External Defibrillator (AED)',
        titleAr: 'تشغيل واستخدام جهاز الصدمات الكهربائية الخارجي (AED)',
        instructionEn:
          'As soon as an AED arrives, turn it on and attach the self-adhesive pads to bare chest as illustrated. Follow voice prompts strictly.',
        instructionAr:
          'بمجرد وصول جهاز الصدمات (AED)، شغّله فوراً وألصق الوسائد الجلدية على الصدر العاري كما هو موضح بالرسم، واتبع التوجيهات الصوتية الصادرة من الجهاز بدقة.',
      },
    ],
    whatNotToDoEn: [
      'Do NOT stop compressions for more than 10 seconds.',
      'Do NOT compress too shallowly or exceed 120 compressions/min.',
      'Do NOT touch the patient while the AED is analyzing or delivering a shock.',
      'Do NOT administer water, medications, or food to an unresponsive person.',
    ],
    whatNotToDoAr: [
      'لا توقف الضغطات الصدرية لأكثر من 10 ثوانٍ أبداً إلا عند توجيه جهاز الصدمات.',
      'لا تضغط بشكل سطحي ضعيف، ولا تتجاوز وتيرة 120 ضغطة/دقيقة كي يتاح للقلب الامتلاء.',
      'لا تلمس المصاب مطلقاً أثناء قيام جهاز الصدمات (AED) بتحليل النبض أو تفريغ الشحنة.',
      'لا تسكب الماء ولا تحاول إعطاء أي سوائل أو أدوية لمصاب فاقد للوعي.',
    ],
  },
  {
    id: 'em-choke-02',
    code: 'CHOKING-HEM',
    title: 'Severe Foreign Body Airway Obstruction (Choking)',
    titleAr: 'انسداد مجرى الهواء الشديد (الغصة والاختناق)',
    category: 'Respiratory',
    severity: 'Critical',
    cprMetronomeAvailable: false,
    warningSignsEn: [
      'Universal distress sign: clutching hands to throat',
      'Inability to speak, cry, or cough forcefully',
      'High-pitched whistling or stridor sound while breathing in',
      'Cyanosis (blue/grey discoloration of lips, earlobes, and nails)',
    ],
    warningSignsAr: [
      'العلامة العالمية للغصة: الإمساك بالرقبة بكلتا اليدين',
      'عدم القدرة التامة على الكلام أو البكاء أو السعال بقوة',
      'صدور صوت صفير أو صرير حاد أثناء محاولة سحب النفس (Stridor)',
      'ازرقاق الشفتين وشحمة الأذن والأظافر بسبب نقص الأكسجين الحاد',
    ],
    immediateActionsEn: [
      'Ask quickly: "Are you choking?" If victim nods and cannot speak, intervene immediately.',
      'Call for EMS / Emergency ambulance immediately.',
      'Alternate 5 firm back blows with 5 abdominal thrusts (Heimlich maneuver).',
    ],
    immediateActionsAr: [
      'اسأل المصاب فوراً: "هل تختنق؟" إذا أومأ برأسه وعجز عن النطق، تدخل فوراً دون تردد.',
      'اطلب من شخص مجاور الاتصال بالإسعاف (123 / 997).',
      'طبق بالتناوب 5 ضربات ظهرية قوية بين لوحي الكتف تليها 5 ضغطات بطنية (مناورة هيمليك).',
    ],
    steps: [
      {
        stepNumber: 1,
        titleEn: '5 Sharp Back Blows',
        titleAr: '5 ضربات ظهرية بين لوحي الكتف',
        instructionEn:
          'Stand slightly behind victim, lean them forward so the mouth is lower than the chest. Deliver up to 5 sharp blows between shoulder blades using the heel of your hand.',
        instructionAr:
          'قف خلف المصاب ومائلاً قليلاً إلى جانبه، واجعله يميل بجذعه للأمام بحيث يكون الفم أدنى من الصدر. وجّه 5 ضربات قوية وحازمة بين لوحي الكتف بكعب يدك.',
      },
      {
        stepNumber: 2,
        titleEn: '5 Inward & Upward Abdominal Thrusts (Heimlich)',
        titleAr: '5 ضغطات بطنية سريعة للداخل ولأعلى (مناورة هيمليك)',
        instructionEn:
          'Wrap arms around victim’s waist from behind. Make a fist with one hand just above the navel. Grasp fist with other hand and thrust sharply inward and upward.',
        instructionAr:
          'طوّق خصر المصاب بذراعيك من الخلف. اصنع قبضة بإحدى يديك وضعها أعلى السرة وأسفل عظم القص مباشرة. أمسك قبضتك بيدك الأخرى وادفع بقوة للداخل ولأعلى بحركة سريعة.',
      },
      {
        stepNumber: 3,
        titleEn: 'If Victim Becomes Unresponsive',
        titleAr: 'في حال فقدان المصاب للوعي وسقوطه',
        instructionEn:
          'Carefully lower them to the floor. Call emergency services immediately and begin CPR chest compressions. Look in the mouth before breaths—remove visible foreign objects only.',
        instructionAr:
          'أنزل المصاب برفق إلى الأرض، واطلب الإسعاف فوراً وابدأ في إجراءات الإنعاش القلبي الرئوي (CPR). انظر داخل الفم قبل إعطاء الأنفاس وأخرج الجسم الغريب فقط إذا كان مرئياً بوضوح وسهل الإزالة.',
      },
    ],
    whatNotToDoEn: [
      'Do NOT perform blind finger sweeps in the oral cavity.',
      'Do NOT give abdominal thrusts to pregnant women or infants (use chest thrusts instead).',
      'Do NOT pat gently on the back while the person is upright.',
    ],
    whatNotToDoAr: [
      'لا تقم بالبحث الأعمى بالأصابع داخل الفم مطلقاً؛ قد يدفع ذلك الجسم الغريب لعمق القصبة.',
      'لا تطبق ضغطات البطن على الحوامل في أشهرهن الأخيرة أو الرضع (استبدلها بضغطات الصدر).',
      'لا تربت بخفة على الظهر أثناء وقوف الشخص منتصباً دون إمالته للأمام.',
    ],
  },
  {
    id: 'em-bleed-03',
    code: 'TRAUMA-HEM',
    title: 'Severe Arterial & Venous Hemorrhage Control',
    titleAr: 'التحكم في النزيف الحاد والشرياني وإيقاف الدم',
    category: 'Trauma',
    severity: 'Critical',
    warningSignsEn: [
      'Blood spurting rhythmically or pooling rapidly on floor',
      'Clothing or dressings quickly soaked with bright or dark blood',
      'Signs of hypovolemic shock: pallor, cold clammy skin, confusion, rapid weak pulse',
    ],
    warningSignsAr: [
      'تدفق الدم أو نبضه بقوة من الجرح بشكل مستمر',
      'تشبع الملابس أو الضمادات بالدم بشكل سريع جداً',
      'ظهور علامات الصدمة النزفية: شحوب الوجه، برودة ورطوبة الجلد، الدوخة، وضعف النبض وسرعته',
    ],
    immediateActionsEn: [
      'Call emergency EMS immediately.',
      'Apply firm, direct manual pressure over the bleeding wound using sterile gauze or clean cloth.',
      'If bleeding continues on a limb, apply a commercial tourniquet 5-7 cm above the wound.',
    ],
    immediateActionsAr: [
      'اتصل بالإسعاف فوراً (123 / 997).',
      'اضغط مباشرة وبقوة وبكعب اليدين على موضع النزيف باستخدام شاش معقم أو قماش نظيف.',
      'إذا كان النزيف في الأطراف ولم يتوقف، استخدم عاصبة شريانية (Tourniquet) على بعد 5-7 سم أعلى الجرح باتجاه القلب.',
    ],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Direct Continuous Pressure',
        titleAr: 'الضغط المباشر المستمر دون انقطاع',
        instructionEn:
          'Place clean dressing over wound and press firmly with both hands, locking elbows and using body weight. Maintain uninterrupted pressure for at least 5 to 10 minutes.',
        instructionAr:
          'ضع ضمادة نظيفة على الجرح واضغط بكلتا يديك بقوة وثبات مع فرد المرفقين والاستفادة من وزن الجسم. حافظ على الضغط المستمر لمدة 5 إلى 10 دقائق دون رفع اليدين للتفقد.',
      },
      {
        stepNumber: 2,
        titleEn: 'Pressure Bandage Application',
        titleAr: 'لف الضمادة الضاغطة بإحكام',
        instructionEn:
          'Secure dressings with an elastic bandage wrapped firmly around the limb, ensuring it is snug enough to control bleeding without completely cutting off peripheral pulses.',
        instructionAr:
          'ثبّت الضمادات بلف رباط ضاغط مرن بإحكام حول الطرف المصاب، بحيث يوقف النزيف دون إيقاف التروية الطرفية تماماً.',
      },
      {
        stepNumber: 3,
        titleEn: 'Treat for Hypovolemic Shock',
        titleAr: 'تدابير الوقاية من الصدمة النزفية',
        instructionEn:
          'Keep patient lying flat, elevate legs slightly if no pelvic/spinal trauma is suspected, keep warm with a blanket, and soothe anxiety until EMS arrives.',
        instructionAr:
          'أبقِ المصاب مستلقياً على ظهره، وارفع ساقيه قليلاً إذا لم يكن هناك اشتباه بكسر في الحوض أو العمود الفقري، وغطه بغطاء دافئ لمنع انخفاض حرارة الجسم.',
      },
    ],
    whatNotToDoEn: [
      'Do NOT remove the initial blood-soaked gauze (layer additional gauze on top).',
      'Do NOT remove deeply impaled foreign objects (stabilize them in place).',
      'Do NOT release an applied tourniquet once secured without physician orders.',
    ],
    whatNotToDoAr: [
      'لا ترفع الشاش الأولي المتشبع بالدم (أضف ضمادات جديدة فوقه واستمر بالضغط).',
      'لا تنزع الأجسام الغريبة المغروزة بعمق في الجرح (ثبتها في مكانها بحشوات جانبية).',
      'لا تفك العاصبة الشريانية (Tourniquet) بعد ربطها وإحكامها إلا بأمر الطبيب المعالج.',
    ],
  },
  {
    id: 'em-heart-04',
    code: 'CARDIO-ACS',
    title: 'Acute Coronary Syndrome (Suspected Heart Attack)',
    titleAr: 'المتلازمة التاجية الحادة (الاشتباه بنوبة قلبية)',
    category: 'Cardiac',
    severity: 'Critical',
    warningSignsEn: [
      'Retrosternal chest pressure, squeezing, or fullness lasting > few minutes',
      'Pain radiating to left shoulder, arm, jaw, neck, or epigastrium',
      'Associated diaphoresis (cold sweat), nausea, dizziness, and dyspnea',
    ],
    warningSignsAr: [
      'ألم أو شعور بالعصر والضغط الشديد في منتصف الصدر يستمر لأكثر من بضع دقائق',
      'امتداد الألم إلى الكتف الأيسر، الذراع، الفك السفلي، الرقبة، أو أعلى المعدة',
      'تعرق بارد غزير مصاحب، غثيان، دوخة مفاجئة، وصعوبة في التقاط الأنفاس',
    ],
    immediateActionsEn: [
      'Call EMS immediately; inform dispatcher of suspected acute myocardial infarction.',
      'Have patient sit comfortably in semi-Fowler position (knees slightly bent).',
      'If not allergic, administer 300mg chewable Aspirin as per guidelines.',
    ],
    immediateActionsAr: [
      'اتصل بالإسعاف فوراً (123 / 997) وأبلغ غرفة العمليات بوجود اشتباه في جلطة قلبية حادة.',
      'أجلس المريض في وضعية مريحة (نصف جالس بزاوية 45 درجة مع ثني الركبتين قليلاً).',
      'إذا لم يكن لدى المريض حساسية، يُعطى قرص أسبرين للأطفال (300 مجم) ليمضغه بالكامل.',
    ],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Physical Rest & Loosen Clothing',
        titleAr: 'الراحة التامة وتخفيف الملابس الضاغطة',
        instructionEn:
          'Strictly forbid any exertion. Loosen tight collars, ties, belts, and open windows for fresh air circulation.',
        instructionAr:
          'امنع المريض تماماً من أي مجهود بدني أو مشي. فك الأزرار وربطات العنق والأحزمة الضاغطة وافتح النوافذ لتجديد الهواء.',
      },
      {
        stepNumber: 2,
        titleEn: 'Chewable Aspirin Administration',
        titleAr: 'مضغ قرص الأسبرين لتثبيط التخثر',
        instructionEn:
          'Ask if they have Aspirin allergy or active internal bleeding. If safe, have them chew one 300mg adult or two 81mg low-dose Aspirin tablets thoroughly.',
        instructionAr:
          'تأكد من عدم وجود حساسية للأسبرين أو تاريخ حديث لنزيف حاد في المعدة، ثم اطلب منه مضغ قرص أسبرين جيداً قبل بلعه لتسريع الامتصاص.',
      },
      {
        stepNumber: 3,
        titleEn: 'Monitor Vitals & Prepare for CPR',
        titleAr: 'مراقبة الوعي والاستعداد الفوري للإنعاش',
        instructionEn:
          'Continuously monitor breathing and responsiveness. If patient collapses or loses consciousness, immediately begin chest compressions and grab nearest AED.',
        instructionAr:
          'راقب وعي المريض وتنفسه باستمرار. في حال فقدانه الوعي وتوقف تنفسه، ابدأ فوراً الإنعاش القلبي الرئوي واطلب جهاز الصدمات (AED).',
      },
    ],
    whatNotToDoEn: [
      'Do NOT allow patient to drive themselves to the hospital.',
      'Do NOT give nitroglycerin if patient has taken phosphodiesterase-5 inhibitors within 48h.',
      'Do NOT dismiss symptoms as "simple indigestion".',
    ],
    whatNotToDoAr: [
      'لا تسمح للمريض بقيادة السيارة بنفسه إلى المستشفى مطلقاً.',
      'لا تعطه حبوب النيتروجليسرين تحت اللسان إذا كان قد تناول أدوية موسعة للشرايين خلال 48 ساعة.',
      'لا تتجاهل الأعراض وتعتبرها مجرد حموضة أو عسر هضم عابر.',
    ],
  },
  {
    id: 'em-burn-05',
    code: 'TRAUMA-BURN',
    title: 'Thermal & Scald Burn Emergency Management',
    titleAr: 'الإسعافات الأولية للحروق الحرارية وسلق السوائل',
    category: 'Trauma',
    severity: 'Urgent',
    warningSignsEn: [
      'Blister formation, intense redness, severe pain (Second-degree / Partial thickness)',
      'Leathery white, charred black, or painless skin (Third-degree / Full thickness)',
      'Burns involving face, hands, feet, joints, or circumferential limb burns',
    ],
    warningSignsAr: [
      'ظهور فقاقيع مائية (Blisters)، احمرار جلدي شديد مع ألم حاد (حروق الدرجة الثانية)',
      'جلد جلدي المظهر أبيض أو متفحم أسود مع غياب الألم بسبب تلف الأعصاب (الدرجة الثالثة)',
      'حروق تشمل الوجه أو اليدين أو المفاصل الرئيسية أو الحروق المحيطية بالأطراف',
    ],
    immediateActionsEn: [
      'Stop the burning process: remove source of heat, extinguish flames safely.',
      'Cool the burn under cool, running tap water for a minimum of 20 minutes.',
      'Call emergency EMS for burns larger than the patient’s palm or full-thickness burns.',
    ],
    immediateActionsAr: [
      'أوقف مصدر الحرارة فوراً: أبعد المصاب عن النار أو السائل المغلي وأطفئ اللهب.',
      'برّد مكان الحرق فوراً بماء صنبور فاتر/بارد جارٍ لمدة 20 دقيقة كاملة.',
      'اتصل بالإسعاف إذا كانت مساحة الحرق أكبر من كف اليد أو إذا كانت الحروق عميقة.',
    ],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Cool Under Running Water for 20 Minutes',
        titleAr: 'التبريد بالماء الجاري لمدة 20 دقيقة',
        instructionEn:
          'Hold the affected area under gentle, cool running tap water (15–20°C). Never use ice, ice water, or frozen packs which cause secondary tissue necrosis.',
        instructionAr:
          'ضع العضو المصاب تحت ماء صنبور بارد معتدل (15-20 درجة مئوية) لمدة 20 دقيقة. لا تستخدم الثلج المباشر أو الماء المثلج الذي يسبب تلفاً إضافياً للأنسجة.',
      },
      {
        stepNumber: 2,
        titleEn: 'Remove Constricting Jewelry & Loose Clothing',
        titleAr: 'نزع الخواتم والساعات والملابس غير الملتصقة',
        instructionEn:
          'Gently remove rings, watches, bracelets, and belts before rapid edema develops. Do NOT pull away clothing that is firmly stuck to the burned wound.',
        instructionAr:
          'انزع الخواتم والأساور والساعات فوراً قبل حدوث التورم والانتفاخ. لا تنزع الملابس الملتصقة بشدة بسطح الحرق بل قص ما حولها بحذر.',
      },
      {
        stepNumber: 3,
        titleEn: 'Cover with Sterile Non-Adherent Dressing or Cling Film',
        titleAr: 'تغطية الحرق بغطاء معقم أو نايلون شفاف نظيف',
        instructionEn:
          'Loosely cover the wound with sterile plastic wrap (cling film) or a clean, non-linting sterile sheet to protect exposed nerve endings and reduce infection risk.',
        instructionAr:
          'غطِّ موضع الحرق بلطف ودون ضغط بغلاف نايلون شفاف نظيف (Cling Film) أو شاش معقم غير لاصق لحماية النهايات العصبية وتقليل الألم والعدوى.',
      },
    ],
    whatNotToDoEn: [
      'Do NOT apply ice, butter, toothpaste, oils, or flour to the burn.',
      'Do NOT pop or burst blisters.',
      'Do NOT overcool infants or children (risk of hypothermia).',
    ],
    whatNotToDoAr: [
      'لا تضع الثلج أو معجون الأسنان أو الزبدة أو الزيوت أو الطحين على الحرق نهائياً.',
      'لا تقم بفقء الفقاعات المائية لأنها تشكل حاجزاً حيوياً طبيعياً يمنع تلوث الجرح.',
      'لا تغمر مساحات واسعة من جسم الأطفال بالماء البارد جداً تفادياً لهبوط حرارة الجسم.',
    ],
  },
];

export const mockArticles: MedicalArticle[] = [
  {
    id: 'art-cardio-01',
    slug: 'hypertension-silent-threat-and-management',
    title: 'Essential Hypertension: Pathophysiology, Screening, and Evidence-Based Control',
    titleAr: 'ارتفاع ضغط الدم الشرياني: الآليات، الكشف المبكر وبروتوكولات العلاج الحديثة',
    category: 'Cardiology',
    summary:
      'A comprehensive clinical review on diagnosing primary hypertension, lifestyle interventions (DASH diet), and first-line pharmacological regimens.',
    summaryAr:
      'مراجعة سريرية متكاملة حول تشخيص ارتفاع ضغط الدم الأساسي، والتعديلات السلوكية الفعالة كحمية DASH، والخيارات الدوائية الأولية وفق أحدث التوصيات.',
    content: `Primary arterial hypertension remains the single largest preventable cause of cardiovascular mortality worldwide. Blood pressure values consistently exceeding 130/80 mmHg in ambulatory monitoring indicate Stage 1 hypertension under ACC/AHA guidelines.\n\n### Clinical Assessment & Workup\nAccurate diagnosis requires at least two resting measurements on separate clinical encounters using a validated, appropriately sized oscillometric cuff. Initial evaluation must rule out secondary causes (such as renal artery stenosis, primary aldosteronism, and obstructive sleep apnea) while screening for end-organ damage via serum creatinine, estimated GFR, urinalysis for microalbuminuria, and an 12-lead electrocardiogram.\n\n### First-Line Interventions\nNon-pharmacological management represents the foundation for all stages:\n- Sodium restriction (< 2,000 mg/day elemental sodium).\n- Adoption of the Dietary Approaches to Stop Hypertension (DASH) dietary pattern rich in potassium and magnesium.\n- Aerobic physical activity totaling at least 150 minutes of moderate intensity weekly.\n- Weight reduction: every 1 kg loss corresponds to approximately 1 mmHg systolic blood pressure drop.\n\nWhen pharmacotherapy is indicated, primary first-line classes include ACE inhibitors (or ARBs), thiazide-like diuretics, and dihydropyridine calcium channel blockers. Dual combination therapy at low initial doses is recommended for patients presenting with baseline pressure exceeding targets by > 20/10 mmHg.`,
    contentAr: `يُعد ارتفاع ضغط الدم الشرياني القاتل الصامت والسبب الرئيسي القابل للوقاية لأمراض القلب والأوعية الدموية والسكتات الدماغية على مستوى العالم. تشير القراءات التي تتجاوز 130/80 ملم زئبق في القياسات المتكررة إلى بدء مرحلة ارتفاع الضغط السريري.\n\n### الفحص والتقييم السريري\nيتطلب التشخيص الدقيق أخذ قياسين على الأقل في زيارتين منفصلتين بعد استراحة المريض لمدة 5 دقائق، باستخدام سوار جهاز قياس مناسب لحجم الذراع. يشمل التقييم الأولي استبعاد المسببات الثانوية (كتضيق الشريان الكلوي وفرط الألدوستيرونية)، والتحقق من سلامة الأعضاء الحيوية عبر فحص وظائف الكلى، وزلال البول، وتخطيط كهربية القلب (ECG).\n\n### التدخلات العلاجية والنمط الحياتي\nتشكل التعديلات غير الدوائية حجر الزاوية في خطة العلاج:\n- تقليل استهلاك الصوديوم (أقل من 2000 ملجم يومياً).\n- اتباع حمية DASH الغنية بالبوتاسيوم والخضراوات الورقية والمغنيسيوم.\n- ممارسة النشاط البدني الهوائي المنتظم لمدة 150 دقيقة أسبوعياً.\n- إنقاص الوزن الزائد، حيث يرتبط فقدان كل كيلوغرام بانخفاض يقارب 1 ملم زئبق في الضغط الانقباضي.\n\nفي حال الحاجة إلى الدواء، تشمل الخيارات الأولية مثبطات الإنزيم المحول للأنجيوتنسين (ACEi) أو مضادات مستقبلات الأنجيوتنسين (ARBs)، ومدرات البول الثيازيدية، وحاصرات قنوات الكالسيوم.`,
    author: {
      name: 'Prof. Youssef El-Shennawy, MD, FACC',
      nameAr: 'أ.د. يوسف الشناوي، استشاري أمراض القلب',
      role: 'Professor of Cardiology',
      roleAr: 'أستاذ أمراض القلب والأوعية الدموية',
      institution: 'Cairo University Faculty of Medicine (Kasr Al-Ainy)',
      institutionAr: 'كلية طب قصر العيني - جامعة القاهرة',
    },
    reviewedBy: {
      name: 'Dr. Mona Abdel-Aziz, MD',
      nameAr: 'د. منى عبد العزيز',
      title: 'Senior Cardiology Consultant & Critical Care Specialist',
      titleAr: 'استشارية أولى لأمراض القلب والرعاية المركزة',
      license: 'EGY-MED-44892',
    },
    readTimeMinutes: 7,
    difficulty: 'Intermediate',
    tags: ['Cardiology', 'Hypertension', 'DASH Diet', 'Pharmacotherapy'],
    tagsAr: ['أمراض القلب', 'ضغط الدم', 'حمية داش', 'الوقاية السريرية'],
    sources: [
      {
        title: '2023 ESH Guidelines for the management of arterial hypertension',
        url: 'https://doi.org/10.1097/HJH.0000000000003480',
        doi: '10.1097/HJH.0000000000003480',
        publisher: 'Journal of Hypertension',
      },
      {
        title: 'AHA/ACC Guideline for the Prevention, Detection, and Management of High Blood Pressure',
        url: 'https://www.ahajournals.org/doi/10.1161/HYP.0000000000000065',
        publisher: 'Circulation',
      },
    ],
    publishedAt: '2026-02-18',
    isFeatured: true,
    status: 'Published',
    viewCount: 1420,
  },
  {
    id: 'art-cpr-01',
    slug: 'science-of-resuscitation-high-quality-cpr',
    title: 'The Physiology of High-Quality Resuscitation: Why Compression Mechanics Matter',
    titleAr: 'فسيولوجيا الإنعاش القلبي عالي الجودة: الأثر الحيوي لعمق وتردد ضغطات الصدر',
    category: 'FirstAid',
    summary:
      'Understanding coronary perfusion pressure, thoracic pump theory, and why complete chest recoil is non-negotiable in CPR survival.',
    summaryAr:
      'فهم ضغط التروية التاجية، ونظرية المضخة الصدرية، وسبب حتمية الارتداد الصدري الكامل لإنقاذ حياة مرضى توقف القلب المفاجئ.',
    content: `Out-of-hospital cardiac arrest (OHCA) survival hinges on generating adequate coronary perfusion pressure (CPP). Animal and human clinical trials show that maintaining CPP above 15 mmHg is mandatory for successful return of spontaneous circulation (ROSC).\n\n### The Mechanics of Compression\n1. Depth: At 5 to 6 cm, compression collapses the right and left ventricles against the vertebral column while generating a intrathoracic pressure gradient.\n2. Recoil: When the rescuer leans on the victim's chest between strokes, residual positive intrathoracic pressure impairs venous return to the heart, dramatically dropping ventricular preload and decreasing next-stroke output by up to 50%.\n3. Rate: Compressing at 100 to 120 beats per minute strikes the optimal balance between forward flow and necessary diastolic filling time. Rates exceeding 130 bpm significantly reduce ejection volume.`,
    contentAr: `تعتمد نجاة المصابين بتوقف القلب المفاجئ خارج المستشفيات على توليد ضغط كافٍ لتروية الشرايين التاجية (CPP). أثبتت الدراسات السريرية أن الحفاظ على ضغط تروية يتجاوز 15 ملم زئبق ضروري جداً لعودة النبض التلقائي الطبيعي للقلب (ROSC).\n\n### الآلية الحيوية للضغطات الصدرية\n1. العمق: عند الضغط بعمق 5 إلى 6 سم، يتم ضغط البطينين بين عظم القص والعمود الفقري، مما يضخ الدم نحو الدماغ والشرايين التاجية.\n2. الارتداد الصدري: عندما يتكئ المسعف بثقله على الصدر بين الضغطات دون السماح بالارتداد الكامل، يظل الضغط داخل القفص الصدري مرتفعاً مما يمنع عودة الدم الوريدي للقلب، فتنخفض كمية الدم المضخوخ في الضغطة التالية بنسبة تصل إلى 50%.\n3. معدل الإيقاع: الضغط بسرعة 100 إلى 120 ضغطة في الدقيقة يحقق التوازن المثالي بين تدفق الدم للأمام وتوفير وقت كافٍ لامتلاء حجرات القلب بالدم.`,
    author: {
      name: 'Dr. Amira Radwan, MD, MRCEM',
      nameAr: 'د. أميرة رضوان، استشارية طب الطوارئ',
      role: 'Emergency Medicine & Trauma Specialist',
      roleAr: 'استشارية طب الطوارئ والإصابات الحرجة',
      institution: 'Ain Shams University Hospitals',
      institutionAr: 'مستشفيات جامعة عين شمس',
    },
    reviewedBy: {
      name: 'Dr. Hesham Tawfik, MD',
      nameAr: 'د. هشام توفيق',
      title: 'Consultant in Intensive Care & Resuscitation',
      titleAr: 'استشاري العناية المركزة والإنعاش',
      license: 'EGY-CRIT-91024',
    },
    readTimeMinutes: 5,
    difficulty: 'Basic',
    tags: ['CPR', 'Emergency', 'Resuscitation', 'AHA Guidelines'],
    tagsAr: ['الإنعاش القلبي', 'الإسعافات الأولية', 'طب الطوارئ', 'توقف القلب'],
    sources: [
      {
        title: 'AHA Guidelines for Cardiopulmonary Resuscitation and Emergency Cardiovascular Care',
        url: 'https://cpr.heart.org',
        publisher: 'American Heart Association',
      },
    ],
    publishedAt: '2026-03-02',
    isFeatured: true,
    status: 'Published',
    viewCount: 2180,
  },
  {
    id: 'art-ped-01',
    slug: 'pediatric-fever-assessment-red-flags-and-antipyretics',
    title: 'Pediatric Fever: Safe Antipyretic Dosing, Triage Protocols, and Dangerous Signs',
    titleAr: 'الحمى لدى الأطفال: الجرعات الدوائية الآمنة، فرز الحالات وعلامات الخطر التي تستدعي الطوارئ',
    category: 'Pediatrics',
    summary:
      'A practical guide for parents and students on weight-based Paracetamol and Ibuprofen dosing, preventing febrile convulsions, and recognizing pediatric sepsis.',
    summaryAr:
      'دليل عملي للتعامل مع ارتفاع درجة حرارة الأطفال: حساب الجرعات الدقيقة حسب الوزن، تجنب خافضات الحرارة الخاطئة، والتعرف على مؤشرات العدوى الخطيرة.',
    content: `Fever is defined as a core body temperature ≥ 38.0°C (100.4°F). In pediatric patients, fever is primarily a physiological host defense mechanism rather than an intrinsic disease.\n\n### When is a Fever an Immediate Emergency?\nSeek instant emergency evaluation if any of the following are present:\n- Infant under 3 months of age with temperature ≥ 38.0°C.\n- Petechial or purpuric rash (non-blanching dark red/purple spots that do not fade when pressed under a clear drinking glass).\n- Extreme lethargy, floppy muscle tone, unresponsiveness, or high-pitched inconsolable crying.\n- Severe work of breathing (grunting, chest retractions, nasal flaring).\n\n### Safe Weight-Based Dosing\nNever dose liquid medications using household kitchen teaspoons.\n- Paracetamol (Acetaminophen): 10 to 15 mg/kg per dose every 4 to 6 hours (Max 60 mg/kg/24h).\n- Ibuprofen: 5 to 10 mg/kg per dose every 6 to 8 hours (for infants > 6 months only; avoid during dehydration or chickenpox).\n- Strictly avoid Aspirin in anyone under 18 due to the fatal risk of Reye Syndrome.`,
    contentAr: `تُعرّف الحمى سريرياً بأنها ارتفاع درجة حرارة الجسم المركزية إلى 38.0 درجة مئوية أو أكثر. الحمى في حد ذاتها استجابة فسيولوجية مناعية طبيعية لمقاومة الميكروبات وليست مرضاً مستقلاً.\n\n### متى تستدعي حرارة الطفل التوجه الفوري للطوارئ؟\n- إذا كان عمر الرضيع أقل من 3 أشهر وبلغت حرارته 38.0 مئوية أو أكثر.\n- ظهور طفح جلدي نقطي بنفسجي أو أحمر داكن لا يختفي لونه عند الضغط عليه بكوب زجاجي شفاف (علامة اشتباه التهاب السحايا).\n- الخمول الشديد، صعوبة إيقاظ الطفل، أو البكاء النحيب المتواصل غير القابل للتهدئة.\n- صعوبة ملحوظة في التنفس (خفقان فتحتي الأنف، أو دخول عضلات الصدر للداخل بين الأضلاع).\n\n### حساب الجرعات الآمنة حسب وزن الطفل\nتُحسب الأدوية وفق وزن الطفل بالكيلوغرام وليس عمره التقريبي:\n- الباراسيتامول: 10 إلى 15 مجم/كجم لكل جرعة كل 4 إلى 6 ساعات (بحد أقصى 60 مجم/كجم يومياً).\n- الإيبوبروفين: 5 إلى 10 مجم/كجم لكل جرعة كل 6 إلى 8 ساعات (للأطفال فوق عمر 6 أشهر فقط، ويمنع في حالات الجفاف الشديد).\n- يُحظر استخدام الأسبرين تماماً للأطفال والمراهقين لاحتمالية تسببه بمتلازمة راي (Reye Syndrome) الكبدية القاتلة.`,
    author: {
      name: 'Dr. Fatima Zahra Al-Mansour, MD, ABP',
      nameAr: 'د. فاطمة الزهراء المنصور',
      role: 'Consultant Pediatrician & Neonatologist',
      roleAr: 'استشارية طب الأطفال وحديثي الولادة',
      institution: 'King Faisal Specialist Hospital & Research Centre',
      institutionAr: 'مستشفى الملك فيصل التخصصي ومركز الأبحاث',
    },
    reviewedBy: {
      name: 'Dr. Khaled Nour, MD',
      nameAr: 'د. خالد نور',
      title: 'Pediatric Critical Care Fellow',
      titleAr: 'زميل العناية المركزة للأطفال',
      license: 'SAU-PED-8819',
    },
    readTimeMinutes: 6,
    difficulty: 'Basic',
    tags: ['Pediatrics', 'Fever', 'Child Health', 'Safe Dosing'],
    tagsAr: ['طب الأطفال', 'الحمى', 'صحة الطفل', 'الجرعات الدوائية'],
    sources: [
      {
        title: 'NICE Clinical Guidelines: Fever in under 5s: assessment and initial management',
        url: 'https://www.nice.org.uk/guidance/ng143',
        publisher: 'National Institute for Health and Care Excellence',
      },
    ],
    publishedAt: '2026-02-28',
    isFeatured: true,
    status: 'Published',
    viewCount: 1850,
  },
  {
    id: 'art-neuro-01',
    slug: 'acute-ischemic-stroke-fast-recognition-and-thrombolysis',
    title: 'Acute Ischemic Stroke: The F.A.S.T. Assessment and the "Time is Brain" Paradigm',
    titleAr: 'السكتة الدماغية الإقفارية الحادة: اختبار F.A.S.T السريع وقاعدة "الوقت هو النسيج الدماغي"',
    category: 'Neurology',
    summary:
      'Understanding rapid neurologic deficit identification, the therapeutic thrombolytic window (tPA within 4.5 hours), and crucial pre-hospital actions.',
    summaryAr:
      'التعرف السريع على علامات السكتة الدماغية المفاجئة، وفهم النافذة العلاجية الذهبية لإذابة الجلطة (tPA خلال 4.5 ساعات)، والإجراءات الإسعافية الحاسمة.',
    content: `During an acute ischemic stroke, approximately 1.9 million neurons die every single minute an occlusion persists. Rapid pre-hospital triage directly determines whether a patient remains eligible for intravenous thrombolysis (r-tPA) or mechanical endovascular thrombectomy.\n\n### The F.A.S.T. Mnemonic\n- F (Face Drooping): Ask patient to smile. Look for unilateral drooping of the mouth or asymmetry.\n- A (Arm Weakness): Ask patient to raise both arms to 90 degrees with eyes closed. Watch for downward drift of one limb.\n- S (Speech Difficulty): Ask patient to repeat a simple sentence like "The sky is blue". Note slurred, garbled words or expressive aphasia.\n- T (Time to Call EMS): Note the EXACT time the patient was last seen at baseline normal and immediately alert emergency dispatch.`,
    contentAr: `أثناء السكتة الدماغية الإقفارية الناتجة عن انسداد شرياني، يموت ما يقارب 1.9 مليون خلية عصبية في كل دقيقة يستمر فيها نقص التروية. يحدد الفرز السريع قبل وصول المستشفى ما إذا كان المريض مؤهلاً لتلقي مذيبات الجلطة الوريدية (rtPA) خلال النافذة الزمنية الذهبية (4.5 ساعات).\n\n### اختبار F.A.S.T السريع للتعرف على الجلطة\n- F (الوجه Face): اطلب من المصاب الابتسام، ولاحظ هل يعاني أحد جانبي الوجه أو زاوية الفم من ارتخاء أو تدلٍ؟\n- A (الذراع Arm): اطلب منه رفع كلتا ذراعيه للأمام مع إغلاق عينيه لمدة 10 ثوانٍ، ولاحظ هل تهبط إحدى الذراعين تلقائياً؟\n- S (الكلام Speech): اطلب منه تكرار عبارة بسيطة، واستمع هل كلامه ثقيل، مبهم، أو غير مفهوم؟\n- T (الوقت Time): حدد بالدقيقة متى كان المصاب في حالته الطبيعية، واتصل فوراً بالإسعاف (123 / 997).`,
    author: {
      name: 'Dr. Ziad Hamdan, MD, PhD',
      nameAr: 'د. زياد حمدان، استشاري طب المخ والأعصاب',
      role: 'Consultant Neurologist & Stroke Specialist',
      roleAr: 'استشاري الأعصاب والسكتات الدماغية',
      institution: 'Beirut Medical Center',
      institutionAr: 'المركز الطبي الجامعي - بيروت',
    },
    reviewedBy: {
      name: 'Dr. Lina Boulos, MD',
      nameAr: 'د. لينا بولس',
      title: 'Interventional Neuroradiology Fellow',
      titleAr: 'أخصائية الأشعة العصبية التداخلية',
      license: 'LEB-NEURO-7712',
    },
    readTimeMinutes: 5,
    difficulty: 'Intermediate',
    tags: ['Neurology', 'Stroke', 'FAST Protocol', 'Emergency Medicine'],
    tagsAr: ['طب الأعصاب', 'السكتة الدماغية', 'بروتوكول FAST', 'الطوارئ'],
    sources: [
      {
        title: 'Guidelines for the Early Management of Patients With Acute Ischemic Stroke',
        url: 'https://doi.org/10.1161/STR.0000000000000158',
        publisher: 'AHA/ASA Stroke Journal',
      },
    ],
    publishedAt: '2026-03-05',
    isFeatured: false,
    status: 'Published',
    viewCount: 1610,
  },
  {
    id: 'art-nutr-01',
    slug: 'clinical-nutrition-metabolic-syndrome-reversal',
    title: 'Nutritional Strategies in Metabolic Syndrome and Type 2 Diabetes Management',
    titleAr: 'الاستراتيجيات الغذائية السريرية للتعامل مع متلازمة الأيض ومقاومة الإنسولين',
    category: 'Nutrition',
    summary:
      'Evidence-based nutritional interventions focusing on glycemic index, dietary fiber intake, and circadian intermittent fasting for metabolic optimization.',
    summaryAr:
      'تدخلات غذائية قائمة على الدليل تركز على المؤشر الجلايسيمي، والألياف المخمرة، وتنظيم ساعات الوجبات لتحسين حساسية الخلايا للإنسولين.',
    content: `Metabolic syndrome represents a cluster of interrelated biochemical conditions: abdominal obesity, elevated fasting triglycerides, diminished HDL cholesterol, elevated blood pressure, and impaired fasting glycemia.\n\n### Dietary Interventions\nClinical trials highlight that reducing refined carbohydrates and replacing them with unrefined whole grains, legumes, and omega-3 fatty acids leads to substantial reductions in HbA1c and visceral adiposity. Dietary fiber intake exceeding 35 grams daily alters short-chain fatty acid production via gut microbiota fermentation, exerting protective systemic insulin-sensitizing effects.`,
    contentAr: `تمثل متلازمة الأيض مجموعة من الاضطرابات الكيميائية الحيوية المترابطة: السمنة الحشوية، وارتفاع الدهون الثلاثية، وانخفاض الكوليسترول الحميد (HDL)، وارتفاع ضغط الدم ومقاومة الإنسولين.\n\n### الخطة التغذوية السريرية\nتؤكد التجارب السريرية أن استبدال الكربوهيدرات المكررة والسكريات بالحبوب الكاملة، والبقوليات، والأحماض الدهنية غير المشبعة (أوميغا 3)، يؤدي إلى انخفاض ملحوظ في معدل السكر التراكمي (HbA1c) ومحيط الخصر. كما أن تناول أكثر من 35 جراماً من الألياف يومياً يعزز صحة الميكروبيوم المعوي ويحسن استجابة الخلايا لهرمون الإنسولين.`,
    author: {
      name: 'Dr. Reem Al-Khatib, RD, PhD',
      nameAr: 'د. ريم الخطيب، دكتوراه التغذية العلاجية',
      role: 'Clinical Nutrition Consultant',
      roleAr: 'استشارية التغذية العلاجية والتمثيل الغذائي',
      institution: 'Jordan University Hospital',
      institutionAr: 'مستشفى الجامعة الأردنية',
    },
    reviewedBy: {
      name: 'Dr. Omar Shalabi, MD',
      nameAr: 'د. عمر شلبي',
      title: 'Endocrinology & Diabetology Consultant',
      titleAr: 'استشاري الغدد الصماء والسكري',
      license: 'JOR-ENDO-3011',
    },
    readTimeMinutes: 6,
    difficulty: 'Basic',
    tags: ['Nutrition', 'Diabetes', 'Metabolic Syndrome', 'Preventive Health'],
    tagsAr: ['التغذية العلاجية', 'السكري', 'متلازمة الأيض', 'الطب الوقائي'],
    sources: [
      {
        title: 'Standards of Medical Care in Diabetes—2024: Nutrition Therapy',
        url: 'https://care.diabetesjournals.org',
        publisher: 'American Diabetes Association',
      },
    ],
    publishedAt: '2026-03-08',
    isFeatured: false,
    status: 'Published',
    viewCount: 940,
  },
];

export const initialChatSessions: ChatSession[] = [
  {
    id: 'chat-sess-01',
    title: 'First-Aid for Minor Burn',
    titleAr: 'إسعافات أولية لحرق سطحي في اليد',
    createdAt: '2026-03-10T14:30:00Z',
    category: 'First Aid',
    messages: [
      {
        id: 'msg-01',
        sender: 'user',
        text: 'What should I do immediately for a hot water burn on my forearm?',
        textAr: 'ما هي الخطوات الإسعافية الفورية لحرق سببه ماء مغلي على ساعد اليد؟',
        timestamp: '14:30',
        isMock: true,
      },
      {
        id: 'msg-02',
        sender: 'assistant',
        text: `### Immediate Emergency Guidance for Scald Burns\n\n1. **Cool Immediately Under Tap Water**: Place your forearm under gentle, cool running tap water (15–20°C) for a **minimum of 20 continuous minutes**. Do NOT use ice or ice water.\n2. **Remove Jewelry & Watches**: Take off any rings or bracelets from the arm before tissue swelling occurs.\n3. **Cover Loosely**: Cover the area with a clean non-stick sterile dressing or clean plastic wrap (cling film).\n4. **Pain Relief**: You may take over-the-counter Paracetamol if you have no contraindications.\n\n⚠️ **When to visit Urgent Care / Emergency:**\n- If the burn size is larger than the size of the palm of your hand.\n- If blisters form and burst, or if skin looks leathery/charred.\n- If the burn crosses a wrist joint.`,
        textAr: `### الإرشادات الإسعافية الفورية لحروق السوائل الساخنة:\n\n1. **التبريد الفوري بماء الصنبور**: ضع الساعد فوراً تحت ماء صنبور بارد معتدل (15-20 درجة مئوية) لمدة **20 دقيقة متواصلة**. تجنب وضع الثلج نهائياً.\n2. **نزع الساعات والحلي**: انزع أي ساعة أو أساور أو خواتم من اليد قبل بدء تورم الأنسجة.\n3. **التغطية النظيفة**: غطِّ الحرق بشاش معقم غير لاصق أو بنايلون شفاف نظيف (Cling Film) دون شد أو ضغط.\n4. **تسكين الألم**: يمكنك تناول قرص باراسيتامول لتخفيف الألم إذا لم تكن هناك موانع صحية لديك.\n\n⚠️ **متى يجب التوجه الفوري للمستشفى:**\n- إذا كانت مساحة الحرق أكبر من مساحة راحة يد المصاب.\n- إذا تشكلت فقاقيع مائية واسعة، أو إذا كان الجلد متفحماً أو فاقداً للإحساس.\n- إذا كان الحرق يحيط بمفصل المعصم بالكامل.`,
        timestamp: '14:31',
        isMock: true,
        suggestedFollowUps: [
          'Can I apply toothpaste or aloe vera to the burn?',
          'How do I treat blisters that popped?',
        ],
        suggestedFollowUpsAr: [
          'هل يمكنني وضع معجون أسنان أو عسل على الحرق؟',
          'كيف أتعامل مع الفقاقيع المائية إذا انفجرت؟',
        ],
      },
    ],
  },
];

import { MedicalVideo } from '../types';

export const mockVideos: MedicalVideo[] = [
  {
    id: 'vid-cpr-01',
    title: 'High-Quality Adult CPR: Compression Rate & Recoil Mastery',
    titleAr: 'تطبيق عملي: الإنعاش القلبي الرئوي المتقدم للبالغين وضبط الإيقاع',
    description:
      'A physician-led clinical simulation demonstrating proper palm placement on the lower sternum, achieving 5-6 cm compression depth, and maintaining 100-120 bpm cadence with complete chest recoil.',
    descriptionAr:
      'شرح سريري تطبيقي بواسطة استشاري طوارئ يوضح الوضعية الصحيحة لكعب اليدين على منتصف عظم القص، والضغط بعمق 5-6 سم، مع الحفاظ على وتيرة 100-120 ضغطة/دقيقة مع الارتداد الصدري التام.',
    category: 'Resuscitation',
    videoUrl: 'https://www.youtube-nocookie.com/embed/cosVBV96E2g',
    thumbnailGradient: 'from-rose-950 via-red-900 to-slate-950',
    duration: '04:45',
    instructor: {
      name: 'Dr. Amira Radwan, MD',
      nameAr: 'د. أميرة رضوان',
      title: 'Emergency Medicine & Critical Care Consultant',
      titleAr: 'استشارية طب الطوارئ والرعاية الحرجة',
      hospital: 'Ain Shams University Hospitals',
      hospitalAr: 'مستشفيات جامعة عين شمس',
    },
    views: 3420,
    likes: 289,
    publishedAt: '2026-03-01',
    status: 'Published',
    tags: ['CPR', 'First Aid', 'Resuscitation', 'Emergency'],
    tagsAr: ['الإنعاش القلبي', 'الإسعافات الأولية', 'طب الطوارئ'],
    keyPointsAr: [
      'وضع كعب اليد في منتصف النصف السفلي لعظم القص وقفل مفصلي الكوعين مستقيمين',
      'الضغط لعمق 5 إلى 6 سم بسرعة 100 إلى 120 ضغطة بالدقيقة',
      'السماح بالارتداد الكامل للقفص الصدري بين كل ضغطة والأخرى دون رفع اليدين',
      'تقليل التوقفات إلى أقل من 10 ثوانٍ كحد أقصى',
    ],
    keyPointsEn: [
      'Place heel of hand on lower sternum half and keep elbows locked straight',
      'Compress 5-6 cm deep at 100-120 compressions per minute',
      'Ensure complete chest recoil between strokes without lifting hands',
      'Minimize compression interruptions to under 10 seconds',
    ],
  },
  {
    id: 'vid-choke-02',
    title: 'Choking Relief: Heimlich Maneuver & Infant Back Blows Protocol',
    titleAr: 'إسعاف الغصة الشديدة: مناورة هيمليك للبالغين وضربات ظهر الرضع',
    description:
      'Clear, practical demonstration on alternating 5 sharp interscapular back blows with 5 upward subdiaphragmatic abdominal thrusts, and specialized cradle technique for infants under 1 year.',
    descriptionAr:
      'تطبيق عملي واضح للتناوب بين 5 ضربات ظهرية بين لوحي الكتف و5 ضغطات بطنية للداخل ولأعلى، مع وضعية المهد الخاصة لإسعاف الرضع دون عمر السنة.',
    category: 'FirstAid',
    videoUrl: 'https://www.youtube-nocookie.com/embed/2v8vlXgGXwE',
    thumbnailGradient: 'from-amber-950 via-orange-900 to-slate-950',
    duration: '03:50',
    instructor: {
      name: 'Dr. Fatima Zahra Al-Mansour, MD',
      nameAr: 'د. فاطمة الزهراء المنصور',
      title: 'Consultant Pediatrician',
      titleAr: 'استشارية طب الأطفال وحديثي الولادة',
      hospital: 'King Faisal Specialist Hospital',
      hospitalAr: 'مستشفى الملك فيصل التخصصي',
    },
    views: 4890,
    likes: 412,
    publishedAt: '2026-03-05',
    status: 'Published',
    tags: ['Choking', 'Heimlich', 'Pediatrics', 'First Aid'],
    tagsAr: ['الغصة', 'هيمليك', 'طب الأطفال', 'إسعاف الرضع'],
    keyPointsAr: [
      'سؤال المصاب فوراً: هل تختنق؟ في حال عجز عن النطق تبدأ المساعدة الفورية',
      'إمالة جذع المصاب للأمام قبل توجيه الضربات الظهرية لضمان خروج الجسم الغريب للأسفل',
      'وضع قبضة اليد أعلى السرة مباشرة والضغط بحركة مائلة للداخل ولأعلى',
      'في الرضع: وضع الرضيع على الساعد بحيث يكون الرأس أخفض من الجذع مع تثبيت الفك',
    ],
    keyPointsEn: [
      'Verify severe obstruction: inability to talk, cough forcefully or breathe',
      'Lean patient forward so foreign object exits downward rather than deeper',
      'Position fist just above navel and thrust inward and upward',
      'In infants: support jaw and place infant head-downward along forearm',
    ],
  },
  {
    id: 'vid-bleed-03',
    title: 'Trauma Hemorrhage Control: Tourniquet & Pressure Packing',
    titleAr: 'السيطرة على النزيف الحاد: تطبيق العاصبة الشريانية وحشو الجروح العميقة',
    description:
      'Critical trauma management protocol showing how to apply a commercial windlass tourniquet 5-7 cm proximal to injury, wind until arterial pulse ceases, and record precise time of placement.',
    descriptionAr:
      'بروتوكول حاسم للتعامل مع النزيف الشرياني الحاد: تركيب العاصبة الشريانية (Tourniquet) أعلى الجرح بـ 5-7 سم، وشدها حتى انقطاع تدفق الدم، وتدوين توقيت التركيب بالساعة والدقيقة.',
    category: 'Trauma',
    videoUrl: 'https://www.youtube-nocookie.com/embed/yQ0w4F5o4B0',
    thumbnailGradient: 'from-slate-950 via-red-950 to-slate-900',
    duration: '05:15',
    instructor: {
      name: 'Dr. Hesham Tawfik, MD',
      nameAr: 'د. هشام توفيق',
      title: 'Consultant Trauma Surgeon',
      titleAr: 'استشاري جراحة الإصابات والحوادث الحرجة',
      hospital: 'Kasr Al-Ainy Trauma Center',
      hospitalAr: 'مركز قصر العيني للطوارئ والإصابات',
    },
    views: 2950,
    likes: 310,
    publishedAt: '2026-03-08',
    status: 'Published',
    tags: ['Bleeding', 'Tourniquet', 'Trauma', 'StopTheBleed'],
    tagsAr: ['إيقاف النزيف', 'العاصبة الشريانية', 'إصابات الحوادث'],
    keyPointsAr: [
      'الضغط المباشر بكعب اليدين أولاً ريثما يتم تجهيز العاصبة أو الشاش المعقم',
      'وضع العاصبة الشريانية على بعد 5-7 سم أعلى الجرح باتجاه القلب (وتجنب وضعها فوق المفاصل)',
      'لف وتدوير قضيب الشد (Windlass) حتى يتوقف النزيف الشرياني النابض تماماً',
      'كتابة توقيت الربط بالدقيقة على شريط العاصبة (TIME) وعدم فكها إلا بإشراف جراحي',
    ],
    keyPointsEn: [
      'Maintain immediate direct pressure while preparing tourniquet',
      'Apply tourniquet 5-7 cm proximal to bleeding site, avoiding joints',
      'Tighten windlass rod until bright arterial bleeding completely ceases',
      'Record exact application timestamp on the tourniquet strap',
    ],
  },
  {
    id: 'vid-burn-04',
    title: 'Emergency Burn Management: The 20-Minute Water Cooling Rule',
    titleAr: 'التدبير الإسعافي للحروق: قاعدة الـ 20 دقيقة بالماء الجاري ومحاذير الثلج',
    description:
      'Evidence-based burn first-aid protocol emphasizing cold tap water cooling within 3 hours of burn, removing jewelry before edema, and using sterile plastic film wraps.',
    descriptionAr:
      'دليل إسعاف الحروق الحرارية المعتمد سريرياً: التبريد الفوري بماء صنبور معتدل لمدة 20 دقيقة، نزع الخواتم والساعات قبل تورم الأطراف، واستخدام النايلون الشفاف كغطاء معقم.',
    category: 'FirstAid',
    videoUrl: 'https://www.youtube-nocookie.com/embed/5F4m_k6wG9g',
    thumbnailGradient: 'from-amber-950 via-teal-950 to-slate-950',
    duration: '03:20',
    instructor: {
      name: 'Dr. Mona Abdel-Aziz, MD',
      nameAr: 'د. منى عبد العزيز',
      title: 'Consultant Critical Care & Burn Unit Specialist',
      titleAr: 'استشارية العناية المركزة ووحدة علاج الحروق',
      hospital: 'Alexandria University Hospitals',
      hospitalAr: 'مستشفيات جامعة الإسكندرية',
    },
    views: 1840,
    likes: 195,
    publishedAt: '2026-03-12',
    status: 'Published',
    tags: ['Burns', 'First Aid', 'Cooling', 'Safety'],
    tagsAr: ['علاج الحروق', 'الإسعافات الأولية', 'التبريد بالماء'],
    keyPointsAr: [
      'التبريد بماء الصنبور العادي (15-20 مئوية) لمدة 20 دقيقة كاملة يقلل عمق الحرق ويخفف الألم',
      'يمنع منعاً باتاً استخدام الثلج لأنه يسبب تضيقاً حاداً بالأوعية وموت الخلايا السطحية',
      'عدم وضع معجون الأسنان أو الزيوت أو الطحين لأنها تحبس الحرارة وتلوث الأنسجة',
      'تغطية الحرق بغلاف نايلون شفاف نظيف لحماية النهايات العصبية من الهواء وتقليل الألم',
    ],
    keyPointsEn: [
      'Cool under tap water (15-20°C) for 20 minutes to reduce burn depth',
      'Never apply ice directly as it induces severe vasoconstriction and necrosis',
      'Strictly avoid butter, toothpaste, or flour which trap heat and harbor bacteria',
      'Cover loosely with clean cling wrap to protect nerve endings from air',
    ],
  },
  // Pending Video for approval queue demonstration in Admin Dashboard
  {
    id: 'vid-ped-pending-05',
    title: 'Pediatric Febrile Seizure: Safety Positioning & Parent Triage',
    titleAr: 'التشنج الحراري عند الأطفال: وضعية الأمان وإرشادات الطوارئ للأهل',
    description:
      'A practical step-by-step guide for parents and nurses on placing a seizing child in the recovery position, clearing surrounding hazards, timing the seizure, and knowing when to call emergency EMS.',
    descriptionAr:
      'شرح عملي للأهل والكوادر التمريضية لكيفية وضع الطفل المتشنج في وضعية الإفاقة الجانبية، إبعاد أي أدوات حادة، حساب مدة التشنج بالثواني، ومتى يُطلب الإسعاف فوراً.',
    category: 'Pediatrics',
    videoUrl: 'https://www.youtube-nocookie.com/embed/9BqM2jJt6eA',
    thumbnailGradient: 'from-indigo-950 via-teal-900 to-slate-900',
    duration: '04:10',
    instructor: {
      name: 'Dr. Khaled Nour, MD',
      nameAr: 'د. خالد نور',
      title: 'Pediatric Emergency Fellow',
      titleAr: 'أخصائي طوارئ الأطفال',
      hospital: 'Cairo Children Specialized Hospital',
      hospitalAr: 'مستشفى الأطفال التخصصي',
    },
    views: 120,
    likes: 14,
    publishedAt: '2026-03-14',
    status: 'UnderReview', // PENDING APPROVAL!
    tags: ['Pediatrics', 'Seizures', 'Fever', 'Parent Guide'],
    tagsAr: ['طب الأطفال', 'التشنجات الحرارية', 'الحمى'],
    keyPointsAr: [
      'وضع الطفل بلطف على جانبه (وضعية الإفاقة) لمنع انسداد مجرى الهواء باللعاب أو القيء',
      'عدم وضع أي شيء داخل فم الطفل المتشنج (عدم وضع ملاعق أو أصابع)',
      'تسجيل مدة نوبة التشنج بالساعة؛ إذا زادت عن 5 دقائق يُطلب الإسعاف فوراً (123)',
    ],
    keyPointsEn: [
      'Gently place child on their side in recovery position to protect airway',
      'Never place anything in a seizing child mouth (no spoons or fingers)',
      'Time the seizure; if exceeding 5 minutes call emergency ambulance immediately',
    ],
  },
];

// Add an article with status 'UnderReview' for the approval queue
export const pendingReviewArticle: MedicalArticle = {
  id: 'art-pending-asthma-01',
  slug: 'acute-severe-asthma-exacerbation-spacer-protocol',
  title: 'Acute Severe Asthma Exacerbation: Metered-Dose Inhaler with Spacer Protocol',
  titleAr: 'النوبة الربوية الحادة: بروتوكول استخدام البخاخ مع الحجرة الاستنشاقية (Spacer)',
  category: 'FirstAid',
  summary:
    'Step-by-step pre-hospital protocol for administering Salbutamol via spacer during acute broncho-constriction and recognizing "silent chest" warning signs.',
  summaryAr:
    'بروتوكول سريري تفصيلي لاستخدام بخاخ السالبوتامول مع الحجرة الهوائية أثناء نوبات ضيق التنفس الربوية الحادة والتعرف على مؤشرات الصدر الصامت الخطيرة.',
  content: `Acute asthma exacerbations present with progressive dyspnea, wheezing, and chest tightness. Immediate intervention with inhaled short-acting beta-2 agonists (SABA) via a spacer device is superior to standard nebulizers in both pediatric and adult settings.\n\n### The "4x4x4" Emergency Protocol\n1. Sit the patient fully upright. Do not allow them to lie flat.\n2. Shake the Salbutamol (Ventolin) inhaler and attach firmly into the spacer chamber.\n3. Administer 1 puff into the spacer, instructing patient to take 4 slow, deep tidal breaths through the mouthpiece.\n4. Repeat for up to 4 separate puffs with 1-minute intervals.\n5. If there is no marked clinical improvement after 4 minutes, summon emergency ambulance dispatch immediately while repeating the 4 puffs.`,
  contentAr: `تتظاهر نوبة الربو الحادة بضيق تنفس تدريجي، وأزيز صدري واضح، وسعال مستمر. استخدام البخاخ الموسع للشعب (سالبوتامول) مع الحجرة الاستنشاقية (Spacer) يعطي فعالية مساوية أو متفوقة على أجهزة البخار المعتادة.\n\n### بروتوكول الطوارئ (4 × 4)\n1. إجلاس المريض منتصباً تماماً مع إمالة الرأس قليلاً للأمام وتجنب استلقائه على ظهره.\n2. رج بخاخ السالبوتامول (فنتولين) جيداً وتركيبه بإحكام في الحجرة الاستنشاقية.\n3. إعطاء بخة واحدة داخل الحجرة، وتوجيه المريض لأخذ 4 أنفاس عميقة وبطيئة عبر فوهة الحجرة.\n4. تكرار الخطوة حتى 4 بخات منفصلة بين كل بخة والأخرى دقيقة واحدة.\n5. إذا لم يطرأ تحسن ملحوظ خلال 4 دقائق، يجب طلب الإسعاف الفوري (123) ومواصلة إعطاء 4 بخات كل 4 دقائق حتى وصول الفريق الطبي.`,
  author: {
    name: 'Dr. Mahmoud El-Banna, MD',
    nameAr: 'د. محمود البنا',
    role: 'Pulmonology Specialist',
    roleAr: 'أخصائي الأمراض الصدرية والحساسية',
    institution: 'Mansoura University Hospitals',
    institutionAr: 'مستشفيات جامعة المنصورة',
  },
  reviewedBy: {
    name: 'Dr. Hesham Tawfik, MD',
    nameAr: 'د. هشام توفيق',
    title: 'Consultant in Intensive Care',
    titleAr: 'استشاري العناية المركزة',
    license: 'EGY-CRIT-91024',
  },
  readTimeMinutes: 4,
  difficulty: 'Basic',
  tags: ['Asthma', 'Inhaler', 'Spacer', 'First Aid'],
  tagsAr: ['الربو', 'الحجرة الاستنشاقية', 'ضيق التنفس', 'الإسعافات الأولية'],
  sources: [
    {
      title: 'Global Initiative for Asthma (GINA) 2024 Report',
      url: 'https://ginasthma.org',
      publisher: 'GINA Executive Committee',
    },
  ],
  publishedAt: '2026-03-14',
  isFeatured: false,
  status: 'UnderReview', // PENDING APPROVAL!
  viewCount: 15,
};

export const mockUsersList: User[] = [
  initialCurrentUser,
  {
    id: 'usr-admin-01',
    fullName: 'Eng. Mohamed Bakr (Admin)',
    fullNameAr: 'م. محمد بكر (مدير المنصة)',
    email: 'admin@mediguide.platform',
    role: 'Admin',
    createdAt: '2026-01-01T08:00:00Z',
    savedArticleIds: ['art-cpr-01', 'art-cardio-01'],
    emergencyContacts: [
      { name: 'Dr. Tarek Mansour', relationship: 'Chief Medical Officer', phone: '+20 100 123 4567' },
    ],
  },
  {
    id: 'usr-doc-02',
    fullName: 'Dr. Amira Radwan',
    fullNameAr: 'د. أميرة رضوان',
    email: 'amira.radwan@ainshams.edu.eg',
    role: 'Doctor',
    createdAt: '2026-01-20T10:00:00Z',
    savedArticleIds: ['art-cpr-01'],
    emergencyContacts: [],
  },
  {
    id: 'usr-stu-03',
    fullName: 'Karim Ahmed',
    fullNameAr: 'كريم أحمد',
    email: 'karim.med@student.cu.edu.eg',
    role: 'Student',
    createdAt: '2026-02-10T12:00:00Z',
    savedArticleIds: ['art-ped-01', 'art-neuro-01'],
    emergencyContacts: [],
  },
  {
    id: 'usr-pat-04',
    fullName: 'Nour El-Din Hassan',
    fullNameAr: 'نور الدين حسن',
    email: 'nour.hassan@gmail.com',
    role: 'Patient',
    createdAt: '2026-03-02T15:00:00Z',
    savedArticleIds: ['art-nutr-01'],
    emergencyContacts: [
      { name: 'Family Doctor', relationship: 'Clinic', phone: '+20 102 333 4455' },
    ],
  },
];

