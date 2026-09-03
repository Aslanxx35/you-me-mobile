import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Screen, s } from '../../src/components/Screen';
import { GlowCard } from '../../src/components/GlowCard';
import { FlipTarotCard } from '../../src/components/FlipTarotCard';
import { drawTarot, TAROT_DECK } from '../../src/data/tarot';
import { useTarotStore } from '../../src/stores/tarotStore';
import { aiApi } from '../../src/services/api/ai';
import { useSubscriptionStore } from '../../src/stores/subscriptionStore';
import { PremiumGate } from '../../src/components/PremiumGate';
import { analyticsEvent } from '../../src/services/analytics';
import { TAROT_IMAGES } from '../../src/constants/tarotAssets';
import { ShareCard } from '../../src/components/ShareCard';

export default function Tarot() {
  const premium = useSubscriptionStore((x) => x.isPremium);
  const { history, add, hydrate } = useTarotStore();
  const [count, setCount] = useState(1);
  const [cards, setCards] = useState<any[]>([]);
  const [reading, setReading] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void hydrate();
  }, []);

  const draw = async () => {
    if (!premium && history.some((h) => h.at.slice(0, 10) === new Date().toISOString().slice(0, 10))) return;
    const c = drawTarot(count);
    setCards(c);
    setReading('');
    setLoading(true);
    analyticsEvent('tarot_draw', { count });
    try {
      const r = await aiApi.tarot({ cards: c, archetype: null });
      const text = r.data?.data?.reading || r.data?.reading || 'Kartların enerjisi bugün sezgini güçlendiriyor.';
      setReading(text);
      add({ at: new Date().toISOString(), cards: c, reading: text });
    } catch {
      const text = c.map((x) => `${x.name}: ${x.keywords.join(', ')}`).join('\n');
      setReading(text);
      add({ at: new Date().toISOString(), cards: c, reading: text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={s.title}>Tarot</Text>
      <Text style={s.subtitle}>{TAROT_DECK.length} kart · astroloji · Jung · AI</Text>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[1, 3, 5].map((n) => (
          <TouchableOpacity
            key={n}
            onPress={() => setCount(n)}
            style={{ padding: 12, borderRadius: 10, backgroundColor: count === n ? '#C9A84C' : '#0E0E1C' }}
          >
            <Text style={{ color: count === n ? '#060610' : '#CCC8B4' }}>{n} Kart</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={s.button} onPress={draw} disabled={loading}>
        <Text style={s.buttonText}>{loading ? 'Kartlar çevriliyor…' : 'Kart Çek'}</Text>
      </TouchableOpacity>

      {!premium && (
        <PremiumGate premium={false}>
          <Text style={s.text}>Premium ile sınırsız Tarot çekimi, geçmiş ve detaylı AI yorum açılır.</Text>
        </PremiumGate>
      )}

      {cards.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginTop: 16 }}>
          {cards.map((c, i) => (
            <View key={c.id} style={{ alignItems: 'center' }}>
              <FlipTarotCard
                name={c.name}
                reversed={c.reversed}
                image={TAROT_IMAGES[TAROT_DECK.findIndex((x) => x.id === c.id)]}
                delay={i * 260}
              />
              <Text style={{ fontSize: 18, color: '#C9A84C', fontWeight: '800', marginTop: 10 }}>{c.name}</Text>
              <Text style={[s.text, { fontSize: 13, textAlign: 'center' }]}>
                {c.reversed ? 'Ters' : 'Düz'} · {c.element} · {c.planet} · {c.archetype}
              </Text>
            </View>
          ))}
        </View>
      )}

      {!!reading && (
        <>
          <GlowCard delay={cards.length * 260 + 300}>
            <Text style={s.text}>{reading}</Text>
          </GlowCard>
          <ShareCard title="YOU me Tarot" text={cards.map((c) => `${c.name} · ${c.reversed ? 'Ters' : 'Düz'}`).join(' | ')} />
        </>
      )}

      <Text style={[s.subtitle, { marginTop: 20 }]}>Geçmiş</Text>
      {history.slice(0, 10).map((h, i) => (
        <View key={i} style={s.card}>
          <Text style={{ color: '#C9A84C' }}>{new Date(h.at).toLocaleString()}</Text>
          <Text style={s.text}>{h.cards.map((c) => c.name).join(' · ')}</Text>
        </View>
      ))}
    </Screen>
  );
}
