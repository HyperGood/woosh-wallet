import { BlurView } from 'expo-blur';
import { Tabs, useSegments } from 'expo-router';

import HomeIcon from '../../assets/images/icons/HomeIcon';
import QRIcon from '../../assets/images/icons/QRIcon';
import TransactionIcon from '../../assets/images/icons/TransactionIcon';
import { COLORS } from '../../constants/global-styles';

export default function TabLayout() {
  const segments: string[] = useSegments();
  const hide: boolean = segments.includes("settingshelp");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary[600],
        tabBarInactiveTintColor: COLORS.dark,
        tabBarActiveBackgroundColor: COLORS.primary[200],
        tabBarBackground: () => <BlurView />,
        tabBarStyle: {
          borderRadius: 100,
          height: 72,
          alignItems: 'center',
          marginHorizontal: 16,
          marginBottom: 24,
          paddingBottom: 0,
          position: 'absolute',
          backgroundColor: 'white',
          display: hide ? "none" : "flex",
        },
        tabBarItemStyle: {
          borderRadius: 100,
          height: '100%',
        },
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon color={color} fill={focused ? color : 'transparent'} />
          ),
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="qr"
        options={{
          tabBarIcon: ({ color }) => <QRIcon color={color} />,
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          tabBarIcon: ({ color }) => <TransactionIcon color={color} />,
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}
