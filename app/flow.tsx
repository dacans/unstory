import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useSessionStore, Emotion } from '@/store/sessionStore';
import { useT, TranslationKeys } from '@/i18n';
import { Colors, FontNames, Spacing, Radius } from '@/constants/theme';

// ─── Step type ───────────────────────────────────────────────────────────────

type StepType = 'text' | 'choice';

interface Step {
  key: string;
  question: string;
  type: StepType;
  choices?: string[];
  placeholder?: string;
  // branch: choiceIndex -> destination ('release' triggers early exit)
  branchByIndex?: Record<number, 'release'>;
}

// ─── Build steps from translations ───────────────────────────────────────────

function buildSteps(T: TranslationKeys, emotion: Emotion): Step[] {
  const f = T.flow;
  switch (emotion) {
    case 'overwhelmed':
      return [
        { key: 'count',  type: 'text',   question: f.overwhelmed.q1, placeholder: f.overwhelmed.q1_placeholder },
        { key: 'urgent', type: 'text',   question: f.overwhelmed.q2, placeholder: f.overwhelmed.q2_placeholder },
        { key: 'wait',   type: 'choice', question: f.overwhelmed.q3, choices: [...f.overwhelmed.q3_choices] },
      ];
    case 'anxious':
      return [
        { key: 'worst',      type: 'text',   question: f.anxious.q1, placeholder: f.anxious.q1_placeholder },
        // choices[1] = 'No' equivalent — branch to release
        { key: 'actionable', type: 'choice', question: f.anxious.q2, choices: [...f.anxious.q2_choices], branchByIndex: { 1: 'release' } },
        { key: 'one_step',   type: 'text',   question: f.anxious.q3, placeholder: f.anxious.q3_placeholder },
      ];
    case 'frustrated':
      return [
        { key: 'expected', type: 'text',   question: f.frustrated.q1, placeholder: f.frustrated.q1_placeholder },
        { key: 'happened', type: 'text',   question: f.frustrated.q2, placeholder: f.frustrated.q2_placeholder },
        // choices[2] = 'No' equivalent — branch to release
        { key: 'control',  type: 'choice', question: f.frustrated.q3, choices: [...f.frustrated.q3_choices], branchByIndex: { 2: 'release' } },
      ];
    case 'exhausted':
      return [
        { key: 'last_rest',   type: 'text', question: f.exhausted.q1, placeholder: f.exhausted.q1_placeholder },
        { key: 'blocking',    type: 'text', question: f.exhausted.q2, placeholder: f.exhausted.q2_placeholder },
        { key: 'consequence', type: 'text', question: f.exhausted.q3, placeholder: f.exhausted.q3_placeholder },
      ];
    case 'stuck':
      return [
        { key: 'avoiding',   type: 'text', question: f.stuck.q1, placeholder: f.stuck.q1_placeholder },
        { key: 'fear',       type: 'text', question: f.stuck.q2, placeholder: f.stuck.q2_placeholder },
        { key: 'small_step', type: 'text', question: f.stuck.q3, placeholder: f.stuck.q3_placeholder },
      ];
  }
}

// ─── Result builders ─────────────────────────────────────────────────────────

function buildResult(
  emotion: Emotion,
  answers: Record<string, string>,
  T: TranslationKeys
): { message: string; resultType: 'acted' | 'released' | 'resting' } {
  const m = T.result.messages;
  switch (emotion) {
    case 'overwhelmed':
      return { message: `${m.overwhelmed}\n\n"${answers.urgent}"`, resultType: 'acted' };
    case 'anxious':
      // If branched to release this won't be called; fallback:
      return { message: `${m.anxious_acted}\n\n"${answers.one_step}"`, resultType: 'acted' };
    case 'frustrated': {
      const steps = buildSteps(T, 'frustrated');
      const controlStep = steps[2];
      // 'Partly' = index 1
      if (controlStep.choices && answers.control === controlStep.choices[1]) {
        return { message: m.frustrated_resting, resultType: 'resting' };
      }
      return { message: m.frustrated_acted, resultType: 'acted' };
    }
    case 'exhausted':
      return { message: m.exhausted, resultType: 'resting' };
    case 'stuck':
      return { message: `${m.stuck}\n\n"${answers.small_step}"`, resultType: 'acted' };
  }
}

// ─── ChoiceButton ────────────────────────────────────────────────────────────

function ChoiceButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(0.97, { duration: 80 }, () => {
      scale.value = withSpring(1, { duration: 120 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={1}
        style={[styles.choiceBtn, selected && styles.choiceBtnSelected]}
      >
        {selected && <View style={styles.choiceBorderLeft} />}
        <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function FlowScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const T = useT();
  const { emotion, setFlowAnswer, flowAnswers, setResultType, incrementSessionCount } =
    useSessionStore();

  const steps = emotion ? buildSteps(T, emotion) : [];
  const [stepIndex, setStepIndex] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>({});
  // Track choice index separately for branching
  const [choiceIndexMap, setChoiceIndexMap] = useState<Record<string, number>>({});
  const inputRef = useRef<TextInput>(null);

  const currentStep = steps[stepIndex];
  const totalSteps = steps.length;
  const progress = `${Math.round(((stepIndex + 1) / (totalSteps + 2)) * 100)}%`;

  useEffect(() => {
    if (currentStep?.type === 'text') {
      const timer = setTimeout(() => inputRef.current?.focus(), 400);
      return () => clearTimeout(timer);
    }
  }, [stepIndex]);

  const currentAnswer = localAnswers[currentStep?.key] ?? '';
  const canProceed =
    currentStep?.type === 'text'
      ? currentAnswer.trim().length > 0
      : currentAnswer.length > 0;

  const handleAnswer = (value: string, choiceIndex?: number) => {
    setLocalAnswers((prev) => ({ ...prev, [currentStep.key]: value }));
    if (choiceIndex !== undefined) {
      setChoiceIndexMap((prev) => ({ ...prev, [currentStep.key]: choiceIndex }));
    }
  };

  const handleNext = () => {
    if (!canProceed || !currentStep) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const updatedAnswers = { ...localAnswers, [currentStep.key]: currentAnswer };
    setFlowAnswer(currentStep.key, currentAnswer);

    // Branch by index for locale-safe choice branching
    if (currentStep.branchByIndex) {
      const choiceIdx = choiceIndexMap[currentStep.key];
      if (choiceIdx !== undefined && currentStep.branchByIndex[choiceIdx] === 'release') {
        setResultType('released', '');
        incrementSessionCount();
        router.push('/result');
        return;
      }
    }

    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      const allAnswers = { ...flowAnswers, ...updatedAnswers };
      const { message, resultType } = buildResult(emotion!, allAnswers, T);
      setResultType(resultType, message);
      incrementSessionCount();
      router.push('/result');
    }
  };

  if (!emotion || !currentStep) {
    router.replace('/');
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => {
            if (stepIndex > 0) setStepIndex((i) => i - 1);
            else router.back();
          }}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progress as `${number}%` }]} />
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Animated.Text
            key={`q-${stepIndex}`}
            entering={FadeInDown.duration(400)}
            exiting={FadeOut.duration(200)}
            style={styles.question}
          >
            {currentStep.question}
          </Animated.Text>

          <Animated.View
            key={`a-${stepIndex}`}
            entering={FadeInDown.delay(120).duration(400)}
          >
            {currentStep.type === 'text' ? (
              <TextInput
                ref={inputRef}
                style={styles.textInput}
                multiline
                placeholder={currentStep.placeholder}
                placeholderTextColor={Colors.textMuted}
                value={currentAnswer}
                onChangeText={(v) => handleAnswer(v)}
                textAlignVertical="top"
                scrollEnabled={false}
                autoCorrect={false}
              />
            ) : (
              <View style={styles.choices}>
                {currentStep.choices?.map((choice, idx) => (
                  <ChoiceButton
                    key={idx}
                    label={choice}
                    selected={currentAnswer === choice}
                    onPress={() => handleAnswer(choice, idx)}
                  />
                ))}
              </View>
            )}
          </Animated.View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
          <TouchableOpacity
            style={[styles.continueBtn, !canProceed && styles.continueBtnDisabled]}
            onPress={handleNext}
            disabled={!canProceed}
            activeOpacity={0.85}
          >
            <Text style={[styles.continueText, !canProceed && styles.continueTextDisabled]}>
              {stepIndex < steps.length - 1 ? T.flow.continue : T.flow.seeResult}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  backBtn: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm },
  backText: { fontSize: 22, color: Colors.textSecondary },
  progressTrack: {
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.accent, borderRadius: Radius.full },
  content: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  question: {
    fontFamily: FontNames.serif,
    fontSize: 28,
    color: Colors.textPrimary,
    lineHeight: 38,
    marginBottom: Spacing.xl,
  },
  textInput: {
    fontFamily: FontNames.sans,
    fontSize: 17,
    color: Colors.textPrimary,
    minHeight: 160,
    lineHeight: 28,
  },
  choices: { gap: Spacing.sm },
  choiceBtn: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    overflow: 'hidden',
  },
  choiceBtnSelected: { backgroundColor: Colors.surfaceHover, borderColor: Colors.accent },
  choiceBorderLeft: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 3,
    backgroundColor: Colors.accent,
  },
  choiceText: { fontFamily: FontNames.sans, fontSize: 17, color: Colors.textPrimary },
  choiceTextSelected: { color: Colors.accent },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  continueBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
  },
  continueBtnDisabled: { backgroundColor: Colors.surface },
  continueText: { fontFamily: FontNames.sansMedium, fontSize: 17, color: Colors.background },
  continueTextDisabled: { color: Colors.textMuted },
});
