import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { COLORS } from '../../theme/colors';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '🎯',
    title: 'Bài học ngắn gọn',
    desc: 'Luyện tập 5-10 phút mỗi ngày với các bài học thiết kế dạng trò chơi cuốn hút.'
  },
  {
    id: '2',
    emoji: '🔥',
    title: 'Duy trì Streak',
    desc: 'Học liên tục mỗi ngày để duy trì chuỗi Streak và nhận nhiều phần thưởng hấp dẫn.'
  },
  {
    id: '3',
    emoji: '💬',
    title: 'Giao lưu Realtime',
    desc: 'Trò chuyện trực tiếp cùng các học viên khác để nâng cao khả năng phản xạ.'
  }
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      navigation.navigate('Register');
    }
  };

  const slide = SLIDES[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Skip Button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.skipText}>Bỏ qua</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Slide */}
      <View style={styles.content}>
        <Text style={styles.emoji}>{slide.emoji}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.desc}>{slide.desc}</Text>
      </View>

      {/* Indicator & Next Button */}
      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {SLIDES.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.indicator, 
                currentIndex === index ? styles.activeIndicator : styles.inactiveIndicator
              ]} 
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>
            {currentIndex === SLIDES.length - 1 ? 'TẠO TÀI KHOẢN' : 'TIẾP THEO'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, paddingHorizontal: 24, justifyContent: 'space-between' },
  topBar: { alignItems: 'flex-end', paddingTop: 10 },
  skipText: { color: COLORS.textLight, fontSize: 15, fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  emoji: { fontSize: 90, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: COLORS.text, textAlign: 'center', marginBottom: 15 },
  desc: { fontSize: 16, color: COLORS.textLight, textAlign: 'center', lineHeight: 24 },
  footer: { marginBottom: 40 },
  indicatorContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 25 },
  indicator: { height: 8, borderRadius: 4, marginHorizontal: 4 },
  activeIndicator: { width: 24, backgroundColor: COLORS.primary },
  inactiveIndicator: { width: 8, backgroundColor: COLORS.border },
  nextBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  nextBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' }
});