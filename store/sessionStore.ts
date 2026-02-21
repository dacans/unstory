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

interface SessionStore {
  emotion: Emotion | null;
  dumpText: string;
  flowAnswers: Record<string, string>;
  sessionCount: number;
  isPro: boolean;
  disclaimerAccepted: boolean;
  sessions: SavedSession[];
  currentResultType: ResultType | null;
  currentResultMessage: string;

  setEmotion: (e: Emotion) => void;
  setDumpText: (t: string) => void;
  setFlowAnswer: (key: string, value: string) => void;
  setResultType: (type: ResultType, message: string) => void;
  saveSession: () => Promise<void>;
  clearSession: () => void;
  incrementSessionCount: () => Promise<void>;
  loadPersistedData: () => Promise<void>;
  setIsPro: (val: boolean) => Promise<void>;
  acceptDisclaimer: () => Promise<void>;
}

const STORAGE_KEYS = {
  sessionCount: 'session_count',
  isPro: 'is_pro',
  savedSessions: 'saved_sessions',
  disclaimerAccepted: 'disclaimer_accepted',
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  emotion: null,
  dumpText: '',
  flowAnswers: {},
  sessionCount: 0,
  isPro: false,
  disclaimerAccepted: false,
  sessions: [],
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
      const [countStr, isProStr, sessionsStr, disclaimerStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.sessionCount),
        AsyncStorage.getItem(STORAGE_KEYS.isPro),
        AsyncStorage.getItem(STORAGE_KEYS.savedSessions),
        AsyncStorage.getItem(STORAGE_KEYS.disclaimerAccepted),
      ]);

      set({
        sessionCount: countStr ? parseInt(countStr, 10) : 0,
        isPro: isProStr === 'true',
        sessions: sessionsStr ? JSON.parse(sessionsStr) : [],
        disclaimerAccepted: disclaimerStr === 'true',
      });
    } catch (_) {}
  },

  setIsPro: async (val) => {
    set({ isPro: val });
    await AsyncStorage.setItem(STORAGE_KEYS.isPro, String(val));
  },

  acceptDisclaimer: async () => {
    set({ disclaimerAccepted: true });
    await AsyncStorage.setItem(STORAGE_KEYS.disclaimerAccepted, 'true');
  },
}));
