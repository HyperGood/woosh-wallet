import { Stack } from 'expo-router';

import { RequestProvider } from '../../../../store/RequestContext';

export default function Layout() {
  return (
    <RequestProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </RequestProvider>
  );
}
