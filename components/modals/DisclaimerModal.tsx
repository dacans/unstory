import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useSessionStore } from '@/store/sessionStore';
import { useT } from '@/i18n';
import { Colors, FontNames, Spacing, Radius } from '@/constants/theme';

interface Props {
  visible: boolean;
}

export default function DisclaimerModal({ visible }: Props) {
  const insets = useSafeAreaInsets();
  const { acceptDisclaimer } = useSessionStore();
  const T = useT();

  const handleAccept = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await acceptDisclaimer();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      transparent={false}
    >
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.md },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Decorative line */}
          <Animated.View entering={FadeIn.duration(600)} style={styles.accentLine} />

          <Animated.Text entering={FadeInDown.delay(150).duration(500)} style={styles.heading}>
            {T.disclaimer.heading}
          </Animated.Text>

          <Animated.Text entering={FadeInDown.delay(300).duration(500)} style={styles.body}>
            {T.disclaimer.body}
          </Animated.Text>
        </ScrollView>

        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleAccept}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>{T.disclaimer.button}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: Spacing.xxl,
  },
  accentLine: {
    width: 36,
    height: 3,
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    marginBottom: Spacing.xl,
  },
  heading: {
    fontFamily: FontNames.serif,
    fontSize: 36,
    color: Colors.textPrimary,
    lineHeight: 46,
    marginBottom: Spacing.xl,
  },
  body: {
    fontFamily: FontNames.sans,
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 28,
  },
  footer: {
    paddingTop: Spacing.md,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingVertical: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FontNames.sansMedium,
    fontSize: 17,
    color: Colors.background,
    letterSpacing: 0.2,
  },
});
