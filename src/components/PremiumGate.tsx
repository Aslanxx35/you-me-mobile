import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '../constants/colors';

export function PremiumGate({ children, premium }: { children: any; premium: boolean }) {
  if (premium) return children;

  return (
    <View style={{ backgroundColor: COLORS.dark.panel, padding: 20, borderRadius: 18, marginVertical: 10 }}>
      <Text style={{ color: COLORS.dark.gold, fontSize: 20, fontWeight: '800' }}>✨ Premium</Text>
      <Text style={{ color: COLORS.dark.textDim, marginTop: 8 }}>Bu detaylı içerik premium üyeler içindir.</Text>
      <TouchableOpacity
        onPress={() => router.push('/premium')}
        style={{ marginTop: 14, padding: 13, backgroundColor: COLORS.dark.gold, borderRadius: 12 }}
      >
        <Text style={{ textAlign: 'center', fontWeight: '800' }}>3 Gün Ücretsiz Dene</Text>
      </TouchableOpacity>
    </View>
  );
}
