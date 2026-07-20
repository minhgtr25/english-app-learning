import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme/colors';

export function Screen({ children, style }) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={[styles.innerScreen, style]}>{children}</View>
    </SafeAreaView>
  );
}

export function AppHeader({ eyebrow, title, right, onBack }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerCopy}>
          {!!eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
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
      style={[
        styles.button, 
        isDark && styles.buttonDark, 
        disabled && styles.buttonDisabled, 
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

export function MetricCard({ label, value, tone = 'dark' }) {
  const isLight = tone === 'light';
  return (
    <View style={[styles.metric, isLight && styles.metricLight]}>
      <Text style={[styles.metricValue, isLight && styles.metricValueLight]}>{value}</Text>
      <Text style={[styles.metricLabel, isLight && styles.metricLabelLight]}>{label}</Text>
    </View>
  );
}

export function EmptyState({ title, copy, style }) {
  return (
    <View style={[styles.empty, style]}>
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
  screen: { flex: 1, backgroundColor: COLORS.surface },
  innerScreen: { flex: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 14, minHeight: 48 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginRight: 12, shadowColor: COLORS.ink, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  backText: { color: COLORS.ink, fontSize: 20, fontWeight: 'bold' },
  headerCopy: { flex: 1 },
  eyebrow: { color: COLORS.primaryDark, fontWeight: '900', fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' },
  headerTitle: { color: COLORS.ink, fontWeight: '950', fontSize: 28, marginTop: 2, letterSpacing: -0.5 },
  button: { backgroundColor: COLORS.primary, borderRadius: 18, height: 54, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 2 },
  buttonDark: { backgroundColor: COLORS.dark, shadowColor: COLORS.dark },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: COLORS.white, fontWeight: '900', fontSize: 16 },
  metric: { flex: 1, backgroundColor: COLORS.dark, borderRadius: 22, padding: 16, shadowColor: COLORS.dark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  metricLight: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, shadowColor: COLORS.ink, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2 },
  metricValue: { color: COLORS.white, fontSize: 24, fontWeight: '950', letterSpacing: -0.5 },
  metricValueLight: { color: COLORS.ink },
  metricLabel: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 11, marginTop: 4, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  metricLabelLight: { color: COLORS.textLight },
  empty: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 24, padding: 22, alignItems: 'center', shadowColor: COLORS.ink, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  emptyMark: { width: 36, height: 6, borderRadius: 3, backgroundColor: COLORS.accent, marginBottom: 12 },
  emptyTitle: { color: COLORS.ink, fontWeight: '900', fontSize: 16 },
  emptyCopy: { color: COLORS.textLight, textAlign: 'center', lineHeight: 20, marginTop: 6, fontSize: 13 },
  field: { marginBottom: 16 },
  label: { color: COLORS.ink, fontWeight: '850', fontSize: 14, marginBottom: 8 },
  error: { color: COLORS.error, fontWeight: '800', fontSize: 12, marginTop: 6 }
});
