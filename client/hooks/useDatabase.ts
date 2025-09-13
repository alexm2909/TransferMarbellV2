import { useState, useEffect, useCallback } from 'react';
import { database, type DatabaseUser, type Booking, type ChatMessage, type Notification, type DriverApplication, type SystemStats } from '@/services/database';

// ============================================================================
// USER HOOKS
// ============================================================================

export function useUsers() {
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshUsers = useCallback(() => {
    setUsers(database.getAllUsers());
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshUsers();
    const unsubscribe = database.subscribe('users', refreshUsers);
    return unsubscribe;
  }, [refreshUsers]);

  const createUser = useCallback((userData: Omit<DatabaseUser, 'id' | 'createdAt'>) => {
    return database.createUser(userData);
  }, []);

  const updateUser = useCallback((id: string, updates: Partial<DatabaseUser>) => {
    return database.updateUser(id, updates);
  }, []);

  return {
    users,
    loading,
    createUser,
    updateUser,
    refreshUsers
  };
}

export function useUser(userId?: string) {
  const [user, setUser] = useState<DatabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(() => {
    if (userId) {
      setUser(database.getUserById(userId));
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refreshUser();
    const unsubscribe = database.subscribe('users', refreshUser);
    return unsubscribe;
  }, [refreshUser]);

  return { user, loading, refreshUser };
}

export function useDrivers() {
  const [drivers, setDrivers] = useState<DatabaseUser[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshDrivers = useCallback(() => {
    setDrivers(database.getDrivers());
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshDrivers();
    const unsubscribe = database.subscribe('users', refreshDrivers);
    return unsubscribe;
  }, [refreshDrivers]);

  return { drivers, loading, refreshDrivers };
}

// ============================================================================
// BOOKING HOOKS
// ============================================================================

export function useBookings(userId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshBookings = useCallback(() => {
    if (userId) {
      setBookings(database.getBookingsByUserId(userId));
    } else {
      setBookings(database.getAllBookings());
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refreshBookings();
    const unsubscribe = database.subscribe('bookings', refreshBookings);
    return unsubscribe;
  }, [refreshBookings]);

  const createBooking = useCallback((bookingData: Omit<Booking, 'id' | 'timeline'>) => {
    return database.createBooking(bookingData);
  }, []);

  const updateBooking = useCallback((id: string, updates: Partial<Booking>) => {
    return database.updateBooking(id, updates);
  }, []);

  const assignToDriver = useCallback((bookingId: string, driverId: string) => {
    return database.assignBookingToDriver(bookingId, driverId);
  }, []);

  return {
    bookings,
    loading,
    createBooking,
    updateBooking,
    assignToDriver,
    refreshBookings
  };
}

export function useAvailableBookings() {
  const [availableBookings, setAvailableBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshAvailable = useCallback(() => {
    setAvailableBookings(database.getAvailableBookings());
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshAvailable();
    const unsubscribe = database.subscribe('bookings', refreshAvailable);
    return unsubscribe;
  }, [refreshAvailable]);

  return { availableBookings, loading, refreshAvailable };
}

export function useEmergencyBookings() {
  const [emergencyBookings, setEmergencyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshEmergency = useCallback(() => {
    setEmergencyBookings(database.getEmergencyBookings());
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshEmergency();
    const unsubscribe = database.subscribe('bookings', refreshEmergency);
    return unsubscribe;
  }, [refreshEmergency]);

  const createEmergencyBooking = useCallback((bookingId: string, reason: string, bonus: number, createdBy: string) => {
    return database.createEmergencyBooking(bookingId, reason, bonus, createdBy);
  }, []);

  return { 
    emergencyBookings, 
    loading, 
    createEmergencyBooking,
    refreshEmergency 
  };
}

// ============================================================================
// DRIVER APPLICATION HOOKS
// ============================================================================

export function useDriverApplications() {
  const [applications, setApplications] = useState<DriverApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshApplications = useCallback(() => {
    setApplications(database.getPendingDriverApplications());
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshApplications();
    const unsubscribe = database.subscribe('driver_applications', refreshApplications);
    return unsubscribe;
  }, [refreshApplications]);

  const createApplication = useCallback((applicationData: Omit<DriverApplication, 'id' | 'submittedAt' | 'status'>) => {
    return database.createDriverApplication(applicationData);
  }, []);

  const approveApplication = useCallback((applicationId: string, reviewedBy: string, notes?: string) => {
    return database.approveDriverApplication(applicationId, reviewedBy, notes);
  }, []);

  const rejectApplication = useCallback((applicationId: string, reviewedBy: string, notes: string) => {
    return database.rejectDriverApplication(applicationId, reviewedBy, notes);
  }, []);

  return {
    applications,
    loading,
    createApplication,
    approveApplication,
    rejectApplication,
    refreshApplications
  };
}

// ============================================================================
// CHAT HOOKS
// ============================================================================

export function useChat(tripId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshMessages = useCallback(() => {
    setMessages(database.getMessagesByTripId(tripId));
    setLoading(false);
  }, [tripId]);

  useEffect(() => {
    refreshMessages();
    const unsubscribe = database.subscribe('chat_messages', refreshMessages);
    return unsubscribe;
  }, [refreshMessages]);

  const sendMessage = useCallback((messageData: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>) => {
    return database.sendMessage(messageData);
  }, []);

  const markAsRead = useCallback((userId: string) => {
    database.markMessagesAsRead(tripId, userId);
  }, [tripId]);

  return {
    messages,
    loading,
    sendMessage,
    markAsRead,
    refreshMessages
  };
}

// ============================================================================
// NOTIFICATION HOOKS
// ============================================================================

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshNotifications = useCallback(() => {
    const userNotifications = database.getNotificationsByUserId(userId);
    setNotifications(userNotifications);
    setUnreadCount(database.getUnreadNotificationCount(userId));
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refreshNotifications();
    const unsubscribe = database.subscribe('notifications', refreshNotifications);
    return unsubscribe;
  }, [refreshNotifications]);

  const markAsRead = useCallback((notificationId: string) => {
    return database.markNotificationAsRead(notificationId);
  }, []);

  const createNotification = useCallback((notificationData: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    return database.createNotification(notificationData);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    createNotification,
    refreshNotifications
  };
}

// ============================================================================
// SYSTEM STATS HOOKS
// ============================================================================

export function useSystemStats() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshStats = useCallback(() => {
    setStats(database.getSystemStats());
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshStats();
    // Refresh stats when any relevant data changes
    const unsubscribers = [
      database.subscribe('users', refreshStats),
      database.subscribe('bookings', refreshStats),
      database.subscribe('driver_applications', refreshStats)
    ];

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [refreshStats]);

  return { stats, loading, refreshStats };
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

export function useDatabaseSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const sync = useCallback(() => {
    // In a real app, this would sync with a remote server
    setLastSync(new Date());
  }, []);

  return { isOnline, lastSync, sync };
}

export function useDatabaseExport() {
  const exportData = useCallback(() => {
    const data = database.exportDatabase();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transfermarbell_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const clearData = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
      database.clearDatabase();
      window.location.reload();
    }
  }, []);

  return { exportData, clearData };
}
