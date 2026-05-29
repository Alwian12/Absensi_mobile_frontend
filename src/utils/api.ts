import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// PENTING: Ganti dengan IP Address komputermu (IPv4). 
// Ketik 'ipconfig' di CMD Windows atau 'ifconfig' di Mac untuk melihatnya.
// Jika pakai emulator Android bawaan Android Studio, bisa pakai 'http://10.0.2.2:3000'
const BASE_URL = 'http://10.0.2.2:3000'; // Ganti bagian ini ya!

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Interceptor: Otomatis menyelipkan JWT Token ke setiap request ke backend
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error mengambil token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;