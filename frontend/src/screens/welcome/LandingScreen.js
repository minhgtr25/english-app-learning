import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS } from '../../theme/colors';

export default function LandingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Visual / Mascot Section */}
      <View style={styles.heroSection}>
        <Text style={styles.mascotEmoji}>🦉</Text>
        <Text style={styles.brandTitle}>duolingo</Text>
        <Text style={styles.tagline}>
          Học ngôn ngữ miễn phí, vui nhộn và hiệu quả mỗi ngày!
        </Text>
      </View>

      {/* Call To Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity 
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Onboarding')}
        >
          <Text style={styles.primaryBtnText}>BẮT ĐẦU NGAY</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryBtnText}>TÔI ĐÃ CÓ TÀI KHOẢN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, paddingHorizontal: 24, justifyContent: 'space-between' },
  heroSection: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  mascotEmoji: { fontSize: 100, marginBottom: 10 },
  brandTitle: { fontSize: 36, fontWeight: '900', color: COLORS.primary, letterSpacing: 1 },
  tagline: { fontSize: 16, color: COLORS.textLight, textAlign: 'center', marginTop: 15, paddingHorizontal: 20, lineHeight: 24 },
  actionSection: { marginBottom: 40, width: '100%' },
  primaryBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12, elevation: 3 },
  primaryBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  secondaryBtn: { backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.border, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  secondaryBtnText: { color: COLORS.secondary, fontSize: 16, fontWeight: 'bold' }
});