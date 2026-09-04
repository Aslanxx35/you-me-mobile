import {useEffect,useState} from 'react';
import {Text,TouchableOpacity,Switch,Linking,Alert,View} from 'react-native';
import {router} from 'expo-router';
import {Screen,s} from '../src/components/Screen';
import {scheduleDailyNotification,cancelDailyNotification} from '../src/services/notification';
import {authenticateBiometric,biometricAvailability,enableBiometric,disableBiometric} from '../src/services/biometric.service';
import {secureStore} from '../src/services/secureStore';
import {ENV} from '../src/config/env';
import {initAnalytics} from '../src/services/analytics';
import {usePrivacyStore} from '../src/stores/privacyStore';
import {userApi} from '../src/services/api/user';
import {useAuthStore} from '../src/stores/authStore';
import {useLanguageStore} from '../src/stores/languageStore';

export default function Settings() {
  const { analytics, setAnalytics } = usePrivacyStore();
  const logout = useAuthStore((x) => x.logout);
  const lang = useLanguageStore((x) => x.language);
  const setLang = useLanguageStore((x) => x.setLanguage);
  const [notifOn, setNotifOn] = useState(false);
  const [bioAvailable, setBioAvailable] = useState(false);
  const [bioOn, setBioOn] = useState(false);

  useEffect(() => {
    (async () => {
      const bio = await biometricAvailability();
      setBioAvailable(bio.available);
      setBioOn(await secureStore.biometricEnabled());
    })();
  }, []);

  const toggleNotifications = async (value: boolean) => {
    if (value) {
      const result = await scheduleDailyNotification();
      if (!result) {
        Alert.alert('İzin gerekli', 'Bildirimleri açmak için cihaz ayarlarından izin vermen gerekiyor.');
        return;
      }
    } else {
      await cancelDailyNotification();
    }
    setNotifOn(value);
  };

  const toggleBiometric = async (value: boolean) => {
    if (value) {
      const ok = await authenticateBiometric();
      if (!ok) {
        Alert.alert('Doğrulama başarısız', 'Face ID / parmak izi doğrulanamadı.');
        return;
      }
      await enableBiometric();
    } else {
      await disableBiometric();
    }
    setBioOn(value);
  };

  const toggleAnalytics = async (value: boolean) => {
    setAnalytics(value);
    if (value) await initAnalytics();
  };

  const deleteAccount = () => {
    Alert.alert(
      'Hesabı sil',
      'Bu işlem geri alınamaz. Tüm verilerin kalıcı olarak silinecek.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Hesabımı Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await userApi.deleteAccount();
              await logout();
              router.replace('/(auth)/welcome');
            } catch (e: any) {
              Alert.alert('Hata', e?.response?.data?.error || 'Hesap silinemedi, tekrar dene.');
            }
          },
        },
      ]
    );
  };

  const exportData = async () => {
    try {
      const r = await userApi.exportData();
      Alert.alert('Veri dışa aktarma', 'Verilerin hazırlandı: ' + JSON.stringify(r.data?.data || r.data).slice(0, 200) + '...');
    } catch (e: any) {
      Alert.alert('Hata', e?.response?.data?.error || 'Veri dışa aktarılamadı.');
    }
  };

  return (
    <Screen>
      <Text style={s.title}>Ayarlar</Text>

      <View style={[s.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={s.text}>Günlük bildirim (08:00)</Text>
        <Switch value={notifOn} onValueChange={toggleNotifications} />
      </View>

      {bioAvailable && (
        <View style={[s.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <Text style={s.text}>Face ID / Parmak izi ile giriş</Text>
          <Switch value={bioOn} onValueChange={toggleBiometric} />
        </View>
      )}

      <View style={[s.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={s.text}>Ürün analitiğine izin ver</Text>
        <Switch value={analytics} onValueChange={toggleAnalytics} />
      </View>

      <Text style={[s.subtitle, { marginTop: 16 }]}>Dil</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(['tr', 'en', 'de'] as const).map((l) => (
          <TouchableOpacity
            key={l}
            onPress={() => setLang(l)}
            style={{ padding: 10, borderRadius: 10, backgroundColor: lang === l ? '#C9A84C' : '#0E0E1C' }}
          >
            <Text style={{ color: lang === l ? '#060610' : '#CCC8B4' }}>{l.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={s.card} onPress={() => Linking.openURL(ENV.privacyUrl)}>
        <Text style={s.text}>Gizlilik Politikası</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.card} onPress={() => Linking.openURL(ENV.termsUrl)}>
        <Text style={s.text}>Kullanım Koşulları</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.card} onPress={exportData}>
        <Text style={s.text}>Verilerimi Dışa Aktar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[s.button, { backgroundColor: '#C05555', marginTop: 24 }]} onPress={deleteAccount}>
        <Text style={s.buttonText}>Hesabımı Sil</Text>
      </TouchableOpacity>
    </Screen>
  );
}
