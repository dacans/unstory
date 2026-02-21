import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  FadeIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useSessionStore } from '@/store/sessionStore';
import { useT } from '@/i18n';
import LanguageSelectorSheet from '@/components/modals/LanguageSelectorSheet';
import { Colors, FontNames, Spacing, Radius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { sessionCount, isPro } = useSessionStore();
  const T = useT();
  const [langVisible, setLangVisible] = useState(false);

  const glowOpacity = useSharedValue(0.3);
  const tooltipOpacity = useSharedValue(1);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 4000 }),
        withTiming(0.3, { duration: 4000 })
      ),
      -1,
      false
    );

    tooltipTimer.current = setTimeout(() => {
      tooltipOpacity.value = withTiming(0, { duration: 600 });
    }, 3000);

    return () => { if (tooltipTimer.current) clearTimeout(tooltipTimer.current); };
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const tooltipStyle = useAnimatedStyle(() => ({
    opacity: tooltipOpacity.value,
  }));

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!isPro && sessionCount >= 5) {
      router.push('/paywall');
    } else {
      router.push('/emotion');
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
      {/* Animated glow */}
      <Animated.View style={[styles.glow, glowStyle]} pointerEvents="none" />

      {/* Header: globe (left) + history (right) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLanguage} style={styles.iconBtn}>
          <Text style={styles.iconText}>🌐</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleHistory} style={styles.iconBtn}>
          <Text style={styles.iconText}>◷</Text>
        </TouchableOpacity>
      </View>

      {/* Center */}
      <Animated.View entering={FadeIn.duration(800).delay(200)} style={styles.center}>
        <Text style={styles.heading}>{T.home.heading}</Text>
        <Text style={styles.subtext}>{T.home.subtext}</Text>

        <Animated.View style={[styles.tooltip, tooltipStyle]}>
          <Text style={styles.tooltipText}>{T.home.tooltip}</Text>
        </Animated.View>
      </Animated.View>

      {/* Bottom */}
      <Animated.View entering={FadeIn.duration(800).delay(400)} style={styles.bottom}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleStart}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>{T.home.cta}</Text>
        </TouchableOpacity>
        <Text style={styles.proText}>{T.home.proText}</Text>
        <Text style={styles.disclaimerLine}>{T.home.disclaimerLine}</Text>
      </Animated.View>

      <LanguageSelectorSheet visible={langVisible} onClose={() => setLangVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
  },
  glow: {
    position: 'absolute',
    width: width * 1.2,
    height: height * 0.6,
    top: height * 0.1,
    left: -width * 0.1,
    borderRadius: width,
    backgroundColor: Colors.accent,
    transform: [{ scaleY: 0.4 }],
    filter: [{ blur: 80 }],
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
  iconText: {
    fontSize: 22,
    color: Colors.textSecondary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    fontFamily: FontNames.serif,
    fontSize: 42,
    color: Colors.textPrimary,
    lineHeight: 52,
    marginBottom: Spacing.md,
  },
  subtext: {
    fontFamily: FontNames.sans,
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  tooltip: {
    marginTop: Spacing.xxl,
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tooltipText: {
    fontFamily: FontNames.sans,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bottom: {
    paddingBottom: Spacing.sm,
    gap: Spacing.md,
  },
  ctaButton: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: FontNames.sansMedium,
    fontSize: 17,
    color: Colors.background,
    letterSpacing: 0.3,
  },
  proText: {
    fontFamily: FontNames.sans,
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  disclaimerLine: {
    fontFamily: FontNames.sans,
    fontSize: 11,
    color: '#8A8780',
    textAlign: 'center',
    lineHeight: 16,
    paddingBottom: Spacing.xs,
  },
});
