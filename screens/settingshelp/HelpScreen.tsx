import { Feather } from '@expo/vector-icons';
import { Button, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { COLORS } from '../../constants/global-styles';

const HelpScreen = () => {
  const router = useRouter();

  return (
    <View>
      <Pressable style={styles.contactIcon} onPress={() => router.dismiss(1)}>
        <Feather name="arrow-left" size={24} color={'#444447'} />
      </Pressable>
      <Text>Hola desde help</Text>
    </View>
  );
};

export default HelpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contactIcon: {
    position: 'absolute',
    top: 50,
    left: 10,
  },
});
