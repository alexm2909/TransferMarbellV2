interface TripReportData {
  id: string;
  bookingId: string;
  clientName: string;
  clientId: string;
  driverName: string;
  driverId: string;
  driverLicense: string;
  origin: string;
  destination: string;
  date: string;
  startTime: string;
  endTime: string;
  distance: number;
  duration: number;
  passengers: number;
  amount: number;
  vehicleType: string;
  vehiclePlate: string;
  status: "completed" | "cancelled";
  paymentMethod: string;
  paymentStatus: "paid" | "pending" | "refunded";
  completedAt: string;
}

interface ReportAttempt {
  tripId: string;
  attemptNumber: number;
  timestamp: string;
  status: "success" | "failed" | "pending";
  errorMessage?: string;
  reportId?: string;
  ministryResponse?: any;
}

interface MinistryApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

class AutomaticTripReportingService {
  private config: MinistryApiConfig;
  private reportQueue: TripReportData[] = [];
  private reportAttempts: Map<string, ReportAttempt[]> = new Map();
  private isProcessing = false;
  private retryTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.config = {
      baseUrl: process.env.MINISTRY_API_BASE_URL || "https://api.ministerio-turismo.es/v1",
      apiKey: process.env.MINISTRY_API_KEY || "demo-key",
      timeout: 30000, // 30 seconds
      retryAttempts: 3,
      retryDelay: 60000, // 1 minute
    };

    // Load pending reports from localStorage
    this.loadPendingReports();

    // Start automatic processing
    this.startAutomaticProcessing();
  }

  /**
   * Add a completed trip to the reporting queue
   */
  public async addTripForReporting(tripData: TripReportData): Promise<void> {
    console.log(`Adding trip ${tripData.bookingId} to reporting queue...`);
    
    // Add to queue
    this.reportQueue.push(tripData);
    
    // Save to localStorage for persistence
    this.savePendingReports();
    
    // Try to report immediately
    await this.processReportQueue();
  }

  /**
   * Process all trips in the reporting queue
   */
  private async processReportQueue(): Promise<void> {
    if (this.isProcessing || this.reportQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    console.log(`Processing ${this.reportQueue.length} trips in reporting queue...`);

    const processedTrips: string[] = [];

    for (const trip of this.reportQueue) {
      try {
        const success = await this.reportTripToMinistry(trip);
        if (success) {
          processedTrips.push(trip.id);
          console.log(`Successfully reported trip ${trip.bookingId} to Ministry`);
        }
      } catch (error) {
        console.error(`Failed to report trip ${trip.bookingId}:`, error);
        await this.handleReportFailure(trip, error as Error);
      }
    }

    // Remove successfully processed trips
    this.reportQueue = this.reportQueue.filter(trip => !processedTrips.includes(trip.id));
    this.savePendingReports();

    this.isProcessing = false;

    // Schedule retry for failed trips
    if (this.reportQueue.length > 0) {
      this.scheduleRetry();
    }
  }

  /**
   * Report a single trip to the Ministry API
   */
  private async reportTripToMinistry(trip: TripReportData): Promise<boolean> {
    const attemptNumber = this.getAttemptNumber(trip.id) + 1;
    
    console.log(`Attempting to report trip ${trip.bookingId} (attempt ${attemptNumber}/${this.config.retryAttempts})`);

    const reportData = this.formatTripForMinistry(trip);
    
    try {
      // Simulate API call with timeout
      const response = await this.makeMinistryApiCall(reportData);
      
      if (response.success) {
        this.recordAttempt(trip.id, {
          tripId: trip.id,
          attemptNumber,
          timestamp: new Date().toISOString(),
          status: "success",
          reportId: response.reportId,
          ministryResponse: response,
        });

        // Notify admin of successful report
        this.notifyAdminOfSuccess(trip, response.reportId);
        
        return true;
      } else {
        throw new Error(response.error || "Unknown API error");
      }
    } catch (error) {
      this.recordAttempt(trip.id, {
        tripId: trip.id,
        attemptNumber,
        timestamp: new Date().toISOString(),
        status: "failed",
        errorMessage: (error as Error).message,
      });

      if (attemptNumber >= this.config.retryAttempts) {
        // Max attempts reached, notify admin
        this.notifyAdminOfFailure(trip, error as Error);
        return false; // Remove from queue
      }
      
      throw error; // Will be retried
    }
  }

  /**
   * Format trip data for Ministry API
   */
  private formatTripForMinistry(trip: TripReportData): any {
    return {
      booking_reference: trip.bookingId,
      service_type: "private_transfer",
      client_details: {
        name: trip.clientName,
        id: trip.clientId,
      },
      driver_details: {
        name: trip.driverName,
        id: trip.driverId,
        license_number: trip.driverLicense,
      },
      trip_details: {
        origin: trip.origin,
        destination: trip.destination,
        date: trip.date,
        start_time: trip.startTime,
        end_time: trip.endTime,
        distance_km: trip.distance,
        duration_minutes: trip.duration,
        passenger_count: trip.passengers,
      },
      vehicle_details: {
        type: trip.vehicleType,
        plate: trip.vehiclePlate,
      },
      financial_details: {
        amount_euros: trip.amount,
        payment_method: trip.paymentMethod,
        payment_status: trip.paymentStatus,
      },
      service_status: trip.status,
      completed_at: trip.completedAt,
      reported_at: new Date().toISOString(),
      reporting_system: "transfermarbell-v1.0",
    };
  }

  /**
   * Make API call to Ministry with timeout and error handling
   */
  private async makeMinistryApiCall(reportData: any): Promise<any> {
    // Simulate API call - replace with actual Ministry API integration
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Ministry API timeout"));
      }, this.config.timeout);

      // Simulate API response
      setTimeout(() => {
        clearTimeout(timeout);
        
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve({
            success: true,
            reportId: `MIN${Date.now()}${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date().toISOString(),
            status: "accepted",
            message: "Trip report successfully submitted to Ministry of Tourism",
          });
        } else {
          // Simulate failure
          reject(new Error("Ministry API temporary unavailable"));
        }
      }, 2000 + Math.random() * 3000); // 2-5 second delay
    });
  }

  /**
   * Handle reporting failure
   */
  private async handleReportFailure(trip: TripReportData, error: Error): Promise<void> {
    const attempts = this.getAttemptNumber(trip.id);
    
    if (attempts >= this.config.retryAttempts) {
      console.error(`Trip ${trip.bookingId} failed to report after ${attempts} attempts:`, error.message);
      
      // Save to failed reports for manual retry
      this.saveFailedReport(trip, error);
      
      // Notify admin immediately for manual intervention
      this.notifyAdminOfCriticalFailure(trip, error);
    } else {
      console.warn(`Trip ${trip.bookingId} failed to report (attempt ${attempts}/${this.config.retryAttempts}):`, error.message);
    }
  }

  /**
   * Schedule retry for failed reports
   */
  private scheduleRetry(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }

    console.log(`Scheduling retry in ${this.config.retryDelay / 1000} seconds...`);
    
    this.retryTimer = setTimeout(() => {
      this.processReportQueue();
    }, this.config.retryDelay);
  }

  /**
   * Start automatic processing loop
   */
  private startAutomaticProcessing(): void {
    // Process queue every 5 minutes
    setInterval(() => {
      this.processReportQueue();
    }, 5 * 60 * 1000);

    // Initial processing
    setTimeout(() => {
      this.processReportQueue();
    }, 1000);
  }

  /**
   * Get attempt number for a trip
   */
  private getAttemptNumber(tripId: string): number {
    const attempts = this.reportAttempts.get(tripId) || [];
    return attempts.length;
  }

  /**
   * Record reporting attempt
   */
  private recordAttempt(tripId: string, attempt: ReportAttempt): void {
    const attempts = this.reportAttempts.get(tripId) || [];
    attempts.push(attempt);
    this.reportAttempts.set(tripId, attempts);
    
    // Save to localStorage
    localStorage.setItem(
      "transfermarbell_report_attempts",
      JSON.stringify(Array.from(this.reportAttempts.entries()))
    );
  }

  /**
   * Save pending reports to localStorage
   */
  private savePendingReports(): void {
    localStorage.setItem(
      "transfermarbell_pending_reports",
      JSON.stringify(this.reportQueue)
    );
  }

  /**
   * Load pending reports from localStorage
   */
  private loadPendingReports(): void {
    try {
      const saved = localStorage.getItem("transfermarbell_pending_reports");
      if (saved) {
        this.reportQueue = JSON.parse(saved);
      }

      const attempts = localStorage.getItem("transfermarbell_report_attempts");
      if (attempts) {
        this.reportAttempts = new Map(JSON.parse(attempts));
      }
    } catch (error) {
      console.error("Failed to load pending reports:", error);
    }
  }

  /**
   * Save failed report for manual retry
   */
  private saveFailedReport(trip: TripReportData, error: Error): void {
    const failedReports = JSON.parse(
      localStorage.getItem("transfermarbell_failed_reports") || "[]"
    );
    
    failedReports.push({
      trip,
      error: error.message,
      failedAt: new Date().toISOString(),
      attempts: this.getAttemptNumber(trip.id),
    });
    
    localStorage.setItem(
      "transfermarbell_failed_reports",
      JSON.stringify(failedReports)
    );
  }

  /**
   * Notify admin of successful report
   */
  private notifyAdminOfSuccess(trip: TripReportData, reportId: string): void {
    // In a real app, this would send notifications to admin dashboard
    console.log(`✅ Trip ${trip.bookingId} successfully reported to Ministry with ID: ${reportId}`);
    
    // Add to admin notifications
    const notifications = JSON.parse(
      localStorage.getItem("transfermarbell_admin_notifications") || "[]"
    );
    
    notifications.unshift({
      id: Date.now().toString(),
      type: "ministry_report_success",
      title: "Viaje Reportado al Ministerio",
      message: `El viaje ${trip.bookingId} ha sido reportado exitosamente con ID: ${reportId}`,
      timestamp: new Date().toISOString(),
      read: false,
      data: { tripId: trip.id, reportId },
    });
    
    localStorage.setItem(
      "transfermarbell_admin_notifications",
      JSON.stringify(notifications.slice(0, 100)) // Keep last 100 notifications
    );
  }

  /**
   * Notify admin of reporting failure
   */
  private notifyAdminOfFailure(trip: TripReportData, error: Error): void {
    console.error(`❌ Trip ${trip.bookingId} failed to report after ${this.config.retryAttempts} attempts:`, error.message);
    
    const notifications = JSON.parse(
      localStorage.getItem("transfermarbell_admin_notifications") || "[]"
    );
    
    notifications.unshift({
      id: Date.now().toString(),
      type: "ministry_report_failure",
      title: "Error al Reportar Viaje",
      message: `El viaje ${trip.bookingId} no pudo ser reportado al Ministerio después de ${this.config.retryAttempts} intentos: ${error.message}`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "high",
      data: { tripId: trip.id, error: error.message },
    });
    
    localStorage.setItem(
      "transfermarbell_admin_notifications",
      JSON.stringify(notifications.slice(0, 100))
    );
  }

  /**
   * Notify admin of critical failure requiring immediate attention
   */
  private notifyAdminOfCriticalFailure(trip: TripReportData, error: Error): void {
    console.error(`🚨 CRITICAL: Trip ${trip.bookingId} requires manual intervention:`, error.message);
    
    const notifications = JSON.parse(
      localStorage.getItem("transfermarbell_admin_notifications") || "[]"
    );
    
    notifications.unshift({
      id: Date.now().toString(),
      type: "ministry_report_critical",
      title: "🚨 ACCIÓN REQUERIDA: Error Crítico de Reporte",
      message: `El viaje ${trip.bookingId} requiere atención manual inmediata. Error: ${error.message}`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "critical",
      data: { tripId: trip.id, error: error.message },
    });
    
    localStorage.setItem(
      "transfermarbell_admin_notifications",
      JSON.stringify(notifications.slice(0, 100))
    );

    // Also trigger browser notification if permission is granted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Transfermarbell - Error Crítico", {
        body: `Viaje ${trip.bookingId} requiere atención manual`,
        icon: "/favicon.ico",
        tag: `trip-report-failure-${trip.id}`,
      });
    }
  }

  /**
   * Get reporting status for admin dashboard
   */
  public getReportingStatus(): {
    pendingReports: number;
    failedReports: number;
    lastProcessed: string | null;
    totalAttempts: number;
  } {
    const failedReports = JSON.parse(
      localStorage.getItem("transfermarbell_failed_reports") || "[]"
    );

    return {
      pendingReports: this.reportQueue.length,
      failedReports: failedReports.length,
      lastProcessed: this.reportQueue.length > 0 ? null : new Date().toISOString(),
      totalAttempts: Array.from(this.reportAttempts.values()).reduce(
        (total, attempts) => total + attempts.length,
        0
      ),
    };
  }

  /**
   * Manually retry failed reports (admin action)
   */
  public async retryFailedReports(): Promise<void> {
    const failedReports = JSON.parse(
      localStorage.getItem("transfermarbell_failed_reports") || "[]"
    );

    if (failedReports.length === 0) {
      console.log("No failed reports to retry");
      return;
    }

    console.log(`Retrying ${failedReports.length} failed reports...`);

    // Add failed reports back to queue
    for (const failedReport of failedReports) {
      this.reportQueue.push(failedReport.trip);
    }

    // Clear failed reports
    localStorage.setItem("transfermarbell_failed_reports", "[]");

    // Process the queue
    await this.processReportQueue();
  }

  /**
   * Get detailed reporting history for admin
   */
  public getReportingHistory(): {
    trip: TripReportData;
    attempts: ReportAttempt[];
  }[] {
    return Array.from(this.reportAttempts.entries()).map(([tripId, attempts]) => {
      const trip = this.reportQueue.find(t => t.id === tripId);
      return {
        trip: trip || ({} as TripReportData),
        attempts,
      };
    });
  }
}

// Create singleton instance
export const automaticTripReporting = new AutomaticTripReportingService();

// Export types for use in other components
export type { TripReportData, ReportAttempt, MinistryApiConfig };
