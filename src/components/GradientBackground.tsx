import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '../constants/colors';

export function GradientBackground({ children }: { children: ReactNode }) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={GRADIENTS.cosmos}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={GRADIENTS.goldGlow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        style={[StyleSheet.absoluteFill, { opacity: 0.7 }]}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}
