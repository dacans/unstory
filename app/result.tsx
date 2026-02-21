import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useSessionStore } from '@/store/sessionStore';
import { useT } from '@/i18n';
import { Colors, FontNames, Spacing, Radius } from '@/constants/theme';

export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const T = useT();
  const {
    emotion,
    dumpText,
    currentResultType,
    currentResultMessage,
    saveSession,
    clearSession,
  } = useSessionStore();

  const isRelease = currentResultType === 'released';

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

  const handleLetGo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    clearSession();
    router.replace('/');
  };

  const quote = emotion ? T.result.quotes[emotion] : null;
  const resultTypeLabel =
    currentResultType === 'acted' ? T.result.labelActed : T.result.labelResting;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
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

        {quote && (
          <Animated.View
            entering={FadeInDown.duration(500).delay(isRelease ? 1800 : 600)}
            style={styles.quoteBlock}
          >
            <View style={styles.quoteDivider} />
            <Text style={styles.quoteText}>"{quote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {quote.author}</Text>
          </Animated.View>
        )}
      </ScrollView>

      <Animated.View
        entering={FadeInDown.duration(500).delay(isRelease ? 2000 : 800)}
        style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}
      >
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>{T.result.saveBtn}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.letGoBtn} onPress={handleLetGo} activeOpacity={0.85}>
          <Text style={styles.letGoBtnText}>{T.result.letGoBtn}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xxl },
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
    marginBottom: Spacing.xl,
  },
  quoteBlock: { marginTop: Spacing.xl },
  quoteDivider: { height: 1, backgroundColor: Colors.border, marginBottom: Spacing.xl },
  quoteText: {
    fontFamily: FontNames.sans,
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  quoteAuthor: { fontFamily: FontNames.sansMedium, fontSize: 13, color: Colors.textMuted },
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  saveBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveBtnText: { fontFamily: FontNames.sansMedium, fontSize: 17, color: Colors.background },
  letGoBtn: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.danger,
    paddingVertical: 18,
    alignItems: 'center',
  },
  letGoBtnText: { fontFamily: FontNames.sansMedium, fontSize: 17, color: Colors.danger },
});
