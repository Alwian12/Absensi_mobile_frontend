import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {colors} from '../components/Theme';
import {AppStoreProvider, useAppStore} from '../state/AppStore';
import AttendanceScreen from '../screens/AttendanceScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReportsScreen from '../screens/ReportsScreen';
import RequestsScreen from '../screens/RequestsScreen';
import TeamScreen from '../screens/TeamScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const {user} = useAppStore();
  const isManager = user?.role !== 'pegawai';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '900',
        },
        tabBarStyle: {
          borderTopColor: '#E2E8F0',
          minHeight: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}>
      <Tab.Screen name="Beranda" component={DashboardScreen} />
      <Tab.Screen name="Absensi" component={AttendanceScreen} />
      <Tab.Screen name="Pengajuan" component={RequestsScreen} />
      {isManager ? <Tab.Screen name="Tim" component={TeamScreen} /> : null}
      <Tab.Screen name="Laporan" component={ReportsScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const RouterContent = () => {
  const {user} = useAppStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? (
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
