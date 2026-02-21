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
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useSessionStore } from '@/store/sessionStore';
import { useT } from '@/i18n';
import { Colors, FontNames, Spacing, Radius } from '@/constants/theme';

export default function DumpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { emotion, dumpText, setDumpText } = useSessionStore();
  const T = useT();
  const inputRef = useRef<TextInput>(null);
  const [localText, setLocalText] = useState(dumpText);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (text: string) => {
    setLocalText(text);
    setDumpText(text);
  };

  const handleContinue = () => {
    if (localText.trim().length < 20) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/flow');
  };

  const prompt = emotion ? T.dump.prompts[emotion] : null;
  const canContinue = localText.trim().length >= 20;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '40%' }]} />
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Animated.Text entering={FadeInDown.duration(400)} style={styles.question}>
            {T.dump.question}
          </Animated.Text>

          {prompt && (
            <Animated.Text entering={FadeInDown.delay(150).duration(400)} style={styles.prompt}>
              {prompt}
            </Animated.Text>
          )}

          <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.inputWrap}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              multiline
              placeholder={T.dump.placeholder}
              placeholderTextColor={Colors.textMuted}
              value={localText}
              onChangeText={handleChange}
              textAlignVertical="top"
              scrollEnabled={false}
              autoCorrect={false}
            />
            <Text style={styles.charCount}>{localText.length}</Text>
          </Animated.View>
        </ScrollView>

        <Animated.View
          entering={FadeInUp.delay(300).duration(400)}
          style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}
        >
          <TouchableOpacity
            style={[styles.continueBtn, !canContinue && styles.continueBtnDisabled]}
            onPress={handleContinue}
            disabled={!canContinue}
            activeOpacity={0.85}
          >
            <Text style={[styles.continueText, !canContinue && styles.continueTextDisabled]}>
              {T.dump.continue}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  backText: {
    fontSize: 22,
    color: Colors.textSecondary,
  },
  progressTrack: {
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  question: {
    fontFamily: FontNames.serif,
    fontSize: 30,
    color: Colors.textPrimary,
    lineHeight: 38,
    marginBottom: Spacing.sm,
  },
  prompt: {
    fontFamily: FontNames.sans,
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    fontStyle: 'italic',
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    fontFamily: FontNames.sans,
    fontSize: 17,
    color: Colors.textPrimary,
    minHeight: 200,
    lineHeight: 28,
    paddingBottom: Spacing.xxl,
  },
  charCount: {
    position: 'absolute',
    bottom: Spacing.md,
    right: 0,
    fontFamily: FontNames.sans,
    fontSize: 12,
    color: Colors.textMuted,
  },
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
  continueBtnDisabled: {
    backgroundColor: Colors.surface,
  },
  continueText: {
    fontFamily: FontNames.sansMedium,
    fontSize: 17,
    color: Colors.background,
  },
  continueTextDisabled: {
    color: Colors.textMuted,
  },
});
