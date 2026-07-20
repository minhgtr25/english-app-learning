import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../i18n/LanguageContext';
import { MetricCard, Screen } from '../../components/ui';
import { useAuth } from '../../state/AuthContext';

const MISSIONS = {
  vi: [
    ['Luyện Từ vựng (Vocabulary)', '10 câu hỏi', 'Trình độ A2', 'Quiz'],
    ['Bài thi Ngữ pháp (Grammar)', '8 câu hỏi', 'Trình độ B1', 'Quiz'],
    ['Phòng luyện nói (Speaking)', 'Phòng nhóm', 'Trực tuyến', 'ChatRoom']
  ],
  en: [
    ['Vocabulary Sprint', '10 questions', 'Level A2', 'Quiz'],
    ['Grammar Exam', '8 questions', 'Level B1', 'Quiz'],
    ['Speaking Room', 'Group chat', 'Live online', 'ChatRoom']
  ]
};

// Main Home screen dashboard displaying user stats, daily missions, and quick access tabs
export default function HomeScreen({ navigation }) {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(prev => !prev);

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <Screen style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header with Hamburger & Language switch */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.menuBtn} onPress={toggleDrawer} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>LINGUALAB</Text>
            <Text style={styles.headerTitle}>{t.homeTitle}</Text>
          </View>
          <TouchableOpacity
            style={styles.langPill}
            onPress={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            activeOpacity={0.8}
          >
            <Text style={styles.langText}>{language.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* User Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>Xin chào, {user?.fullName || 'Demo Student'} 👋</Text>
          <Text style={styles.greetingSub}>{t.homeSubtitle}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <MetricCard label="TỔNG ĐIỂM" value={String(user?.totalScore || 1280)} />
          <MetricCard
            label="ĐIỂM TRUNG BÌNH"
            value={String(user?.totalQuizzes > 0 ? Math.round((user.totalScore || 0) / user.totalQuizzes) : 85)}
          />
          <MetricCard
            label="ĐỘ CHÍNH XÁC"
            value={user?.totalQuestions > 0 ? `${Math.round(((user.correctQuestions || 0) / user.totalQuestions) * 100)}%` : '83%'}
          />
        </View>

        {/* Learning Roadmap */}
        <View style={styles.roadmapHeader}>
          <Text style={styles.sectionTitle}>Nhiệm vụ hôm nay</Text>
          <Text style={styles.sectionSub}>3 bài học mới</Text>
        </View>

        <View style={styles.roadmap}>
          {(MISSIONS[language] || MISSIONS.vi).map((item, index) => {
            const isQuiz = item[3] === 'Quiz';
            const category = item[0].includes('Grammar')
              ? 'Grammar'
              : item[0].includes('Speaking')
              ? 'Speaking'
              : 'Vocabulary';
            return (
              <TouchableOpacity
                key={item[0]}
                style={[styles.mission, index === 1 && styles.missionActive]}
                onPress={() => navigation.navigate(item[3], isQuiz ? { category } : undefined)}
                activeOpacity={0.84}
              >
                <View style={[styles.node, index === 1 && styles.nodeActive]}>
                  <Text style={styles.nodeText}>{index + 1}</Text>
                </View>
                <View style={styles.missionCopy}>
                  <Text style={styles.missionTitle}>{item[0]}</Text>
                  <Text style={styles.missionMeta}>{item[1]} • {item[2]}</Text>
                </View>
                <View style={styles.arrowCircle}>
                  <Text style={styles.missionArrow}>→</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Side Drawer Modal */}
      <Modal visible={drawerOpen} transparent animationType="fade" onRequestClose={toggleDrawer}>
        <View style={styles.modalBackdrop}>
          <View style={styles.drawerContent}>
            {/* User Profile Info in Drawer */}
            <View style={styles.drawerHeader}>
              <View style={styles.drawerAvatar}>
                <Text style={styles.drawerAvatarText}>{initials}</Text>
              </View>
              <Text style={styles.drawerName}>{user?.fullName || 'Demo Student'}</Text>
              <Text style={styles.drawerEmail}>{user?.email || 'student@demo.com'}</Text>
            </View>

            {/* Navigation Drawer Menu Items */}
            <View style={styles.drawerMenu}>
              <DrawerItem
                icon="📝"
                title={t.quiz}
                onPress={() => { toggleDrawer(); navigation.navigate('Quiz'); }}
              />
              <DrawerItem
                icon="💬"
                title={t.chat}
                onPress={() => { toggleDrawer(); navigation.navigate('ChatRoom'); }}
              />
              <DrawerItem
                icon="🏆"
                title={t.leaderboard}
                onPress={() => { toggleDrawer(); navigation.navigate('Leaderboard'); }}
              />
              <DrawerItem
                icon="⚙️"
                title="Cài đặt"
                onPress={() => { toggleDrawer(); navigation.navigate('Settings'); }}
              />
              {user?.role === 'admin' && (
                <DrawerItem
                  icon="🛡️"
                  title={t.admin}
                  onPress={() => { toggleDrawer(); navigation.navigate('AdminDashboard'); }}
                />
              )}
            </View>

            <TouchableOpacity style={styles.closeDrawerBtn} onPress={toggleDrawer}>
              <Text style={styles.closeDrawerText}>Đóng menu</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.backdropPress} onPress={toggleDrawer} activeOpacity={1} />
        </View>
      </Modal>
    </Screen>
  );
}

function DrawerItem({ icon, title, onPress }) {
  return (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.drawerItemIcon}>{icon}</Text>
      <Text style={styles.drawerItemTitle}>{title}</Text>
      <Text style={styles.drawerItemArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  scrollContent: { paddingBottom: 24 },
  topHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 16 },
  menuBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.ink, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  menuIcon: { fontSize: 20, color: COLORS.ink, fontWeight: 'bold' },
  headerCopy: { flex: 1, marginLeft: 14 },
  eyebrow: { color: COLORS.primaryDark, fontWeight: '900', fontSize: 11, letterSpacing: 1.2 },
  headerTitle: { color: COLORS.ink, fontWeight: '950', fontSize: 26, marginTop: 1, letterSpacing: -0.5 },
  langPill: { backgroundColor: COLORS.white, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.border },
  langText: { color: COLORS.primaryDark, fontWeight: '900', fontSize: 12 },

  greetingContainer: { marginTop: 4, marginBottom: 18 },
  greetingTitle: { color: COLORS.ink, fontWeight: '950', fontSize: 20, letterSpacing: -0.3 },
  greetingSub: { color: COLORS.textLight, fontSize: 14, lineHeight: 20, marginTop: 4, fontWeight: '600' },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 22 },

  roadmapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: COLORS.ink, fontWeight: '950', fontSize: 18, letterSpacing: -0.3 },
  sectionSub: { color: COLORS.textLight, fontSize: 12, fontWeight: '700' },

  roadmap: { gap: 12 },
  mission: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border, padding: 18, shadowColor: COLORS.ink, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  missionActive: { borderColor: COLORS.primary, backgroundColor: '#F8FAF7' },
  node: { width: 40, height: 40, borderRadius: 14, backgroundColor: COLORS.dark, alignItems: 'center', justifyContent: 'center' },
  nodeActive: { backgroundColor: COLORS.primary },
  nodeText: { color: COLORS.white, fontWeight: '950', fontSize: 15 },
  missionCopy: { flex: 1, marginLeft: 14 },
  missionTitle: { color: COLORS.ink, fontWeight: '900', fontSize: 16 },
  missionMeta: { color: COLORS.textLight, marginTop: 3, fontSize: 13, fontWeight: '600' },
  arrowCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.muted, alignItems: 'center', justifyContent: 'center' },
  missionArrow: { color: COLORS.ink, fontSize: 16, fontWeight: '900' },

  // Modal & Drawer styles
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.45)', flexDirection: 'row' },
  backdropPress: { flex: 1 },
  drawerContent: { width: '80%', maxWidth: 320, backgroundColor: COLORS.white, padding: 22, justifyContent: 'space-between', shadowColor: COLORS.ink, shadowOffset: { width: 2, height: 0 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 5 },
  drawerHeader: { marginTop: 20, marginBottom: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 20 },
  drawerAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  drawerAvatarText: { color: COLORS.white, fontSize: 20, fontWeight: '950' },
  drawerName: { color: COLORS.ink, fontSize: 18, fontWeight: '950' },
  drawerEmail: { color: COLORS.textLight, fontSize: 12, marginTop: 2, fontWeight: '600' },

  drawerMenu: { flex: 1, gap: 10 },
  drawerItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  drawerItemIcon: { fontSize: 18, marginRight: 12 },
  drawerItemTitle: { flex: 1, color: COLORS.ink, fontWeight: '850', fontSize: 15 },
  drawerItemArrow: { color: COLORS.textLight, fontSize: 18, fontWeight: '800' },

  closeDrawerBtn: { backgroundColor: COLORS.muted, borderRadius: 16, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  closeDrawerText: { color: COLORS.ink, fontWeight: '900', fontSize: 14 }
});
