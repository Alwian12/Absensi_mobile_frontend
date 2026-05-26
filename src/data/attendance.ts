import type {
  ActivityItem,
  AppUser,
  AttendanceRecord,
  PhotoMode,
  RequestRecord,
} from '../types/attendance';

export const demoUsers: AppUser[] = [
  {
    id: 'USR-001',
    name: 'Siti Aminah',
    role: 'pegawai',
    employeeId: 'PGW-001',
    department: 'HR',
  },
  {
    id: 'USR-ADM',
    name: 'Maya Santoso',
    role: 'admin',
    employeeId: 'PGW-006',
    department: 'HR',
  },
  {
    id: 'USR-SPV',
    name: 'Andi Wijaya',
    role: 'atasan',
    employeeId: 'PGW-007',
    department: 'Operasional',
  },
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'PGW-001',
    name: 'Siti Aminah',
    role: 'Admin HR',
    department: 'HR',
    location: 'Kantor Pusat',
    shift: 'Reguler',
    status: 'hadir',
    checkIn: '07:52',
    checkOut: '16:43',
    proof: {
      id: 'FTO-001',
      mode: 'Area kantor',
      note: 'Foto area meja kerja',
      capturedAt: '07:52',
      location: 'Kantor Pusat',
    },
  },
  {
    id: 'PGW-002',
    name: 'Bima Pratama',
    role: 'Staff Operasional',
    department: 'Operasional',
    location: 'Gudang Timur',
    shift: 'Reguler',
    status: 'terlambat',
    checkIn: '08:21',
    checkOut: '16:51',
    proof: {
      id: 'FTO-002',
      mode: 'Lokasi kerja',
      note: 'Foto titik absensi gudang',
      capturedAt: '08:21',
      location: 'Gudang Timur',
    },
  },
  {
    id: 'PGW-003',
    name: 'Nadia Kartika',
    role: 'Finance',
    department: 'Finance',
    location: 'Kantor Pusat',
    shift: 'Reguler',
    status: 'hadir',
    checkIn: '07:45',
    checkOut: '16:35',
    proof: {
      id: 'FTO-003',
      mode: 'Area kantor',
      note: 'Foto meja loket finance',
      capturedAt: '07:45',
      location: 'Kantor Pusat',
    },
  },
  {
    id: 'PGW-004',
    name: 'Rafi Maulana',
    role: 'Teknisi Lapangan',
    department: 'Teknik',
    location: 'Cabang Selatan',
    shift: 'Lapangan',
    status: 'izin',
    checkIn: '-',
    checkOut: '-',
    proof: {
      id: 'DOC-004',
      mode: 'Dokumen tugas',
      note: 'Surat izin tersimpan',
      capturedAt: '06:50',
      location: 'Cabang Selatan',
    },
  },
  {
    id: 'PGW-005',
    name: 'Dewi Maharani',
    role: 'Customer Service',
    department: 'Layanan',
    location: 'Kantor Pusat',
    shift: 'Reguler',
    status: 'alpa',
    checkIn: '-',
    checkOut: '-',
  },
  {
    id: 'PGW-006',
    name: 'Maya Santoso',
    role: 'Admin HR',
    department: 'HR',
    location: 'Kantor Pusat',
    shift: 'Reguler',
    status: 'hadir',
    checkIn: '07:56',
    checkOut: '-',
    proof: {
      id: 'FTO-006',
      mode: 'Area kantor',
      note: 'Foto ruang HR',
      capturedAt: '07:56',
      location: 'Kantor Pusat',
    },
  },
  {
    id: 'PGW-007',
    name: 'Andi Wijaya',
    role: 'Supervisor Operasional',
    department: 'Operasional',
    location: 'Kantor Pusat',
    shift: 'Reguler',
    status: 'hadir',
    checkIn: '07:49',
    checkOut: '-',
    proof: {
      id: 'FTO-007',
      mode: 'Area kantor',
      note: 'Foto area operasional',
      capturedAt: '07:49',
      location: 'Kantor Pusat',
    },
  },
];

export const initialRequests: RequestRecord[] = [
  {
    id: 'REQ-204',
    employeeId: 'PGW-004',
    employee: 'Rafi Maulana',
    type: 'Izin keluarga',
    date: '26 Mei 2026',
    reason: 'Keperluan keluarga mendadak',
    status: 'menunggu',
  },
  {
    id: 'REQ-197',
    employeeId: 'PGW-003',
    employee: 'Nadia Kartika',
    type: 'Koreksi jam pulang',
    date: '25 Mei 2026',
    reason: 'Lupa menekan tombol absen pulang',
    status: 'disetujui',
  },
  {
    id: 'REQ-190',
    employeeId: 'PGW-002',
    employee: 'Bima Pratama',
    type: 'Lembur operasional',
    date: '24 Mei 2026',
    reason: 'Penerimaan barang malam',
    status: 'disetujui',
  },
];

export const initialActivities: ActivityItem[] = [
  {
    id: 'ACT-001',
    title: 'Foto bukti tersimpan',
    description: 'Siti Aminah absen masuk dari Kantor Pusat',
    time: '07:52',
  },
  {
    id: 'ACT-002',
    title: 'Keterlambatan tercatat',
    description: 'Bima Pratama masuk melewati batas 08:15',
    time: '08:21',
  },
  {
    id: 'ACT-003',
    title: 'Pengajuan baru',
    description: 'Rafi Maulana mengajukan izin keluarga',
    time: '09:10',
  },
];

export const photoModes: PhotoMode[] = [
  'Lokasi kerja',
  'Area kantor',
  'Dokumen tugas',
];

export const scheduleItems = [
  {
    label: 'Jam masuk',
    value: '08:00',
  },
  {
    label: 'Batas telat',
    value: '08:15',
  },
  {
    label: 'Jam pulang',
    value: '16:30',
  },
];

export const quickActions = [
  {
    label: 'Absen',
    route: 'Absensi',
  },
  {
    label: 'Pengajuan',
    route: 'Pengajuan',
  },
  {
    label: 'Tim',
    route: 'Tim',
  },
  {
    label: 'Laporan',
    route: 'Laporan',
  },
];
