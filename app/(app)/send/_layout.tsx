import { Stack } from 'expo-router';

import { TransactionProvider } from '../../../store/TransactionContext';

export default function Layout() {
  return (
    <TransactionProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </TransactionProvider>
  );
}
