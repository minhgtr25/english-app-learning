import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../i18n/LanguageContext';

export default function LandingScreen({ navigation }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.logoMark}>
          <Text style={styles.logoText}>LL</Text>
        </View>
        <View style={styles.langSwitch}>
          {['vi', 'en'].map(item => (
            <TouchableOpacity
              key={item}
              style={[styles.langButton, language === item && styles.langButtonActive]}
              onPress={() => setLanguage(item)}
            >
              <Text style={[styles.langText, language === item && styles.langTextActive]}>
                {item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.hero}>
        <View style={styles.examCard}>
          <Text style={styles.examLabel}>IELTS MINI TEST</Text>
          <Text style={styles.examScore}>84</Text>
          <Text style={styles.examCopy}>Listening A2 • Grammar B1 • Speaking drill</Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <Text style={styles.title}>{t.appName}</Text>
        <Text style={styles.subtitle}>{t.appTagline}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Onboarding')}>
          <Text style={styles.primaryText}>{t.start}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.secondaryText}>{t.loginCta}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface, padding: 22 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoMark: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.dark, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: COLORS.white, fontWeight: '900' },
  langSwitch: { flexDirection: 'row', backgroundColor: COLORS.muted, borderRadius: 14, padding: 4 },
  langButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  langButtonActive: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  langText: { color: COLORS.textLight, fontWeight: '800', fontSize: 12 },
  langTextActive: { color: COLORS.primaryDark },
  hero: { flex: 1, justifyContent: 'center' },
  examCard: { backgroundColor: COLORS.dark, borderRadius: 28, padding: 22, marginBottom: 34 },
  examLabel: { color: COLORS.accent, fontWeight: '900', fontSize: 12, letterSpacing: 1 },
  examScore: { color: COLORS.white, fontSize: 64, fontWeight: '900', marginTop: 8 },
  examCopy: { color: '#C7D2CB', fontSize: 14, marginBottom: 18 },
  progressTrack: { height: 10, backgroundColor: '#344139', borderRadius: 20 },
  progressFill: { width: '72%', height: 10, backgroundColor: COLORS.primary, borderRadius: 20 },
  title: { fontSize: 42, fontWeight: '900', color: COLORS.ink, letterSpacing: 0 },
  subtitle: { color: COLORS.textLight, fontSize: 17, lineHeight: 25, marginTop: 12 },
  actions: { gap: 12, paddingBottom: 10 },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: 18, paddingVertical: 17, alignItems: 'center' },
  primaryText: { color: COLORS.white, fontSize: 16, fontWeight: '900' },
  secondaryBtn: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, paddingVertical: 17, alignItems: 'center' },
  secondaryText: { color: COLORS.secondaryDark, fontSize: 16, fontWeight: '900' }
});
