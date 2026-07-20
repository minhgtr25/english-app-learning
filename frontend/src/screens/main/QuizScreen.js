import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppHeader, EmptyState, PrimaryButton, Screen } from '../../components/ui';
import api from '../../api/client';
import { demoQuestions } from '../../data/demoData';
import { useAuth } from '../../state/AuthContext';

// Quiz screen component containing multiple choice question interactive learning logic
export default function QuizScreen({ route, navigation }) {
  const { category: filterCategory } = route.params || {};
  const { t } = useLanguage();
  const { updateUser, user } = useAuth();
  
  // Set initial questions list based on filter
  const initialQuestions = useMemo(() => {
    if (!filterCategory) return demoQuestions;
    const filtered = demoQuestions.filter(q => q.category?.toLowerCase() === filterCategory.toLowerCase());
    return filtered.length ? filtered : demoQuestions;
  }, [filterCategory]);

  const [questions, setQuestions] = useState(initialQuestions);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.get('/questions')
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data?.questions;
        if (mounted && list?.length) {
          const filtered = filterCategory
            ? list.filter(q => q.category?.toLowerCase() === filterCategory.toLowerCase())
            : list;
          setQuestions(filtered.length ? filtered : list);
        }
      })
      .catch(() => {
        if (mounted) {
          const filtered = filterCategory
            ? demoQuestions.filter(q => q.category?.toLowerCase() === filterCategory.toLowerCase())
            : demoQuestions;
          setQuestions(filtered.length ? filtered : demoQuestions);
          setNotice(t.emptyState);
        }
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [t.emptyState, filterCategory]);

  const question = questions[index] || demoQuestions[0];
  const isCorrect = selected === question.correctAnswer;
  const progress = useMemo(() => `${index + 1}/${questions.length}`, [index, questions.length]);

  const checkAnswer = async () => {
    if (!selected) return;
    setChecked(true);
    const correct = selected === question.correctAnswer;
    if (correct) {
      setScore(value => value + 10);
    }
    
    const scoreVal = correct ? 10 : 0;
    try {
      const { data } = await api.post('/progress/score', {
        questionId: question._id,
        score: scoreVal,
        isCorrect: correct
      });
      if (data?.user) {
        await updateUser(data.user);
      } else {
        const nextQuestions = (user?.totalQuestions || 0) + 1;
        const nextCorrect = (user?.correctQuestions || 0) + (correct ? 1 : 0);
        const nextScore = (user?.totalScore || 0) + scoreVal;
        await updateUser({
          totalScore: nextScore,
          totalQuestions: nextQuestions,
          correctQuestions: nextCorrect
        });
      }
    } catch (err) {
      const nextQuestions = (user?.totalQuestions || 0) + 1;
      const nextCorrect = (user?.correctQuestions || 0) + (correct ? 1 : 0);
      const nextScore = (user?.totalScore || 0) + scoreVal;
      await updateUser({
        totalScore: nextScore,
        totalQuestions: nextQuestions,
        correctQuestions: nextCorrect
      });
    }
  };

  const goNext = async () => {
    if (index < questions.length - 1) {
      setIndex(value => value + 1);
      setSelected('');
      setChecked(false);
      return;
    }
    setCompleted(true);
    try {
      const { data } = await api.post('/progress/complete', { lessonId: filterCategory || 'daily-exam', score });
      if (data?.user) {
        await updateUser(data.user);
      } else {
        await updateUser({ totalQuizzes: (user?.totalQuizzes || 0) + 1 });
      }
    } catch (err) {
      await updateUser({ totalQuizzes: (user?.totalQuizzes || 0) + 1 });
    }
  };

  if (completed) {
    const accuracyVal = questions.length > 0 ? Math.round((score / (questions.length * 10)) * 100) : 100;
    return (
      <Screen style={styles.completedScreen}>
        <View style={styles.completedCard}>
          <Text style={styles.completedEmoji}>🎉</Text>
          <Text style={styles.completedTitle}>MISSION COMPLETE!</Text>
          <Text style={styles.completedSub}>You have successfully finished the {filterCategory || 'Practice'} drill.</Text>

          <View style={styles.resultsGrid}>
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>SCORE GAINED</Text>
              <Text style={styles.resultValue}>+{score} PTS</Text>
            </View>
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>ACCURACY</Text>
              <Text style={styles.resultValue}>{accuracyVal}%</Text>
            </View>
          </View>

          <PrimaryButton
            title="Return to Home"
            onPress={() => navigation.navigate('Home')}
            style={styles.completedBtn}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader
        eyebrow={question.category?.toUpperCase() || 'PRACTICE'}
        title={t.quiz}
        onBack={() => navigation.goBack()}
        right={<Text style={styles.progress}>{progress}</Text>}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{question.title}</Text>
        <Text style={styles.prompt}>{question.englishText}</Text>

        <View style={styles.options}>
          {question.options.map(option => {
            const active = selected === option;
            const correct = checked && option === question.correctAnswer;
            const wrong = checked && active && !correct;
            return (
              <TouchableOpacity
                key={option}
                disabled={checked}
                style={[styles.option, active && styles.optionActive, correct && styles.optionCorrect, wrong && styles.optionWrong]}
                onPress={() => setSelected(option)}
                activeOpacity={0.84}
              >
                <Text style={[styles.optionText, (active || correct || wrong) && styles.optionTextActive]}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {checked && (
          <View style={[styles.feedback, isCorrect ? styles.feedbackGood : styles.feedbackBad]}>
            <Text style={styles.feedbackTitle}>{isCorrect ? t.correct : t.wrong}</Text>
            <Text style={styles.feedbackCopy}>{t.answer}: {question.correctAnswer}</Text>
          </View>
        )}

        {notice ? <EmptyState title={loading ? t.loading : t.emptyState} copy={notice} /> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.score}>{t.score}: {score}</Text>
        <PrimaryButton
          title={checked ? (index === questions.length - 1 ? t.completeLesson : t.nextQuestion) : t.check}
          onPress={checked ? goNext : checkAnswer}
          disabled={!checked && !selected}
          style={styles.action}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 20 },
  progress: { color: COLORS.textLight, fontWeight: '900', fontSize: 14 },
  title: { fontSize: 26, fontWeight: '900', color: COLORS.ink, marginTop: 20 },
  prompt: { backgroundColor: COLORS.white, borderRadius: 24, padding: 22, color: COLORS.text, fontSize: 17, lineHeight: 26, marginTop: 16, borderWidth: 1, borderColor: COLORS.border },
  options: { marginTop: 20, gap: 12 },
  option: { backgroundColor: COLORS.white, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, padding: 18 },
  optionActive: { backgroundColor: COLORS.dark, borderColor: COLORS.dark },
  optionCorrect: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  optionWrong: { backgroundColor: COLORS.error, borderColor: COLORS.error },
  optionText: { color: COLORS.text, fontWeight: '900', fontSize: 16 },
  optionTextActive: { color: COLORS.white },
  feedback: { borderRadius: 18, padding: 18, marginTop: 18, marginBottom: 16 },
  feedbackGood: { backgroundColor: '#E8F6EA' },
  feedbackBad: { backgroundColor: '#FCECEC' },
  feedbackTitle: { color: COLORS.ink, fontWeight: '900', fontSize: 16 },
  feedbackCopy: { color: COLORS.textLight, marginTop: 4 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 14, borderTopWidth: 1, borderTopColor: COLORS.border },
  score: { flex: 1, color: COLORS.ink, fontWeight: '900', fontSize: 16 },
  action: { flex: 1.4 },
  completedScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surface },
  completedCard: { width: '90%', backgroundColor: COLORS.white, borderRadius: 28, borderWidth: 1, borderColor: COLORS.border, padding: 30, alignItems: 'center', shadowColor: COLORS.ink, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  completedEmoji: { fontSize: 60, marginBottom: 16 },
  completedTitle: { color: COLORS.primaryDark, fontSize: 22, fontWeight: '950', letterSpacing: 1 },
  completedSub: { color: COLORS.textLight, fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  resultsGrid: { flexDirection: 'row', gap: 16, marginTop: 24, marginBottom: 28 },
  resultBox: { flex: 1, backgroundColor: COLORS.muted, borderRadius: 20, padding: 16, alignItems: 'center' },
  resultLabel: { color: COLORS.textLight, fontSize: 11, fontWeight: '850', letterSpacing: 0.5 },
  resultValue: { color: COLORS.ink, fontSize: 20, fontWeight: '900', marginTop: 6 },
  completedBtn: { alignSelf: 'stretch' }
});
