import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppHeader, EmptyState, Screen } from '../../components/ui';
import api from '../../api/client';
import { demoUsers } from '../../data/demoData';

const medals = ['Gold', 'Silver', 'Bronze'];

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
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppHeader eyebrow="CLASS RANKING" title={t.topLearners} onBack={() => navigation.goBack()} />
        {notice ? <EmptyState title={t.emptyState} copy={notice} /> : null}

        <View style={styles.list}>
          {[...users].sort((a, b) => b.totalScore - a.totalScore).map((user, index) => (
            <View key={user._id || user.email || index} style={[styles.row, index < 3 && styles.topRow]}>
              <View style={[styles.rank, index === 0 && styles.rankGold, index === 1 && styles.rankSilver, index === 2 && styles.rankBronze]}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={styles.userCopy}>
                <Text style={styles.name}>{user.fullName}</Text>
                <Text style={styles.meta}>{medals[index] || `${user.streak || 0} day streak`}</Text>
              </View>
              <Text style={styles.score}>{user.totalScore}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12, marginTop: 22 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, padding: 15 },
  topRow: { backgroundColor: '#F7FBF4' },
  rank: { width: 42, height: 42, borderRadius: 14, backgroundColor: COLORS.dark, alignItems: 'center', justifyContent: 'center' },
  rankGold: { backgroundColor: COLORS.accent },
  rankSilver: { backgroundColor: COLORS.secondary },
  rankBronze: { backgroundColor: COLORS.primaryDark },
  rankText: { color: COLORS.white, fontWeight: '900' },
  userCopy: { flex: 1, marginLeft: 14 },
  name: { color: COLORS.text, fontWeight: '900', fontSize: 16 },
  meta: { color: COLORS.textLight, marginTop: 3 },
  score: { color: COLORS.primaryDark, fontWeight: '900', fontSize: 18 }
});
