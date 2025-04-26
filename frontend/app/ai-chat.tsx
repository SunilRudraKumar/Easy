import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChatMessage } from '@/utils/walletData';
import { colors, spacing, typography, borderRadius } from '@/utils/theme';
import ChatMessageComponent from '@/components/ChatMessager';
import ChatInput from '@/components/ChatInput';
import { ArrowLeft, Bot } from 'lucide-react-native';

export default function AIChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // auto‑scroll
  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    // 1) Append the user's message locally
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);

    // 2) Kick off the network call
    setLoading(true);
    let json;
    try {
      // ***IMPORTANT*** replace with your machine's LAN IP, e.g. 192.168.1.42  
      // Expo Go running on your phone will be able to hit this.
      const res = await fetch('http://localhost:3000/mcp/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contextId: 'user‑123',
          messages: [...messages, userMsg].map(m => ({
            role: m.isUser ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      json = await res.json();
      console.log('📥 Backend replied:', json);
    } catch (err: any) {
      console.error('⚠️ Fetch error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: '⚠️ Unable to connect to server.',
          isUser: false,
          timestamp: Date.now(),
        },
      ]);
      setLoading(false);
      return;
    }

    // 3) Append the assistant's reply
    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: json.reply ?? '…',
      isUser: false,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral.background }}>
      <LinearGradient
        colors={colors.gradients.primaryGradient}
        style={{ padding: spacing.lg, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <ArrowLeft color={colors.neutral.white} size={24} onPress={() => router.back()} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Bot color={colors.neutral.white} size={24} style={{ marginRight: spacing.xs }} />
            <Text style={{ color: colors.neutral.white, fontSize: typography.size.lg, fontFamily: typography.font.bold }}>
              AI Assistant
            </Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ChatMessageComponent message={item} />}
          contentContainerStyle={{ padding: spacing.xl }}
          showsVerticalScrollIndicator={false}
        />

        {loading && (
          <ActivityIndicator
            style={{ position: 'absolute', bottom: 80, alignSelf: 'center' }}
            size="large"
            color={colors.primary.main}
          />
        )}

        <ChatInput onSend={handleSendMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
