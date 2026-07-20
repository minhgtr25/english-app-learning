import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppHeader, EmptyState, PrimaryButton, Screen } from '../../components/ui';
import api from '../../api/client';
import { demoQuestions } from '../../data/demoData';

export default function QuizScreen({ navigation }) {
  const { t } = useLanguage();
  const [questions, setQuestions] = useState(demoQuestions);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.get('/questions')
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data?.questions;
        if (mounted && list?.length) setQuestions(list);
      })
      .catch(() => setNotice(t.emptyState))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [t.emptyState]);

  const question = questions[index];
  const isCorrect = selected === question.correctAnswer;
  const progress = useMemo(() => `${index + 1}/${questions.length}`, [index, questions.length]);

  const checkAnswer = async () => {
    if (!selected) return;
    setChecked(true);
    if (selected === question.correctAnswer) {
      setScore(value => value + 10);
      try {
        await api.post('/progress/score', { questionId: question._id, score: 10 });
      } catch (err) {
        setNotice(t.emptyState);
      }
    }
  };

  const goNext = async () => {
    if (index < questions.length - 1) {
      setIndex(value => value + 1);
      setSelected('');
      setChecked(false);
      return;
    }
    try {
      await api.post('/progress/complete', { lessonId: 'daily-exam', score });
    } catch (err) {
      setNotice(t.emptyState);
    } finally {
      navigation.navigate('Home');
    }
  };

  return (
    <Screen>
      <AppHeader eyebrow={question.category} title={t.quiz} onBack={() => navigation.goBack()} right={<Text style={styles.progress}>{progress}</Text>} />
      <ScrollView showsVerticalScrollIndicator={false}>
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
  progress: { color: COLORS.textLight, fontWeight: '900' },
  title: { fontSize: 30, fontWeight: '900', color: COLORS.ink, marginTop: 24 },
  prompt: { backgroundColor: COLORS.white, borderRadius: 24, padding: 20, color: COLORS.text, fontSize: 18, lineHeight: 27, marginTop: 18, borderWidth: 1, borderColor: COLORS.border },
  options: { marginTop: 20, gap: 12 },
  option: { backgroundColor: COLORS.white, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, padding: 17 },
  optionActive: { backgroundColor: COLORS.dark, borderColor: COLORS.dark },
  optionCorrect: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  optionWrong: { backgroundColor: COLORS.error, borderColor: COLORS.error },
  optionText: { color: COLORS.text, fontWeight: '900', fontSize: 16 },
  optionTextActive: { color: COLORS.white },
  feedback: { borderRadius: 18, padding: 16, marginTop: 18, marginBottom: 16 },
  feedbackGood: { backgroundColor: '#E8F6EA' },
  feedbackBad: { backgroundColor: '#FCECEC' },
  feedbackTitle: { color: COLORS.ink, fontWeight: '900', fontSize: 16 },
  feedbackCopy: { color: COLORS.textLight, marginTop: 4 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 12 },
  score: { flex: 1, color: COLORS.ink, fontWeight: '900', fontSize: 16 },
  action: { flex: 1.4 }
});
