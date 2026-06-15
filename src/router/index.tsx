import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Icon, IconName } from '../components/Icon';
import { colors } from '../components/Theme';
import { AppStoreProvider, useAppStore } from '../state/AppStore';

// Import semua layar yang sudah kita "upgrade"
import AttendanceScreen from '../screens/AttendanceScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReportsScreen from '../screens/ReportsScreen';
import RequestsScreen from '../screens/RequestsScreen';
import TeamScreen from '../screens/TeamScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcons: Record<string, IconName> = {
  Beranda: 'home',
  Absensi: 'camera',
  Pengajuan: 'file',
  Tim: 'users',
  Laporan: 'barChart',
  Profil: 'user',
};

const MainTabs = () => {
  const { userRole } = useAppStore();
  const isManager = userRole === 'admin';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.faint,
        tabBarIcon: ({ color, size, focused }) => (
          <Icon
            name={tabIcons[route.name] ?? 'home'}
            size={size}
            color={color}
            strokeWidth={focused ? 2.5 : 2}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '900',
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          minHeight: 68,
          paddingBottom: 10,
          paddingTop: 9,
          elevation: 10,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 14,
        },
      })}>
      <Tab.Screen name="Beranda" component={DashboardScreen} />
      <Tab.Screen name="Absensi" component={AttendanceScreen} />
      <Tab.Screen name="Pengajuan" component={RequestsScreen} />
      {/* Tab "Tim" hanya muncul jika yang login adalah Admin */}
      {isManager ? <Tab.Screen name="Tim" component={TeamScreen} /> : null}
      <Tab.Screen name="Laporan" component={ReportsScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const RouterContent = () => {
  const { isLoggedIn, isLoading } = useAppStore();

  // Menampilkan layar loading saat mengecek token di memori HP
  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Router = () => (
  <AppStoreProvider>
    <RouterContent />
  </AppStoreProvider>
);

export default Router;

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
  },
});
