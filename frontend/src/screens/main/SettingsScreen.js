import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppHeader, Field, PrimaryButton, Screen } from '../../components/ui';
import { useAuth } from '../../state/AuthContext';
import api from '../../api/client';

export default function SettingsScreen({ navigation }) {
  const { t } = useLanguage();
  const { user, updateUser, logout } = useAuth();
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [nameLoading, setNameLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpdateName = async () => {
    if (!fullName.trim()) return;
    setMessage({ type: '', text: '' });
    setNameLoading(true);
    try {
      const { data } = await api.put('/users/profile', { fullName: fullName.trim() });
      if (data?.user) {
        await updateUser(data.user);
      } else {
        await updateUser({ fullName: fullName.trim() });
      }
      setMessage({ type: 'success', text: 'Hoàn tất cập nhật tên thành công!' });
    } catch (err) {
      await updateUser({ fullName: fullName.trim() });
      setMessage({ type: 'success', text: 'Đã cập nhật tên trên ứng dụng.' });
    } finally {
      setNameLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!password || !newPassword) {
      setMessage({ type: 'error', text: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
      return;
    }

    setMessage({ type: '', text: '' });
    setPassLoading(true);
    try {
      await api.put('/users/profile', { password, newPassword });
      setPassword('');
      setNewPassword('');
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Đổi mật khẩu thất bại, kiểm tra mật khẩu hiện tại.' });
    } finally {
      setPassLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace('Landing');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <Screen style={styles.screen}>
      <AppHeader
        eyebrow="TÀI KHOẢN"
        title="Cài đặt"
        onBack={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.fullName || 'Demo Student'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'student@demo.com'}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user?.role === 'admin' ? 'Quản trị viên' : 'Học viên'}</Text>
            </View>
          </View>
        </View>

        {!!message.text && (
          <View style={[styles.messageBanner, message.type === 'error' ? styles.msgError : styles.msgSuccess]}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        )}

        {/* Section 1: Update Name */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          <Field label="Họ và tên">
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nhập họ và tên mới"
              placeholderTextColor={COLORS.textLight}
            />
          </Field>
          <PrimaryButton
            title="Cập nhật tên"
            onPress={handleUpdateName}
            loading={nameLoading}
            style={styles.saveBtn}
          />
        </View>

        {/* Section 2: Change Password */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Đổi mật khẩu</Text>
          <Field label="Mật khẩu hiện tại">
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={COLORS.textLight}
            />
          </Field>
          <Field label="Mật khẩu mới">
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={COLORS.textLight}
            />
          </Field>
          <PrimaryButton
            title="Đổi mật khẩu"
            onPress={handleChangePassword}
            loading={passLoading}
            style={styles.saveBtn}
          />
        </View>

        {/* Section 3: Logout Button at bottom */}
        <View style={styles.logoutContainer}>
          <PrimaryButton
            title="Đăng xuất"
            onPress={handleLogout}
            variant="dark"
            style={styles.logoutBtn}
          />
          <Text style={styles.versionText}>Phiên bản 1.0.0 • LinguaLab</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  scrollContent: { paddingBottom: 30 },
  profileHeaderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 28, borderWidth: 1, borderColor: COLORS.border, padding: 18, marginTop: 10, shadowColor: COLORS.ink, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { color: COLORS.white, fontSize: 18, fontWeight: '950' },
  profileInfo: { flex: 1 },
  profileName: { color: COLORS.ink, fontSize: 18, fontWeight: '950' },
  profileEmail: { color: COLORS.textLight, fontSize: 13, marginTop: 2, fontWeight: '600' },
  roleBadge: { alignSelf: 'flex-start', backgroundColor: '#E8F5E9', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginTop: 6 },
  roleText: { color: COLORS.primaryDark, fontSize: 11, fontWeight: '850' },

  messageBanner: { borderRadius: 16, padding: 14, marginTop: 14 },
  msgSuccess: { backgroundColor: '#E8F6EA' },
  msgError: { backgroundColor: '#FCECEC' },
  messageText: { color: COLORS.ink, fontWeight: '800', fontSize: 13, textAlign: 'center' },

  sectionCard: { backgroundColor: COLORS.white, borderRadius: 28, borderWidth: 1, borderColor: COLORS.border, padding: 20, marginTop: 16, shadowColor: COLORS.ink, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  sectionTitle: { color: COLORS.ink, fontSize: 16, fontWeight: '950', marginBottom: 14 },
  input: { backgroundColor: COLORS.muted, borderRadius: 16, paddingHorizontal: 16, height: 48, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, fontSize: 15 },
  saveBtn: { marginTop: 8, height: 48 },

  logoutContainer: { marginTop: 24, alignItems: 'center' },
  logoutBtn: { width: '100%', height: 54 },
  versionText: { color: COLORS.textLight, fontSize: 12, marginTop: 16, fontWeight: '700' }
});
