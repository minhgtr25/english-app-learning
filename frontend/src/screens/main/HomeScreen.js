import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppHeader, MetricCard, Screen } from '../../components/ui';

const missions = [
  ['Vocabulary', '12 min', '82%', 'Quiz'],
  ['Grammar exam', '18 min', '68%', 'Quiz'],
  ['Speaking room', 'Live', '4 peers', 'ChatRoom']
];

export default function HomeScreen({ navigation }) {
  const { language, setLanguage, t } = useLanguage();

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
        <Text style={styles.subtitle}>{t.homeSubtitle}</Text>

        <View style={styles.statsRow}>
          <MetricCard label={t.streak} value="14" />
          <MetricCard label={t.score} value="1280" />
          <MetricCard label={t.accuracy} value="82%" />
        </View>

        <View style={styles.roadmap}>
          {missions.map((item, index) => (
            <TouchableOpacity
              key={item[0]}
              style={[styles.mission, index === 1 && styles.missionActive]}
              onPress={() => navigation.navigate(item[3])}
              activeOpacity={0.84}
            >
              <View style={styles.node}>
                <Text style={styles.nodeText}>{index + 1}</Text>
              </View>
              <View style={styles.missionCopy}>
                <Text style={styles.missionTitle}>{item[0]}</Text>
                <Text style={styles.missionMeta}>{item[1]} | {item[2]}</Text>
              </View>
              <Text style={styles.missionArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.navGrid}>
          <NavButton title={t.quiz} onPress={() => navigation.navigate('Quiz')} />
          <NavButton title={t.chat} onPress={() => navigation.navigate('ChatRoom')} />
          <NavButton title={t.leaderboard} onPress={() => navigation.navigate('Leaderboard')} />
          <NavButton title={t.admin} onPress={() => navigation.navigate('AdminDashboard')} />
        </View>
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
  missionArrow: { color: COLORS.textLight, fontSize: 30, fontWeight: '700' },
  navGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 22, marginBottom: 20 },
  navButton: { width: '48%', backgroundColor: COLORS.white, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, padding: 16 },
  navButtonText: { color: COLORS.text, fontWeight: '900' }
});
