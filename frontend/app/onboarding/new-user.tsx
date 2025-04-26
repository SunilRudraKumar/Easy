import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { colors, typography, spacing, borderRadius, shadows } from '@/utils/theme';
import { LogIn, ArrowLeft } from 'lucide-react-native';
import ChatbotButton from '@/components/ChatbotButton';
import { useSignIn } from '@clerk/clerk-expo';

export default function NewUserScreen() {
  const router = useRouter();
  const { signIn, setActive } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation value for the button
  const buttonScale = useSharedValue(1);
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Implement OAuth sign-in here using Clerk
      // This is a placeholder for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });
  
  const handleBackPress = () => {
    router.back();
  };

  return (
    <LinearGradient 
    colors={colors.gradients.primaryGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleBackPress}
        activeOpacity={0.7}
      >
        <ArrowLeft 
          color={colors.primary.dark} 
          size={24} 
        />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Welcome to Easy</Text>
          <Text style={styles.subtitleText}>Let's get you set up with a secure account</Text>
        </View>
        
        <View style={styles.illustrationContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/7742588/pexels-photo-7742588.jpeg' }} 
            style={styles.illustration}
          />
        </View>
        
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Sign in with</Text>
          
          <Animated.View style={[buttonAnimatedStyle]}>
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <View style={styles.googleIconContainer}>
                <Image 
                  source={{ uri: 'https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/google.svg' }} 
                  style={styles.googleIcon}
                />
              </View>
              <Text style={styles.googleButtonText}>
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
      
      <ChatbotButton style={styles.chatButton} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: spacing.xl + 20,
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...shadows.small,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl + spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  welcomeText: {
    fontFamily: typography.font.bold,
    fontSize: typography.size.xxxl,
    color: colors.primary.dark,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitleText: {
    fontFamily: typography.font.regular,
    fontSize: typography.size.md,
    color: colors.neutral.darkGray,
    textAlign: 'center',
    maxWidth: 300,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  illustration: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  signInContainer: {
    width: '100%',
    alignItems: 'center',
  },
  signInText: {
    fontFamily: typography.font.medium,
    fontSize: typography.size.md,
    color: colors.neutral.darkGray,
    marginBottom: spacing.md,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  googleIconContainer: {
    marginRight: spacing.md,
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  googleButtonText: {
    fontFamily: typography.font.medium,
    fontSize: typography.size.md,
    color: colors.neutral.black,
  },
  termsText: {
    fontFamily: typography.font.regular,
    fontSize: typography.size.sm,
    color: colors.neutral.darkGray,
    textAlign: 'center',
    maxWidth: 280,
  },
  chatButton: {
    bottom: spacing.xxl,
    right: spacing.xl,
  },
});