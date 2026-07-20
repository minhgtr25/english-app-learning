import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppHeader, EmptyState, Screen } from '../../components/ui';
import api from '../../api/client';
import { demoUsers } from '../../data/demoData';

const medals = ['🥇 Gold', '🥈 Silver', '🥉 Bronze'];

function UserAvatar({ name, index }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';
  
  // Pick background color based on index to make it colorful
  const bgColors = ['#FFE0B2', '#E0F2F1', '#F1F8E9', '#ECEFF1'];
  const textColors = ['#E65100', '#004D40', '#33691E', '#37474F'];
  const bg = bgColors[index % bgColors.length];
  const color = textColors[index % textColors.length];

  return (
    <View style={[styles.avatar, { backgroundColor: bg }]}>
      <Text style={[styles.avatarText, { color }]}>{initials}</Text>
    </View>
  );
}

export default function LeaderboardScreen({ navigation }) {
  const { t } = useLanguage();
  const [users, setUsers] = useState(demoUsers);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let mounted = true;
    api.get('/users/leaderboard')
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data?.users;
        if (mounted && list?.length) setUsers(list);
      })
      .catch(() => setNotice(t.emptyState));
    return () => { mounted = false; };
  }, [t.emptyState]);

  return (
    <Screen style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppHeader eyebrow="CLASS RANKING" title={t.topLearners} onBack={() => navigation.goBack()} />
        {notice ? <EmptyState title={t.emptyState} copy={notice} style={styles.noticeCard} /> : null}

        <View style={styles.list}>
          {[...users].sort((a, b) => b.totalScore - a.totalScore).map((user, index) => {
            const isTop3 = index < 3;
            const accuracyVal = user.totalQuestions > 0
              ? Math.round((user.correctQuestions / user.totalQuestions) * 100)
              : 85;
            return (
              <View key={user._id || user.email || index} style={[styles.row, isTop3 && styles.topRow]}>
                <View style={[styles.rank, index === 0 && styles.rankGold, index === 1 && styles.rankSilver, index === 2 && styles.rankBronze]}>
                  <Text style={[styles.rankText, isTop3 && styles.rankTextTop]}>{index + 1}</Text>
                </View>
                
                <UserAvatar name={user.fullName} index={index} />
                
                <View style={styles.userCopy}>
                  <Text style={styles.name}>{user.fullName}</Text>
                  <Text style={styles.meta}>
                    {isTop3 ? `${medals[index]} • ${accuracyVal}% Accuracy` : `${user.totalQuizzes || 10} Quizzes • ${accuracyVal}% Accuracy`}
                  </Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={styles.score}>{user.totalScore}</Text>
                  <Text style={styles.scoreLabel}>PTS</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  noticeCard: { marginTop: 14 },
  list: { gap: 12, marginTop: 22, paddingBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 14, shadowColor: COLORS.ink, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  topRow: { backgroundColor: '#F8FAF7', borderColor: 'rgba(67, 160, 71, 0.2)' },
  rank: { width: 34, height: 34, borderRadius: 12, backgroundColor: COLORS.muted, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rankGold: { backgroundColor: '#FFF9C4' },
  rankSilver: { backgroundColor: '#E0F7FA' },
  rankBronze: { backgroundColor: '#E8F5E9' },
  rankText: { color: COLORS.textLight, fontWeight: '900', fontSize: 13 },
  rankTextTop: { color: COLORS.dark },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: COLORS.border },
  avatarText: { fontSize: 14, fontWeight: '900' },
  userCopy: { flex: 1 },
  name: { color: COLORS.ink, fontWeight: '900', fontSize: 16 },
  meta: { color: COLORS.textLight, fontSize: 12, marginTop: 4, fontWeight: '700' },
  scoreContainer: { alignItems: 'flex-end' },
  score: { color: COLORS.primaryDark, fontWeight: '950', fontSize: 18 },
  scoreLabel: { color: COLORS.textLight, fontSize: 9, fontWeight: '900', marginTop: 2 }
});
