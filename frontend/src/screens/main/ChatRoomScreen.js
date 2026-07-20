import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { io } from 'socket.io-client';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppHeader, Screen } from '../../components/ui';
import api, { SOCKET_URL } from '../../api/client';
import { demoMessages } from '../../data/demoData';
import { useAuth } from '../../state/AuthContext';

export default function ChatRoomScreen({ navigation }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const scrollRef = useRef(null);
  const socketRef = useRef(null);
  const [messages, setMessages] = useState(demoMessages);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('Demo room');

  useEffect(() => {
    let mounted = true;
    api.get('/chat/messages')
      .then(({ data }) => {
        if (mounted && data?.messages?.length) {
          setMessages(data.messages);
        }
      })
      .catch(() => setStatus('Demo room'));

    socketRef.current = io(SOCKET_URL, { transports: ['websocket'], timeout: 3000 });
    socketRef.current.on('connect', () => setStatus('Live room'));
    socketRef.current.on('connect_error', () => setStatus('Demo room'));
    socketRef.current.on('chat:message', message => {
      setMessages(value => {
        // Prevent duplicate messages in list if we already added it locally
        if (value.some(m => m.id === message.id)) return value;
        return [...value, message];
      });
    });
    return () => {
      mounted = false;
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    // Small delay to ensure layout completed before scrolling
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    const msgId = String(Date.now());
    const message = {
      id: msgId,
      user: user?.fullName || 'Anonymous',
      userId: user?._id || null,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (socketRef.current?.connected) {
      socketRef.current.emit('chat:message', message);
    }
    // We do NOT call api.post in live mode if we have socket connection,
    // but if it's completely offline, we don't save to remote. We just append locally.
    setMessages(value => [...value, message]);
    setText('');
  };

  return (
    <Screen style={styles.screen}>
      <AppHeader
        eyebrow={status === 'Live room' ? 'REALTIME CHAT' : 'DEMO MODE'}
        title={t.chat}
        onBack={() => navigation.goBack()}
        right={
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, status === 'Demo room' && styles.statusDotDemo]} />
            <Text style={styles.statusLabel}>{status === 'Live room' ? 'Live' : 'Demo'}</Text>
          </View>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView ref={scrollRef} style={styles.thread} contentContainerStyle={styles.threadContent}>
          {messages.map(message => {
            const mine = message.userId === user?._id || message.user === user?.fullName || message.user === 'You';
            return (
              <View key={message.id} style={[styles.bubbleWrapper, mine && styles.bubbleWrapperMine]}>
                <View style={[styles.bubble, mine && styles.bubbleMine]}>
                  <Text style={[styles.sender, mine && styles.senderMine]}>
                    {mine ? 'You' : message.user} • {message.time}
                  </Text>
                  <Text style={[styles.message, mine && styles.messageMine]}>{message.text}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder={t.messagePlaceholder}
            placeholderTextColor={COLORS.textLight}
            onSubmitEditing={send}
          />
          <TouchableOpacity style={styles.sendButton} onPress={send} activeOpacity={0.84}>
            <Text style={styles.sendText}>{t.send}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  keyboardContainer: { flex: 1 },
  statusIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  statusDotDemo: { backgroundColor: COLORS.warning },
  statusLabel: { fontSize: 12, fontWeight: '800', color: COLORS.text },
  thread: { flex: 1, marginTop: 18 },
  threadContent: { gap: 14, paddingBottom: 20 },
  bubbleWrapper: { flexDirection: 'row', justifyContent: 'flex-start' },
  bubbleWrapperMine: { justifyContent: 'flex-end' },
  bubble: { backgroundColor: COLORS.white, borderRadius: 20, borderTopLeftRadius: 4, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.border, maxWidth: '80%', shadowColor: COLORS.ink, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  bubbleMine: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, borderTopLeftRadius: 20, borderTopRightRadius: 4 },
  sender: { color: COLORS.textLight, fontSize: 11, fontWeight: '800', marginBottom: 4 },
  senderMine: { color: 'rgba(255, 255, 255, 0.75)' },
  message: { color: COLORS.text, fontSize: 15, lineHeight: 22 },
  messageMine: { color: COLORS.white },
  composer: { flexDirection: 'row', gap: 10, paddingTop: 12, paddingBottom: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
  input: { flex: 1, backgroundColor: COLORS.white, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 16, height: 48, color: COLORS.text, fontSize: 15 },
  sendButton: { backgroundColor: COLORS.dark, borderRadius: 18, paddingHorizontal: 20, justifyContent: 'center', height: 48 },
  sendText: { color: COLORS.white, fontWeight: '900', fontSize: 15 }
});
