import { Feather } from '@expo/vector-icons';
import { Link, Stack, router } from 'expo-router';
import { Button, Pressable, Image, SafeAreaView, StyleSheet, Text, View, TextInput, TouchableWithoutFeedback } from 'react-native';

import { COLORS } from '../../constants/global-styles';
import { useSession } from '../../store/AuthContext';
import SettingsOption from '../../components/settings/SettingsOption';

const SettingsScreen = () => {
  const { logout } = useSession();

  return (
    <>
      <View style={styles.container}>
        <Pressable style={styles.exit} onPress={() => router.navigate('/')}>
          <Feather name="x" size={24} color={'#444447'} />
        </Pressable>
        <View style={{ flexDirection: 'row', marginTop: 56 }}>
          <View style={{ justifyContent: 'center' }}>
            <Image
              source={require('../../assets/images/temp/janet.jpg')}
              style={styles.userImage}
            />
          </View>
          <View style={{ justifyContent: 'center', paddingLeft: 18 }}>
            <Text style={styles.account}>$account1</Text>
            <Text style={styles.joinedOn}>Joined On: 04/01/2024</Text>
          </View>
        </View>
        <View style={{ marginTop: 30, marginBottom: 16 }}>
          <View>
            <Text style={styles.upperInputText}>Name</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.textInput} value={'Name'} />
              <View style={styles.iconContainer}>
                <Feather name="edit-2" size={16} color="black" />
              </View>
            </View>
          </View>
          <View style={{ marginTop: 12 }}>
            <Text style={styles.upperInputText}>ETH Address</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.textInput} value={'0x123..123'} editable={false} />
              <View style={styles.iconContainer}>
                <Feather name="link" size={16} color="black" />
              </View>
            </View>
          </View>
        </View>
        <SettingsOption
          icon={'help-circle'}
          label={'Help'}
          onPress={() => router.push('/settingshelp/help')}
          color={'#00A3FF'}
        />
        <SettingsOption
          icon={'bell'}
          label={'Notification'}
          onPress={() => (true)}
          color={'#FFDE68'}
        />
        <SettingsOption
          icon={'eye'}
          label={'Theme'}
          onPress={() => (true)}
          color={'#1EE51E'}
        />
        <SettingsOption
          icon={'eye-off'}
          label={'Log Out'}
          onPress={() => logout()}
          color={'#FF1568'}
        />
        <View
          style={{
            alignItems: 'center',
            opacity: 0.4,
            width: '100%',
          }}>
          <Text style={styles.testText}>Tesnet Mode</Text>
          <View style={{ flexDirection: 'row', width: '70%', justifyContent: 'space-between' }}>
            <Text style={styles.testText}>Network: Base Sepolia</Text>
            <Text style={styles.testText}>Build 01 - (03/25/2024)</Text>
          </View>
          <Text style={styles.testText}>Made with 3 in Mexico by HyperGood</Text>
        </View>
      </View>
    </>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  exit: {
    position: 'absolute',
  },
  userImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  account: {
    fontFamily: 'Satoshi',
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: -0.2,
    color: COLORS.dark,
  },
  joinedOn: {
    fontFamily: 'Satoshi',
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: -0.2,
    color: COLORS.dark,
  },
  upperInputText: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Satoshi',
    fontWeight: '700',
  },
  textInput: {
    fontSize: 17,
    fontFamily: 'Satoshi',
    height: '100%',
    width: '100%',
    textAlignVertical: 'center',
    zIndex: 2,
  },
  inputContainer: {
    height: 65,
    width: '100%',
    backgroundColor: '#DADADA',
    justifyContent: 'center',
    paddingLeft: 16,
    borderRadius: 16,
    opacity: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 1,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testText: {
    fontSize: 14,
    fontFamily: 'Satoshi',
    marginVertical: 4,
    color: '#444447',
  }
});
