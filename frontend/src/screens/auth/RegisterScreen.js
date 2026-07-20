import React, { useState } from 'react';
import { Text, StyleSheet, TextInput, View } from 'react-native';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppHeader, Field, PrimaryButton, Screen } from '../../components/ui';
import { useAuth } from '../../state/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { t } = useLanguage();
  const { register } = useAuth();
  const [fullName, setFullName] = useState('Minh Tran');
  const [email, setEmail] = useState('student@demo.com');
  const [password, setPassword] = useState('123456');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setNotice('');
    setLoading(true);
    const result = await register({ fullName, email, password });
    if (!result.ok) {
      setNotice(result.error);
      setLoading(false);
      return;
    }
    setLoading(false);
    navigation.replace('Home');
  };

  return (
    <Screen style={styles.screen}>
      <AppHeader title={t.register} eyebrow="LEARNER PROFILE" onBack={() => navigation.goBack()} />
      <Text style={styles.subtitle}>Create a learner profile for streaks, scoring, leaderboard, and admin analytics.</Text>

      <View style={styles.form}>
        <Field label={t.fullName}>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
        </Field>
        <Field label={t.email}>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        </Field>
        <Field label={t.password}>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
        </Field>
        {!!notice && <Text style={styles.notice}>{notice}</Text>}
        <PrimaryButton title={t.createAccount} onPress={submit} loading={loading} variant="dark" style={styles.button} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { justifyContent: 'center' },
  subtitle: { color: COLORS.textLight, marginTop: 12, marginBottom: 24, lineHeight: 21 },
  form: { backgroundColor: COLORS.white, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border, padding: 18 },
  input: { backgroundColor: COLORS.muted, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border },
  notice: { color: COLORS.warning, marginTop: 12, fontWeight: '700' },
  button: { marginTop: 18 }
});
