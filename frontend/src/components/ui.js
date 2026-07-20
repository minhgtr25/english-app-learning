import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme/colors';

export function Screen({ children, style }) {
  return <SafeAreaView style={[styles.screen, style]}>{children}</SafeAreaView>;
}

export function AppHeader({ eyebrow, title, right, onBack }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerCopy}>
          {!!eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      </View>
      {right}
    </View>
  );
}

export function PrimaryButton({ title, onPress, variant = 'primary', disabled, loading, style }) {
  const isDark = variant === 'dark';
  return (
    <TouchableOpacity
      style={[styles.button, isDark && styles.buttonDark, disabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
    >
      {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>{title}</Text>}
    </TouchableOpacity>
  );
}

export function MetricCard({ label, value, tone = 'dark' }) {
  return (
    <View style={[styles.metric, tone === 'light' && styles.metricLight]}>
      <Text style={[styles.metricValue, tone === 'light' && styles.metricValueLight]}>{value}</Text>
      <Text style={[styles.metricLabel, tone === 'light' && styles.metricLabelLight]}>{label}</Text>
    </View>
  );
}

export function EmptyState({ title, copy }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyMark} />
      <Text style={styles.emptyTitle}>{title}</Text>
      {!!copy && <Text style={styles.emptyCopy}>{copy}</Text>}
    </View>
  );
}

export function Field({ label, children, error }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface, padding: 22 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  backButton: { width: 40, height: 40, borderRadius: 14, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  backText: { color: COLORS.ink, fontSize: 30, lineHeight: 30, fontWeight: '700' },
  headerCopy: { flex: 1 },
  eyebrow: { color: COLORS.secondaryDark, fontWeight: '900', fontSize: 12, letterSpacing: 1 },
  headerTitle: { color: COLORS.ink, fontWeight: '900', fontSize: 31, marginTop: 3 },
  button: { backgroundColor: COLORS.primary, borderRadius: 16, minHeight: 54, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  buttonDark: { backgroundColor: COLORS.dark },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { color: COLORS.white, fontWeight: '900', fontSize: 16 },
  metric: { flex: 1, backgroundColor: COLORS.dark, borderRadius: 20, padding: 16 },
  metricLight: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  metricValue: { color: COLORS.white, fontSize: 24, fontWeight: '900' },
  metricValueLight: { color: COLORS.ink },
  metricLabel: { color: '#C7D2CB', fontSize: 12, marginTop: 4, fontWeight: '700' },
  metricLabelLight: { color: COLORS.textLight },
  empty: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 22, padding: 18, alignItems: 'center' },
  emptyMark: { width: 44, height: 8, borderRadius: 8, backgroundColor: COLORS.accent, marginBottom: 12 },
  emptyTitle: { color: COLORS.ink, fontWeight: '900', fontSize: 16 },
  emptyCopy: { color: COLORS.textLight, textAlign: 'center', lineHeight: 20, marginTop: 6 },
  field: { marginTop: 12 },
  label: { color: COLORS.text, fontWeight: '800', marginBottom: 8 },
  error: { color: COLORS.error, fontWeight: '700', marginTop: 6 }
});
