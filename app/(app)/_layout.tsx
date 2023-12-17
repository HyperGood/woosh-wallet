import { Redirect, Stack } from 'expo-router';

import { useSession } from '../../store/auth-context';

export default function Layout() {
  const { token } = useSession();

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
