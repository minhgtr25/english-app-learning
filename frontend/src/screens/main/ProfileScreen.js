import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import api from '../api/client';

// ─── Avatar Picker Modal ──────────────────────────────────────────────────────

function AvatarPickerModal({ visible, currentUrl, onSelect, onClose }) {
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) fetchAvatars();
  }, [visible]);

  const fetchAvatars = async () => {
    setLoading(true);
    try {
      const res = await api.get('/profile/avatars');
      setAvatars(res.data.data || []);
    } catch {
      Alert.alert('Lỗi', 'Không thể tải danh sách avatar.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await api.patch('/profile/avatar', { avatarId: selected.id });
      onSelect(selected.url);
      onClose();
    } catch {
      Alert.alert('Lỗi', 'Không thể cập nhật avatar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Chọn Avatar</Text>
          <TouchableOpacity onPress={handleConfirm} disabled={!selected || saving}>
            {saving ? (
              <ActivityIndicator color="#6C63FF" />
            ) : (
              <Text style={[styles.confirmText, !selected && { opacity: 0.3 }]}>Xong</Text>
            )}
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#6C63FF" />
          </View>
        ) : (
          <FlatList
            data={avatars}
            keyExtractor={(item) => item.id}
            numColumns={4}
            contentContainerStyle={styles.avatarGrid}
            renderItem={({ item }) => {
              const isSelected = selected?.id === item.id;
              return (
                <TouchableOpacity
                  style={[styles.avatarOption, isSelected && styles.avatarOptionSelected]}
                  onPress={() => setSelected(item)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: item.url }} style={styles.avatarOptionImg} />
                  {isSelected && <View style={styles.avatarCheckBadge}><Text style={{ color: '#fff', fontSize: 10 }}>✓</Text></View>}
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </Modal>
  );
}

// ─── Change Password Modal ────────────────────────────────────────────────────

function ChangePasswordModal({ visible, onClose }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => { setCurrent(''); setNext(''); setConfirm(''); };

  const handleSave = async () => {
    if (!current || !next || !confirm) {
      return Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ các trường.');
    }
    if (next !== confirm) {
      return Alert.alert('Không khớp', 'Mật khẩu mới và xác nhận không giống nhau.');
    }
    if (next.length < 6) {
      return Alert.alert('Quá ngắn', 'Mật khẩu mới phải có ít nhất 6 ký tự.');
    }
    setSaving(true);
    try {
      const res = await api.patch('/profile/change-password', {
        currentPassword: current,
        newPassword: next,
      });
      if (res.data.success) {
        Alert.alert('✅ Thành công', 'Đổi mật khẩu thành công!');
        reset();
        onClose();
      }
    } catch (err) {
      Alert.alert('Lỗi', err?.response?.data?.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => { reset(); onClose(); }}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView style={{ flex: 1, padding: 20 }} keyboardShouldPersistTaps="handled">
          <Text style={styles.inputLabel}>Mật khẩu hiện tại</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#5A5A7A"
            value={current}
            onChangeText={setCurrent}
          />

          <Text style={styles.inputLabel}>Mật khẩu mới</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#5A5A7A"
            value={next}
            onChangeText={setNext}
          />

          <Text style={styles.inputLabel}>Xác nhận mật khẩu mới</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#5A5A7A"
            value={confirm}
            onChangeText={setConfirm}
          />

          <TouchableOpacity style={[styles.saveBtn, { marginTop: 24 }]} onPress={handleSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Lưu mật khẩu</Text>}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Main Profile Screen ──────────────────────────────────────────────────────

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [edited, setEdited] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get('/profile');
      const data = res.data.data;
      setProfile(data);
      setFullName(data.fullName || '');
      setBio(data.bio || '');
      setAvatarUrl(data.avatarUrl || '');
    } catch {
      Alert.alert('Lỗi', 'Không thể tải hồ sơ.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!profile) return;
    const changed =
      fullName !== (profile.fullName || '') ||
      bio !== (profile.bio || '') ||
      avatarUrl !== (profile.avatarUrl || '');
    setEdited(changed);
  }, [fullName, bio, avatarUrl, profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/profile', { fullName, bio, avatarUrl });
      Alert.alert('✅', 'Cập nhật hồ sơ thành công!');
      setEdited(false);
      setProfile((prev) => ({ ...prev, fullName, bio, avatarUrl }));
    } catch (err) {
      Alert.alert('Lỗi', err?.response?.data?.message || 'Cập nhật thất bại.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <Text style={styles.screenTitle}>👤 Hồ sơ</Text>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={() => setShowAvatarPicker(true)} activeOpacity={0.85}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>
                  {fullName ? fullName.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
            )}
            <View style={styles.avatarEditBadge}>
              <Text style={styles.avatarEditIcon}>✏️</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowAvatarPicker(true)}>
            <Text style={styles.changeAvatarText}>Đổi avatar</Text>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        {profile && (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>{profile.totalQuizzes ?? 0}</Text>
              <Text style={styles.statLabel}>Bài đã thi</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>{profile.totalScore ?? 0}</Text>
              <Text style={styles.statLabel}>Tổng điểm</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color: '#6C63FF' }]}>{profile.role === 'vip' ? '👑 VIP' : 'Free'}</Text>
              <Text style={styles.statLabel}>Tài khoản</Text>
            </View>
          </View>
        )}

        {/* Form */}
        <View style={styles.formSection}>
          <Text style={styles.inputLabel}>Họ và tên</Text>
          <TextInput
            style={styles.textInput}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Nhập họ tên"
            placeholderTextColor="#5A5A7A"
          />

          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.textInputDisabled}>
            <Text style={styles.textInputDisabledText}>{profile?.email}</Text>
          </View>

          <Text style={styles.inputLabel}>Giới thiệu bản thân</Text>
          <TextInput
            style={[styles.textInput, { height: 90 }]}
            value={bio}
            onChangeText={setBio}
            placeholder="Viết gì đó về bạn... (tối đa 200 ký tự)"
            placeholderTextColor="#5A5A7A"
            multiline
            maxLength={200}
          />
          <Text style={styles.charCount}>{bio.length}/200</Text>
        </View>

        {/* Save button */}
        {edited && (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving} activeOpacity={0.85}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Lưu thay đổi</Text>}
          </TouchableOpacity>
        )}

        {/* Other options */}
        <View style={styles.optionsSection}>
          <TouchableOpacity style={styles.optionRow} onPress={() => setShowPasswordModal(true)}>
            <Text style={styles.optionIcon}>🔒</Text>
            <Text style={styles.optionText}>Đổi mật khẩu</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() =>
              Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất không?', [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đăng xuất', style: 'destructive', onPress: () => {} },
              ])
            }
          >
            <Text style={styles.optionIcon}>🚪</Text>
            <Text style={[styles.optionText, { color: '#E05C5C' }]}>Đăng xuất</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        visible={showAvatarPicker}
        currentUrl={avatarUrl}
        onSelect={(url) => { setAvatarUrl(url); setEdited(true); }}
        onClose={() => setShowAvatarPicker(false)}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0E1A' },
  content: { paddingHorizontal: 20, paddingBottom: 48 },
  centered: { justifyContent: 'center', alignItems: 'center' },

  screenTitle: { fontSize: 26, fontWeight: '700', color: '#FFFFFF', marginTop: 48, marginBottom: 24 },

  // Avatar
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#2C2B40' },
  avatarPlaceholder: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center',
  },
  avatarPlaceholderText: { fontSize: 36, fontWeight: '700', color: '#fff' },
  avatarEditBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#1C1B2E', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#0F0E1A',
  },
  avatarEditIcon: { fontSize: 12 },
  changeAvatarText: { color: '#6C63FF', fontWeight: '600', fontSize: 13, marginTop: 8 },

  // Stats
  statsRow: {
    flexDirection: 'row', backgroundColor: '#1C1B2E',
    borderRadius: 16, paddingVertical: 16, paddingHorizontal: 12,
    marginBottom: 28, alignItems: 'center',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#6B6B8A' },
  statDivider: { width: 1, height: 36, backgroundColor: '#2C2B40' },

  // Form
  formSection: { marginBottom: 20 },
  inputLabel: { fontSize: 13, color: '#A0A0C0', marginBottom: 8, marginTop: 16 },
  textInput: {
    backgroundColor: '#1C1B2E', borderRadius: 12,
    padding: 14, color: '#FFFFFF', fontSize: 15,
    borderWidth: 1, borderColor: '#2C2B40',
  },
  textInputDisabled: {
    backgroundColor: '#16152A', borderRadius: 12,
    padding: 14, borderWidth: 1, borderColor: '#2C2B40',
  },
  textInputDisabledText: { color: '#5A5A7A', fontSize: 15 },
  charCount: { fontSize: 11, color: '#5A5A7A', textAlign: 'right', marginTop: 4 },

  // Save button
  saveBtn: {
    backgroundColor: '#6C63FF', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginBottom: 24,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Options
  optionsSection: { backgroundColor: '#1C1B2E', borderRadius: 16, overflow: 'hidden' },
  optionRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 18,
    borderBottomWidth: 1, borderBottomColor: '#2C2B40',
  },
  optionIcon: { fontSize: 18, marginRight: 14 },
  optionText: { flex: 1, fontSize: 15, color: '#E0E0FF', fontWeight: '500' },
  optionArrow: { fontSize: 20, color: '#5A5A7A' },

  // Modals
  modalContainer: { flex: 1, backgroundColor: '#0F0E1A' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  closeBtn: { fontSize: 18, color: '#A0A0C0', fontWeight: '700' },
  confirmText: { fontSize: 16, color: '#6C63FF', fontWeight: '700' },

  // Avatar grid
  avatarGrid: { paddingHorizontal: 20, paddingTop: 16 },
  avatarOption: {
    flex: 1, margin: 8, aspectRatio: 1,
    borderRadius: 50, borderWidth: 2, borderColor: 'transparent',
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  avatarOptionSelected: { borderColor: '#6C63FF' },
  avatarOptionImg: { width: '100%', height: '100%', borderRadius: 50 },
  avatarCheckBadge: {
    position: 'absolute', top: 0, right: 0,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center',
  },
});
