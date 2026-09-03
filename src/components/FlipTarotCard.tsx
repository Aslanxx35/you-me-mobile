import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

interface FlipTarotCardProps {
  name: string;
  reversed?: boolean;
  image?: any;
  delay?: number;
  startFaceDown?: boolean;
}

export function FlipTarotCard({ name, reversed, image, delay = 0, startFaceDown = true }: FlipTarotCardProps) {
  const flip = useSharedValue(startFaceDown ? 0 : 180);
  const glow = useSharedValue(0);

  useEffect(() => {
    if (startFaceDown) {
      flip.value = withDelay(delay, withTiming(180, { duration: 620 }));
      glow.value = withDelay(delay + 500, withTiming(1, { duration: 500 }));
    } else {
      glow.value = 1;
    }
  }, []);

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flip.value, [0, 180], [0, 180]);
    return {
      transform: [{ perspective: 900 }, { rotateY: `${rotateY}deg` }, { rotate: reversed ? '180deg' : '0deg' }],
      opacity: rotateY > 90 ? 1 : 0,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flip.value, [0, 180], [180, 360]);
    return {
      transform: [{ perspective: 900 }, { rotateY: `${rotateY}deg` }],
      opacity: flip.value < 90 ? 1 : 0,
    };
  });

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value * 0.6,
    transform: [{ scale: withSpring(glow.value ? 1.06 : 1) }],
  }));

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.glow, glowStyle]} />
      <Animated.View style={[styles.face, styles.back, backStyle]}>
        <View style={styles.backPattern}>
          <Text style={styles.backGlyph}>✦</Text>
        </View>
      </Animated.View>
      <Animated.View style={[styles.face, frontStyle]}>
        {image ? (
          <Image source={image} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.imageFallback]}>
            <Text style={{ color: COLORS.dark.gold, fontSize: 13, textAlign: 'center', padding: 8 }}>{name}</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 180, height: 270, alignItems: 'center', justifyContent: 'center' },
  glow: {
    position: 'absolute',
    width: 200,
    height: 290,
    borderRadius: 20,
    backgroundColor: COLORS.dark.gold,
  },
  face: { position: 'absolute', width: 180, height: 270, borderRadius: 14, backfaceVisibility: 'hidden' },
  back: {
    backgroundColor: '#141428',
    borderWidth: 1.5,
    borderColor: COLORS.dark.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPattern: { alignItems: 'center', justifyContent: 'center' },
  backGlyph: { color: COLORS.dark.gold, fontSize: 40, opacity: 0.85 },
  image: { width: 180, height: 270, borderRadius: 14 },
  imageFallback: { backgroundColor: '#141428', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.dark.border2 },
});
