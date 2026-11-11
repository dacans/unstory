import { useState } from 'react';
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
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { useSessionStore, Emotion } from '@/store/sessionStore';
import { useT } from '@/i18n';
import { Colors, FontNames, Spacing, Radius } from '@/constants/theme';

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

const EMOTION_IDS: { id: Emotion; icon: FeatherIconName }[] = [
  { id: 'overwhelmed', icon: 'wind' },
  { id: 'anxious', icon: 'zap' },
  { id: 'frustrated', icon: 'alert-circle' },
  { id: 'exhausted', icon: 'moon' },
  { id: 'stuck', icon: 'anchor' },
];

function EmotionCard({
  id,
  icon,
  label,
  subtitle,
  selected,
  onSelect,
  index,
}: {
  id: Emotion;
  icon: FeatherIconName;
  label: string;
  subtitle: string;
  selected: boolean;
  onSelect: () => void;
  index: number;
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.97, { duration: 100 }),
      withSpring(1, { duration: 150 })
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect();
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).duration(400)}
      style={animStyle}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={1}
        style={[styles.card, selected && styles.cardSelected]}
      >
        {selected && <View style={styles.selectedBorder} />}
        <View style={styles.cardContent}>
          <View style={styles.cardText}>
            <Text style={styles.cardLabel}>{label}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
          </View>
          <Feather name={icon} size={22} color={Colors.accent} style={styles.cardIcon} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function EmotionSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setEmotion, clearSession } = useSessionStore();
  const T = useT();
  const [selected, setSelected] = useState<Emotion | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    clearSession();
    setEmotion(selected);
    router.push('/dump');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: '20%' }]} />
      </View>

      <Animated.Text entering={FadeInDown.duration(400)} style={styles.question}>
        {T.emotion.question}
      </Animated.Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {EMOTION_IDS.map(({ id, icon }, index) => (
          <EmotionCard
            key={id}
            id={id}
            icon={icon}
            label={T.emotion.emotions[id].label}
            subtitle={T.emotion.emotions[id].subtitle}
            selected={selected === id}
            onSelect={() => setSelected(id)}
            index={index}
          />
        ))}
      </ScrollView>

      {selected && (
        <Animated.View
          entering={FadeInUp.duration(350)}
          style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}
        >
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueText}>{T.emotion.continue}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
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
  question: {
    fontFamily: FontNames.serif,
    fontSize: 30,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    lineHeight: 38,
  },
  scroll: {
    flex: 1,
  },
  list: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardSelected: {
    backgroundColor: Colors.surfaceHover,
    borderColor: Colors.accent,
  },
  selectedBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: Colors.accent,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  cardText: {
    flex: 1,
  },
  cardLabel: {
    fontFamily: FontNames.serif,
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: FontNames.sans,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  cardIcon: {
    marginLeft: Spacing.md,
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
  continueText: {
    fontFamily: FontNames.sansMedium,
    fontSize: 17,
    color: Colors.background,
  },
});
