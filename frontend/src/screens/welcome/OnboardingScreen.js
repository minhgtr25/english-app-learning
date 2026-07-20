import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
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
      // Roadmap Pathway Illustration
      return (
        <View style={styles.illustrationContainer}>
          <View style={styles.roadmapLine} />
          <View style={styles.roadmapContainer}>
            <View style={[styles.roadmapNode, styles.nodeDone]}>
              <Text style={styles.nodeIcon}>✓</Text>
            </View>
            <View style={[styles.roadmapNode, styles.nodeActive]}>
              <Text style={styles.nodeTextActive}>2</Text>
              <View style={styles.pulseRing} />
            </View>
            <View style={styles.roadmapNode}>
              <Text style={styles.nodeText}>3</Text>
            </View>
          </View>
          <Text style={styles.illustrationCaption}>Vocabulary • Grammar • Speaking</Text>
        </View>
      );
    }
    
    if (index === 1) {
      // Exam Feedback Mockup
      return (
        <View style={styles.illustrationContainer}>
          <View style={styles.mockQuizCard}>
            <Text style={styles.mockQuizTitle}>Choose closest meaning to "rapid":</Text>
            <View style={styles.mockOption}>
              <Text style={styles.mockOptionText}>late</Text>
            </View>
            <View style={[styles.mockOption, styles.mockOptionCorrect]}>
              <Text style={[styles.mockOptionText, styles.mockOptionTextActive]}>fast  ✓</Text>
            </View>
            <View style={styles.scorePop}>
              <Text style={styles.scorePopText}>+10 XP</Text>
            </View>
          </View>
        </View>
      );
    }

    // Classroom Chat Mockup
    return (
      <View style={styles.illustrationContainer}>
        <View style={styles.chatMock}>
          <View style={styles.avatarStack}>
            <View style={[styles.miniAvatar, { backgroundColor: '#FFE0B2', zIndex: 3 }]}>
              <Text style={{ fontSize: 10, fontWeight: '900', color: '#E65100' }}>MT</Text>
            </View>
            <View style={[styles.miniAvatar, { backgroundColor: '#E0F2F1', zIndex: 2, marginLeft: -12 }]}>
              <Text style={{ fontSize: 10, fontWeight: '900', color: '#004D40' }}>LN</Text>
            </View>
            <View style={[styles.miniAvatar, { backgroundColor: '#ECEFF1', zIndex: 1, marginLeft: -12 }]}>
              <Text style={{ fontSize: 10, fontWeight: '900', color: '#37474F' }}>BP</Text>
            </View>
          </View>
          <View style={styles.mockBubble}>
            <Text style={styles.mockBubbleText}>Let's practice English together! 💬</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.skipText}>{t.skip}</Text>
      </TouchableOpacity>

      <View style={styles.panel}>
        <Text style={styles.kicker}>0{index + 1} / 03</Text>
        <Text style={styles.title}>{slide[0]}</Text>
        <Text style={styles.copy}>{slide[1]}</Text>
        <View style={styles.visualGrid}>
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
  container: { flex: 1, backgroundColor: COLORS.surface, paddingHorizontal: 22, paddingTop: 10 },
  skip: { alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 12 },
  skipText: { color: COLORS.textLight, fontWeight: '800', fontSize: 14 },
  panel: { flex: 1, justifyContent: 'center' },
  kicker: { color: COLORS.primaryDark, fontWeight: '900', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: '950', color: COLORS.ink, lineHeight: 38, letterSpacing: -0.5 },
  copy: { color: COLORS.textLight, fontSize: 15, lineHeight: 22, marginTop: 10 },
  visualGrid: { marginTop: 28, height: 210, backgroundColor: COLORS.white, borderRadius: 28, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', shadowColor: COLORS.ink, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 18 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  dotActive: { width: 22, backgroundColor: COLORS.primary },
  nextBtn: { backgroundColor: COLORS.dark, borderRadius: 18, height: 54, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.dark, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  nextText: { color: COLORS.white, fontWeight: '900', fontSize: 16 },
  footer: { paddingBottom: 16 },
  loginLink: { marginTop: 14, alignItems: 'center', paddingVertical: 8 },
  loginLinkLabel: { color: COLORS.textLight, fontSize: 14, fontWeight: '700' },
  loginLinkHighlight: { color: COLORS.primaryDark, fontWeight: '900' },
  
  // Custom Illustrations styling
  illustrationContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  roadmapContainer: { flexDirection: 'row', alignItems: 'center', gap: 30, zIndex: 2 },
  roadmapLine: { position: 'absolute', width: 150, height: 4, backgroundColor: COLORS.border, top: '48%', zIndex: 1 },
  roadmapNode: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.muted, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  nodeDone: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  nodeIcon: { color: COLORS.white, fontSize: 18, fontWeight: '900' },
  nodeActive: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.white, borderColor: COLORS.primary, borderWidth: 3 },
  nodeTextActive: { color: COLORS.primaryDark, fontWeight: '900', fontSize: 16 },
  nodeText: { color: COLORS.textLight, fontWeight: '700' },
  pulseRing: { position: 'absolute', width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: COLORS.primary, opacity: 0.4 },
  illustrationCaption: { color: COLORS.textLight, fontSize: 12, marginTop: 24, fontWeight: '700' },

  mockQuizCard: { alignSelf: 'stretch', backgroundColor: COLORS.surface, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 16 },
  mockQuizTitle: { color: COLORS.ink, fontSize: 14, fontWeight: '900', marginBottom: 12 },
  mockOption: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 8 },
  mockOptionCorrect: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  mockOptionText: { color: COLORS.text, fontWeight: '700', fontSize: 13 },
  mockOptionTextActive: { color: COLORS.white },
  scorePop: { position: 'absolute', right: 12, top: -14, backgroundColor: COLORS.accent, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, shadowColor: COLORS.ink, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  scorePopText: { color: COLORS.ink, fontSize: 11, fontWeight: '950' },

  chatMock: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 10 },
  avatarStack: { flexDirection: 'row', alignItems: 'center' },
  miniAvatar: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
  mockBubble: { backgroundColor: COLORS.muted, borderRadius: 18, borderTopLeftRadius: 4, paddingVertical: 10, paddingHorizontal: 14, maxWidth: '70%', borderWidth: 1, borderColor: COLORS.border },
  mockBubbleText: { color: COLORS.ink, fontSize: 13, fontWeight: '800', lineHeight: 18 }
});
