import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

const VIP_PLANS = [
  {
    id: 'monthly',
    label: '1 Tháng',
    price: '49.000đ',
    pricePerMonth: '49.000đ/tháng',
    badge: null,
    color: '#6C63FF',
  },
  {
    id: 'quarterly',
    label: '3 Tháng',
    price: '129.000đ',
    pricePerMonth: '43.000đ/tháng',
    badge: 'Tiết kiệm 12%',
    color: '#43B89C',
  },
  {
    id: 'yearly',
    label: '1 Năm',
    price: '399.000đ',
    pricePerMonth: '33.000đ/tháng',
    badge: 'Tiết kiệm 32% 🔥',
    color: '#F5A623',
  },
];

const VIP_BENEFITS = [
  '✅ Học không giới hạn tất cả bài học',
  '✅ Luyện tập phát âm với AI',
  '✅ Tải bài về học offline',
  '✅ Không có quảng cáo',
  '✅ Ưu tiên hỗ trợ 24/7',
  '✅ Truy cập các bộ từ vựng độc quyền',
];

export default function VipSubscribeScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [loading, setLoading] = useState(false);
  const [vipStatus, setVipStatus] = useState(null);

  useEffect(() => {
    fetchVipStatus();
  }, []);

  const fetchVipStatus = async () => {
    try {
      // Replace with your actual API base URL and auth token
      // const res = await fetch('/api/vip/status', { headers: { Authorization: `Bearer ${token}` } });
      // const data = await res.json();
      // setVipStatus(data.data);
    } catch (err) {
      console.error('fetchVipStatus error:', err);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // const res = await fetch('/api/vip/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      //   body: JSON.stringify({ planId: selectedPlan }),
      // });
      // const data = await res.json();
      // if (data.success) {
      //   Alert.alert('Thành công!', data.message);
      //   navigation.goBack();
      // } else {
      //   Alert.alert('Lỗi', data.message);
      // }

      // Demo alert
      const plan = VIP_PLANS.find((p) => p.id === selectedPlan);
      await new Promise((r) => setTimeout(r, 1200));
      Alert.alert('🎉 Đăng ký thành công!', `Bạn đã đăng ký gói VIP ${plan.label} với giá ${plan.price}.`);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ. Vui lòng hãy thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanData = VIP_PLANS.find((p) => p.id === selectedPlan);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.crownIcon}>👑</Text>
        <Text style={styles.title}>Nâng cấp VIP</Text>
        <Text style={styles.subtitle}>Mở khoá toàn bộ tính năng học tiếng Anh</Text>
      </View>

      {/* Benefits */}
      <View style={styles.benefitsCard}>
        {VIP_BENEFITS.map((benefit, idx) => (
          <Text key={idx} style={styles.benefitItem}>{benefit}</Text>
        ))}
      </View>

      {/* Plan Selector */}
      <Text style={styles.sectionTitle}>Chọn gói của bạn</Text>
      <View style={styles.planRow}>
        {VIP_PLANS.map((plan) => {
          const isSelected = plan.id === selectedPlan;
          return (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                isSelected && { borderColor: plan.color, borderWidth: 2 },
              ]}
              onPress={() => setSelectedPlan(plan.id)}
              activeOpacity={0.8}
            >
              {plan.badge && (
                <View style={[styles.badge, { backgroundColor: plan.color }]}>
                  <Text style={styles.badgeText}>{plan.badge}</Text>
                </View>
              )}
              <Text style={[styles.planLabel, isSelected && { color: plan.color }]}>
                {plan.label}
              </Text>
              <Text style={[styles.planPrice, isSelected && { color: plan.color }]}>
                {plan.price}
              </Text>
              <Text style={styles.planPerMonth}>{plan.pricePerMonth}</Text>
              {isSelected && (
                <View style={[styles.selectedDot, { backgroundColor: plan.color }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Subscribe Button */}
      <TouchableOpacity
        style={[styles.subscribeBtn, { backgroundColor: selectedPlanData?.color || '#6C63FF' }]}
        onPress={handleSubscribe}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.subscribeBtnText}>
            Đăng ký {selectedPlanData?.label} — {selectedPlanData?.price}
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Bằng cách đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
        Bạn có thể hủy bất kỳ lúc nào.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0E1A',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 24,
  },
  crownIcon: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#A0A0C0',
    textAlign: 'center',
  },
  benefitsCard: {
    backgroundColor: '#1C1B2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    gap: 10,
  },
  benefitItem: {
    fontSize: 14,
    color: '#E0E0FF',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 14,
  },
  planRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  planCard: {
    flex: 1,
    backgroundColor: '#1C1B2E',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '700',
  },
  planLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A0A0C0',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  planPerMonth: {
    fontSize: 10,
    color: '#6B6B8A',
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  subscribeBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  subscribeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  disclaimer: {
    fontSize: 11,
    color: '#5A5A7A',
    textAlign: 'center',
    lineHeight: 16,
  },
});
