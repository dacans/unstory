import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Emotion = 'overwhelmed' | 'anxious' | 'frustrated' | 'exhausted' | 'stuck';

export type ResultType = 'acted' | 'released' | 'resting';

export interface SavedSession {
  id: string;
  date: string;
  emotion: Emotion;
  dumpText: string;
  flowAnswers: Record<string, string>;
  resultType: ResultType;
  resultMessage: string;
}

export interface PresentMoment {
  id: string;
  date: string;
  text: string;
}

interface SessionStore {
  emotion: Emotion | null;
  dumpText: string;
  flowAnswers: Record<string, string>;
  sessionCount: number;
  isPro: boolean;
  isPremium: boolean;
  disclaimerAccepted: boolean;
  sessions: SavedSession[];
  presentMoments: PresentMoment[];
  currentResultType: ResultType | null;
  currentResultMessage: string;

  setEmotion: (e: Emotion) => void;
  setDumpText: (t: string) => void;
  setFlowAnswer: (key: string, value: string) => void;
  setResultType: (type: ResultType, message: string) => void;
  saveSession: () => Promise<void>;
  savePresentMoment: (text: string) => Promise<void>;
  clearSession: () => void;
  incrementSessionCount: () => Promise<void>;
  loadPersistedData: () => Promise<void>;
  setIsPro: (val: boolean) => Promise<void>;
  setIsPremium: (val: boolean) => Promise<void>;
  acceptDisclaimer: () => Promise<void>;
}

const STORAGE_KEYS = {
  sessionCount: 'session_count',
  isPro: 'is_pro',
  isPremium: 'is_premium',
  savedSessions: 'saved_sessions',
  disclaimerAccepted: 'disclaimer_accepted',
  presentMoments: 'present_moments',
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  emotion: null,
  dumpText: '',
  flowAnswers: {},
  sessionCount: 0,
  isPro: false,
  isPremium: false,
  disclaimerAccepted: false,
  sessions: [],
  presentMoments: [],
  currentResultType: null,
  currentResultMessage: '',

  setEmotion: (e) => set({ emotion: e }),

  setDumpText: (t) => set({ dumpText: t }),

  setFlowAnswer: (key, value) =>
    set((state) => ({ flowAnswers: { ...state.flowAnswers, [key]: value } })),

  setResultType: (type, message) =>
    set({ currentResultType: type, currentResultMessage: message }),

  saveSession: async () => {
    const { emotion, dumpText, flowAnswers, currentResultType, currentResultMessage, sessions } =
      get();
    if (!emotion || !currentResultType) return;

    const newSession: SavedSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      emotion,
      dumpText,
      flowAnswers,
      resultType: currentResultType,
      resultMessage: currentResultMessage,
    };

    const updated = [newSession, ...sessions];
    set({ sessions: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.savedSessions, JSON.stringify(updated));
  },

  savePresentMoment: async (text) => {
    const { presentMoments } = get();
    const newMoment: PresentMoment = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      text,
    };
    const updated = [newMoment, ...presentMoments];
    set({ presentMoments: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.presentMoments, JSON.stringify(updated));
  },

  clearSession: () =>
    set({
      emotion: null,
      dumpText: '',
      flowAnswers: {},
      currentResultType: null,
      currentResultMessage: '',
    }),

  incrementSessionCount: async () => {
    const next = get().sessionCount + 1;
    set({ sessionCount: next });
    await AsyncStorage.setItem(STORAGE_KEYS.sessionCount, String(next));
  },

  loadPersistedData: async () => {
    try {
      const [countStr, isProStr, isPremiumStr, sessionsStr, disclaimerStr, momentsStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.sessionCount),
        AsyncStorage.getItem(STORAGE_KEYS.isPro),
        AsyncStorage.getItem(STORAGE_KEYS.isPremium),
        AsyncStorage.getItem(STORAGE_KEYS.savedSessions),
        AsyncStorage.getItem(STORAGE_KEYS.disclaimerAccepted),
        AsyncStorage.getItem(STORAGE_KEYS.presentMoments),
      ]);

      set({
        sessionCount: countStr ? parseInt(countStr, 10) : 0,
        isPro: isProStr === 'true',
        isPremium: isPremiumStr === 'true',
        sessions: sessionsStr ? JSON.parse(sessionsStr) : [],
        disclaimerAccepted: disclaimerStr === 'true',
        presentMoments: momentsStr ? JSON.parse(momentsStr) : [],
      });
    } catch (_) {}
  },

  setIsPro: async (val) => {
    set({ isPro: val });
    await AsyncStorage.setItem(STORAGE_KEYS.isPro, String(val));
  },

  setIsPremium: async (val) => {
    set({ isPremium: val });
    await AsyncStorage.setItem(STORAGE_KEYS.isPremium, String(val));
  },

  acceptDisclaimer: async () => {
    set({ disclaimerAccepted: true });
    await AsyncStorage.setItem(STORAGE_KEYS.disclaimerAccepted, 'true');
  },
}));
