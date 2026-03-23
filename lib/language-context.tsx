'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.advertisement': 'ADVERTISEMENT',
    'nav.originals': 'ORIGINALS',
    'nav.corporate': 'CORPORATE',
    'nav.music': 'MUSIC',
    'nav.studio': 'STUDIO',
    'nav.about': 'ABOUT',
    'nav.contact': 'CONTACT',

    // Home
    'home.play': 'PLAY',
    'home.discover': 'DISCOVER',
    'home.next': 'NEXT',
    'home.creative_production': 'CREATIVE PRODUCTION,',
    'home.post_production': '& POST-PRODUCTION STUDIO',
    'home.fueled': 'FUELED BY FEELINGS',

    // Footer
    'footer.get_in_touch': 'GET IN TOUCH',
    'footer.legals': 'LEGALS',
    'footer.credits': 'CREDITS',

    // Cookie Banner
    'cookie.message': 'BY CLICKING ON "ACCEPT", YOU ACCEPT THE INSTALLATION OF COOKIES ON YOUR BROWSER IN ORDER TO IMPROVE YOUR BROWSING EXPERIENCE AND THE ACQUISITION OF STATISTICS. VISIT OUR LEGAL NOTICES FOR MORE INFORMATIONS.',
    'cookie.accept': 'Accept',
    'cookie.preferences': 'Preferences',

    // About
    'about.title': 'ABOUT',
    'about.who_we_are': 'WHO WE ARE',
    'about.what_we_do': 'WHAT WE DO',
    'about.our_services': 'OUR SERVICES',
    'about.team_description': 'WE ARE A TEAM OF PASSIONATE CREATIVES, PRODUCERS AND DIRECTORS, ON A MISSION TO DELIVER GREAT CONTENT',

    // Contact
    'contact.title': 'CONTACT',
    'contact.time_zone': 'TIME ZONE',
    'contact.address': 'ADDRESS',
    'contact.jobs': 'JOBS',
    'contact.say_hello': 'SAY HELLO',

    // Common
    'common.scroll': 'Scroll',
    'common.to_top': 'TO TOP',
    'common.back': 'Back',
    'common.next_project': 'Next project',
    'common.filters': 'Filters',
    'common.all': 'All',
  },
  fr: {
    // Navigation
    'nav.advertisement': 'PUBLICITÉ',
    'nav.originals': 'ORIGINAUX',
    'nav.corporate': 'CORPORATE',
    'nav.music': 'MUSIQUE',
    'nav.studio': 'STUDIO',
    'nav.about': 'À PROPOS',
    'nav.contact': 'CONTACT',

    // Home
    'home.play': 'PLAY',
    'home.discover': 'DÉCOUVRIR',
    'home.next': 'SUIVANT',
    'home.creative_production': 'PRODUCTION CRÉATIVE,',
    'home.post_production': '& STUDIO POST-PRODUCTION',
    'home.fueled': 'ALIMENTÉ PAR LES ÉMOTIONS',

    // Footer
    'footer.get_in_touch': 'CONTACTEZ-NOUS',
    'footer.legals': 'MENTIONS LÉGALES',
    'footer.credits': 'CRÉDITS',

    // Cookie Banner
    'cookie.message': 'EN CLIQUANT SUR "ACCEPTER", VOUS ACCEPTEZ L\'INSTALLATION DE COOKIES SUR VOTRE NAVIGATEUR AFIN D\'AMÉLIORER VOTRE EXPÉRIENCE DE NAVIGATION ET L\'ACQUISITION DE STATISTIQUES. CONSULTEZ NOS MENTIONS LÉGALES POUR PLUS D\'INFORMATIONS.',
    'cookie.accept': 'Accepter',
    'cookie.preferences': 'Préférences',

    // About
    'about.title': 'À PROPOS',
    'about.who_we_are': 'QUI NOUS SOMMES',
    'about.what_we_do': 'CE QUE NOUS FAISONS',
    'about.our_services': 'NOS SERVICES',
    'about.team_description': 'NOUS SOMMES UNE ÉQUIPE DE CRÉATIFS PASSIONNÉS, PRODUCTEURS ET RÉALISATEURS, EN MISSION POUR LIVRER DU CONTENU EXCEPTIONNEL',

    // Contact
    'contact.title': 'CONTACT',
    'contact.time_zone': 'FUSEAU HORAIRE',
    'contact.address': 'ADRESSE',
    'contact.jobs': 'EMPLOIS',
    'contact.say_hello': 'DITES BONJOUR',

    // Common
    'common.scroll': 'Défiler',
    'common.to_top': 'HAUT DE PAGE',
    'common.back': 'Retour',
    'common.next_project': 'Projet suivant',
    'common.filters': 'Filtres',
    'common.all': 'Tout',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
