import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useSessionStore, SavedSession } from '@/store/sessionStore';
import { useT } from '@/i18n';
import { Colors, FontNames, Spacing, Radius } from '@/constants/theme';

const EMOTION_ICONS: Record<string, string> = {
  overwhelmed: '🌊',
  anxious: '⚡',
  frustrated: '🔥',
  exhausted: '🌑',
  stuck: '🪨',
};

const RESULT_COLORS: Record<string, string> = {
  acted: Colors.accent,
  released: Colors.accentBlue,
  resting: Colors.textSecondary,
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function SessionDetailModal({
  session,
  onClose,
}: {
  session: SavedSession;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const T = useT();

  return (
    <Modal animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modal, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalDate}>{formatDate(session.date)}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>{T.history.done}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>{EMOTION_ICONS[session.emotion]}</Text>
            <View>
              <Text style={styles.detailLabel}>{T.history.emotionLabel}</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {T.emotion.emotions[session.emotion].label}
              </Text>
            </View>
          </View>

          <View style={styles.detailChip}>
            <Text style={[styles.chipText, { color: RESULT_COLORS[session.resultType] }]}>
              {T.history.badges[session.resultType]}
            </Text>
          </View>

          <Text style={styles.sectionLabel}>{T.history.sectionWrote}</Text>
          <Text style={styles.bodyText}>{session.dumpText}</Text>

          {session.resultMessage ? (
            <>
              <Text style={styles.sectionLabel}>{T.history.sectionResult}</Text>
              <Text style={styles.resultText}>{session.resultMessage}</Text>
            </>
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { sessions } = useSessionStore();
  const T = useT();
  const [selected, setSelected] = useState<SavedSession | null>(null);

  const actedCount = sessions.filter((s) => s.resultType === 'acted').length;
  const releasedCount = sessions.filter((s) => s.resultType === 'released').length;

  const handleCard = (session: SavedSession) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(session);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{T.history.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      {sessions.length > 0 && (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.stats}>
          <Text style={styles.statsText}>
            {T.history.statsReleased}{' '}
            <Text style={styles.statsHighlight}>{releasedCount}</Text>{' '}
            {T.history.statsThings}{' '}
            {T.history.statsActed}{' '}
            <Text style={styles.statsHighlight}>{actedCount}</Text>
            {T.history.statsOn ? ` ${T.history.statsOn}` : '.'}
          </Text>
        </Animated.View>
      )}

      {sessions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{T.history.emptyTitle}</Text>
          <Text style={styles.emptySubtext}>{T.history.emptySubtext}</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 60).duration(400)}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleCard(item)}
                activeOpacity={0.8}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.cardIcon}>{EMOTION_ICONS[item.emotion]}</Text>
                  <View style={styles.cardMeta}>
                    <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
                    <View style={[styles.resultBadge, { borderColor: RESULT_COLORS[item.resultType] }]}>
                      <Text style={[styles.resultBadgeText, { color: RESULT_COLORS[item.resultType] }]}>
                        {T.history.badges[item.resultType]}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.cardPreview} numberOfLines={2}>
                  {item.dumpText}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      )}

      {selected && (
        <SessionDetailModal session={selected} onClose={() => setSelected(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  backBtn: { width: 40 },
  backText: { fontSize: 22, color: Colors.textSecondary },
  title: { fontFamily: FontNames.serif, fontSize: 20, color: Colors.textPrimary },
  stats: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, marginBottom: Spacing.sm },
  statsText: { fontFamily: FontNames.sans, fontSize: 15, color: Colors.textSecondary, lineHeight: 22 },
  statsHighlight: { color: Colors.accent, fontFamily: FontNames.sansMedium },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  emptyText: {
    fontFamily: FontNames.serif, fontSize: 22, color: Colors.textPrimary,
    marginBottom: Spacing.sm, textAlign: 'center',
  },
  emptySubtext: {
    fontFamily: FontNames.sans, fontSize: 15, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22,
  },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl, gap: Spacing.sm },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, gap: Spacing.sm },
  cardIcon: { fontSize: 20 },
  cardMeta: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardDate: { fontFamily: FontNames.sans, fontSize: 13, color: Colors.textSecondary },
  resultBadge: { borderRadius: Radius.full, borderWidth: 1, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  resultBadgeText: { fontFamily: FontNames.sansMedium, fontSize: 11, letterSpacing: 0.5 },
  cardPreview: { fontFamily: FontNames.sans, fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  // Modal
  modal: { flex: 1, backgroundColor: Colors.background },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  modalDate: { fontFamily: FontNames.sans, fontSize: 15, color: Colors.textSecondary },
  closeBtn: { padding: Spacing.xs },
  closeText: { fontFamily: FontNames.sansMedium, fontSize: 15, color: Colors.accent },
  modalContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.xxl },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  detailIcon: { fontSize: 28 },
  detailLabel: { fontFamily: FontNames.sans, fontSize: 12, color: Colors.textMuted, letterSpacing: 0.5 },
  detailValue: { fontFamily: FontNames.serif, fontSize: 20, color: Colors.textPrimary },
  detailChip: { alignSelf: 'flex-start', marginBottom: Spacing.lg },
  chipText: { fontFamily: FontNames.sansMedium, fontSize: 13, letterSpacing: 0.8, textTransform: 'uppercase' },
  sectionLabel: {
    fontFamily: FontNames.sans, fontSize: 12, color: Colors.textMuted,
    letterSpacing: 1, textTransform: 'uppercase',
    marginBottom: Spacing.sm, marginTop: Spacing.lg,
  },
  bodyText: { fontFamily: FontNames.sans, fontSize: 16, color: Colors.textSecondary, lineHeight: 26 },
  resultText: { fontFamily: FontNames.serif, fontSize: 20, color: Colors.textPrimary, lineHeight: 30 },
});
