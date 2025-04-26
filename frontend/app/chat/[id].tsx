import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChatMessage, dummyMessages, dummyUsers } from '@/utils/walletData';
import { colors, typography, spacing, borderRadius } from '@/utils/theme';
import ChatMessageComponent from '@/components/ChatMessager';
import ChatInput from '@/components/ChatInput';
import { ArrowLeft, MoveVertical as MoreVertical } from 'lucide-react-native';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(dummyMessages);
  const flatListRef = useRef<FlatList>(null);
  
  const user = dummyUsers.find(u => u.id === id);
  
  if (!user) {
    return null;
  }
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  
  const handleSendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: Date.now(),
    };
    
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    
    // Simulate response after a short delay
    setTimeout(() => {
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Got it! I'll take a look at that.",
        isUser: false,
        timestamp: Date.now() + 1000,
      };
      
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[colors.primary.light, colors.secondary.light] as const}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft color={colors.neutral.white} size={24} />
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical color={colors.neutral.white} size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatMessageComponent message={item} />}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
        
        <ChatInput onSend={handleSendMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
  },
  userName: {
    fontFamily: typography.font.semiBold,
    fontSize: typography.size.lg,
    color: colors.neutral.white,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
});