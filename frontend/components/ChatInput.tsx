import React, { useState, useRef } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Send, Mic, X } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { colors, typography, spacing, borderRadius } from '../utils/theme';

interface ChatInputProps {
  onSend: (message: string) => void;
}

// Comment

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // Placeholder for voice recording
    // In a real implementation, we would use something like expo-av
    // For now, we'll just simulate a message after a short delay
    
    setTimeout(() => {
      const simulatedVoiceMessage = "I'd like to check my balance";
      setMessage(simulatedVoiceMessage);
      setIsRecording(false);
      
      if (Platform.OS !== 'web') {
        Speech.speak("Recognized: I'd like to check my balance", {
          language: 'en',
          pitch: 1,
          rate: 0.9,
        });
      }
      
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 2000);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.keyboardAvoid}
    >
      <View style={styles.container}>
        {isRecording ? (
          <View style={styles.recordingContainer}>
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingPulse} />
            </View>
            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopRecording}
            >
              <X color={colors.error.main} size={24} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor={colors.neutral.gray}
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
              />
            </View>
            
            <View style={styles.buttonContainer}>
              {message.trim() ? (
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSend}
                  activeOpacity={0.7}
                >
                  <Send color={colors.neutral.white} size={20} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.micButton}
                  onPress={startRecording}
                  activeOpacity={0.7}
                >
                  <Mic color={colors.neutral.white} size={20} />
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.lightGray,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: colors.neutral.lightGray,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? spacing.sm : 0,
    marginRight: spacing.sm,
  },
  input: {
    fontSize: typography.size.md,
    fontFamily: typography.font.regular,
    color: colors.neutral.black,
    maxHeight: 100,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.secondary.main,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral.lightGray,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error.main,
    marginRight: spacing.sm,
  },
  stopButton: {
    padding: spacing.xs,
  },
});

export default ChatInput;