import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Screen, s } from '../../src/components/Screen';
import { GlowCard } from '../../src/components/GlowCard';
import { useAuthStore } from '../../src/stores/authStore';
import { useSubscriptionStore } from '../../src/stores/subscriptionStore';
import { useChartStore } from '../../src/stores/chartStore';
import { dailyApi } from '../../src/services/api/daily';
import { useEffect, useState } from 'react';
import { analyticsEvent } from '../../src/services/analytics';
import { getSunSignTR } from '../../src/utils/sunSign';

export default function Home() {
  const user = useAuthStore((x) => x.user);
  const premium = useSubscriptionStore((x) => x.isPremium);
  const natalChart = useChartStore((x) => x.natalChart);
  const [reading, setReading] = useState<any>(null);

  const sunSign = getSunSignTR(natalChart);

  useEffect(() => {
    if (user?.birthData && sunSign) {
      dailyApi
        .getTodayReading(sunSign)
        .then((r) => setReading(r.data?.data || r.data))
        .catch(() => {});
      analyticsEvent('dashboard_view', { sunSign });
    }
  }, [user?.id, sunSign]);

  return (
    <Screen>
      <Text style={s.title}>Günaydın {user?.name || 'Gezgin'} ✨</Text>
      <Text style={s.subtitle}>Bugünün gökyüzü sana ne söylüyor?</Text>

      <GlowCard delay={0}>
        <Text style={{ color: '#C9A84C', fontWeight: '800' }}>
          Günlük AI yorum{sunSign ? ` · ${sunSign}` : ''}
        </Text>
        <Text style={[s.text, { marginTop: 10 }]}>
          {!user?.birthData
            ? 'Doğum haritanı tamamla; kişisel yorumun burada görünecek.'
            : reading?.reading || 'Yorum hazırlanıyor…'}
        </Text>
      </GlowCard>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {[
          ['Natal', '/(tabs)/natal'],
          ['Tarot', '/(tabs)/tarot'],
          ['Sinastri', '/(tabs)/synastry'],
          ['Transit', '/(tabs)/transit'],
        ].map(([t, r], i) => (
          <GlowCard key={t} delay={80 + i * 60} style={{ width: '47%', marginBottom: 10 }}>
            <TouchableOpacity onPress={() => router.push(r as any)}>
              <Text style={{ color: '#C9A84C', fontWeight: '800' }}>{t}</Text>
            </TouchableOpacity>
          </GlowCard>
        ))}
      </View>

      <Text style={{ color: '#807C6A', marginTop: 10 }}>Premium: {premium ? 'Aktif' : 'Aktif değil'}</Text>
    </Screen>
  );
}
