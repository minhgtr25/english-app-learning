import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppHeader, MetricCard, PrimaryButton, Screen } from '../../components/ui';
import { useAuth } from '../../state/AuthContext';
import api from '../../api/client';

const missions = [
  ['Vocabulary', '12 min', '82%', 'Quiz'],
  ['Grammar exam', '18 min', '68%', 'Quiz'],
  ['Speaking room', 'Live', '4 peers', 'ChatRoom']
];

export default function HomeScreen({ navigation }) {
  const { language, setLanguage, t } = useLanguage();
  const { logout, user } = useAuth();
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.get('/health')
      .then(() => {
        if (mounted) setBackendOnline(true);
      })
      .catch(() => {
        if (mounted) setBackendOnline(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigation.replace('Landing');
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppHeader
          eyebrow="LINGUALAB"
          title={t.homeTitle}
          right={
            <TouchableOpacity style={styles.langPill} onPress={() => setLanguage(language === 'vi' ? 'en' : 'vi')}>
              <Text style={styles.langText}>{language.toUpperCase()}</Text>
            </TouchableOpacity>
          }
        />
        <Text style={styles.greeting}>{user?.fullName || 'Demo Student'}</Text>
        <View style={[styles.statusPill, backendOnline ? styles.statusOnline : styles.statusDemo]}>
          <View style={[styles.statusDot, backendOnline ? styles.statusDotOnline : styles.statusDotDemo]} />
          <Text style={styles.statusText}>{backendOnline ? 'Backend online' : 'Demo mode'}</Text>
        </View>
        <Text style={styles.subtitle}>{t.homeSubtitle}</Text>

        <View style={styles.statsRow}>
          <MetricCard label={t.streak} value={String(user?.streak || 14)} />
          <MetricCard label={t.score} value={String(user?.totalScore || 1280)} />
          <MetricCard label={t.accuracy} value="82%" />
        </View>

        <View style={styles.roadmap}>
          {missions.map((item, index) => {
            const isQuiz = item[3] === 'Quiz';
            const category = item[0] === 'Grammar exam' ? 'Grammar' : item[0];
            return (
              <TouchableOpacity
                key={item[0]}
                style={[styles.mission, index === 1 && styles.missionActive]}
                onPress={() => navigation.navigate(item[3], isQuiz ? { category } : undefined)}
                activeOpacity={0.84}
              >
                <View style={styles.node}>
                  <Text style={styles.nodeText}>{index + 1}</Text>
                </View>
                <View style={styles.missionCopy}>
                  <Text style={styles.missionTitle}>{item[0]}</Text>
                  <Text style={styles.missionMeta}>{item[1]} | {item[2]}</Text>
                </View>
                <Text style={styles.missionArrow}>{'>'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.navGrid}>
          <NavButton title={t.quiz} onPress={() => navigation.navigate('Quiz')} />
          <NavButton title={t.chat} onPress={() => navigation.navigate('ChatRoom')} />
          <NavButton title={t.leaderboard} onPress={() => navigation.navigate('Leaderboard')} />
          {user?.role === 'admin' && (
            <NavButton title={t.admin} onPress={() => navigation.navigate('AdminDashboard')} />
          )}
        </View>

        <PrimaryButton title="Logout" onPress={handleLogout} variant="dark" style={styles.logoutButton} />
      </ScrollView>
    </Screen>
  );
}

function NavButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.navButton} onPress={onPress} activeOpacity={0.84}>
      <Text style={styles.navButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  greeting: { color: COLORS.ink, fontWeight: '900', marginTop: 14, fontSize: 16 },
  statusPill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, marginTop: 10 },
  statusOnline: { backgroundColor: '#E8F6EA' },
  statusDemo: { backgroundColor: '#FFF6D8' },
  statusDot: { width: 8, height: 8, borderRadius: 8 },
  statusDotOnline: { backgroundColor: COLORS.primary },
  statusDotDemo: { backgroundColor: COLORS.warning },
  statusText: { color: COLORS.ink, fontWeight: '900', fontSize: 12 },
  subtitle: { color: COLORS.textLight, lineHeight: 22, marginTop: 10, marginBottom: 22 },
  langPill: { backgroundColor: COLORS.white, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.border },
  langText: { color: COLORS.primaryDark, fontWeight: '900' },
  statsRow: { flexDirection: 'row', gap: 10 },
  roadmap: { marginTop: 22, gap: 14 },
  mission: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 22, borderWidth: 1, borderColor: COLORS.border, padding: 16 },
  missionActive: { borderColor: COLORS.primary, backgroundColor: '#F6FBF4' },
  node: { width: 42, height: 42, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  nodeText: { color: COLORS.white, fontWeight: '900' },
  missionCopy: { flex: 1, marginLeft: 14 },
  missionTitle: { color: COLORS.text, fontWeight: '900', fontSize: 16 },
  missionMeta: { color: COLORS.textLight, marginTop: 3 },
  missionArrow: { color: COLORS.textLight, fontSize: 22, fontWeight: '900' },
  navGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 22, marginBottom: 20 },
  navButton: { width: '48%', backgroundColor: COLORS.white, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, padding: 16 },
  navButtonText: { color: COLORS.text, fontWeight: '900' },
  logoutButton: { marginBottom: 24 }
});
