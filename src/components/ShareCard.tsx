import React, { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { shareView } from '../services/share';
import { COLORS } from '../constants/colors';

export function ShareCard({ title, text }: { title: string; text: string }) {
  const ref = useRef<View>(null);

  return (
    <View>
      <View ref={ref} collapsable={false} style={{ backgroundColor: COLORS.dark.panel, padding: 24, borderRadius: 18 }}>
        <Text style={{ color: COLORS.dark.gold, fontSize: 22, fontWeight: '800' }}>{title}</Text>
        <Text style={{ color: COLORS.dark.text, marginTop: 12 }}>{text}</Text>
      </View>
      <TouchableOpacity
        onPress={() => shareView(ref, `${title}\n${text}\nYOU me`)}
        style={{ marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: COLORS.dark.gold }}
      >
        <Text style={{ textAlign: 'center', fontWeight: '800' }}>Paylaş</Text>
      </TouchableOpacity>
    </View>
  );
}
