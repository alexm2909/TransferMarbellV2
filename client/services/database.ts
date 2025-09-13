// Comprehensive database service for TransferMarbell
import { User } from "@/hooks/useAuth";
import { VehicleData } from "@/components/VehicleSelector";

// ============================================================================
// DATA MODELS
// ============================================================================

export interface DatabaseUser extends User {
  id: string;
  createdAt: string;
  lastLogin?: string;
  profile?: {
    profileImage?: string;
    dateOfBirth?: string;
    address?: string;
    emergencyContact?: {
      name: string;
      phone: string;
    };
  };
  // Driver specific fields
  driverStatus?: "pending" | "approved" | "rejected";
  driverApplication?: DriverApplication;
  driverProfile?: DriverProfile;
  // Statistics
  stats?: {
    totalTrips: number;
    totalEarnings: number;
    rating: number;
    ratingCount: number;
  };
}

export interface DriverApplication {
  id: string;
  userId: string;
  vehicle: VehicleData;
  financial: {
    bankAccount: string;
    taxId: string;
  };
  documents: DocumentUpload[];
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  status: "pending" | "approved" | "rejected";
}

export interface DocumentUpload {
  id: string;
  name: string;
  description: string;
  required: boolean;
  file: File | null;
  uploaded: boolean;
  fileName?: string;
  uploadDate?: string;
}

export interface DriverProfile {
  licenseNumber: string;
  vehicleRegistration: string;
  insuranceExpiry: string;
  availability: {
    isActive: boolean;
    workingHours: {
      start: string;
      end: string;
    };
    workingDays: number[]; // 0-6, Sunday to Saturday
  };
  location?: {
    lat: number;
    lng: number;
    lastUpdated: string;
  };
}

export interface Booking {
  id: string;
  clientId: string;
  driverId?: string;
  status: "pending" | "assigned" | "confirmed" | "in_progress" | "completed" | "cancelled";
  tripDetails: {
    origin: {
      address: string;
      coordinates?: { lat: number; lng: number; };
    };
    destination: {
      address: string;
      coordinates?: { lat: number; lng: number; };
    };
    date: string;
    time: string;
    passengers: number;
    luggage: {
      small: number;
      medium: number;
      large: number;
    };
    children?: {
      count: number;
      ages: number[];
    };
    specialRequests?: string;
  };
  vehicleType: string;
  pricing: {
    basePrice: number;
    extras: { name: string; price: number; }[];
    totalPrice: number;
    currency: "EUR";
  };
  payment: {
    method?: string;
    status: "pending" | "completed" | "failed" | "refunded";
    transactionId?: string;
    paidAt?: string;
  };
  timeline: {
    createdAt: string;
    assignedAt?: string;
    confirmedAt?: string;
    startedAt?: string;
    completedAt?: string;
    cancelledAt?: string;
  };
  isEmergency?: boolean;
  emergencyDetails?: {
    originalPrice: number;
    emergencyBonus: number;
    reason: string;
    createdBy: string;
    urgencyLevel: "medium" | "high" | "critical";
  };
  clientData?: {
    name: string;
    email: string;
    phone: string;
  };
  rating?: {
    clientRating?: number;
    driverRating?: number;
    clientComment?: string;
    driverComment?: string;
  };
}

export interface ChatMessage {
  id: string;
  tripId: string;
  senderId: string;
  senderRole: "client" | "driver" | "admin";
  content: string;
  type: "text" | "location" | "system";
  timestamp: Date;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: "booking" | "driver_application" | "emergency" | "payment" | "system";
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

export interface SystemStats {
  totalUsers: number;
  totalDrivers: number;
  pendingApplications: number;
  totalBookings: number;
  totalRevenue: number;
  activeTrips: number;
  emergencyTrips: number;
  lastUpdated: string;
}

// ============================================================================
// DATABASE SERVICE
// ============================================================================

class DatabaseService {
  private storagePrefix = 'transfermarbell_';
  private eventListeners: Map<string, Set<Function>> = new Map();

  // ========================================================================
  // STORAGE HELPERS
  // ========================================================================

  private getStorageKey(table: string): string {
    return `${this.storagePrefix}${table}`;
  }

  private getData<T>(table: string): T[] {
    try {
      const data = localStorage.getItem(this.getStorageKey(table));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading ${table}:`, error);
      return [];
    }
  }

  private setData<T>(table: string, data: T[]): void {
    try {
      localStorage.setItem(this.getStorageKey(table), JSON.stringify(data));
      this.notifyListeners(table);
    } catch (error) {
      console.error(`Error writing ${table}:`, error);
    }
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ========================================================================
  // EVENT SYSTEM
  // ========================================================================

  public subscribe(table: string, callback: Function): () => void {
    if (!this.eventListeners.has(table)) {
      this.eventListeners.set(table, new Set());
    }
    this.eventListeners.get(table)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(table);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  private notifyListeners(table: string): void {
    const listeners = this.eventListeners.get(table);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Error in database listener:', error);
        }
      });
    }
  }

  // ========================================================================
  // USER MANAGEMENT
  // ========================================================================

  public createUser(userData: Omit<DatabaseUser, 'id' | 'createdAt'>): DatabaseUser {
    const users = this.getData<DatabaseUser>('users');
    const newUser: DatabaseUser = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      stats: {
        totalTrips: 0,
        totalEarnings: 0,
        rating: 0,
        ratingCount: 0
      }
    };

    users.push(newUser);
    this.setData('users', users);
    return newUser;
  }

  public getUserById(id: string): DatabaseUser | null {
    const users = this.getData<DatabaseUser>('users');
    return users.find(user => user.id === id) || null;
  }

  public getUserByEmail(email: string): DatabaseUser | null {
    const users = this.getData<DatabaseUser>('users');
    return users.find(user => user.email === email) || null;
  }

  public updateUser(id: string, updates: Partial<DatabaseUser>): boolean {
    const users = this.getData<DatabaseUser>('users');
    const index = users.findIndex(user => user.id === id);
    
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.setData('users', users);
      return true;
    }
    return false;
  }

  public getAllUsers(): DatabaseUser[] {
    return this.getData<DatabaseUser>('users');
  }

  public getDrivers(): DatabaseUser[] {
    return this.getData<DatabaseUser>('users').filter(user => 
      user.role === 'driver' || user.driverStatus === 'approved'
    );
  }

  public getPendingDriverApplications(): DriverApplication[] {
    return this.getData<DriverApplication>('driver_applications')
      .filter(app => app.status === 'pending');
  }

  // ========================================================================
  // BOOKING MANAGEMENT
  // ========================================================================

  public createBooking(bookingData: Omit<Booking, 'id' | 'timeline'>): Booking {
    const bookings = this.getData<Booking>('bookings');
    const newBooking: Booking = {
      ...bookingData,
      id: this.generateId(),
      timeline: {
        createdAt: new Date().toISOString()
      }
    };

    bookings.push(newBooking);
    this.setData('bookings', bookings);

    // Create notification for admins about new booking
    this.createNotification({
      userId: 'admin',
      type: 'booking',
      title: 'Nueva Reserva',
      message: `Nueva reserva creada: ${newBooking.tripDetails.origin.address} → ${newBooking.tripDetails.destination.address}`,
      data: { bookingId: newBooking.id }
    });

    return newBooking;
  }

  public getBookingById(id: string): Booking | null {
    const bookings = this.getData<Booking>('bookings');
    return bookings.find(booking => booking.id === id) || null;
  }

  public updateBooking(id: string, updates: Partial<Booking>): boolean {
    const bookings = this.getData<Booking>('bookings');
    const index = bookings.findIndex(booking => booking.id === id);
    
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updates };
      this.setData('bookings', bookings);
      return true;
    }
    return false;
  }

  public getBookingsByUserId(userId: string): Booking[] {
    return this.getData<Booking>('bookings').filter(booking => 
      booking.clientId === userId || booking.driverId === userId
    );
  }

  public getAvailableBookings(): Booking[] {
    return this.getData<Booking>('bookings').filter(booking => 
      booking.status === 'pending' && !booking.driverId
    );
  }

  public getEmergencyBookings(): Booking[] {
    return this.getData<Booking>('bookings').filter(booking => 
      booking.isEmergency && booking.status === 'pending'
    );
  }

  public assignBookingToDriver(bookingId: string, driverId: string): boolean {
    const booking = this.getBookingById(bookingId);
    if (!booking || booking.driverId) return false;

    const success = this.updateBooking(bookingId, {
      driverId,
      status: 'assigned',
      timeline: {
        ...booking.timeline,
        assignedAt: new Date().toISOString()
      }
    });

    if (success) {
      // Notify client
      this.createNotification({
        userId: booking.clientId,
        type: 'booking',
        title: 'Conductor Asignado',
        message: 'Un conductor ha sido asignado a tu reserva',
        data: { bookingId }
      });

      // Notify driver
      this.createNotification({
        userId: driverId,
        type: 'booking',
        title: 'Nueva Asignación',
        message: 'Se te ha asignado una nueva reserva',
        data: { bookingId }
      });
    }

    return success;
  }

  public createEmergencyBooking(originalBookingId: string, reason: string, bonus: number, createdBy: string): boolean {
    const originalBooking = this.getBookingById(originalBookingId);
    if (!originalBooking) return false;

    const success = this.updateBooking(originalBookingId, {
      isEmergency: true,
      emergencyDetails: {
        originalPrice: originalBooking.pricing.totalPrice,
        emergencyBonus: bonus,
        reason,
        createdBy,
        urgencyLevel: 'high'
      },
      pricing: {
        ...originalBooking.pricing,
        totalPrice: originalBooking.pricing.totalPrice + bonus
      }
    });

    if (success) {
      // Notify all drivers about emergency booking
      const drivers = this.getDrivers();
      drivers.forEach(driver => {
        this.createNotification({
          userId: driver.id,
          type: 'emergency',
          title: '🚨 Reserva de Emergencia',
          message: `Nueva reserva urgente con bonus de €${bonus}`,
          data: { bookingId: originalBookingId }
        });
      });
    }

    return success;
  }

  // ========================================================================
  // DRIVER APPLICATION MANAGEMENT
  // ========================================================================

  public createDriverApplication(applicationData: Omit<DriverApplication, 'id' | 'submittedAt' | 'status'>): DriverApplication {
    const applications = this.getData<DriverApplication>('driver_applications');
    const newApplication: DriverApplication = {
      ...applicationData,
      id: this.generateId(),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    applications.push(newApplication);
    this.setData('driver_applications', applications);

    // Update user status
    this.updateUser(applicationData.userId, {
      driverStatus: 'pending',
      driverApplication: newApplication
    });

    // Notify admins
    this.createNotification({
      userId: 'admin',
      type: 'driver_application',
      title: 'Nueva Solicitud de Conductor',
      message: 'Nueva solicitud de conductor pendiente de revisión',
      data: { applicationId: newApplication.id }
    });

    return newApplication;
  }

  public approveDriverApplication(applicationId: string, reviewedBy: string, notes?: string): boolean {
    const applications = this.getData<DriverApplication>('driver_applications');
    const index = applications.findIndex(app => app.id === applicationId);
    
    if (index === -1) return false;

    const application = applications[index];
    applications[index] = {
      ...application,
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy,
      reviewNotes: notes
    };

    this.setData('driver_applications', applications);

    // Update user to driver role
    this.updateUser(application.userId, {
      role: 'driver',
      driverStatus: 'approved'
    });

    // Notify user
    this.createNotification({
      userId: application.userId,
      type: 'driver_application',
      title: '¡Solicitud Aprobada!',
      message: 'Tu solicitud para ser conductor ha sido aprobada. Ya puedes comenzar a recibir reservas.',
      data: { applicationId }
    });

    return true;
  }

  public rejectDriverApplication(applicationId: string, reviewedBy: string, notes: string): boolean {
    const applications = this.getData<DriverApplication>('driver_applications');
    const index = applications.findIndex(app => app.id === applicationId);
    
    if (index === -1) return false;

    const application = applications[index];
    applications[index] = {
      ...application,
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy,
      reviewNotes: notes
    };

    this.setData('driver_applications', applications);

    // Update user status
    this.updateUser(application.userId, {
      driverStatus: 'rejected'
    });

    // Notify user
    this.createNotification({
      userId: application.userId,
      type: 'driver_application',
      title: 'Solicitud Rechazada',
      message: `Tu solicitud ha sido rechazada. Motivo: ${notes}`,
      data: { applicationId }
    });

    return true;
  }

  // ========================================================================
  // CHAT MANAGEMENT
  // ========================================================================

  public sendMessage(messageData: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>): ChatMessage {
    const messages = this.getData<ChatMessage>('chat_messages');
    const newMessage: ChatMessage = {
      ...messageData,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    messages.push(newMessage);
    this.setData('chat_messages', messages);
    return newMessage;
  }

  public getMessagesByTripId(tripId: string): ChatMessage[] {
    return this.getData<ChatMessage>('chat_messages')
      .filter(message => message.tripId === tripId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  public markMessagesAsRead(tripId: string, userId: string): void {
    const messages = this.getData<ChatMessage>('chat_messages');
    let updated = false;

    const updatedMessages = messages.map(message => {
      if (message.tripId === tripId && message.senderId !== userId && !message.read) {
        updated = true;
        return { ...message, read: true };
      }
      return message;
    });

    if (updated) {
      this.setData('chat_messages', updatedMessages);
    }
  }

  // ========================================================================
  // NOTIFICATION MANAGEMENT
  // ========================================================================

  public createNotification(notificationData: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
    const notifications = this.getData<Notification>('notifications');
    const newNotification: Notification = {
      ...notificationData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      read: false
    };

    notifications.push(newNotification);
    this.setData('notifications', notifications);
    return newNotification;
  }

  public getNotificationsByUserId(userId: string): Notification[] {
    return this.getData<Notification>('notifications')
      .filter(notification => notification.userId === userId || notification.userId === 'admin')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public markNotificationAsRead(notificationId: string): boolean {
    const notifications = this.getData<Notification>('notifications');
    const index = notifications.findIndex(n => n.id === notificationId);
    
    if (index !== -1) {
      notifications[index].read = true;
      this.setData('notifications', notifications);
      return true;
    }
    return false;
  }

  public getUnreadNotificationCount(userId: string): number {
    return this.getData<Notification>('notifications')
      .filter(notification => 
        (notification.userId === userId || notification.userId === 'admin') && 
        !notification.read
      ).length;
  }

  // ========================================================================
  // STATISTICS
  // ========================================================================

  public getAllBookings(): Booking[] {
    return this.getData<Booking>('bookings');
  }

  public getSystemStats(): SystemStats {
    const users = this.getData<DatabaseUser>('users');
    const bookings = this.getData<Booking>('bookings');
    
    const totalRevenue = bookings
      .filter(b => b.payment.status === 'completed')
      .reduce((sum, b) => sum + b.pricing.totalPrice, 0);

    return {
      totalUsers: users.length,
      totalDrivers: users.filter(u => u.role === 'driver').length,
      pendingApplications: this.getPendingDriverApplications().length,
      totalBookings: bookings.length,
      totalRevenue,
      activeTrips: bookings.filter(b => b.status === 'in_progress').length,
      emergencyTrips: bookings.filter(b => b.isEmergency && b.status === 'pending').length,
      lastUpdated: new Date().toISOString()
    };
  }

  // ========================================================================
  // INITIALIZATION & SEEDING
  // ========================================================================

  public initializeDatabase(): void {
    // Check if database is already initialized
    const initialized = localStorage.getItem(`${this.storagePrefix}initialized`);
    if (initialized) return;

    // Create default admin user
    this.createUser({
      email: 'admin@transfermarbell.com',
      name: 'Administrador Sistema',
      role: 'admin',
      phone: '+34 952 123 456'
    });

    // Create some sample users
    this.createUser({
      email: 'cliente@test.com',
      name: 'Ana García',
      role: 'client',
      phone: '+34 600 123 456'
    });

    this.createUser({
      email: 'conductor@test.com',
      name: 'Carlos Rodríguez',
      role: 'driver',
      phone: '+34 600 654 321',
      driverStatus: 'approved'
    });

    // Mark as initialized
    localStorage.setItem(`${this.storagePrefix}initialized`, 'true');
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  public clearDatabase(): void {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.storagePrefix)
    );
    keys.forEach(key => localStorage.removeItem(key));
  }

  public exportDatabase(): string {
    const data: any = {};
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.storagePrefix)
    );
    
    keys.forEach(key => {
      try {
        data[key] = JSON.parse(localStorage.getItem(key) || '[]');
      } catch {
        data[key] = localStorage.getItem(key);
      }
    });

    return JSON.stringify(data, null, 2);
  }
}

// Export singleton instance
export const database = new DatabaseService();

// Initialize on module load
database.initializeDatabase();
