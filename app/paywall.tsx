import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useSessionStore } from '@/store/sessionStore';
import { useT } from '@/i18n';
import { Colors, FontNames, Spacing, Radius } from '@/constants/theme';

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setIsPro } = useSessionStore();
  const T = useT();

  const handlePurchase = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // RevenueCat integration point — for now simulate purchase
    // In production: await Purchases.purchaseProduct('unwind_lifetime')
    await setIsPro(true);
    router.replace('/');
  };

  const handleRestore = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // RevenueCat restore point
    // In production: await Purchases.restorePurchases()
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <Animated.View entering={FadeIn.duration(600)} style={styles.center}>
        <Text style={styles.eyebrow}>{T.paywall.eyebrow}</Text>
        <Text style={styles.heading}>{T.paywall.heading}</Text>
        <Text style={styles.subtext}>{T.paywall.subtext}</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.features}>
        {T.paywall.features.map((item, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>{item}</Text>
          </View>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.priceBlock}>
        <Text style={styles.price}>$7.99</Text>
        <Text style={styles.priceLabel}>{T.paywall.priceLabel}</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(700).duration(500)} style={styles.footer}>
        <TouchableOpacity style={styles.purchaseBtn} onPress={handlePurchase} activeOpacity={0.85}>
          <Text style={styles.purchaseBtnText}>{T.paywall.purchaseBtn}</Text>
        </TouchableOpacity>
        <Text style={styles.oneTimeNote}>{T.paywall.oneTimeNote}</Text>
        <TouchableOpacity onPress={handleRestore} style={styles.restoreBtn}>
          <Text style={styles.restoreText}>{T.paywall.restore}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: Spacing.xl },
  closeBtn: { alignSelf: 'flex-end', padding: Spacing.md, marginTop: Spacing.sm },
  closeText: { fontSize: 18, color: Colors.textSecondary },
  center: { flex: 1, justifyContent: 'center', paddingTop: Spacing.lg },
  eyebrow: {
    fontFamily: FontNames.sansMedium, fontSize: 12, color: Colors.accent,
    letterSpacing: 2, textTransform: 'uppercase', marginBottom: Spacing.sm,
  },
  heading: {
    fontFamily: FontNames.serif, fontSize: 36, color: Colors.textPrimary,
    lineHeight: 46, marginBottom: Spacing.md,
  },
  subtext: { fontFamily: FontNames.sans, fontSize: 16, color: Colors.textSecondary, lineHeight: 24 },
  features: { gap: Spacing.sm, marginVertical: Spacing.xl },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  featureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.accent },
  featureText: { fontFamily: FontNames.sans, fontSize: 16, color: Colors.textPrimary },
  priceBlock: {
    alignItems: 'center', paddingVertical: Spacing.lg,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl,
  },
  price: { fontFamily: FontNames.serif, fontSize: 48, color: Colors.accent },
  priceLabel: { fontFamily: FontNames.sans, fontSize: 15, color: Colors.textSecondary, marginTop: 4 },
  footer: { paddingBottom: Spacing.md, gap: Spacing.md },
  purchaseBtn: {
    backgroundColor: Colors.accent, borderRadius: Radius.lg,
    paddingVertical: 20, alignItems: 'center',
  },
  purchaseBtnText: {
    fontFamily: FontNames.sansMedium, fontSize: 18,
    color: Colors.background, letterSpacing: 0.3,
  },
  oneTimeNote: { fontFamily: FontNames.sans, fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
  restoreBtn: { alignItems: 'center', paddingVertical: Spacing.xs },
  restoreText: { fontFamily: FontNames.sans, fontSize: 14, color: Colors.textSecondary },
});
