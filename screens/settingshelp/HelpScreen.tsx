import { Feather } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';

import HelpItem from '../../components/settings/HelpItem';
import i18n from '../../constants/i18n';

const HelpScreen = () => {
  const router = useRouter();
  const text = 'Have a question?\nRan into an issue?\nFound a bug?'

  return (
    <ScrollView style={styles.container}>
      <Pressable style={styles.goBack} onPress={() => router.dismiss(1)}>
        <Feather name="arrow-left" size={24} color={'#444447'} />
      </Pressable>
      <Text style={styles.title}>{i18n.t('helpTitle')}</Text>
      <HelpItem label={i18n.t('helpQ1')} answer={i18n.t('helpA1')} onPress={() => (Linking.openURL('https://whatsapp.com/channel/0029VaPyZL21dAvu00J87z1q'))} />
      <HelpItem label={i18n.t('helpQ2')} answer={i18n.t('helpA2')} onPress={() => (Linking.openURL('https://wa.me/523111234567'))} />
      <HelpItem label={i18n.t('helpQ3')} answer={i18n.t('helpA3')} onPress={() => true} />
    </ScrollView>
  );
};

export default HelpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 40,
    marginTop: 60,
    marginBottom: 24,
  },
  goBack: {
    position: 'absolute',
  },
});
