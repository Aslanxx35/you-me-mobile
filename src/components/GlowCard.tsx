import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, GLOW } from '../constants/colors';

interface GlowCardProps {
  children: ReactNode;
  style?: ViewStyle;
  delay?: number;
  tone?: 'gold' | 'purple';
}

export function GlowCard({ children, style, delay = 0, tone = 'gold' }: GlowCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 14, scale: 0.97 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: 'timing', duration: 420, delay }}
      style={[styles.wrap, tone === 'gold' ? GLOW.gold : GLOW.purple, style]}
    >
      <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={GRADIENTS.cardShine}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.content}>{children}</View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 20,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.dark.border2,
    backgroundColor: 'rgba(14,14,28,0.55)',
  },
  content: { padding: 18 },
});
