import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker'; // Kita pakai galeri untuk surat sakit

import api from '../utils/api';
import { Button, Field, Segmented } from '../components/FormControls';
import { Card, Screen, SectionHeader } from '../components/Screen';
import { colors } from '../components/Theme';

const jenisIzinOptions = ['sakit', 'izin', 'cuti', 'pulang_cepat'];

const RequestsScreen = () => {
  const { width } = useWindowDimensions();
  const isWide = width >= 920;

  // State Daftar Izin
  const [requestsList, setRequestsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Form Pengajuan
  const [jenis, setJenis] = useState(jenisIzinOptions[0]);
  const [alasan, setAlasan] = useState('');
  // Untuk format tanggal, kita buat sederhana YYYY-MM-DD
  const [tanggalMulai, setTanggalMulai] = useState(new Date().toISOString().split('T')[0]);
  const [tanggalSelesai, setTanggalSelesai] = useState(new Date().toISOString().split('T')[0]);
  
  const [lampiran, setLampiran] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data setiap kali layar dibuka
  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [])
  );

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/izin');
      setRequestsList(response.data);
    } catch (error) {
      console.error('Error fetching izin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (!result.didCancel && result.assets) {
      setLampiran(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (alasan.trim().length < 10) {
      Alert.alert('Peringatan', 'Alasan harus diisi minimal 10 karakter!');
      return;
    }

    if (new Date(tanggalMulai) > new Date(tanggalSelesai)) {
      Alert.alert('Peringatan', 'Tanggal mulai tidak boleh lebih dari tanggal selesai!');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('tanggal_mulai', tanggalMulai);
      formData.append('tanggal_selesai', tanggalSelesai);
      formData.append('jenis', jenis);
      formData.append('alasan', alasan);
      
      if (lampiran) {
        formData.append('lampiran', {
          uri: lampiran.uri,
          type: lampiran.type || 'image/jpeg',
          name: lampiran.fileName || 'surat_izin.jpg',
        } as any);
      }

      const response = await api.post('/api/izin', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Sukses', response.data.message);
      
      // Reset form
      setAlasan('');
      setLampiran(null);
      
      // Tarik ulang data list
      fetchRequests();

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'G