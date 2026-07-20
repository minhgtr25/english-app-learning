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
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
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
          <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="student@demo.com" placeholderTextColor={COLORS.textLight} />
        </Field>
        <Field label={t.password}>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" placeholderTextColor={COLORS.textLight} />
        </Field>
        {!!error && <Text style={styles.notice}>{error}</Text>}
        <PrimaryButton title={t.continue} onPress={submit} loading={loading} style={styles.button} />

        <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
          <Text style={styles.registerLinkLabel}>
            Don't have an account? <Text style={styles.registerLinkHighlight}>Sign up</Text>
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
  registerLink: { marginTop: 18, alignItems: 'center', paddingVertical: 8 },
  registerLinkLabel: { color: COLORS.textLight, fontSize: 14, fontWeight: '700' },
  registerLinkHighlight: { color: COLORS.primaryDark, fontWeight: '900' }
});
