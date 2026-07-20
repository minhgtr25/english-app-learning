import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import api from '../api/client';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getScoreColor(score) {
  if (score >= 80) return '#43B89C';
  if (score >= 50) return '#F5A623';
  return '#E05C5C';
}

function getScoreLabel(score) {
  if (score >= 80) return 'Xuất sắc';
  if (score >= 50) return 'Đạt';
  return 'Chưa đạt';
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({ summary }) {
  if (!summary) return null;
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>📊 Thống kê của bạn</Text>
      <View style={styles.summaryGrid}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{summary.totalExams}</Text>
          <Text style={styles.summaryLabel}>Bài đã thi</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: '#6C63FF' }]}>
            {summary.averageScore}
          </Text>
          <Text style={styles.summaryLabel}>Điểm TB</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: '#43B89C' }]}>
            {summary.highestScore}
          </Text>
          <Text style={styles.summaryLabel}>Cao nhất</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: '#F5A623' }]}>
            🔥 {summary.currentStreak}
          </Text>
          <Text style={styles.summaryLabel}>Ngày liên tiếp</Text>
        </View>
      </View>
    </View>
  );
}

// ─── History Item ─────────────────────────────────────────────────────────────

function ExamHistoryItem({ item, onDelete }) {
  const scoreColor = getScoreColor(item.score || 0);

  return (
    <View style={styles.historyItem}>
      <View style={styles.historyLeft}>
        <Text style={styles.lessonId} numberOfLines={1}>
          📝 {item.lessonId || 'Bài thi'}
        </Text>
        <Text style={styles.dateText}>{formatDate(item.completedAt || item.createdAt)}</Text>
      </View>
      <View style={styles.historyRight}>
        <Text style={[styles.scoreText, { color: scoreColor }]}>{item.score ?? 0}</Text>
        <Text style={[styles.scoreLabel, { color: scoreColor }]}>
          {getScoreLabel(item.score ?? 0)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() =>
          Alert.alert('Xóa bản ghi', 'Bạn có chắc muốn xóa bài thi này không?', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Xóa', style: 'destructive', onPress: () => onDelete(item._id) },
          ])
        }
      >
        <Text style={styles.deleteBtnText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ExamHistoryScreen() {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchSummary = async () => {
    try {
      const res = await api.get('/exam-history/summary');
      if (res.data.success) setSummary(res.data.data);
    } catch (err) {
      console.error('fetchSummary error:', err);
    }
  };

  const fetchHistory = useCallback(async (pageNum = 1, append = false) => {
    try {
      const res = await api.get(`/exam-history?page=${pageNum}&limit=10`);
      if (res.data.success) {
        const newItems = res.data.data;
        setHistory((prev) => (append ? [...prev, ...newItems] : newItems));
        setHasNextPage(res.data.pagination.hasNextPage);
        setPage(pageNum);
      }
    } catch (err) {
      console.error('fetchHistory error:', err);
      Alert.alert('Lỗi', 'Không thể tải lịch sử bài thi. Vui lòng thử lại.');
    }
  }, []);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchSummary(), fetchHistory(1, false)]);
    setLoading(false);
  }, [fetchHistory]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchSummary(), fetchHistory(1, false)]);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (loadingMore || !hasNextPage) return;
    setLoadingMore(true);
    await fetchHistory(page + 1, true);
    setLoadingMore(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/exam-history/${id}`);
      if (res.data.success) {
        setHistory((prev) => prev.filter((item) => item._id !== id));
        await fetchSummary();
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể xóa bản ghi. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <>
            <Text style={styles.screenTitle}>🏆 Lịch sử bài thi</Text>
            <SummaryCard summary={summary} />
            {history.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={styles.emptyText}>Bạn chưa hoàn thành bài thi nào.</Text>
                <Text style={styles.emptySubText}>Hãy bắt đầu luyện tập ngay!</Text>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <ExamHistoryItem item={item} onDelete={handleDelete} />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator color="#6C63FF" style={{ marginVertical: 16 }} />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6C63FF"
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0E1A',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0E1A',
    gap: 12,
  },
  loadingText: {
    color: '#A0A0C0',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 48,
    marginBottom: 20,
  },
  // Summary card
  summaryCard: {
    backgroundColor: '#1C1B2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A0A0C0',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#6B6B8A',
    textAlign: 'center',
  },
  // History item
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1B2E',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  historyLeft: {
    flex: 1,
    gap: 4,
  },
  lessonId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E0E0FF',
  },
  dateText: {
    fontSize: 12,
    color: '#6B6B8A',
  },
  historyRight: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2C2B40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#E05C5C',
    fontSize: 12,
    fontWeight: '700',
  },
  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A0A0C0',
  },
  emptySubText: {
    fontSize: 13,
    color: '#5A5A7A',
  },
});
