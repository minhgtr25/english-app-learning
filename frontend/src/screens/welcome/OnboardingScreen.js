import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../i18n/LanguageContext';

const CONTENT = {
  vi: [
    ['Lộ trình như game', 'Mỗi bài là một nhiệm vụ nhỏ: nghe, từ vựng, ngữ pháp và đọc hiểu.'],
    ['Thi thử có phản hồi', 'Chọn đáp án, xem đúng sai ngay, cộng điểm và hoàn thành bài học.'],
    ['Học cùng lớp', 'Chat realtime, bảng xếp hạng và dashboard giúp nhóm theo dõi tiến độ.']
  ],
  en: [
    ['Game-like roadmap', 'Each lesson is a compact mission across listening, vocabulary, grammar, and reading.'],
    ['Exam feedback', 'Answer questions, see instant feedback, earn points, and complete lessons.'],
    ['Learn with your class', 'Realtime chat, leaderboard, and admin analytics keep the class moving.']
  ]
};

export default function OnboardingScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const { language, t } = useLanguage();
  const slide = CONTENT[language][index];

  const next = () => {
    if (index === CONTENT[language].length - 1) {
      navigation.navigate('Register');
      return;
    }
    setIndex(value => value + 1);
  };

  const renderIllustration = () => {
    if (index === 0) {
      return (
        <View style={styles.illustrationContainer}>
          <View style={styles.roadmapLine} />
          <View style={styles.roadmapContainer}>
            <View style={styles.nodeWrapper}>
              <View style={[styles.roadmapNode, styles.nodeDone]}>
                <Text style={styles.nodeIcon}>✓</Text>
              </View>
              <Text style={styles.nodeTag}>Vocab</Text>
            </View>

            <View style={styles.nodeWrapper}>
              <View style={[styles.roadmapNode, styles.nodeActive]}>
                <Text style={styles.nodeTextActive}>2</Text>
              </View>
              <Text style={[styles.nodeTag, styles.nodeTagActive]}>Grammar</Text>
            </View>

            <View style={styles.nodeWrapper}>
              <View style={styles.roadmapNode}>
                <Text style={styles.nodeText}>3</Text>
              </View>
              <Text style={styles.nodeTag}>Speaking</Text>
            </View>
          </View>
        </View>
      );
    }
    
    if (index === 1) {
      return (
        <View style={styles.illustrationContainer}>
          <View style={styles.mockQuizCard}>
            <View style={styles.quizBadgeHeader}>
              <Text style={styles.quizBadgeTitle}>PRACTICE DRILL</Text>
              <View style={styles.scorePop}>
                <Text style={styles.scorePopText}>+10 XP</Text>
              </View>
            </View>
            <Text style={styles.mockQuizTitle}>Closest meaning to "rapid":</Text>
            <View style={styles.mockOption}>
              <Text style={styles.mockOptionText}>A. late</Text>
            </View>
            <View style={[styles.mockOption, styles.mockOptionCorrect]}>
              <Text style={[styles.mockOptionText, styles.mockOptionTextActive]}>B. fast  ✓</Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.illustrationContainer}>
        <View style={styles.chatMockCard}>
          <View style={styles.chatHeader}>
            <View style={styles.avatarStack}>
              <View style={[styles.miniAvatar, { backgroundColor: '#FFE0B2', zIndex: 3 }]}>
                <Text style={{ fontSize: 9, fontWeight: '900', color: '#E65100' }}>MT</Text>
              </View>
              <View style={[styles.miniAvatar, { backgroundColor: '#E0F2F1', zIndex: 2, marginLeft: -8 }]}>
                <Text style={{ fontSize: 9, fontWeight: '900', color: '#004D40' }}>LN</Text>
              </View>
              <View style={[styles.miniAvatar, { backgroundColor: '#F1F8E9', zIndex: 1, marginLeft: -8 }]}>
                <Text style={{ fontSize: 9, fontWeight: '900', color: '#33691E' }}>BP</Text>
              </View>
            </View>
            <Text style={styles.chatRoomTitle}>Class Study Group</Text>
          </View>

          <View style={styles.chatBody}>
            <View style={styles.bubbleOther}>
              <Text style={styles.bubbleSender}>Coach • 09:12</Text>
              <Text style={styles.bubbleTextOther}>Describe your hometown in 1 sentence.</Text>
            </View>
            <View style={styles.bubbleSelf}>
              <Text style={styles.bubbleSenderSelf}>You • 09:13</Text>
              <Text style={styles.bubbleTextSelf}>My hometown is peaceful and bright.</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <View style={styles.kickerBadge}>
          <Text style={styles.kickerText}>0{index + 1} / 03</Text>
        </View>
        <TouchableOpacity style={styles.skip} onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
          <Text style={styles.skipText}>{t.skip}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentArea}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{slide[0]}</Text>
          <Text style={styles.copy}>{slide[1]}</Text>
        </View>

        <View style={styles.illustrationCard}>
          {renderIllustration()}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {CONTENT[language].map((_, dotIndex) => (
            <View key={dotIndex} style={[styles.dot, index === dotIndex && styles.dotActive]} />
          ))}
        </View>
        
        <TouchableOpacity style={styles.nextBtn} onPress={next} activeOpacity={0.85}>
          <Text style={styles.nextText}>{index === 2 ? t.createAccount : t.next}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
          <Text style={styles.loginLinkLabel}>
            Already have an account? <Text style={styles.loginLinkHighlight}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface, paddingHorizontal: 22, paddingTop: Platform.OS === 'android' ? 24 : 10 },
  topHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 12 },
  kickerBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  kickerText: { color: COLORS.primaryDark, fontWeight: '900', fontSize: 12, letterSpacing: 0.5 },
  skip: { padding: 6 },
  skipText: { color: COLORS.textLight, fontWeight: '800', fontSize: 14 },
  
  contentArea: { flex: 1, justifyContent: 'space-between' },
  textContainer: { marginTop: 8, marginBottom: 16 },
  title: { fontSize: 30, fontWeight: '950', color: COLORS.ink, lineHeight: 36, letterSpacing: -0.5 },
  copy: { color: COLORS.textLight, fontSize: 15, lineHeight: 22, marginTop: 8 },
  
  illustrationCard: { flex: 1, minHeight: 240, maxHeight: 310, backgroundColor: COLORS.white, borderRadius: 28, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', shadowColor: COLORS.ink, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, marginBottom: 20 },
  illustrationContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  
  // Roadmap slide styles
  roadmapContainer: { flexDirection: 'row', alignItems: 'center', gap: 24, zIndex: 2 },
  roadmapLine: { position: 'absolute', width: 140, height: 3, backgroundColor: COLORS.border, top: '40%', zIndex: 1 },
  nodeWrapper: { alignItems: 'center', gap: 8 },
  roadmapNode: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  nodeDone: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  nodeIcon: { color: COLORS.white, fontSize: 16, fontWeight: '900' },
  nodeActive: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.white, borderColor: COLORS.primary, borderWidth: 3 },
  nodeTextActive: { color: COLORS.primaryDark, fontWeight: '900', fontSize: 16 },
  nodeText: { color: COLORS.textLight, fontWeight: '700' },
  nodeTag: { color: COLORS.textLight, fontSize: 11, fontWeight: '700' },
  nodeTagActive: { color: COLORS.primaryDark, fontWeight: '900' },

  // Quiz slide styles
  mockQuizCard: { alignSelf: 'stretch', backgroundColor: COLORS.surface, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 16 },
  quizBadgeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  quizBadgeTitle: { color: COLORS.textLight, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  mockQuizTitle: { color: COLORS.ink, fontSize: 14, fontWeight: '900', marginBottom: 12 },
  mockOption: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 8 },
  mockOptionCorrect: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  mockOptionText: { color: COLORS.text, fontWeight: '700', fontSize: 13 },
  mockOptionTextActive: { color: COLORS.white },
  scorePop: { backgroundColor: COLORS.accent, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  scorePopText: { color: COLORS.ink, fontSize: 10, fontWeight: '950' },

  // Chat slide styles
  chatMockCard: { alignSelf: 'stretch', backgroundColor: COLORS.surface, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  avatarStack: { flexDirection: 'row', alignItems: 'center' },
  miniAvatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
  chatRoomTitle: { color: COLORS.ink, fontSize: 12, fontWeight: '900' },
  chatBody: { gap: 8 },
  bubbleOther: { alignSelf: 'flex-start', backgroundColor: COLORS.white, borderRadius: 14, borderTopLeftRadius: 2, padding: 10, borderWidth: 1, borderColor: COLORS.border, maxWidth: '85%' },
  bubbleSender: { color: COLORS.textLight, fontSize: 10, fontWeight: '800', marginBottom: 2 },
  bubbleTextOther: { color: COLORS.text, fontSize: 12, lineHeight: 16 },
  bubbleSelf: { alignSelf: 'flex-end', backgroundColor: COLORS.primary, borderRadius: 14, borderTopRightRadius: 2, padding: 10, maxWidth: '85%' },
  bubbleSenderSelf: { color: 'rgba(255, 255, 255, 0.75)', fontSize: 10, fontWeight: '800', marginBottom: 2 },
  bubbleTextSelf: { color: COLORS.white, fontSize: 12, lineHeight: 16 },

  // Footer styles
  footer: { paddingBottom: 16 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  dotActive: { width: 22, backgroundColor: COLORS.primary },
  nextBtn: { backgroundColor: COLORS.dark, borderRadius: 18, height: 54, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.dark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  nextText: { color: COLORS.white, fontWeight: '900', fontSize: 16 },
  loginLink: { marginTop: 14, alignItems: 'center', paddingVertical: 6 },
  loginLinkLabel: { color: COLORS.textLight, fontSize: 14, fontWeight: '700' },
  loginLinkHighlight: { color: COLORS.primaryDark, fontWeight: '900' }
});
