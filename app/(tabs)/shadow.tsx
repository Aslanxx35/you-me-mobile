import { Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { Screen, s } from '../../src/components/Screen';
import { SHADOW_QUESTIONS, ARCHETYPE_NAMES } from '../../src/data/shadow';
import { useShadowStore } from '../../src/stores/shadowStore';
import { ShadowRadar } from '../../src/components/ShadowRadar';
import { PremiumGate } from '../../src/components/PremiumGate';
import { useSubscriptionStore } from '../../src/stores/subscriptionStore';

export default function Shadow() {
  const { answers, setAnswer, complete, results, reset } = useShadowStore();
  const [i, setI] = useState(Object.keys(answers).length);
  const premium = useSubscriptionStore(x => x.isPremium);

  if (results) {
    return (
      <Screen>
        <Text style={s.title}>Gölge Arketipin</Text>
        <Text style={s.subtitle}>
          Baskın: {ARCHETYPE_NAMES[results.dominant as keyof typeof ARCHETYPE_NAMES]} · İkincil: {ARCHETYPE_NAMES[results.secondary as keyof typeof ARCHETYPE_NAMES]}
        </Text>
        <ShadowRadar scores={results.scores} />
        <PremiumGate premium={premium}>
          <View style={s.card}>
            <Text style={s.text}>Detaylı arketip raporun ve kişisel önerilerin burada.</Text>
          </View>
        </PremiumGate>
        <TouchableOpacity style={s.button} onPress={reset}>
          <Text style={s.buttonText}>Testi Yeniden Yap</Text>
        </TouchableOpacity>
      </Screen>
    );
  }

  const q = SHADOW_QUESTIONS[i];

  return (
    <Screen>
      <Text style={s.subtitle}>Soru {i + 1}/{SHADOW_QUESTIONS.length}</Text>
      <Text style={[s.title, { fontSize: 24 }]}>{q.question}</Text>
      {q.options.map((o, j) => (
        <TouchableOpacity
          key={o}
          style={s.card}
          onPress={() => {
            setAnswer(q.id, j);
            if (i === SHADOW_QUESTIONS.length - 1) {
              complete();
            } else setI(i + 1);
          }}
        >
          <Text style={s.text}>{o}</Text>
        </TouchableOpacity>
      ))}
    </Screen>
  );
}
