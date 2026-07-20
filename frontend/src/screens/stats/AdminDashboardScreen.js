import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppHeader, EmptyState, Field, MetricCard, PrimaryButton, Screen } from '../../components/ui';
import api from '../../api/client';
import { demoQuestions } from '../../data/demoData';

const width = Dimensions.get('window').width - 44;

export default function AdminDashboardScreen({ navigation }) {
  const { t } = useLanguage();
  const [questions, setQuestions] = useState(demoQuestions);
  const [analytics, setAnalytics] = useState({
    metrics: {
      questionCount: demoQuestions.length,
      learnerCount: 4,
      completedLessons: 12,
      averageScore: 1096
    },
    weeklyScores: [18, 36, 42, 64, 81]
  });
  const [notice, setNotice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: 'Speaking Warmup',
    category: 'Speaking',
    englishText: 'Choose the best response: How are you doing?',
    correctAnswer: 'I am doing well.',
    options: 'I am doing well., It is a book., At 7 PM., Blue',
    level: 'A2'
  });

  useEffect(() => {
    let mounted = true;
    api.get('/questions')
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data?.questions;
        if (mounted && list?.length) setQuestions(list);
      })
      .catch(() => setNotice(t.emptyState));

    api.get('/analytics')
      .then(({ data }) => {
        if (mounted && data?.metrics) {
          setAnalytics({
            metrics: data.metrics,
            weeklyScores: data.weeklyScores?.length ? data.weeklyScores : [18, 36, 42, 64, 81]
          });
        }
      })
      .catch(() => setNotice(t.emptyState));

    return () => { mounted = false; };
  }, [t.emptyState]);

  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));

  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: 'Speaking Warmup',
      category: 'Speaking',
      englishText: 'Choose the best response: How are you doing?',
      correctAnswer: 'I am doing well.',
      options: 'I am doing well., It is a book., At 7 PM., Blue',
      level: 'A2'
    });
  };

  const startEdit = question => {
    setEditingId(question._id);
    setForm({
      title: question.title,
      category: question.category,
      englishText: question.englishText,
      correctAnswer: question.correctAnswer,
      options: question.options.join(', '),
      level: question.level
    });
  };

  const saveQuestion = async () => {
    setSaving(true);
    const payload = {
      ...form,
      options: form.options.split(',').map(item => item.trim()).filter(Boolean)
    };

    try {
      if (editingId) {
        const { data } = await api.put(`/questions/${editingId}`, payload);
        const updatedQuestion = data?.question || { ...payload, _id: editingId };
        setQuestions(current => current.map(item => item._id === editingId ? updatedQuestion : item));
      } else {
        const draft = { ...payload, _id: String(Date.now()) };
        const { data } = await api.post('/questions', draft);
        setQuestions(current => [data?.question || draft, ...current]);
      }
      resetForm();
    } catch (err) {
      if (editingId) {
        setQuestions(current => current.map(item => item._id === editingId ? { ...payload, _id: editingId } : item));
      } else {
        setQuestions(current => [{ ...payload, _id: String(Date.now()) }, ...current]);
      }
      setNotice(t.emptyState);
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const removeQuestion = async id => {
    setQuestions(current => current.filter(item => item._id !== id));
    try {
      await api.delete(`/questions/${id}`);
    } catch (err) {
      setNotice(t.emptyState);
    }
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppHeader eyebrow="ADMIN PANEL" title={t.analytics} onBack={() => navigation.goBack()} />
        {notice ? <EmptyState title={t.emptyState} copy={notice} /> : null}

        <View style={styles.metrics}>
          <MetricCard label={t.questionBank} value={String(analytics.metrics.questionCount || questions.length)} tone="light" />
          <MetricCard label="Learners" value={String(analytics.metrics.learnerCount || 0)} tone="light" />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Weekly score growth</Text>
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
              datasets: [{ data: analytics.weeklyScores }]
            }}
            width={Math.max(width - 34, 280)}
            height={190}
            chartConfig={{
              backgroundGradientFrom: COLORS.white,
              backgroundGradientTo: COLORS.white,
              decimalPlaces: 0,
              color: opacity => `rgba(67, 160, 71, ${opacity})`,
              labelColor: () => COLORS.textLight,
              propsForDots: { r: '4', strokeWidth: '2', stroke: COLORS.primaryDark }
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.form}>
          <View style={styles.formHeader}>
            <Text style={styles.sectionTitle}>{editingId ? 'Edit question' : t.addQuestion}</Text>
            {editingId ? (
              <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {[
            ['title', t.title],
            ['category', t.category],
            ['level', t.level],
            ['englishText', 'Question text'],
            ['correctAnswer', t.answer],
            ['options', t.options]
          ].map(([key, label]) => (
            <Field key={key} label={label}>
              <TextInput style={styles.input} value={form[key]} onChangeText={value => update(key, value)} />
            </Field>
          ))}
          <PrimaryButton title={editingId ? 'Update' : t.save} onPress={saveQuestion} loading={saving} variant="dark" style={styles.button} />
        </View>

        <Text style={styles.sectionTitle}>{t.questionBank}</Text>
        <View style={styles.bank}>
          {questions.map(item => (
            <View key={item._id} style={styles.questionRow}>
              <View style={styles.questionCopy}>
                <Text style={styles.questionTitle}>{item.title}</Text>
                <Text style={styles.questionMeta}>{item.category} | {item.level}</Text>
              </View>
              <View style={styles.rowActions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => startEdit(item)}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => removeQuestion(item._id)}>
                  <Text style={styles.deleteText}>{t.delete}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  metrics: { flexDirection: 'row', gap: 10, marginTop: 20 },
  chartCard: { backgroundColor: COLORS.white, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border, padding: 17, marginTop: 18, overflow: 'hidden' },
  sectionTitle: { color: COLORS.ink, fontWeight: '900', fontSize: 18, marginBottom: 14, marginTop: 18 },
  chart: { borderRadius: 18 },
  form: { backgroundColor: COLORS.white, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border, padding: 17, marginTop: 18 },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cancelBtn: { backgroundColor: COLORS.muted, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  cancelText: { color: COLORS.text, fontWeight: '900' },
  input: { backgroundColor: COLORS.muted, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 11, color: COLORS.text },
  button: { marginTop: 16 },
  bank: { gap: 10, marginBottom: 24 },
  questionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  questionCopy: { flex: 1 },
  questionTitle: { color: COLORS.text, fontWeight: '900' },
  questionMeta: { color: COLORS.textLight, marginTop: 3 },
  rowActions: { flexDirection: 'row', gap: 8 },
  editBtn: { backgroundColor: '#E8F6EA', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  editText: { color: COLORS.primaryDark, fontWeight: '900' },
  deleteBtn: { backgroundColor: '#FCECEC', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  deleteText: { color: COLORS.error, fontWeight: '900' }
});
