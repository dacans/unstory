import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { useI18nStore, useT } from '@/i18n';
import { SupportedLocale } from '@/i18n/translations';
import { Colors, FontNames, Spacing, Radius } from '@/constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const LOCALES: { id: SupportedLocale }[] = [
  { id: 'en' },
  { id: 'es' },
  { id: 'de' },
];

export default function LanguageSelectorSheet({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { locale, setLocale } = useI18nStore();
  const T = useT();

  const handleSelect = async (id: SupportedLocale) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setLocale(id);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Animated.View entering={FadeIn.duration(200)} style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {/* Sheet */}
        <Animated.View
          entering={SlideInDown.duration(350).springify()}
          style={[styles.sheet, { paddingBottom: insets.bottom + Spacing.md }]}
        >
          {/* Handle */}
          <View style={styles.handle} />

          <Text style={styles.title}>{T.language.title}</Text>

          <View style={styles.options}>
            {LOCALES.map(({ id }) => {
              const isSelected = locale === id;
              const label = T.language[id];
              return (
                <TouchableOpacity
                  key={id}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => handleSelect(id)}
                  activeOpacity={0.8}
                >
                  {isSelected && <View style={styles.optionBorderLeft} />}
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {label}
                  </Text>
                  {isSelected && (
                    <Feather name="check" size={18} color="#C8A97E" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.doneBtnText}>{T.language.done}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: FontNames.serif,
    fontSize: 22,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  options: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceHover,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    overflow: 'hidden',
    gap: Spacing.md,
  },
  optionSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.background,
  },
  optionBorderLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: Colors.accent,
  },
  optionLabel: {
    flex: 1,
    fontFamily: FontNames.sans,
    fontSize: 17,
    color: Colors.textPrimary,
  },
  optionLabelSelected: {
    color: Colors.accent,
    fontFamily: FontNames.sansMedium,
  },
  doneBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  doneBtnText: {
    fontFamily: FontNames.sansMedium,
    fontSize: 15,
    color: Colors.textSecondary,
  },
});
