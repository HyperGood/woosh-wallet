import { Feather } from '@expo/vector-icons';
import { Link, Stack, router } from 'expo-router';
import { Button, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../constants/global-styles';

const SettingsScreen = () => {
  return (
    <View>
      <Pressable style={styles.contactIcon} onPress={() => router.navigate('/')}>
        <Feather name="x" size={24} color={'#444447'} />
      </Pressable>
      <Link push href="/settingshelp/help">
        Go to other page
      </Link>
    </View>
  );
};

export default SettingsScreen;

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
