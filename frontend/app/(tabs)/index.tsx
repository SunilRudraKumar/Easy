import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { dummyTokens, getTotalBalance, Token } from '@/utils/walletData';
import { colors, typography, spacing, borderRadius, shadows } from '@/utils/theme';
import TokenCard from '@/components/TokenCard';
import { ChevronRight, CirclePlus as PlusCircle, Wallet, ArrowDownUp } from 'lucide-react-native';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import ChatbotButton from '@/components/ChatbotButton';

export default function HomeScreen() {
  const [tokens, setTokens] = useState<Token[]>(dummyTokens);
  const [refreshing, setRefreshing] = useState(false);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  
  // Animation for the balance
  const balanceScale = useSharedValue(1);
  
  // Simulate a refresh loading state
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  // Animation for the balance when updated
  useEffect(() => {
    balanceScale.value = withTiming(1.1, { duration: 200, easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
    
    setTimeout(() => {
      balanceScale.value = withTiming(1, { duration: 200, easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
    }, 200);
  }, [tokens, isBalanceHidden]);
  
  const balanceAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: balanceScale.value }],
    };
  });
  
  // Toggle balance visibility
  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };
  
  // Calculate total balance
  const totalBalance = getTotalBalance(tokens);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <LinearGradient
          colors={colors.gradients.primaryGradient }
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <TouchableOpacity onPress={toggleBalanceVisibility} style={styles.balanceToggle}>
              {isBalanceHidden ? (
                <Text style={styles.balanceHiddenText}>••••••</Text>
              ) : (
                <Animated.Text style={[styles.balanceText, balanceAnimatedStyle]}>
                  ${totalBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </Animated.Text>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <PlusCircle color={colors.neutral.white} size={20} />
              </View>
              <Text style={styles.actionText}>Deposit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <ArrowDownUp color={colors.neutral.white} size={20} />
              </View>
              <Text style={styles.actionText}>Swap</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <Wallet color={colors.neutral.white} size={20} />
              </View>
              <Text style={styles.actionText}>Send</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        
        <View style={styles.contentContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Assets</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color={colors.primary.main} />
            </TouchableOpacity>
          </View>
          
          <ScrollView
            style={styles.tokenList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary.main}
                colors={[colors.primary.main]}
              />
            }
          >
            {tokens.map((token) => (
              <TokenCard 
                key={token.id} 
                token={token} 
                onPress={() => {/* Navigate to token details */}}
              />
            ))}
            
            <View style={styles.spacer} />
          </ScrollView>
        </View>
      </View>
      
      <ChatbotButton />
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  balanceLabel: {
    fontFamily: typography.font.medium,
    fontSize: typography.size.sm,
    color: colors.neutral.white,
    marginBottom: spacing.xs,
  },
  balanceText: {
    fontFamily: typography.font.bold,
    fontSize: typography.size.xxxl,
    color: colors.neutral.white,
  },
  balanceHiddenText: {
    fontFamily: typography.font.bold,
    fontSize: typography.size.xxxl,
    color: colors.neutral.white,
  },
  balanceToggle: {
    padding: spacing.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  actionText: {
    fontFamily: typography.font.medium,
    fontSize: typography.size.sm,
    color: colors.neutral.white,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.font.semiBold,
    fontSize: typography.size.lg,
    color: colors.neutral.black,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: typography.font.medium,
    fontSize: typography.size.sm,
    color: colors.primary.main,
    marginRight: 2,
  },
  tokenList: {
    flex: 1,
  },
  spacer: {
    height: 100,
  },
});