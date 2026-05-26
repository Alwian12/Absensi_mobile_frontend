import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  demoUsers,
  initialActivities,
  initialAttendanceRecords,
  initialRequests,
} from '../data/attendance';
import type {
  ActivityItem,
  AppUser,
  AttendanceAction,
  AttendanceRecord,
  PhotoMode,
  RequestRecord,
  RequestStatus,
  UserRole,
} from '../types/attendance';
import {createId, formatTime} from '../utils/date';

type AddRequestInput = {
  type: string;
  date: string;
  reason: string;
};

type AppStoreValue = {
  user: AppUser | null;
  attendanceRecords: AttendanceRecord[];
  requests: RequestRecord[];
  activities: ActivityItem[];
  activeEmployee: AttendanceRecord;
  signIn: (role: UserRole) => void;
  signOut: () => void;
  submitAttendance: (
    action: AttendanceAction,
    photoMode: PhotoMode,
    note: string,
  ) => string;
  addRequest: (input: AddRequestInput) => string;
  decideRequest: (id: string, status: RequestStatus) => void;
};

const AppStoreContext = createContext<AppStoreValue | undefined>(undefined);

const fallbackEmployee = initialAttendanceRecords[0];

const getDemoUser = (role: UserRole) =>
  demoUsers.find(item => item.role === role) ?? demoUsers[0];

const isLateTime = (time: string) => time > '08:15';

const addActivity = (
  current: ActivityItem[],
  title: string,
  description: string,
  time = formatTime(new Date()),
) => [
  {
    id: createId('ACT'),
    title,
    description,
    time,
  },
  ...current,
].slice(0, 8);

export const AppStoreProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState(
    initialAttendanceRecords,
  );
  const [requests, setRequests] = useState(initialRequests);
  const [activities, setActivities] = useState(initialActivities);

  const activeEmployee = useMemo(
    () =>
      attendanceRecords.find(record => record.id === user?.employeeId) ??
      fallbackEmployee,
    [attendanceRecords, user?.employeeId],
  );

  const signIn = useCallback((role: UserRole) => {
    setUser(getDemoUser(role));
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  const submitAttendance = useCallback(
    (action: AttendanceAction, photoMode: PhotoMode, note: string) => {
      const time = formatTime(new Date());
      const employeeId = user?.employeeId ?? fallbackEmployee.id;
      const employeeName = user?.name ?? fallbackEmployee.name;
      const cleanNote =
        note.trim() ||
        `Foto ${photoMode.toLowerCase()} sebagai bukti kehadiran`;

      setAttendanceRecords(current =>
        current.map(record => {
          if (record.id !== employeeId) {
            return record;
          }

          const nextStatus =
            action === 'masuk'
              ? isLateTime(time)
                ? 'terlambat'
                : 'hadir'
              : record.status === 'alpa'
                ? 'hadir'
                : record.status;

          return {
            ...record,
            status: nextStatus,
            checkIn: action === 'masuk' ? time : record.checkIn,
            checkOut: action === 'pulang' ? time : record.checkOut,
            proof: {
              id: createId('FTO'),
              mode: photoMode,
              note: cleanNote,
              capturedAt: time,
              location: record.location,
            },
          };
        }),
      );

      const title =
        action === 'masuk' ? 'Absen masuk tersimpan' : 'Absen pulang tersimpan';
      const message = `${employeeName} ${title.toLowerCase()} dengan bukti foto ${photoMode.toLowerCase()}`;

      setActivities(current => addActivity(current, title, message, time));

      return message;
    },
    [user?.employeeId, user?.name],
  );

  const addRequest = useCallback(
    (input: AddRequestInput) => {
      const employee = activeEmployee;
      const time = formatTime(new Date());
      const newRequest: RequestRecord = {
        id: createId('REQ'),
        employeeId: employee.id,
        employee: employee.name,
        type: input.type.trim() || 'Pengajuan absensi',
        date: input.date.trim() || 'Hari ini',
        reason: input.reason.trim() || 'Menunggu catatan pegawai',
        status: 'menunggu',
      };

      setRequests(current => [newRequest, ...current]);
      setActivities(current =>
        addActivity(
          current,
          'Pengajuan dikirim',
          `${employee.name} mengirim ${newRequest.type.toLowerCase()}`,
          time,
        ),
      );

      return `${newRequest.type} berhasil dikirim`;
    },
    [activeEmployee],
  );

  const decideRequest = useCallback((id: string, status: RequestStatus) => {
    let updatedRequest: RequestRecord | undefined;

    setRequests(current =>
      current.map(item => {
        if (item.id !== id) {
          return item;
        }

        updatedRequest = {
          ...item,
          status,
        };

        return updatedRequest;
      }),
    );

    if (updatedRequest) {
      setActivities(current =>
        addActivity(
          current,
          'Status pengajuan diperbarui',
          `${updatedRequest?.employee} ${status} untuk ${updatedRequest?.type}`,
        ),
      );
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      attendanceRecords,
      requests,
      activities,
      activeEmployee,
      signIn,
      signOut,
      submitAttendance,
      addRequest,
      decideRequest,
    }),
    [
      user,
      attendanceRecords,
      requests,
      activities,
      activeEmployee,
      signIn,
      signOut,
      submitAttendance,
      addRequest,
      decideRequest,
    ],
  );

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppStore = () => {
  const value = useContext(AppStoreContext);

  if (!value) {
    throw new Error('useAppStore must be used inside AppStoreProvider');
  }

  return value;
};
