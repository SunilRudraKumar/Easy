import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  ScrollView, 
  Alert, 
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '@/utils/theme';
import { 
  Fingerprint, 
  Shield, 
  Key, 
  Copy, 
  LogOut, 
  ChevronRight, 
  User, 
  Mail, 
  Bell, 
  Moon,
  Globe,
  Wallet,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import ChatbotButton from '@/components/ChatbotButton';

export default function SettingsScreen() {
  const router = useRouter();
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  
  const handleLogout = () => {
    // In a real app, implement proper logout logic
    router.replace('/onboarding/splash');
  };
  
  const handleBackupWallet = () => {
    // In a real app, implement wallet backup
    Alert.alert(
      'Backup Wallet', 
      'This would start the wallet backup process in a real application.'
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[colors.primary.light, colors.secondary.light] as const}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.iconContainer}>
                <User color={colors.primary.main} size={20} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>Profile Information</Text>
                <ChevronRight color={colors.neutral.gray} size={20} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.iconContainer}>
                <Mail color={colors.primary.main} size={20} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>Email Address</Text>
                <ChevronRight color={colors.neutral.gray} size={20} />
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            
            <View style={styles.menuItem}>
              <View style={styles.iconContainer}>
                <Fingerprint color={colors.secondary.main} size={20} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>Biometric Authentication</Text>
                <Switch
                  value={isBiometricEnabled}
                  onValueChange={setIsBiometricEnabled}
                  trackColor={{ 
                    false: colors.neutral.mediumGray, 
                    true: colors.primary.main 
                  }}
                  thumbColor={
                    Platform.OS === 'ios' 
                      ? undefined 
                      : isBiometricEnabled 
                        ? colors.neutral.white 
                        : colors.neutral.lightGray
                  }
                />
              </View>
            </View>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.iconContainer}>
                <Key color={colors.secondary.main} size={20} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>Private Keys</Text>
                <ChevronRight color={colors.neutral.gray} size={20} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleBackupWallet}>
              <View style={styles.iconContainer}>
                <Shield color={colors.secondary.main} size={20} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>Backup Wallet</Text>
                <ChevronRight color={colors.neutral.gray} size={20} />
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.menuItem}>
              <View style={styles.iconContainer}>
                <Moon color={colors.accent.main} size={20} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>Dark Mode</Text>
                <Switch
                  value={isDarkModeEnabled}
                  onValueChange={setIsDarkModeEnabled}
                  trackColor={{ 
                    false: colors.neutral.mediumGray, 
                    true: colors.primary.main 
                  }}
                  thumbColor={
                    Platform.OS === 'ios' 
                      ? undefined 
                      : isDarkModeEnabled 
                        ? colors.neutral.white 
                        : colors.neutral.lightGray
                  }
                />
              </View>
            </View>
            
            <View style={styles.menuItem}>
              <View style={styles.iconContainer}>
                <Bell color={colors.accent.main} size={20} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>Notifications</Text>
                <Switch
                  value={isNotificationsEnabled}
                  onValueChange={setIsNotificationsEnabled}
                  trackColor={{ 
                    false: colors.neutral.mediumGray, 
                    true: colors.primary.main 
                  }}
                  thumbColor={
                    Platform.OS === 'ios' 
                      ? undefined 
                      : isNotificationsEnabled 
                        ? colors.neutral.white 
                        : colors.neutral.lightGray
                  }
                />
              </View>
            </View>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.iconContainer}>
                <Globe color={colors.accent.main} size={20} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>Language</Text>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>English</Text>
                  <ChevronRight color={colors.neutral.gray} size={20} />
                </View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.iconContainer}>
                <Wallet color={colors.accent.main} size={20} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>Default Currency</Text>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>USD</Text>
                  <ChevronRight color={colors.neutral.gray} size={20} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <LogOut color={colors.error.main} size={20} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
          
          <View style={styles.footer}>
            <Text style={styles.versionText}>Easy Wallet v1.0.0</Text>
          </View>
        </ScrollView>
      </LinearGradient>
      
      <ChatbotButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.black,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    fontFamily: typography.font.bold,
    fontSize: typography.size.xl,
    color: colors.neutral.white,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: typography.font.semiBold,
    fontSize: typography.size.md,
    color: colors.neutral.white,
    marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuItemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemText: {
    fontFamily: typography.font.medium,
    fontSize: typography.size.md,
    color: colors.neutral.white,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontFamily: typography.font.regular,
    fontSize: typography.size.sm,
    color: colors.neutral.gray,
    marginRight: spacing.xs,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    marginVertical: spacing.lg,
    padding: spacing.md,
  },
  logoutText: {
    fontFamily: typography.font.semiBold,
    fontSize: typography.size.md,
    color: colors.error.main,
    marginLeft: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  versionText: {
    fontFamily: typography.font.regular,
    fontSize: typography.size.sm,
    color: colors.neutral.gray,
  },
});