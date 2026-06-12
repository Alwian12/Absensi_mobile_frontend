import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialAttendanceRecords } from '../data/attendance';
import type { AttendanceRecord } from '../types/attendance';

type UserRole = 'employee' | 'admin' | null;

type AppStoreValue = {
  isLoggedIn: boolean;
  userRole: UserRole;
  isLoading: boolean;
  attendanceRecords: AttendanceRecord[];
  signIn: (role: UserRole) => void;
  signOut: () => Promise<void>;
};

const AppStoreContext = createContext<AppStoreValue | undefined>(undefined);

export const AppStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attendanceRecords] = useState(initialAttendanceRecords);

  // Otomatis mengecek apakah ada Token tersimpan saat aplikasi pertama kali dibuka
  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const role = await AsyncStorage.getItem('userRole') as UserRole;
      
      if (token) {
        setIsLoggedIn(true);
        setUserRole(role || 'employee');
      }
    } catch (e) {
      console.error('Gagal memuat token', e);
    } finally {
      setIsLoading(false); // Selesai loading, masuk ke aplikasi
    }
  };

  const signIn = useCallback((role: UserRole) => {
    setIsLoggedIn(true);
    setUserRole(role);
  }, []);

  const signOut = useCallback(async () => {
    // Memastikan memori HP benar-benar bersih saat Logout
    await Promise.all([
      AsyncStorage.removeItem('userToken'),
      AsyncStorage.removeItem('userData'),
      AsyncStorage.removeItem('userRole'),
    ]);
    setIsLoggedIn(false);
    setUserRole(null);
  }, []);

  return (
    <AppStoreContext.Provider
      value={{ isLoggedIn, userRole, isLoading, attendanceRecords, signIn, signOut }}>
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore harus digunakan di dalam AppStoreProvider');
  }
  return context;
};
