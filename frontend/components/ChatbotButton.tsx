import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Platform } from 'react-native';
import { Bot } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  Easing,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, shadows } from '../utils/theme';

interface ChatbotButtonProps {
  onPress?: () => void;
  style?: any;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onPress, style }) => {
  const router = useRouter();
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const isPulsing = useRef(true);

  // Animation for the pulsing effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const startPulsing = () => {
      if (isPulsing.current) {
        scale.value = withSequence(
          withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        );
        
        timeout = setTimeout(startPulsing, 2000);
      }
    };
    
    startPulsing();
    
    return () => {
      isPulsing.current = false;
      clearTimeout(timeout);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotateZ: `${rotation.value}deg` },
      ],
    };
  });

  const handlePress = () => {
    // Stop pulsing temporarily
    isPulsing.current = false;
    
    // Trigger press animation
    scale.value = withSequence(
      withTiming(0.9, { duration: 150 }),
      withTiming(1.1, { duration: 200 }),
      withTiming(1, { duration: 150 })
    );
    
    // Rotate animation
    rotation.value = withSequence(
      withTiming(10, { duration: 100 }),
      withTiming(-10, { duration: 150 }),
      withTiming(0, { duration: 100 })
    );
    
    // Resume pulsing after animation
    setTimeout(() => {
      isPulsing.current = true;
    }, 1000);
    
    // Navigate to the AI chat
    if (onPress) {
      onPress();
    } else {
      router.push('/ai-chat');
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={styles.buttonContainer}
      >
        <LinearGradient
          colors={colors.gradients.primaryGradient}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.iconContainer}>
            <Bot 
              color={colors.neutral.white}
              size={24}
              strokeWidth={2.5}
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    zIndex: 100,
    ...shadows.medium,
  },
  buttonContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatbotButton;