import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowUp, ArrowDown } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';
import { Token } from '../utils/walletData';

interface TokenCardProps {
  token: Token;
  onPress?: () => void;
}

const TokenCard: React.FC<TokenCardProps> = ({ token, onPress }) => {
  const isPositive = token.change >= 0;
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: token.logo }} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{token.name}</Text>
        <Text style={styles.symbol}>{token.symbol}</Text>
      </View>
      
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceValue}>
          {token.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {token.symbol}
        </Text>
        <Text style={styles.dollarValue}>
          ${token.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </Text>
        
        <View style={[
          styles.changeContainer, 
          { backgroundColor: isPositive ? colors.success.light : colors.error.light }
        ]}>
          {isPositive ? (
            <ArrowUp size={12} color={colors.success.dark} />
          ) : (
            <ArrowDown size={12} color={colors.error.dark} />
          )}
          <Text style={[
            styles.changeText,
            { color: isPositive ? colors.success.dark : colors.error.dark }
          ]}>
            {Math.abs(token.change).toFixed(1)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.small,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  logo: {
    width: 32,
    height: 32,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontFamily: typography.font.semiBold,
    fontSize: typography.size.md,
    color: colors.neutral.black,
    marginBottom: spacing.xs,
  },
  symbol: {
    fontFamily: typography.font.regular,
    fontSize: typography.size.sm,
    color: colors.neutral.gray,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceValue: {
    fontFamily: typography.font.medium,
    fontSize: typography.size.md,
    color: colors.neutral.black,
    marginBottom: 2,
  },
  dollarValue: {
    fontFamily: typography.font.regular,
    fontSize: typography.size.sm,
    color: colors.neutral.gray,
    marginBottom: spacing.xs,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.round,
  },
  changeText: {
    fontFamily: typography.font.medium,
    fontSize: typography.size.xs,
    marginLeft: 2,
  },
});

export default TokenCard;