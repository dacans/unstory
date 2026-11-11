import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSessionStore } from '@/store/sessionStore';
import { useT } from '@/i18n';
import { Colors, FontNames, Spacing, Radius } from '@/constants/theme';

const DURATION = 60; // seconds
const CIRCLE_SIZE = 220;
const STROKE = 6;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Progress ring: two rotating half-masks, no SVG ────────────────────
function ProgressRing({ secondsLeft }: { secondsLeft: number }) {
  const progress = 1 - secondsLeft / DURATION; // 0 = start, 1 = done
  const R = CIRCLE_SIZE / 2;
  const fullAngle = progress * 360;
  const right_angle = Math.min(fullAngle, 180);
  const left_angle = Math.max(0, fullAngle - 180);

  return (
    <View style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
      {/* Base dim ring */}
      <View
        style={{
          position: 'absolute',
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          borderRadius: R,
          borderWidth: STROKE,
          borderColor: Colors.border,
        }}
      />

      {/* Right half clip */}
      <View
        style={{
          position: 'absolute',
          width: R,
          height: CIRCLE_SIZE,
          right: 0,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: R,
            borderWidth: STROKE,
            borderColor: Colors.accent,
            right: 0,
            transform: [{ rotate: `${right_angle}deg` }],
          }}
        />
      </View>

      {/* Left half clip — only shown after 180° */}
      {fullAngle > 180 && (
        <View
          style={{
            position: 'absolute',
            width: R,
            height: CIRCLE_SIZE,
            left: 0,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: R,
              borderWidth: STROKE,
              borderColor: Colors.accent,
              left: 0,
              transform: [{ rotate: `${left_angle - 180}deg` }],
            }}
          />
        </View>
      )}

      {/* Inner fill — creates the ring effect */}
      <View
        style={{
          position: 'absolute',
          top: STROKE,
          left: STROKE,
          width: CIRCLE_SIZE - STROKE * 2,
          height: CIRCLE_SIZE - STROKE * 2,
          borderRadius: R - STROKE,
          backgroundColor: Colors.background,
        }}
      />

      {/* Seconds label in center */}
      <View style={styles.secondsContainer}>
        <Text style={styles.secondsText}>{secondsLeft}</Text>
      </View>
    </View>
  );
}

export default function PresentMomentScreen() {
  const router = useRouter();
  const T = useT();
  const { savePresentMoment } = useSessionStore();

  const [secondsLeft, setSecondsLeft] = useState(DURATION);
  const [phase, setPhase] = useState<'timer' | 'input'>('timer');
  const [noticeText, setNoticeText] = useState('');

  const timerOpacity = useSharedValue(1);
  const inputTranslateY = useSharedValue(80);
  const inputOpacity = useSharedValue(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const enterInput = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    timerOpacity.value = withTiming(0, { duration: 600 });
    inputTranslateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });
    inputOpacity.value = withTiming(1, { duration: 500 });
    setPhase('input');
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;

        // Haptic pulse every 15 seconds
        const elapsed = DURATION - next;
        if (elapsed > 0 && elapsed % 15 === 0 && elapsed !== DURATION) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        if (next <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          runOnJS(enterInput)();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enterInput]);

  const timerStyle = useAnimatedStyle(() => ({
    opacity: timerOpacity.value,
  }));

  const inputStyle = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
    transform: [{ translateY: inputTranslateY.value }],
  }));

  const handleSave = async () => {
    if (!noticeText.trim()) return;
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await savePresentMoment(noticeText.trim());
    router.replace('/');
  };

  const handleSkip = () => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.kavContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.inner}>

            {/* ── Timer phase (absolute overlay, fades out) ── */}
            <Animated.View
              style={[styles.timerPhase, timerStyle]}
              pointerEvents={phase === 'timer' ? 'auto' : 'none'}
            >
              <View style={styles.timerCenter}>
                <Animated.View entering={FadeIn.duration(600)}>
                  <ProgressRing secondsLeft={secondsLeft} />
                </Animated.View>
                <Animated.Text
                  entering={FadeIn.duration(800).delay(300)}
                  style={styles.timerLabel}
                >
                  {T?.presentMoment?.timerLabel ?? ''}
                </Animated.Text>
              </View>
            </Animated.View>

            {/* ── Input phase (slides up after timer) ── */}
            <Animated.View
              style={[styles.inputPhase, inputStyle]}
              pointerEvents={phase === 'input' ? 'auto' : 'none'}
            >
              {/* TOP — question */}
              <Text style={styles.noticePrompt}>{T?.presentMoment?.noticePrompt ?? ''}</Text>

              {/* MIDDLE — text input */}
              <TextInput
                style={styles.textInput}
                placeholder={T?.presentMoment?.noticePlaceholder ?? ''}
                placeholderTextColor={Colors.textMuted}
                value={noticeText}
                onChangeText={setNoticeText}
                multiline
                selectionColor={Colors.accent}
                textAlignVertical="top"
              />

              {/* BOTTOM — buttons */}
              <View style={styles.inputButtons}>
                <TouchableOpacity
                  style={[styles.saveBtn, !noticeText.trim() && styles.saveBtnDisabled]}
                  onPress={handleSave}
                  activeOpacity={0.85}
                  disabled={!noticeText.trim()}
                >
                  <Text style={styles.saveBtnText}>{T?.presentMoment?.saveBtn ?? ''}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.7}>
                  <Text style={styles.skipBtnText}>{T?.presentMoment?.skipBtn ?? ''}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D0D0F',
  },
  kavContainer: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
  },

  // ── Timer phase ───────────────────────────────────────────────
  timerPhase: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  timerCenter: {
    alignItems: 'center',
    gap: Spacing.xxl,
  },
  secondsContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondsText: {
    fontFamily: FontNames.serif,
    fontSize: 56,
    color: Colors.textPrimary,
    lineHeight: 64,
  },
  timerLabel: {
    fontFamily: FontNames.sans,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: SCREEN_WIDTH - 80,
  },

  // ── Input phase ───────────────────────────────────────────────
  inputPhase: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
  },
  noticePrompt: {
    fontFamily: FontNames.serif,
    fontSize: 28,
    color: Colors.textPrimary,
    lineHeight: 38,
  },
  textInput: {
    flex: 1,
    fontFamily: FontNames.sans,
    fontSize: 16,
    color: '#F0EDE8',
    lineHeight: 26,
    minHeight: 120,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: '#2A2A30',
    borderRadius: Radius.md,
    textAlignVertical: 'top',
  },
  inputButtons: {
    gap: Spacing.sm,
  },
  saveBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.45,
  },
  saveBtnText: {
    fontFamily: FontNames.sansMedium,
    fontSize: 17,
    color: Colors.background,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  skipBtnText: {
    fontFamily: FontNames.sans,
    fontSize: 15,
    color: Colors.textMuted,
  },
});
