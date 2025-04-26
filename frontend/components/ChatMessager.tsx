import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../utils/theme';
import { ChatMessage as ChatMessageType } from '../utils/walletData';
import { Send } from 'lucide-react-native';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (message.isPayment) {
    return (
      <View style={[
        styles.container,
        message.isUser ? styles.userContainer : styles.botContainer
      ]}>
        <View style={styles.paymentBubble}>
          <View style={styles.paymentIconContainer}>
            <LinearGradient
              colors={colors.gradients.primaryGradient }
              style={styles.paymentIconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Send size={20} color={colors.neutral.white} />
            </LinearGradient>
          </View>
          <View style={styles.paymentContent}>
            <Text style={styles.paymentTitle}>Payment Sent</Text>
            <Text style={styles.paymentAmount}>
              {message.paymentAmount} {message.paymentSymbol}
            </Text>
            <Text style={styles.paymentMessage}>{message.text}</Text>
          </View>
          <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      message.isUser ? styles.userContainer : styles.botContainer
    ]}>
      {message.isUser ? (
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.text}</Text>
          <Text style={styles.userTimestamp}>{formatTime(message.timestamp)}</Text>
        </View>
      ) : (
        <LinearGradient
        colors={colors.gradients.primaryGradient }
          style={styles.botBubble}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.botText}>{message.text}</Text>
          <Text style={styles.botTimestamp}>{formatTime(message.timestamp)}</Text>
        </LinearGradient>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  botContainer: {
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: colors.neutral.lightGray,
    borderRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.sm,
    padding: spacing.md,
  },
  botBubble: {
    borderRadius: borderRadius.lg,
    borderBottomLeftRadius: borderRadius.sm,
    padding: spacing.md,
  },
  userText: {
    color: colors.neutral.black,
    fontFamily: typography.font.regular,
    fontSize: typography.size.md,
  },
  botText: {
    color: colors.neutral.white,
    fontFamily: typography.font.regular,
    fontSize: typography.size.md,
  },
  timestamp: {
    fontSize: typography.size.xs,
    color: colors.neutral.gray,
    marginTop: spacing.xs,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    fontSize: typography.size.xs,
    color: colors.neutral.gray,
    marginTop: spacing.xs,
    alignSelf: 'flex-end',
  },
  botTimestamp: {
    fontSize: typography.size.xs,
    color: colors.neutral.lightGray,
    marginTop: spacing.xs,
    alignSelf: 'flex-end',
  },
  paymentBubble: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent.light,
  },
  paymentIconContainer: {
    marginRight: spacing.md,
  },
  paymentIconGradient: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentContent: {
    flex: 1,
  },
  paymentTitle: {
    fontFamily: typography.font.semiBold,
    fontSize: typography.size.md,
    color: colors.neutral.black,
    marginBottom: 2,
  },
  paymentAmount: {
    fontFamily: typography.font.bold,
    fontSize: typography.size.lg,
    color: colors.accent.dark,
    marginBottom: spacing.xs,
  },
  paymentMessage: {
    fontFamily: typography.font.regular,
    fontSize: typography.size.sm,
    color: colors.neutral.darkGray,
  },
});

export default ChatMessageComponent;