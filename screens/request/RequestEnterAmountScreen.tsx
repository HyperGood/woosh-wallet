import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import NumberPad from '../../components/UI/NumberPad';
import { TabOption } from '../../components/UI/Tabs';
import { COLORS } from '../../constants/global-styles';
import { useRequest } from '../../store/RequestContext';

const RequestEnterAmountScreen = () => {
  const [amount, setAmount] = useState('0');
  const [description, setDescription] = useState('');
  const { setRequestData } = useRequest();
  const [activeTab, setActiveTab] = useState<TabOption>('Total');

  const handleTabPress = (tab: TabOption) => {
    setActiveTab(tab);
  };

  const handleNextPress = () => {
    router.push('/(app)/request/selectContact');
  };

  useEffect(() => {
    setRequestData(
      (prevData) =>
        ({
          ...prevData,
          totalAmount: amount,
          description,
          type: 'total',
        }) as any
    );
  }, [amount]);

  return (
    <ScrollView style={{ flex: 1, width: '100%' }}>
      <View style={styles.wrapper}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
          }}>
          <View style={{ position: 'absolute', left: 16, top: 2 }}>
            <BackButton />
          </View>
          <Text style={styles.title}>Solicitar Pago</Text>
        </View>
        <NumberPad
          onChange={setAmount}
          description={description}
          setDescription={setDescription}
          type="request"
          activeTab={activeTab}
          handleTabPress={handleTabPress}
        />
        <View style={styles.buttonWrapper}>
          <Button
            title="Next"
            type="primary"
            onPress={() => {
              setDescription('');
              handleNextPress();
            }}
            disabled={amount === '0'}
          />
        </View>
      </View>
    </ScrollView>
  );
};
export default RequestEnterAmountScreen;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  title: {
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    fontSize: 24,
  },
  recipient: {
    marginHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  recipientName: {
    fontSize: 32,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
  },
  recipientPhone: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
    opacity: 0.6,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  buttonWrapper: {
    marginTop: 24,
    flexDirection: 'row',
    marginHorizontal: 12,
  },
});
