import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../i18n/LanguageContext';

// Welcome landing screen component representing the main entry point of the app
export default function LandingScreen({ navigation }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
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
                activeOpacity={0.8}
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
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Onboarding')} activeOpacity={0.85}>
            <Text style={styles.primaryText}>{t.start}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Login')} activeOpacity={0.85}>
            <Text style={styles.secondaryText}>{t.loginCta}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  inner: { flex: 1, paddingHorizontal: 22, paddingTop: 10, paddingBottom: 16 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  logoMark: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.dark, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.ink, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  logoText: { color: COLORS.white, fontWeight: '950', fontSize: 16 },
  langSwitch: { flexDirection: 'row', backgroundColor: COLORS.muted, borderRadius: 16, padding: 4 },
  langButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  langButtonActive: { backgroundColor: COLORS.white, shadowColor: COLORS.ink, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  langText: { color: COLORS.textLight, fontWeight: '800', fontSize: 12 },
  langTextActive: { color: COLORS.primaryDark },
  hero: { flex: 1, justifyContent: 'center' },
  examCard: { backgroundColor: COLORS.dark, borderRadius: 32, padding: 24, marginBottom: 30, shadowColor: COLORS.dark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 },
  examLabel: { color: COLORS.accent, fontWeight: '950', fontSize: 11, letterSpacing: 1.5 },
  examScore: { color: COLORS.white, fontSize: 64, fontWeight: '950', marginTop: 6, letterSpacing: -1 },
  examCopy: { color: 'rgba(255, 255, 255, 0.75)', fontSize: 14, marginBottom: 18, fontWeight: '700' },
  progressTrack: { height: 10, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 5 },
  progressFill: { width: '72%', height: 10, backgroundColor: COLORS.primary, borderRadius: 5 },
  title: { fontSize: 44, fontWeight: '950', color: COLORS.ink, letterSpacing: -1 },
  subtitle: { color: COLORS.textLight, fontSize: 16, lineHeight: 24, marginTop: 8, fontWeight: '700' },
  actions: { gap: 12, paddingBottom: 8 },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: 18, height: 54, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 2 },
  primaryText: { color: COLORS.white, fontSize: 16, fontWeight: '950' },
  secondaryBtn: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, height: 54, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: COLORS.secondaryDark, fontSize: 16, fontWeight: '950' }
});
