import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    fr: string;
    ar: string;
  };
}

export const translations: Translations = {
  home: { en: 'Home', fr: 'Accueil', ar: 'الرئيسية' },
  menu: { en: 'Menu', fr: 'Menu', ar: 'القائمة' },
  about: { en: 'About', fr: 'À propos', ar: 'حول' },
  location: { en: 'Location', fr: 'Emplacement', ar: 'الموقع' },
  welcome: { en: 'Welcome to Salé', fr: 'Bienvenue à Salé', ar: 'مرحباً بكم في سلا' },
  heroTitle: { en: 'Coffee. Comfort. Creativity.', fr: 'Café. Confort. Créativité.', ar: 'قهوة. راحة. إبداع.' },
  heroSub: { en: 'Your premium workspace in the heart of the city.', fr: 'Votre espace de travail premium au cœur de la ville.', ar: 'مساحة عملك المتميزة في قلب المدينة.' },
  visitUs: { en: 'Visit Us', fr: 'Visitez-nous', ar: 'زورونا' },
  signatureMenu: { en: 'Signature Menu', fr: 'Menu Signature', ar: 'قائمة التوقيع' },
  fullMenu: { en: 'Full Menu', fr: 'Menu Complet', ar: 'القائمة الكاملة' },
  findUs: { en: 'Find Us', fr: 'Trouvez-nous', ar: 'تجدوننا' },
  getDirections: { en: 'GET DIRECTIONS', fr: 'ITINÉRAIRE', ar: 'الحصول على الاتجاهات' },
  reviewsTitle: { en: 'Google Maps Reviews', fr: 'Avis Google Maps', ar: 'تقييمات جوجل مابس' },
  verifiedReviews: { en: 'Verified Reviews', fr: 'Avis vérifiés', ar: 'تقييمات موثقة' },
  studyFriendly: { en: 'Study Friendly', fr: 'Idéal pour étudier', ar: 'مناسب للدراسة' },
  highSpeedWifi: { en: 'High-Speed WiFi', fr: 'WiFi haut débit', ar: 'واي فاي سريع' },
  ourStory: { en: 'Our Story', fr: 'Notre Histoire', ar: 'قصتنا' },
  aboutTitle: { en: 'A Space Where Ideas Brew', fr: 'Un espace où les idées germent', ar: 'مساحة حيث تُصنع الأفكار' },
  aboutText: { 
    en: 'Café Rodina was born from a simple vision: to create a bridge between the traditional Moroccan café culture and the modern needs of students and freelancers in Salé.',
    fr: 'Le Café Rodina est né d\'une vision simple : créer un pont entre la culture traditionnelle des cafés marocains et les besoins modernes des étudiants et des freelances à Salé.',
    ar: 'وُلد مقهى رودينا من رؤية بسيطة: خلق جسر بين ثقافة المقاهي المغربية التقليدية والاحتياجات الحديثة للطلاب والمستقلين في سلا.'
  },
  artisanalCoffee: { en: 'Artisanal Coffee', fr: 'Café Artisanal', ar: 'قهوة حرفية' },
  coffeeDesc: { en: 'Carefully sourced beans, roasted to perfection.', fr: 'Grains soigneusement sélectionnés, torréfiés à la perfection.', ar: 'حبوب مختارة بعناية، محمصة بإتقان.' },
  coworkingReady: { en: 'Coworking Ready', fr: 'Prêt pour le Coworking', ar: 'جاهز للعمل المشترك' },
  coworkingDesc: { en: 'High-speed Wi-Fi and plenty of outlets.', fr: 'Wi-Fi haut débit et nombreuses prises.', ar: 'واي فاي عالي السرعة والعديد من المقابس.' },
  allRights: { en: 'All rights reserved.', fr: 'Tous droits réservés.', ar: 'جميع الحقوق محفوظة.' },
  adminLogin: { en: 'Admin Login', fr: 'Connexion Admin', ar: 'دخول المسؤول' },
  logout: { en: 'Logout', fr: 'Déconnexion', ar: 'تسجيل الخروج' },
  admin: { en: 'Admin', fr: 'Admin', ar: 'المسؤول' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div className={isRTL ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
