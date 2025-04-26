import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChatUser, dummyUsers } from '@/utils/walletData';
import { colors, typography, spacing, borderRadius, shadows } from '@/utils/theme';
import { Search, Plus } from 'lucide-react-native';
import ChatbotButton from '@/components/ChatbotButton';

function ChatListItem({ user, onPress }: { user: ChatUser; onPress: () => void }) {
  const formattedTime = (timestamp: number) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffHours = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <TouchableOpacity 
      style={styles.chatItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: user.avatar }} 
        style={styles.avatar}
      />
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.timestamp}>{formattedTime(user.timestamp)}</Text>
        </View>
        
        <View style={styles.lastMessageContainer}>
          <Text 
            style={styles.lastMessage}
            numberOfLines={1}
          >
            {user.lastMessage}
          </Text>
          
          {user.unreadCount ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{user.unreadCount}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ChatListScreen() {
  const router = useRouter();
  
  const handleChatPress = (userId: string) => {
    router.push(`/chat/${userId}`);
  };
  
  const handleNewChat = () => {
    // Handle new chat creation
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
       colors={[colors.primary.light, colors.secondary.light] as const}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity 
          style={styles.newChatButton}
          onPress={handleNewChat}
        >
          <Plus color={colors.neutral.white} size={24} />
        </TouchableOpacity>
      </LinearGradient>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.neutral.gray} />
          <Text style={styles.searchPlaceholder}>Search messages</Text>
        </View>
      </View>
      
      <FlatList
        data={dummyUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatListItem 
            user={item} 
            onPress={() => handleChatPress(item.id)}
          />
        )}
        style={styles.chatList}
        showsVerticalScrollIndicator={false}
      />
      
      <ChatbotButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: typography.font.bold,
    fontSize: typography.size.xl,
    color: colors.neutral.white,
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.small,
  },
  searchPlaceholder: {
    fontFamily: typography.font.regular,
    fontSize: typography.size.md,
    color: colors.neutral.gray,
    marginLeft: spacing.sm,
  },
  chatList: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lightGray,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.round,
    marginRight: spacing.md,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontFamily: typography.font.semiBold,
    fontSize: typography.size.md,
    color: colors.neutral.black,
  },
  timestamp: {
    fontFamily: typography.font.regular,
    fontSize: typography.size.sm,
    color: colors.neutral.gray,
  },
  lastMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontFamily: typography.font.regular,
    fontSize: typography.size.sm,
    color: colors.neutral.darkGray,
    marginRight: spacing.sm,
  },
  unreadBadge: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.round,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontFamily: typography.font.medium,
    fontSize: typography.size.xs,
    color: colors.neutral.white,
  },
});