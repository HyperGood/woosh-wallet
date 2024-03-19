import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import Button from '../../components/UI/Button';
import NumberPad from '../../components/UI/NumberPad';
import { TabOption } from '../../components/UI/Tabs';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useRequest } from '../../store/RequestContext';
import { useSmartAccount } from '../../store/SmartAccountContext';

const RequestEnterAmountScreen = () => {
  const [amount, setAmount] = useState('0');
  const [description, setDescription] = useState('');
  const { address } = useSmartAccount();
  const { setRequestData } = useRequest();
  const [activeTab, setActiveTab] = useState<TabOption>({ title: 'Total', value: 'total' });

  const handleTabPress = (tab: TabOption) => {
    setActiveTab(tab);
  };

  const handleNextPress = () => {
    router.push('/request/selectContact');
  };

  useEffect(() => {
    setRequestData(
      (prevData) =>
        ({
          ...prevData,
          totalAmount: amount,
          amountPerPerson: amount,
          description,
          recipientAddress: address,
          type: activeTab.value,
        }) as any
    );
  }, [amount, activeTab, description]);

  return (
    <ScrollView style={{ flex: 1, width: '100%' }}>
      <View style={styles.wrapper}>
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
            title={i18n.t('next')}
            type="secondary"
            icon="arrow-right"
            onPress={() => {
              setDescription('');
              handleNextPress();
            }}
            disabled={parseFloat(amount) <= 0}
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
