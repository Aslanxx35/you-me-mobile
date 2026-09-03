import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { MotiView } from 'moti';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { ARCHETYPE_IDS, ARCHETYPE_NAMES } from '../data/shadow';

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);

export function ShadowRadar({ scores }: { scores: Record<string, number> }) {
  const size = Math.min(Dimensions.get('window').width - 40, 320);
  const c = size / 2;
  const r = size * 0.35;

  const draw = useSharedValue(0);
  useEffect(() => {
    draw.value = withDelay(150, withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }));
  }, []);

  const pts = (scale: number) =>
    ARCHETYPE_IDS.map((_, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 8;
      const v = Math.max(0, Math.min(1, (scores[ARCHETYPE_IDS[i]] || 0) / 30)) * scale;
      return `${c + Math.cos(a) * r * v},${c + Math.sin(a) * r * v}`;
    }).join(' ');

  const fullPoints = pts(1);

  const animatedProps = useAnimatedProps(() => ({
    points: fullPoints,
    scale: draw.value,
  }));

  return (
    <MotiView from={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 500 }}>
      <Svg width={size} height={size}>
        {[0.33, 0.66, 1].map((x, i) => (
          <Polygon key={i} points={pts(x)} fill="none" stroke="#39354A" />
        ))}
        {ARCHETYPE_IDS.map((id, i) => {
          const a = -Math.PI / 2 + (i * 2 * Math.PI) / 8;
          return (
            <React.Fragment key={id}>
              <Line x1={c} y1={c} x2={c + Math.cos(a) * r} y2={c + Math.sin(a) * r} stroke="#39354A" />
              <SvgText x={c + Math.cos(a) * (r + 18)} y={c + Math.sin(a) * (r + 18)} fill="#CCC8B4" fontSize="9" textAnchor="middle">
                {ARCHETYPE_NAMES[id]}
              </SvgText>
            </React.Fragment>
          );
        })}
        <AnimatedPolygon
          animatedProps={animatedProps}
          originX={c}
          originY={c}
          fill="rgba(201,168,76,.2)"
          stroke="#C9A84C"
          strokeWidth="2"
        />
        {ARCHETYPE_IDS.map((id, i) => {
          const a = -Math.PI / 2 + (i * 2 * Math.PI) / 8;
          const v = Math.max(0, Math.min(1, (scores[id] || 0) / 30));
          return <Circle key={`p${id}`} cx={c + Math.cos(a) * r * v} cy={c + Math.sin(a) * r * v} r="4" fill="#C9A84C" />;
        })}
      </Svg>
    </MotiView>
  );
}
