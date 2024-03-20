import { Stack } from 'expo-router';
import { View, Text, Button } from 'react-native';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}