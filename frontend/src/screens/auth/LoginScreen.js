import React, { useState } from 'react';
import { Text, StyleSheet, TextInput, View } from 'react-native';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppHeader, Field, PrimaryButton, Screen } from '../../components/ui';
import { useAuth } from '../../state/AuthContext';

export default function LoginScreen({ navigation }) {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [email, setEmail] = useState('student@demo.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError('');
    setLoading(true);
    const result = await login({ email, password });
    if (result.demo) {
      setError(t.demoMode);
    }
    setLoading(false);
    navigation.replace('Home');
  };

  return (
    <Screen style={styles.screen}>
      <AppHeader title={t.login} eyebrow="JWT AUTH" onBack={() => navigation.goBack()} />
      <Text style={styles.subtitle}>JWT login, token storage, and offline fallback are ready for testing.</Text>

      <View style={styles.form}>
        <Field label={t.email}>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        </Field>
        <Field label={t.password}>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
        </Field>
        {!!error && <Text style={styles.notice}>{error}</Text>}
        <PrimaryButton title={t.continue} onPress={submit} loading={loading} style={styles.button} />
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
