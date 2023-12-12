import { createPasskeyOwner } from '@zerodev/sdk/passkey';
import { ZeroDevConnector } from '@zerodev/wagmi';
import { Alert } from 'react-native';
import { useConnect } from 'wagmi';
//import { useState } from 'react';

import { chains } from '../../app/_layout';
import Button from '../UI/Button';

const CreateWallet = () => {
  //const [creatingWallet, setCreatingWallet] = useState(false);
  const { connect } = useConnect({
    onSuccess(data) {
      console.log('Connect', data);
    },
    onError(error) {
      console.log('Error', error);
    },
  });
  const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID || '';

  async function createWallet() {
    console.log('Creating wallet Wallet');
    try {
      const owner = await createPasskeyOwner({ name: 'Woosh', projectId: PROJECT_ID });

      if (owner) {
        console.log(owner);
        connect({
          connector: new ZeroDevConnector({
            chains,
            options: {
              projectId: PROJECT_ID,
              owner,
            },
          }),
        });
        console.log(owner);
      } else {
        Alert.alert("Couldn't create wallet");
      }
    } catch (error) {
      Alert.alert('Error');
      console.log(error);
    }
  }

  return <Button title="Create Wallet" onPress={createWallet} />;
};
export default CreateWallet;
