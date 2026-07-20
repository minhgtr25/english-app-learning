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
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Enter your name" placeholderTextColor={COLORS.textLight} />
        </Field>
        <Field label={t.email}>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="student@demo.com" placeholderTextColor={COLORS.textLight} />
        </Field>
        <Field label={t.password}>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" placeholderTextColor={COLORS.textLight} />
        </Field>
        {!!notice && <Text style={styles.notice}>{notice}</Text>}
        <PrimaryButton title={t.createAccount} onPress={submit} loading={loading} variant="dark" style={styles.button} />

        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
          <Text style={styles.loginLinkLabel}>
            Already have an account? <Text style={styles.loginLinkHighlight}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { justifyContent: 'center' },
  subtitle: { color: COLORS.textLight, marginTop: 10, marginBottom: 20, lineHeight: 21, fontSize: 14 },
  form: { backgroundColor: COLORS.white, borderRadius: 28, borderWidth: 1, borderColor: COLORS.border, padding: 22, shadowColor: COLORS.ink, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  input: { backgroundColor: COLORS.muted, borderRadius: 16, paddingHorizontal: 16, height: 50, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, fontSize: 15 },
  notice: { color: COLORS.error, marginTop: 10, fontWeight: '850', fontSize: 13, textAlign: 'center' },
  button: { marginTop: 12 },
  loginLink: { marginTop: 18, alignItems: 'center', paddingVertical: 8 },
  loginLinkLabel: { color: COLORS.textLight, fontSize: 14, fontWeight: '700' },
  loginLinkHighlight: { color: COLORS.primaryDark, fontWeight: '900' }
});
