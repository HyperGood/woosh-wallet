import { Feather } from '@expo/vector-icons';
import { Button, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { COLORS } from '../../constants/global-styles';
import HelpItem from '../../components/settings/HelpItem';

const HelpScreen = () => {
  const router = useRouter();
  const text = 'Have a question?\nRan into an issue?\nFound a bug?'

  return (
    <ScrollView style={styles.container}>
      <Pressable style={styles.goBack} onPress={() => router.dismiss(1)}>
        <Feather name="arrow-left" size={24} color={'#444447'} />
      </Pressable>
      <Text style={styles.title}>{text}</Text>
      <HelpItem label={'WhatsApp Group'} answer={'Share bugs or ask questions. Reach out out here if it’s not a private topic.'} onPress={() => true} />
      <HelpItem label={'Private Chat'} answer={'Delicate topic you don’t want others knowing about?'} onPress={() => true} />
      <HelpItem label={'On/Off Ramp Funds?'} answer={'Share bugs or ask questions. Reach out out here if it’s not a private topic.'} onPress={() => true} />
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
    fontFamily: 'Satoshi',
    fontWeight: '700',
    fontSize: 40,
    marginTop: 60,
    marginBottom: 24,
  },
  goBack: {
    position: 'absolute',
  },
});
