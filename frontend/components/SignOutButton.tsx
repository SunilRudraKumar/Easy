import { useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '@/utils/theme';

export function SignOutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/onboarding');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <TouchableOpacity onPress={handleSignOut} style={styles.button}>
      <Text style={styles.text}>Sign Out</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    backgroundColor: colors.primary.main,
    borderRadius: 8,
  },
  text: {
    color: colors.neutral.white,
    fontWeight: '600',
  },
});