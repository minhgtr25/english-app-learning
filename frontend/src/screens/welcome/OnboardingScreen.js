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
          <View style={[styles.tile, styles.tileWide]} />
          <View style={[styles.tile, styles.tileAccent]} />
          <View style={[styles.tile, styles.tileDark]} />
        </View>
      </View>

      <View>
        <View style={styles.dots}>
          {CONTENT[language].map((_, dotIndex) => (
            <View key={dotIndex} style={[styles.dot, index === dotIndex && styles.dotActive]} />
          ))}
        </View>
        <TouchableOpacity style={styles.nextBtn} onPress={next}>
          <Text style={styles.nextText}>{index === 2 ? t.createAccount : t.next}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface, padding: 22 },
  skip: { alignSelf: 'flex-end', paddingVertical: 10 },
  skipText: { color: COLORS.textLight, fontWeight: '800' },
  panel: { flex: 1, justifyContent: 'center' },
  kicker: { color: COLORS.secondaryDark, fontWeight: '900', marginBottom: 14 },
  title: { fontSize: 34, fontWeight: '900', color: COLORS.ink, lineHeight: 40 },
  copy: { color: COLORS.textLight, fontSize: 16, lineHeight: 24, marginTop: 14 },
  visualGrid: { marginTop: 34, height: 190, gap: 12 },
  tile: { flex: 1, borderRadius: 24, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  tileWide: { flex: 1.2, backgroundColor: COLORS.muted },
  tileAccent: { backgroundColor: COLORS.accent },
  tileDark: { backgroundColor: COLORS.dark },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 18 },
  dot: { width: 8, height: 8, borderRadius: 10, backgroundColor: COLORS.border },
  dotActive: { width: 26, backgroundColor: COLORS.primary },
  nextBtn: { backgroundColor: COLORS.dark, borderRadius: 18, paddingVertical: 17, alignItems: 'center' },
  nextText: { color: COLORS.white, fontWeight: '900', fontSize: 16 }
});
