import { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { GradientBackground } from './GradientBackground';

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  return (
    <GradientBackground>
      <SafeAreaView style={s.safe}>
        {scroll ? <ScrollView contentContainerStyle={s.content}>{children}</ScrollView> : children}
      </SafeAreaView>
    </GradientBackground>
  );
}

export const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: COLORS.dark.panel, borderRadius: 18, padding: 18, marginBottom: 14 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.dark.gold, marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.dark.textDim, marginBottom: 20 },
  text: { color: COLORS.dark.text, fontSize: 16, lineHeight: 24 },
  button: { backgroundColor: COLORS.dark.gold, padding: 15, borderRadius: 14, marginTop: 10 },
  buttonText: { textAlign: 'center', fontWeight: '800', color: '#060610' },
  input: { backgroundColor: '#111125', borderRadius: 12, padding: 14, color: '#fff', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(201,168,76,.2)' },
});
