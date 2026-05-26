export type UserRole = 'pegawai' | 'admin' | 'atasan';

export type AttendanceStatus = 'hadir' | 'terlambat' | 'izin' | 'alpa';

export type AttendanceAction = 'masuk' | 'pulang';

export type RequestStatus = 'menunggu' | 'disetujui' | 'ditolak';

export type PhotoMode = 'Lokasi kerja' | 'Area kantor' | 'Dokumen tugas';

export type AppUser = {
  id: string;
  name: string;
  role: UserRole;
  employeeId: string;
  department: string;
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  location: string;
  shift: string;
};

export type PhotoProof = {
  id: string;
  mode: PhotoMode;
  note: string;
  capturedAt: string;
  location: string;
};

export type AttendanceRecord = Employee & {
  status: AttendanceStatus;
  checkIn: string;
  checkOut: string;
  proof?: PhotoProof;
};

export type RequestRecord = {
  id: string;
  employeeId: string;
  employee: string;
  type: string;
  date: string;
  reason: string;
  status: RequestStatus;
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
};
