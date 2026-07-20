import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { io } from 'socket.io-client';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppHeader, Screen } from '../../components/ui';
import api, { SOCKET_URL } from '../../api/client';
import { demoMessages } from '../../data/demoData';

export default function ChatRoomScreen({ navigation }) {
  const { t } = useLanguage();
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
      setMessages(value => [...value, message]);
    });
    return () => {
      mounted = false;
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    const message = {
      id: String(Date.now()),
      user: 'You',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    socketRef.current?.emit('chat:message', message);
    api.post('/chat/messages', message).catch(() => undefined);
    setMessages(value => [...value, message]);
    setText('');
  };

  return (
    <Screen>
      <AppHeader
        eyebrow={status}
        title={t.chat}
        onBack={() => navigation.goBack()}
        right={<View style={[styles.statusDot, status === 'Demo room' && styles.statusDotDemo]} />}
      />

      <ScrollView ref={scrollRef} style={styles.thread} contentContainerStyle={styles.threadContent}>
        {messages.map(message => {
          const mine = message.user === 'You';
          return (
            <View key={message.id} style={[styles.bubble, mine && styles.bubbleMine]}>
              <Text style={[styles.sender, mine && styles.senderMine]}>{message.user} | {message.time}</Text>
              <Text style={[styles.message, mine && styles.messageMine]}>{message.text}</Text>
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
        />
        <TouchableOpacity style={styles.sendButton} onPress={send} activeOpacity={0.84}>
          <Text style={styles.sendText}>{t.send}</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusDot: { width: 14, height: 14, borderRadius: 10, backgroundColor: COLORS.primary },
  statusDotDemo: { backgroundColor: COLORS.warning },
  thread: { flex: 1, marginTop: 18 },
  threadContent: { gap: 12, paddingBottom: 14 },
  bubble: { backgroundColor: COLORS.white, borderRadius: 20, padding: 15, borderWidth: 1, borderColor: COLORS.border, maxWidth: '88%' },
  bubbleMine: { alignSelf: 'flex-end', backgroundColor: COLORS.dark, borderColor: COLORS.dark },
  sender: { color: COLORS.textLight, fontSize: 12, fontWeight: '800', marginBottom: 5 },
  senderMine: { color: '#C7D2CB' },
  message: { color: COLORS.text, fontSize: 15, lineHeight: 22 },
  messageMine: { color: COLORS.white },
  composer: { flexDirection: 'row', gap: 10, paddingTop: 12 },
  input: { flex: 1, backgroundColor: COLORS.white, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14, color: COLORS.text },
  sendButton: { backgroundColor: COLORS.primary, borderRadius: 18, paddingHorizontal: 18, justifyContent: 'center' },
  sendText: { color: COLORS.white, fontWeight: '900' }
});
