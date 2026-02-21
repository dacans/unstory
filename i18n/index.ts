import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { translations, SupportedLocale, TranslationKeys } from './translations';
export type { TranslationKeys, SupportedLocale };

const STORAGE_KEY = 'app_language';
const SUPPORTED: SupportedLocale[] = ['en', 'es', 'de'];

function detectDeviceLocale(): SupportedLocale {
  try {
    const locales = getLocales();
    for (const locale of locales) {
      const tag = locale.languageTag?.toLowerCase() ?? '';
      if (tag.startsWith('es')) return 'es';
      if (tag.startsWith('de')) return 'de';
    }
  } catch (_) {}
  return 'en';
}

interface I18nStore {
  locale: SupportedLocale;
  ready: boolean;
  setLocale: (locale: SupportedLocale) => Promise<void>;
  init: () => Promise<void>;
}

export const useI18nStore = create<I18nStore>((set) => ({
  locale: 'en',
  ready: false,

  init: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.includes(stored as SupportedLocale)) {
        set({ locale: stored as SupportedLocale, ready: true });
      } else {
        const detected = detectDeviceLocale();
        set({ locale: detected, ready: true });
      }
    } catch (_) {
      set({ locale: 'en', ready: true });
    }
  },

  setLocale: async (locale: SupportedLocale) => {
    set({ locale });
    await AsyncStorage.setItem(STORAGE_KEY, locale);
  },
}));

/** Hook that returns the full translation object for the current locale */
export function useT(): TranslationKeys {
  const locale = useI18nStore((s) => s.locale);
  return translations[locale] as unknown as TranslationKeys;
}

/** One-shot getter for use outside React (e.g. in store callbacks) */
export function t(): TranslationKeys {
  const locale = useI18nStore.getState().locale;
  return translations[locale] as unknown as TranslationKeys;
}
