import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  DMSerifDisplay_400Regular,
} from '@expo-google-fonts/dm-serif-display';
import {
  DMSans_400Regular,
  DMSans_500Medium,
} from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { useSessionStore } from '@/store/sessionStore';
import { useI18nStore } from '@/i18n';
import DisclaimerModal from '@/components/modals/DisclaimerModal';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const loadPersistedData = useSessionStore((s) => s.loadPersistedData);
  const disclaimerAccepted = useSessionStore((s) => s.disclaimerAccepted);
  const setIsPremium = useSessionStore((s) => s.setIsPremium);
  const initI18n = useI18nStore((s) => s.init);
  const i18nReady = useI18nStore((s) => s.ready);

  const [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
    DMSans_400Regular,
    DMSans_500Medium,
  });

  useEffect(() => {
    Promise.all([loadPersistedData(), initI18n()]);
  }, []);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      Purchases.configure({ apiKey: 'appl_kQQsZFsNYSLvJeaQTUgRpMDGYyC' });
      console.log('[RevenueCat] Initialized successfully');

      // Sync premium status from RevenueCat on app start
      Purchases.getCustomerInfo()
        .then((customerInfo) => {
          const premium = !!customerInfo?.entitlements?.active?.['Unstory Pro'];
          setIsPremium(premium);
          console.log('[RevenueCat] isPremium:', premium);
        })
        .catch((e) => {
          console.log('[RevenueCat] Error:', e);
        });
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded && i18nReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, i18nReady]);

  if (!fontsLoaded || !i18nReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#0D0D0F' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="emotion" />
        <Stack.Screen name="dump" />
        <Stack.Screen name="flow" />
        <Stack.Screen name="result" />
        <Stack.Screen name="history" />
        <Stack.Screen name="paywall" />
      </Stack>

      {/* First-launch disclaimer — shown above the entire navigator */}
      <DisclaimerModal visible={!disclaimerAccepted} />
    </GestureHandlerRootView>
  );
}
