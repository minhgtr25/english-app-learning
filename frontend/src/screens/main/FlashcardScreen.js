import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Animated,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import api from '../api/client';

const { width } = Dimensions.get('window');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_COLOR = {
  new: '#6B6B8A',
  learning: '#F5A623',
  review: '#6C63FF',
  mastered: '#43B89C',
};

const STATUS_LABEL = {
  new: 'Mới',
  learning: 'Đang học',
  review: 'Ôn tập',
  mastered: 'Thành thạo',
};

const RATING_OPTIONS = [
  { value: 0, label: 'Không nhớ', emoji: '😵', color: '#E05C5C' },
  { value: 3, label: 'Nhớ ra được', emoji: '🤔', color: '#F5A623' },
  { value: 5, label: 'Nhớ ngay', emoji: '🎯', color: '#43B89C' },
];

// ─── FlipCard Component ───────────────────────────────────────────────────────

function FlipCard({ front, back, example, onRate }) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  const flip = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped((prev) => !prev);
  };

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <View style={styles.flipWrapper}>
      <TouchableOpacity onPress={flip} activeOpacity={0.95}>
        {/* Front */}
        <Animated.View
          style={[styles.card, { transform: [{ rotateY: frontRotate }] }]}
          pointerEvents={isFlipped ? 'none' : 'auto'}
        >
          <Text style={styles.cardHint}>Nhấn để lật thẻ</Text>
          <Text style={styles.cardFront}>{front}</Text>
        </Animated.View>

        {/* Back */}
        <Animated.View
          style={[styles.card, styles.cardBack, { transform: [{ rotateY: backRotate }] }]}
          pointerEvents={isFlipped ? 'auto' : 'none'}
        >
          <Text style={styles.cardHint}>Nghĩa</Text>
          <Text style={styles.cardBackText}>{back}</Text>
          {example ? (
            <Text style={styles.cardExample}>"{example}"</Text>
          ) : null}
        </Animated.View>
      </TouchableOpacity>

      {/* Rating buttons — only visible when flipped */}
      {isFlipped && (
        <View style={styles.ratingRow}>
          {RATING_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.ratingBtn, { borderColor: opt.color }]}
              onPress={() => {
                setIsFlipped(false);
                flipAnim.setValue(0);
                onRate(opt.value);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.ratingEmoji}>{opt.emoji}</Text>
              <Text style={[styles.ratingLabel, { color: opt.color }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Study Session Modal ──────────────────────────────────────────────────────

function StudySessionModal({ visible, setId, onClose }) {
  const [dueCards, setDueCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionDone, setSessionDone] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });

  useEffect(() => {
    if (visible && setId) {
      fetchDue();
    }
  }, [visible, setId]);

  const fetchDue = async () => {
    setLoading(true);
    setCurrentIndex(0);
    setSessionDone(false);
    setStats({ correct: 0, wrong: 0 });
    try {
      const res = await api.get(`/flashcards/due?setId=${setId}&limit=20`);
      setDueCards(res.data.data || []);
    } catch {
      Alert.alert('Lỗi', 'Không tải được thẻ ôn tập.');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (rating) => {
    const card = dueCards[currentIndex];
    try {
      await api.post(`/flashcards/${card._id}/review`, { rating });
      setStats((prev) => ({
        correct: rating >= 3 ? prev.correct + 1 : prev.correct,
        wrong: rating < 3 ? prev.wrong + 1 : prev.wrong,
      }));
    } catch {
      // silent fail, still advance
    }

    if (currentIndex + 1 >= dueCards.length) {
      setSessionDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const currentCard = dueCards[currentIndex];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.sessionContainer}>
        {/* Header */}
        <View style={styles.sessionHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.sessionTitle}>Ôn tập</Text>
          {!sessionDone && !loading && dueCards.length > 0 && (
            <Text style={styles.sessionProgress}>
              {currentIndex + 1}/{dueCards.length}
            </Text>
          )}
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#6C63FF" />
          </View>
        ) : dueCards.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyText}>Không có thẻ nào đến hạn hôm nay!</Text>
            <Text style={styles.emptySubText}>Hãy quay lại vào ngày mai.</Text>
          </View>
        ) : sessionDone ? (
          /* Session Complete */
          <View style={styles.centered}>
            <Text style={[styles.emptyIcon, { fontSize: 64 }]}>🏆</Text>
            <Text style={styles.doneTitle}>Hoàn thành!</Text>
            <View style={styles.doneStats}>
              <View style={styles.doneStat}>
                <Text style={[styles.doneStatVal, { color: '#43B89C' }]}>{stats.correct}</Text>
                <Text style={styles.doneStatLabel}>Đúng</Text>
              </View>
              <View style={styles.doneStat}>
                <Text style={[styles.doneStatVal, { color: '#E05C5C' }]}>{stats.wrong}</Text>
                <Text style={styles.doneStatLabel}>Sai</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.primaryBtn} onPress={fetchDue}>
              <Text style={styles.primaryBtnText}>Ôn lại thẻ sai</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostBtn} onPress={onClose}>
              <Text style={styles.ghostBtnText}>Về trang chủ</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Flashcard */
          <FlipCard
            front={currentCard.front}
            back={currentCard.back}
            example={currentCard.example}
            onRate={handleRate}
          />
        )}
      </View>
    </Modal>
  );
}

// ─── Add Card Modal ───────────────────────────────────────────────────────────

function AddCardModal({ visible, setId, onClose, onAdded }) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [example, setExample] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!front.trim() || !back.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập từ và nghĩa.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/flashcards', { setId, front: front.trim(), back: back.trim(), example: example.trim() });
      setFront('');
      setBack('');
      setExample('');
      onAdded();
    } catch {
      Alert.alert('Lỗi', 'Không thể thêm flashcard.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.sessionContainer}>
        <View style={styles.sessionHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.sessionTitle}>Thêm thẻ mới</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={{ flex: 1, padding: 20 }} keyboardShouldPersistTaps="handled">
          <Text style={styles.inputLabel}>Từ / Cụm từ (Tiếng Anh)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ví dụ: ambiguous"
            placeholderTextColor="#5A5A7A"
            value={front}
            onChangeText={setFront}
          />

          <Text style={styles.inputLabel}>Nghĩa (Tiếng Việt)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ví dụ: mơ hồ, không rõ ràng"
            placeholderTextColor="#5A5A7A"
            value={back}
            onChangeText={setBack}
          />

          <Text style={styles.inputLabel}>Câu ví dụ (tuỳ chọn)</Text>
          <TextInput
            style={[styles.textInput, { height: 80 }]}
            placeholder="Ví dụ: The instructions were ambiguous."
            placeholderTextColor="#5A5A7A"
            value={example}
            onChangeText={setExample}
            multiline
          />

          <TouchableOpacity
            style={[styles.primaryBtn, { marginTop: 20 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Lưu thẻ</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Set Card (list item) ─────────────────────────────────────────────────────

function SetCard({ set, onStudy, onAdd }) {
  const pct = set.total > 0 ? Math.round((set.mastered / set.total) * 100) : 0;

  return (
    <View style={styles.setCard}>
      <View style={styles.setCardHeader}>
        <Text style={styles.setName} numberOfLines={1}>{set._id}</Text>
        <TouchableOpacity onPress={() => onAdd(set._id)} style={styles.addCardBtn}>
          <Text style={styles.addCardBtnText}>+ Thẻ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.setStats}>
        <View style={styles.setStat}>
          <Text style={styles.setStatVal}>{set.total}</Text>
          <Text style={styles.setStatLabel}>Tổng</Text>
        </View>
        <View style={styles.setStat}>
          <Text style={[styles.setStatVal, { color: '#F5A623' }]}>{set.learning}</Text>
          <Text style={styles.setStatLabel}>Đang học</Text>
        </View>
        <View style={styles.setStat}>
          <Text style={[styles.setStatVal, { color: '#43B89C' }]}>{set.mastered}</Text>
          <Text style={styles.setStatLabel}>Thuộc</Text>
        </View>
        <View style={styles.setStat}>
          <Text style={[styles.setStatVal, { color: '#E05C5C' }]}>{set.dueCount}</Text>
          <Text style={styles.setStatLabel}>Đến hạn</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.progressLabel}>{pct}% thành thạo</Text>

      <TouchableOpacity
        style={[styles.studyBtn, set.dueCount === 0 && styles.studyBtnDisabled]}
        onPress={() => onStudy(set._id)}
        disabled={set.dueCount === 0}
      >
        <Text style={styles.studyBtnText}>
          {set.dueCount > 0 ? `Ôn tập ngay (${set.dueCount} thẻ)` : '✅ Hoàn thành hôm nay'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function FlashcardScreen() {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studySetId, setStudySetId] = useState(null);
  const [addSetId, setAddSetId] = useState(null);
  const [showNewSet, setShowNewSet] = useState(false);
  const [newSetName, setNewSetName] = useState('');

  const fetchSets = useCallback(async () => {
    try {
      const res = await api.get('/flashcards/sets');
      setSets(res.data.data || []);
    } catch {
      Alert.alert('Lỗi', 'Không thể tải danh sách bộ thẻ.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSets();
  }, [fetchSets]);

  const handleCreateSet = () => {
    if (!newSetName.trim()) return;
    // The set is created implicitly when the first card is added
    setAddSetId(newSetName.trim());
    setNewSetName('');
    setShowNewSet(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sets}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <Text style={styles.screenTitle}>🃏 Flashcard</Text>
            <Text style={styles.screenSubtitle}>Ôn tập thông minh với Spaced Repetition</Text>

            {/* Create new set */}
            {showNewSet ? (
              <View style={styles.newSetRow}>
                <TextInput
                  style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
                  placeholder="Tên bộ thẻ (VD: IELTS Vocabulary)"
                  placeholderTextColor="#5A5A7A"
                  value={newSetName}
                  onChangeText={setNewSetName}
                  autoFocus
                />
                <TouchableOpacity style={styles.confirmBtn} onPress={handleCreateSet}>
                  <Text style={styles.confirmBtnText}>Tạo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.createSetBtn}
                onPress={() => setShowNewSet(true)}
              >
                <Text style={styles.createSetBtnText}>＋ Tạo bộ thẻ mới</Text>
              </TouchableOpacity>
            )}

            {sets.length === 0 && (
              <View style={[styles.centered, { paddingTop: 40 }]}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={styles.emptyText}>Chưa có bộ thẻ nào.</Text>
                <Text style={styles.emptySubText}>Tạo bộ thẻ đầu tiên của bạn ngay!</Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <SetCard
            set={item}
            onStudy={(id) => setStudySetId(id)}
            onAdd={(id) => setAddSetId(id)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* Study Session Modal */}
      <StudySessionModal
        visible={!!studySetId}
        setId={studySetId}
        onClose={() => {
          setStudySetId(null);
          fetchSets();
        }}
      />

      {/* Add Card Modal */}
      <AddCardModal
        visible={!!addSetId}
        setId={addSetId}
        onClose={() => setAddSetId(null)}
        onAdded={() => {
          fetchSets();
          Alert.alert('✅', 'Đã thêm flashcard!');
        }}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0E1A' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },

  screenTitle: { fontSize: 26, fontWeight: '700', color: '#FFFFFF', marginTop: 48 },
  screenSubtitle: { fontSize: 13, color: '#6B6B8A', marginBottom: 20, marginTop: 4 },

  // Create set
  createSetBtn: {
    borderWidth: 1.5,
    borderColor: '#6C63FF',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  createSetBtnText: { color: '#6C63FF', fontWeight: '600', fontSize: 15 },
  newSetRow: { flexDirection: 'row', gap: 10, marginBottom: 24, alignItems: 'center' },
  confirmBtn: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  confirmBtnText: { color: '#fff', fontWeight: '700' },

  // Set card
  setCard: {
    backgroundColor: '#1C1B2E',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  setCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  setName: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', flex: 1 },
  addCardBtn: {
    backgroundColor: '#2C2B40',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addCardBtnText: { color: '#6C63FF', fontSize: 13, fontWeight: '600' },
  setStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  setStat: { alignItems: 'center', flex: 1 },
  setStatVal: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  setStatLabel: { fontSize: 11, color: '#6B6B8A', marginTop: 2 },
  progressBarBg: { height: 6, backgroundColor: '#2C2B40', borderRadius: 3, marginBottom: 6 },
  progressBarFill: { height: 6, backgroundColor: '#43B89C', borderRadius: 3 },
  progressLabel: { fontSize: 11, color: '#6B6B8A', marginBottom: 14 },
  studyBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  studyBtnDisabled: { backgroundColor: '#2C2B40' },
  studyBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },

  // Session modal
  sessionContainer: { flex: 1, backgroundColor: '#0F0E1A' },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  closeBtn: { fontSize: 18, color: '#A0A0C0', fontWeight: '700' },
  sessionTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  sessionProgress: { fontSize: 14, color: '#6B6B8A' },

  // Flip card
  flipWrapper: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  card: {
    width: '100%',
    height: 280,
    backgroundColor: '#1C1B2E',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1B2E',
    borderWidth: 1.5,
    borderColor: '#6C63FF',
  },
  cardHint: { fontSize: 12, color: '#5A5A7A', marginBottom: 16 },
  cardFront: { fontSize: 32, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  cardBackText: { fontSize: 26, fontWeight: '700', color: '#6C63FF', textAlign: 'center' },
  cardExample: { fontSize: 13, color: '#6B6B8A', marginTop: 14, textAlign: 'center', fontStyle: 'italic' },
  ratingRow: { flexDirection: 'row', gap: 10, marginTop: 28 },
  ratingBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#1C1B2E',
    gap: 4,
  },
  ratingEmoji: { fontSize: 20 },
  ratingLabel: { fontSize: 11, fontWeight: '600' },

  // Done screen
  doneTitle: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginTop: 12 },
  doneStats: { flexDirection: 'row', gap: 40, marginTop: 20, marginBottom: 32 },
  doneStat: { alignItems: 'center' },
  doneStatVal: { fontSize: 36, fontWeight: '700' },
  doneStatLabel: { fontSize: 13, color: '#A0A0C0', marginTop: 4 },

  // Buttons
  primaryBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: width - 80,
    marginBottom: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  ghostBtn: {
    borderWidth: 1.5,
    borderColor: '#3A3A5A',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: width - 80,
  },
  ghostBtnText: { color: '#A0A0C0', fontWeight: '600', fontSize: 15 },

  // Empty
  emptyIcon: { fontSize: 52 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#A0A0C0' },
  emptySubText: { fontSize: 13, color: '#5A5A7A' },

  // Input
  inputLabel: { fontSize: 13, color: '#A0A0C0', marginBottom: 8, marginTop: 16 },
  textInput: {
    backgroundColor: '#1C1B2E',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2C2B40',
    marginBottom: 4,
  },
});
