import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { usePaywall } from '@/hooks/usePaywall';
import { useT } from '@/i18n';
import { Colors, FontNames, Spacing, Radius } from '@/constants/theme';

type PlanId = 'monthly' | 'annual' | 'lifetime';

const BORDER_GOLD = '#C8A97E';
const BORDER_MUTED = 'rgba(200, 169, 126, 0.2)';

function FeatureItem({ text }: { text: string }) {
  return (
    <View style={styles.featureRow}>
      <Feather name="check" size={16} color={Colors.accent} style={styles.featureIcon} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

interface PlanCardProps {
  label: string;
  price: string;
  note?: string;
  badge?: string;
  selected: boolean;
  onPress: () => void;
}

function PlanCard({ label, price, note, badge, selected, onPress }: PlanCardProps) {
  return (
    <TouchableOpacity
      style={[styles.planCard, selected ? styles.planCardSelected : styles.planCardDefault]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      <Text style={[styles.planLabel, selected && styles.planLabelSelected]}>{label}</Text>
      <Text style={[styles.planPrice, selected && styles.planPriceSelected]}>{price}</Text>
      {note ? <Text style={styles.planNote}>{note}</Text> : null}
    </TouchableOpacity>
  );
}

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const T = useT();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('annual');

  const {
    isLoading,
    purchaseMonthly,
    purchaseAnnual,
    purchaseLifetime,
    restorePurchases,
    isPremium,
    error,
  } = usePaywall();

  const handlePurchase = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (selectedPlan === 'monthly') await purchaseMonthly();
    else if (selectedPlan === 'annual') await purchaseAnnual();
    else await purchaseLifetime();

    if (isPremium) router.replace('/');
  };

  const handleRestore = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await restorePurchases();
    if (isPremium) router.replace('/');
  };

  return (
    <View style={[styles.outer, { paddingTop: insets.top }]}>

      {/* Close button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
        <Feather name="x" size={22} color={Colors.textSecondary} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(500)}>
          <Text style={styles.eyebrow}>{T.paywall.label}</Text>
          <Text style={styles.title}>{T.paywall.title}</Text>
          <Text style={styles.subtitle}>{T.paywall.subtitle}</Text>
        </Animated.View>

        {/* Features */}
        <Animated.View entering={FadeInDown.delay(150).duration(450)} style={styles.features}>
          <FeatureItem text={T.paywall.feature1} />
          <FeatureItem text={T.paywall.feature2} />
          <FeatureItem text={T.paywall.feature3} />
          <FeatureItem text={T.paywall.feature4} />
        </Animated.View>

        {/* Plan selector */}
        <Animated.View entering={FadeInDown.delay(300).duration(450)} style={styles.plans}>
          <PlanCard
            label={T.paywall.monthly}
            price={T.paywall.monthlyPrice}
            selected={selectedPlan === 'monthly'}
            onPress={() => setSelectedPlan('monthly')}
          />
          <PlanCard
            label={T.paywall.annual}
            price={T.paywall.annualPrice}
            badge={T.paywall.bestValue}
            selected={selectedPlan === 'annual'}
            onPress={() => setSelectedPlan('annual')}
          />
          <PlanCard
            label={T.paywall.lifetime}
            price={T.paywall.lifetimePrice}
            note={T.paywall.lifetimeNote}
            badge={T.paywall.mostPopular}
            selected={selectedPlan === 'lifetime'}
            onPress={() => setSelectedPlan('lifetime')}
          />
        </Animated.View>

        {/* Error */}
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        {/* CTA */}
        <Animated.View entering={FadeInDown.delay(450).duration(450)}>
          <TouchableOpacity
            style={[styles.ctaBtn, isLoading && styles.ctaBtnDisabled]}
            onPress={handlePurchase}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <Text style={styles.ctaBtnText}>{T.paywall.cta}</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom links row */}
        <Animated.View entering={FadeInDown.delay(550).duration(450)} style={styles.linksRow}>
          <TouchableOpacity onPress={handleRestore} disabled={isLoading}>
            <Text style={styles.linkText}>{T.paywall.restoreLabel}</Text>
          </TouchableOpacity>
          <Text style={styles.separator}> · </Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://dacans.github.io/unstory/terms.html')}>
            <Text style={styles.linkText}>{T.paywall.terms}</Text>
          </TouchableOpacity>
          <Text style={styles.separator}> · </Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://dacans.github.io/unstory/privacy.html')}>
            <Text style={styles.linkText}>{T.paywall.privacy}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Disclaimer */}
        <Animated.View entering={FadeInDown.delay(600).duration(450)}>
          <Text style={styles.disclaimer}>{T.paywall.disclaimer}</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    padding: Spacing.md,
    paddingHorizontal: 28,
    marginTop: Spacing.xs,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 28,
  },
  eyebrow: {
    fontFamily: FontNames.sansMedium,
    fontSize: 11,
    color: Colors.accent,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: {
    fontFamily: FontNames.serif,
    fontSize: 32,
    color: Colors.textPrimary,
    lineHeight: 42,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: FontNames.sans,
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 23,
    marginBottom: 28,
  },
  features: {
    gap: 12,
    marginBottom: 28,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureIcon: {
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontFamily: FontNames.sans,
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 23,
  },
  plans: {
    gap: 10,
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    padding: 16,
    paddingHorizontal: 20,
    position: 'relative',
  },
  planCardDefault: {
    borderColor: BORDER_MUTED,
  },
  planCardSelected: {
    borderColor: BORDER_GOLD,
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: 14,
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: FontNames.sansMedium,
    fontSize: 9,
    color: Colors.background,
    letterSpacing: 1,
  },
  planLabel: {
    fontFamily: FontNames.sansMedium,
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  planLabelSelected: {
    color: Colors.accent,
  },
  planPrice: {
    fontFamily: FontNames.serif,
    fontSize: 22,
    color: Colors.textPrimary,
  },
  planPriceSelected: {
    color: Colors.textPrimary,
  },
  planNote: {
    fontFamily: FontNames.sans,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  errorText: {
    fontFamily: FontNames.sans,
    fontSize: 13,
    color: '#C87E7E',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  ctaBtnDisabled: {
    opacity: 0.7,
  },
  ctaBtnText: {
    fontFamily: FontNames.sansMedium,
    fontSize: 17,
    color: Colors.background,
    letterSpacing: 0.3,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 2,
  },
  linkText: {
    fontFamily: FontNames.sans,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  separator: {
    fontFamily: FontNames.sans,
    fontSize: 12,
    color: Colors.textMuted,
  },
  disclaimer: {
    fontFamily: FontNames.sans,
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
});
