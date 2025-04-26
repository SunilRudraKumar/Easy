import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors, typography, spacing, borderRadius, shadows } from '@/utils/theme';
import ChatbotButton from '@/components/ChatbotButton';

export default function SplashScreen() {
  const router = useRouter();
  
  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);
  
  useEffect(() => {
    // Animate the logo
    opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    scale.value = withTiming(1, {
      duration: 1200,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    });
    
    // Animate the buttons with delay
    buttonOpacity.value = withDelay(
      600,
      withTiming(1, {
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
    
    buttonTranslateY.value = withDelay(
      600,
      withTiming(0, {
        duration: 800,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      })
    );
  }, []);
  
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
      ],
    };
  });
  
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
      transform: [
        { translateY: buttonTranslateY.value },
      ],
    };
  });
  
  const handleNewUser = () => {
    router.push('/onboarding/new-user');
  };
  
  const handleExperiencedUser = () => {
    // For now, route to the same place
    router.push('/onboarding/new-user');
  };

  return (
    <LinearGradient 
    colors={[colors.primary.main, colors.secondary.main] as const}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <LinearGradient
            colors={colors.gradients.primaryGradient}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.logoText}>E</Text>
          </LinearGradient>
        </Animated.View>
        
        <Animated.View style={[styles.titleContainer, logoAnimatedStyle]}>
          <Text style={styles.title}>Easy</Text>
          <Text style={styles.subtitle}>Crypto Made Simple</Text>
        </Animated.View>
        
        <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleNewUser}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={colors.gradients.primaryGradient }
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.primaryButtonText}>I'm brand new</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleExperiencedUser}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>I've used crypto before</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      
      <ChatbotButton style={styles.chatButton} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.xl,
    ...shadows.medium,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontFamily: typography.font.bold,
    fontSize: 48,
    color: colors.neutral.white,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  title: {
    fontFamily: typography.font.bold,
    fontSize: typography.size.xxxl,
    color: colors.primary.dark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: typography.font.medium,
    fontSize: typography.size.lg,
    color: colors.neutral.darkGray,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  primaryButton: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.small,
  },
  buttonGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: typography.font.semiBold,
    fontSize: typography.size.md,
    color: colors.neutral.white,
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  secondaryButtonText: {
    fontFamily: typography.font.semiBold,
    fontSize: typography.size.md,
    color: colors.primary.dark,
  },
  chatButton: {
    bottom: spacing.xxl,
  },
});