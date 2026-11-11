import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { useSessionStore } from '@/store/sessionStore';
import { useT, useI18nStore } from '@/i18n';
import LanguageSelectorSheet from '@/components/modals/LanguageSelectorSheet';
import { Colors, FontNames, Spacing, Radius } from '@/constants/theme';
import { seedDemoData } from '@/utils/seedDemoData';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { sessionCount, isPro, isPremium } = useSessionStore();
  const T = useT();
  const [langVisible, setLangVisible] = useState(false);
  const [demoToast, setDemoToast] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHeadingTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 2000);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      if (tapTimer.current) clearTimeout(tapTimer.current);
      const lang = useI18nStore.getState().locale;
      seedDemoData(lang).then(() => {
        setDemoToast(true);
        setTimeout(() => setDemoToast(false), 2000);
      });
    }
  };

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!isPro && !isPremium && sessionCount >= 5) {
      router.push('/paywall');
    } else {
      router.push('/emotion');
    }
  };

  const handleMoments = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isPremium) {
      router.push('/present-moment');
    } else {
      router.push('/paywall');
    }
  };

  const handleHistory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/history');
  };

  const handleLanguage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLangVisible(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLanguage} style={styles.iconBtn}>
          <Feather name="globe" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleHistory} style={styles.iconBtn}>
          <Feather name="clock" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Center — vertically centered */}
      <Animated.View entering={FadeIn.duration(700).delay(100)} style={styles.center}>
        <TouchableOpacity onPress={handleHeadingTap} activeOpacity={1}>
          <Text
            style={styles.heading}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            numberOfLines={3}
          >
            {T.home.heading}
          </Text>
        </TouchableOpacity>
        <View style={styles.gap} />
        <Text style={styles.subtext}>{T.home.subtext}</Text>
        {demoToast && <Text style={styles.demoToast}>✓ Demo loaded</Text>}
      </Animated.View>

      {/* Bottom — pinned above safe area */}
      <Animated.View entering={FadeIn.duration(700).delay(250)} style={styles.bottom}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleStart}
          activeOpacity={0.85}
        >
          <Text
            style={styles.ctaText}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            numberOfLines={1}
          >
            {T.home.cta}
          </Text>
        </TouchableOpacity>
        <View style={styles.gap16} />
        <TouchableOpacity
          style={styles.momentsButton}
          onPress={handleMoments}
          activeOpacity={0.8}
        >
          <Feather name="sun" size={16} color="#C8A97E" />
          <Text style={styles.momentsText}>{T.home.momentsButton}</Text>
        </TouchableOpacity>
        <View style={styles.gap12} />
        <Text style={styles.disclaimerLine}>{T.home.disclaimerLine}</Text>
      </Animated.View>

      <LanguageSelectorSheet visible={langVisible} onClose={() => setLangVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0F',
    paddingHorizontal: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  iconBtn: {
    padding: Spacing.xs,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    fontFamily: FontNames.serif,
    fontSize: 36,
    color: '#F0EDE8',
    lineHeight: 46,
  },
  gap: {
    height: 16,
  },
  gap12: {
    height: 12,
  },
  subtext: {
    fontFamily: FontNames.sans,
    fontSize: 16,
    color: '#8A8780',
    lineHeight: 24,
  },
  bottom: {
    paddingBottom: Spacing.sm,
  },
  ctaButton: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  ctaText: {
    fontFamily: FontNames.sansMedium,
    fontSize: 17,
    color: '#0D0D0F',
    letterSpacing: 0.3,
  },
  demoToast: {
    fontFamily: FontNames.sans,
    fontSize: 12,
    color: Colors.accent,
    marginTop: 8,
  },
  gap16: {
    height: 16,
  },
  momentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(200, 169, 126, 0.35)',
    paddingVertical: 14,
    gap: 8,
  },
  momentsText: {
    fontFamily: FontNames.sans,
    fontSize: 15,
    color: '#C8A97E',
  },
  disclaimerLine: {
    fontFamily: FontNames.sans,
    fontSize: 11,
    color: '#8A8780',
    textAlign: 'left',
    lineHeight: 16,
  },
});
