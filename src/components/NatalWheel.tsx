import React, { useMemo, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, RadialGradient, Stop, Text as SvgText } from 'react-native-svg';
import { MotiView } from 'moti';

const SIGN_GLYPHS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const SIGN_COLORS = ['#D55', '#D99', '#D8C', '#7CC', '#D85', '#8C8', '#D9A', '#A77', '#D88', '#A88', '#8AD', '#B8D'];

const PLANET_GLYPHS: Record<string, string> = {
  Sun: '☉', Güneş: '☉',
  Moon: '☽', Ay: '☽',
  Mercury: '☿', Merkür: '☿',
  Venus: '♀', Venüs: '♀',
  Mars: '♂',
  Jupiter: '♃', Jüpiter: '♃',
  Saturn: '♄', Satürn: '♄',
  Uranus: '♅', Uranüs: '♅',
  Neptune: '♆', Neptün: '♆',
  Pluto: '♇', Plüton: '♇',
  Chiron: '⚷', Kiron: '⚷',
  NorthNode: '☊', 'Kuzey Düğüm': '☊',
};

const ASPECT_COLORS: Record<string, string> = {
  Conjunction: '#C9A84C',
  Sextile: '#6CA6CD',
  Square: '#D56A6A',
  Trine: '#77B77A',
  Opposition: '#B57BD0',
};

function point(cx: number, cy: number, r: number, angleDeg: number) {
  const t = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) };
}

function glyphFor(planetName: string): string {
  return PLANET_GLYPHS[planetName] || planetName.slice(0, 2);
}

export function NatalWheel({ chart }: { chart: any }) {
  const [showLabels, setShowLabels] = useState(true);
  const size = Math.min(Dimensions.get('window').width - 32, 380);
  const c = size / 2;
  const r = size * 0.43;

  const planets = useMemo(
    () => (Array.isArray(chart?.planets) ? chart.planets : Object.entries(chart?.planets || {}).map(([planet, v]: any) => ({ ...v, planet }))),
    [chart]
  );
  const houses = Array.isArray(chart?.houses) ? chart.houses : [];
  const aspects = Array.isArray(chart?.aspects) ? chart.aspects : [];
  const planetByName = new Map(planets.map((p: any) => [p.planet, p]));

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 550 }}
    >
      <Pressable onPress={() => setShowLabels((v) => !v)} style={{ alignItems: 'center' }}>
        <Svg width={size} height={size}>
          <Defs>
            <RadialGradient id="wheelGlow" cx="50%" cy="50%" r="55%">
              <Stop offset="0%" stopColor="#1D0F3A" stopOpacity="1" />
              <Stop offset="75%" stopColor="#0E0E1C" stopOpacity="1" />
              <Stop offset="100%" stopColor="#060610" stopOpacity="1" />
            </RadialGradient>
            <RadialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#F0D080" stopOpacity="0.9" />
              <Stop offset="100%" stopColor="#C9A84C" stopOpacity="0.35" />
            </RadialGradient>
          </Defs>

          <Circle cx={c} cy={c} r={r + 6} stroke="url(#goldGlow)" strokeWidth="1.5" fill="none" opacity={0.6} />
          <Circle cx={c} cy={c} r={r} stroke="#C9A84C" strokeWidth="2" fill="url(#wheelGlow)" />
          <Circle cx={c} cy={c} r={r - 54} stroke="#39354A" strokeWidth="1" fill="none" />

          {SIGN_GLYPHS.map((glyph, i) => {
            const a = i * 30;
            const p1 = point(c, c, r, a);
            const p2 = point(c, c, r - 18, a);
            const label = point(c, c, r - 35, a + 15);
            return (
              <React.Fragment key={glyph}>
                <Line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#6D654C" />
                <SvgText x={label.x} y={label.y} fill={SIGN_COLORS[i]} fontSize="20" textAnchor="middle" dominantBaseline="middle">
                  {glyph}
                </SvgText>
              </React.Fragment>
            );
          })}

          {Array.from({ length: 12 }).map((_, i) => {
            const a = houses[i]?.longitude ?? i * 30;
            const p1 = point(c, c, r - 54, a);
            const p2 = point(c, c, r - 130, a);
            return <Line key={`h${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#39354A" />;
          })}

          {aspects.map((a: any, i: number) => {
            const p1 = planetByName.get(a.planet1);
            const p2 = planetByName.get(a.planet2);
            if (!p1 || !p2) return null;
            const q1 = point(c, c, r - 88, Number((p1 as any).longitude));
            const q2 = point(c, c, r - 88, Number((p2 as any).longitude));
            return (
              <Line
                key={`a${i}`}
                x1={q1.x} y1={q1.y} x2={q2.x} y2={q2.y}
                stroke={ASPECT_COLORS[a.type] || '#6D654C'}
                strokeWidth="1.3"
                opacity={0.7}
              />
            );
          })}

          {planets.map((p: any) => {
            const a = Number(p.longitude ?? 0);
            const q = point(c, c, r - 82, a);
            return (
              <React.Fragment key={p.planet}>
                <Circle cx={q.x} cy={q.y} r="11" fill="url(#goldGlow)" opacity={0.55} />
                <Circle cx={q.x} cy={q.y} r="8" fill="#C9A84C" stroke="#F0D080" strokeWidth="0.5" />
                <SvgText x={q.x} y={q.y + 4} fill="#060610" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {glyphFor(p.planet)}
                </SvgText>
              </React.Fragment>
            );
          })}

          {showLabels && (
            <>
              <SvgText x={c} y={16} fill="#C9A84C" fontSize="11" textAnchor="middle">
                ASC {chart?.angles?.ASC != null ? Number(chart.angles.ASC).toFixed(1) + '°' : ''}
              </SvgText>
              <SvgText x={c} y={size - 6} fill="#C9A84C" fontSize="11" textAnchor="middle">
                MC {chart?.angles?.MC != null ? Number(chart.angles.MC).toFixed(1) + '°' : ''}
              </SvgText>
            </>
          )}

          <Circle cx={c} cy={c} r="5" fill="url(#goldGlow)" />
        </Svg>
        <Text style={{ color: '#807C6A', fontSize: 12, marginTop: 6 }}>Çarka dokun: etiket görünümünü değiştir</Text>
      </Pressable>
    </MotiView>
  );
}
