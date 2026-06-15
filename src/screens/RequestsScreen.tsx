import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';

import {RequestBadge} from '../components/Badge';
import {Button, Field, Segmented} from '../components/FormControls';
import {Icon} from '../components/Icon';
import {Card, Screen, SectionHeader} from '../components/Screen';
import {colors, radius} from '../components/Theme';
import type {RequestStatus} from '../types/attendance';
import api from '../utils/api';

const jenisIzinOptions = ['sakit', 'izin', 'cuti', 'pulang_cepat'];
const todayIso = () => new Date().toISOString().split('T')[0];
const normalizeRequestStatus = (status?: string): RequestStatus => {
  if (status === 'disetujui' || status === 'ditolak') {
    return status;
  }
  return 'menunggu';
};

const RequestsScreen = () => {
  const {width} = useWindowDimensions();
  const isWide = width >= 920;

  const [requestsList, setRequestsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [jenis, setJenis] = useState(jenisIzinOptions[0]);
  const [alasan, setAlasan] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState(todayIso());
  const [tanggalSelesai, setTanggalSelesai] = useState(todayIso());
  const [lampiran, setLampiran] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await api.get('/api/izin');
      setRequestsList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching izin:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [fetchRequests]),
  );

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (!result.didCancel && result.assets?.[0]) {
      setLampiran(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (alasan.trim().length < 10) {
      Alert.alert('Peringatan', 'Alasan harus diisi minimal 10 karakter!');
      return;
    }

    if (new Date(tanggalMulai) > new Date(tanggalSelesai)) {
      Alert.alert(
        'Peringatan',
        'Tanggal mulai tidak boleh lebih dari tanggal selesai!',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('tanggal_mulai', tanggalMulai);
      formData.append('tanggal_selesai', tanggalSelesai);
      formData.append('jenis', jenis);
      formData.append('alasan', alasan.trim());

      if (lampiran) {
        formData.append('lampiran', {
          uri: lampiran.uri,
          type: lampiran.type || 'image/jpeg',
          name: lampiran.fileName || 'surat_izin.jpg',
        } as any);
      }

      const response = await api.post('/api/izin', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });

      Alert.alert('Sukses', response.data?.message || 'Pengajuan terkirim.');
      setAlasan('');
      setLampiran(null);
      fetchRequests();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Gagal mengirim pengajuan izin.';
      Alert.alert('Gagal', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRequestItem = ({item}: {item: any}) => (
    <View style={styles.requestItem}>
      <View style={styles.requestHeader}>
        <View style={styles.requestTitleGroup}>
          <View style={styles.requestIcon}>
            <Icon name="file" size={17} color={colors.brand} strokeWidth={2.3} />
          </View>
          <Text style={styles.requestType}>{item.jenis || item.type || 'Izin'}</Text>
        </View>
        <RequestBadge status={normalizeRequestStatus(item.status)} />
      </View>
      <Text style={styles.requestDate}>
        {item.tanggal_mulai || item.date || '-'}
        {item.tanggal_selesai && item.tanggal_selesai !== item.tanggal_mulai
          ? ` sampai ${item.tanggal_selesai}`
          : ''}
      </Text>
      <Text style={styles.requestReason}>{item.alasan || item.reason || '-'}</Text>
    </View>
  );

  return (
    <Screen title="Pengajuan Izin" badge="Form Izin Online">
      <View style={[styles.grid, isWide && styles.gridWide]}>
        <View style={styles.mainColumn}>
          <Card style={styles.formCard}>
            <SectionHeader
              title="Form Pengajuan"
              subtitle="Isi tanggal, jenis izin, alasan, dan lampiran bila diperlukan"
            />

            <View style={styles.formGap}>
              <Segmented
                items={jenisIzinOptions}
                value={jenis}
                onChange={setJenis}
              />
              <Field
                value={tanggalMulai}
                onChangeText={setTanggalMulai}
                placeholder="Tanggal mulai YYYY-MM-DD"
              />
              <Field
                value={tanggalSelesai}
                onChangeText={setTanggalSelesai}
                placeholder="Tanggal selesai YYYY-MM-DD"
              />
              <Field
                value={alasan}
                onChangeText={setAlasan}
                placeholder="Alasan pengajuan"
                multiline
                numberOfLines={4}
                style={styles.reasonInput}
              />
            </View>

            <View style={styles.attachmentBox}>
              <View style={styles.attachmentInfo}>
                <View style={styles.attachmentTitleRow}>
                  <Icon name="paperclip" size={17} color={colors.brand} strokeWidth={2.3} />
                  <Text style={styles.attachmentLabel}>Lampiran</Text>
                </View>
                <Text style={styles.attachmentValue}>
                  {lampiran?.fileName || 'Belum ada lampiran'}
                </Text>
              </View>
              {lampiran?.uri ? (
                <Image source={{uri: lampiran.uri}} style={styles.attachmentImage} />
              ) : null}
            </View>

            <View style={styles.actionRow}>
              <Button
                label="Pilih Lampiran"
                icon="paperclip"
                onPress={pickImage}
                variant="secondary"
                disabled={isSubmitting}
                style={styles.actionButton}
              />
              <Button
                label={isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan'}
                icon="send"
                onPress={handleSubmit}
                disabled={isSubmitting}
                loading={isSubmitting}
                style={styles.actionButton}
              />
            </View>
          </Card>
        </View>

        <View style={[styles.sideColumn, isWide && styles.sideColumnWide]}>
          <Card>
            <SectionHeader
              title="Riwayat Pengajuan"
              subtitle={`${requestsList.length} data tersimpan`}
            />
            {isLoading ? (
              <ActivityIndicator color={colors.brand} />
            ) : requestsList.length > 0 ? (
              <FlatList
                data={requestsList}
                keyExtractor={(item, index) =>
                  (item.id || item._id || index).toString()
                }
                renderItem={renderRequestItem}
                scrollEnabled={false}
                contentContainerStyle={styles.requestList}
              />
            ) : (
              <Text style={styles.emptyText}>Belum ada pengajuan izin.</Text>
            )}
          </Card>
        </View>
      </View>
    </Screen>
  );
};

export default RequestsScreen;

const styles = StyleSheet.create({
  grid: {gap: 16},
  gridWide: {flexDirection: 'row', alignItems: 'flex-start'},
  mainColumn: {flex: 1},
  sideColumn: {gap: 16},
  sideColumnWide: {width: 380},
  formCard: {gap: 0},
  formGap: {gap: 10},
  reasonInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  attachmentBox: {
    borderRadius: radius.md,
    backgroundColor: colors.panelAlt,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    marginTop: 14,
    gap: 12,
  },
  attachmentInfo: {gap: 4},
  attachmentTitleRow: {flexDirection: 'row', alignItems: 'center', gap: 7},
  attachmentLabel: {color: colors.muted, fontSize: 12, fontWeight: '900', textTransform: 'uppercase'},
  attachmentValue: {color: colors.ink, fontSize: 14, fontWeight: '900'},
  attachmentImage: {
    width: '100%',
    height: 150,
    borderRadius: radius.md,
    backgroundColor: colors.brandSoft,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  actionButton: {flex: 1, minWidth: 150},
  requestList: {gap: 10},
  requestItem: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panelAlt,
    padding: 12,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  requestTitleGroup: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  requestIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestType: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
  requestDate: {color: colors.muted, fontSize: 12, marginTop: 6},
  requestReason: {color: colors.ink, fontSize: 13, lineHeight: 18, marginTop: 8},
  emptyText: {
    color: colors.muted,
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 18,
  },
});
