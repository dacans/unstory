import { Colors, FontNames, Radius, Spacing } from '@/constants/theme';
import { useT } from '@/i18n';
import { Emotion, useSessionStore } from '@/store/sessionStore';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

function getQuoteGroupKey(emotion: Emotion | null): 'restSimplicity' | 'actionCourage' | 'acceptanceControl' {
  if (emotion === 'overwhelmed' || emotion === 'exhausted') return 'restSimplicity';
  if (emotion === 'anxious' || emotion === 'stuck') return 'actionCourage';
  return 'acceptanceControl';
}

export default function ResultScreen() {
  const router = useRouter();
  const T = useT();
  const {
    emotion,
    dumpText,
    currentResultType,
    currentResultMessage,
    saveSession,
    clearSession,
    isPro,
  } = useSessionStore();

  const isRelease = currentResultType === 'released';

  const quote = useMemo(() => {
    const groupKey = getQuoteGroupKey(emotion);
    const group = (T?.result?.quoteGroups ?? {})[groupKey] ?? [];
    return group[Math.floor(Math.random() * group.length)] ?? { text: '', author: '' };
  }, [emotion, T]);

  const releaseOpacity = useSharedValue(isRelease ? 1 : 0);
  const releaseTranslateY = useSharedValue(0);

  const releaseStyle = useAnimatedStyle(() => ({
    opacity: releaseOpacity.value,
    transform: [{ translateY: releaseTranslateY.value }],
  }));

  useEffect(() => {
    if (isRelease) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      releaseTranslateY.value = withDelay(600, withTiming(-200, { duration: 1200 }));
      releaseOpacity.value = withDelay(600, withTiming(0, { duration: 1200 }));
    }
  }, [isRelease]);

  const handleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await saveSession();
    clearSession();
    router.replace('/');
  };

  const handleLetGo = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await clearSession();
    router.replace('/');
  };

  const handlePresentMoment = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!isPro) {
      router.push('/paywall?from=present-moment');
    } else {
      router.push('/present-moment');
    }
  };

  const resultTypeLabel =
    currentResultType === 'acted' ? T.result.labelActed : T.result.labelResting;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Result message */}
        {isRelease ? (
          <Animated.View entering={FadeIn.duration(600)} style={styles.releaseSection}>
            <Text style={styles.releaseLabel}>{T.result.releaseLabel}</Text>
            <Animated.Text style={[styles.releaseText, releaseStyle]}>
              {dumpText}
            </Animated.Text>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.duration(500).delay(200)}>
            <Text style={styles.resultTypeLabel}>{resultTypeLabel}</Text>
            <Text style={styles.resultMessage}>{currentResultMessage}</Text>
          </Animated.View>
        )}

        {/* 2. Separator */}
        <View style={styles.divider} />

        {/* 3. "One more thing" card */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(isRelease ? 2200 : 1000)}
          style={styles.teaserCard}
        >
          <Text style={styles.teaserHeading}>{T?.presentMoment?.resultTeaser ?? ''}</Text>
          <Text style={styles.teaserSub}>{T?.presentMoment?.resultTeaserSub ?? ''}</Text>
          <TouchableOpacity
            style={styles.teaserBtn}
            onPress={handlePresentMoment}
            activeOpacity={0.85}
          >
            <Text style={styles.teaserBtnText}>{T?.presentMoment?.readyBtn ?? ''}</Text>
          </TouchableOpacity>
          <Text style={styles.teaserHint}>{T?.presentMoment?.teaserHint ?? ''}</Text>
        </Animated.View>

        {/* 4. Separator */}
        <View style={styles.divider} />

        {/* 5. Stoic quote */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(isRelease ? 1800 : 600)}
          style={styles.quoteBlock}
        >
          <Text style={styles.quoteText}>"{quote.text}"</Text>
          <Text style={styles.quoteAuthor}>— {quote.author}</Text>
        </Animated.View>

        {/* 6 & 7. Save / Let it go */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(isRelease ? 2000 : 800)}
          style={styles.buttonsSection}
        >
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>{T.result.saveBtn}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.letGoBtn} onPress={handleLetGo} activeOpacity={0.85}>
            <Text style={styles.letGoBtnText}>{T.result.letGoBtn}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: 80,
  },

  // ── Release section ───────────────────────────────────────────
  releaseSection: { alignItems: 'center', paddingTop: Spacing.xxl },
  releaseLabel: {
    fontFamily: FontNames.serif,
    fontSize: 36,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  releaseText: {
    fontFamily: FontNames.sans,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
  },

  // ── Result message ────────────────────────────────────────────
  resultTypeLabel: {
    fontFamily: FontNames.sans,
    fontSize: 13,
    color: Colors.accent,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },
  resultMessage: {
    fontFamily: FontNames.serif,
    fontSize: 30,
    color: Colors.textPrimary,
    lineHeight: 42,
  },

  // ── Separator ─────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: '#2A2A30',
    marginVertical: Spacing.xl,
  },

  // ── "One more thing" card ─────────────────────────────────────
  teaserCard: {
    backgroundColor: '#1A1A1F',
    borderRadius: 16,
    padding: 24,
    marginVertical: 0,
    borderTopWidth: 2,
    borderTopColor: '#C8A97E',
    shadowColor: '#C8A97E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  teaserHeading: {
    fontFamily: FontNames.serif,
    fontSize: 22,
    color: '#C8A97E',
    marginBottom: 8,
  },
  teaserSub: {
    fontFamily: FontNames.sans,
    fontSize: 15,
    color: '#8A8780',
    lineHeight: 22,
    marginBottom: 20,
  },
  teaserBtn: {
    backgroundColor: '#C8A97E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    marginTop: 4,
  },
  teaserBtnText: {
    fontFamily: FontNames.sansMedium,
    fontSize: 17,
    color: Colors.background,
  },
  teaserHint: {
    fontFamily: FontNames.sans,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
  },

  // ── Stoic quote ───────────────────────────────────────────────
  quoteBlock: {
    marginBottom: Spacing.xl,
  },
  quoteText: {
    fontFamily: FontNames.sans,
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  quoteAuthor: {
    fontFamily: FontNames.sansMedium,
    fontSize: 13,
    color: Colors.textMuted,
  },

  // ── Action buttons ────────────────────────────────────────────
  buttonsSection: {
    gap: Spacing.sm,
  },
  saveBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveBtnText: {
    fontFamily: FontNames.sansMedium,
    fontSize: 17,
    color: Colors.background,
  },
  letGoBtn: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.danger,
    paddingVertical: 18,
    alignItems: 'center',
  },
  letGoBtnText: {
    fontFamily: FontNames.sansMedium,
    fontSize: 17,
    color: Colors.danger,
  },
});
