import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import ContactListItem from '../../components/request/ContactListItem';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useRequest } from '../../store/RequestContext';

const SuccessScreen = () => {
  const { requestData } = useRequest();
  const totalAmount = requestData?.totalAmount || 1;

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync('Request Link');
    Alert.alert('Copied to clipboard!');
  };
  return (
    <View style={{ width: '100%', flex: 1 }}>
      <LinearGradient
        colors={['#00FF47', '#19181D']}
        style={styles.background}
        end={{ x: 0.3, y: 0.7 }}
      />
      <SafeAreaView style={styles.container}>
        <View />
        <View style={{ alignSelf: 'flex-start', position: 'absolute', top: 100, left: 16 }}>
          <BackButton backFunction={() => router.push('/')} size={24} />
        </View>
        <View style={{ alignItems: 'center', width: '100%', padding: 16 }}>
          <Text style={styles.title}>
            {i18n.t('requestSuccessTitle1')} ${totalAmount} {i18n.t('requestSuccessTitle2')}:
          </Text>
          {requestData?.contacts && requestData.contacts?.length > 0 && (
            <FlatList
              data={requestData?.contacts}
              renderItem={({ item, index }) => (
                <ContactListItem
                  name={item.name}
                  phoneNumber={item.phoneNumber}
                  amount={item.amount.toString()}
                />
              )}
              keyExtractor={(item) => item.phoneNumber}
              style={styles.contactsContainer}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: 1,
                    backgroundColor: COLORS.light,
                    opacity: 0.05,
                    width: '75%',
                    alignSelf: 'center',
                    marginVertical: 8,
                  }}
                />
              )}
            />
          )}
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title={i18n.t('copyLink')}
            type="secondary"
            icon="link"
            onPress={copyToClipboard}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};
export default SuccessScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  contactsContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: COLORS.gray[800],
    borderRadius: 24,
    paddingVertical: 8,
    width: '100%',
  },
  title: {
    fontSize: 48,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
    marginBottom: 4,
  },
  description: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
    marginBottom: 16,
  },
  buttonWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
});
