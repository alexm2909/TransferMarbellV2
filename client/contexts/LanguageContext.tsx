import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  currency: string;
  darkMode: boolean;
  setLanguage: (lang: string) => void;
  setCurrency: (curr: string) => void;
  setDarkMode: (dark: boolean) => void;
  formatCurrency: (amount: number) => string;
  t: (key: string) => string;
}

// Comprehensive translations
const translations = {
  es: {
    // Navigation
    'dashboard': 'Dashboard',
    'bookings': 'Mis Reservas',
    'settings': 'Configuración',
    'loading': 'Cargando...',
    'save': 'Guardar',
    'cancel': 'Cancelar',
    'edit': 'Editar',
    'delete': 'Eliminar',
    'add': 'Añadir',
    'search': 'Buscar',
    'filter': 'Filtrar',
    'close': 'Cerrar',
    'back': 'Volver',
    
    // Booking related
    'book_transfer': 'Reservar Traslado',
    'view_bookings': 'Ver Reservas',
    'booking_details': 'Detalles de la Reserva',
    'origin': 'Origen',
    'destination': 'Destino',
    'date': 'Fecha',
    'time': 'Hora',
    'passengers': 'Pasajeros',
    'luggage': 'Equipaje',
    'driver': 'Conductor',
    'vehicle': 'Vehículo',
    'status': 'Estado',
    'price': 'Precio',
    
    // Status
    'upcoming': 'Próximo',
    'in_progress': 'En Curso',
    'completed': 'Completado',
    'cancelled': 'Cancelado',
    'paid': 'Pagado',
    'pending': 'Pendiente',
    
    // Settings
    'personal_info': 'Información Personal',
    'language_currency': 'Idioma y Moneda',
    'notifications': 'Notificaciones',
    'privacy': 'Privacidad',
    'payment_methods': 'Métodos de Pago',
    'appearance': 'Apariencia',
    'dark_mode': 'Modo Oscuro',
    'light_mode': 'Modo Claro',
    
    // Common actions
    'submit': 'Enviar',
    'continue': 'Continuar',
    'confirm': 'Confirmar',
    'view_details': 'Ver Detalles',
    'rate_service': 'Valorar Servicio',
    'chat': 'Chat',
    'repeat': 'Repetir',
    'download': 'Descargar',
    'book_now': 'Reservar Ahora',
    'logout': 'Cerrar Sesión',
    'profile': 'Perfil',

    // Dashboard & Bookings
    'welcome_back': 'Bienvenido de nuevo',
    'recent_bookings': 'Reservas Recientes',
    'next_trip': 'Próximo Viaje',
    'trip_history': 'Historial de Viajes',
    'quick_actions': 'Acciones Rápidas',
    'active_trips': 'Viajes Activos',
    'available_transfers': 'Traslados Disponibles',
    'total_available': 'Total Disponibles',
    'accept': 'Aceptar',
    'reject': 'Rechazar',
    'distance': 'Distancia',
    'duration': 'Duración',
    'estimated_cost': 'Coste Estimado',
    'route_details': 'Detalles de la Ruta',

    // Driver specific
    'driver_panel': 'Panel de Conductor',
    'earnings': 'Ganancias',
    'trips_completed': 'Viajes Completados',
    'rating': 'Valoración',
    'vehicle_status': 'Estado del Vehículo',
    'go_online': 'Conectarse',
    'go_offline': 'Desconectarse',
    'online': 'En Línea',
    'offline': 'Desconectado',
    
    // User roles
    'client': 'Cliente',
    'driver': 'Conductor',
    'fleet_manager': 'Jefe de Flota',
    'admin': 'Administrador',
    'business': 'Empresa',
    
    // Payment
    'add_payment_method': 'Añadir Método de Pago',
    'credit_card': 'Tarjeta de Crédito',
    'debit_card': 'Tarjeta de Débito',
    'paypal': 'PayPal',
    'bank_transfer': 'Transferencia Bancaria',
    'card_number': 'Número de Tarjeta',
    'expiry_date': 'Fecha de Vencimiento',
    'cvv': 'CVV',
    'cardholder_name': 'Nombre del Titular',
  },
  en: {
    // Navigation
    'dashboard': 'Dashboard',
    'bookings': 'My Bookings',
    'settings': 'Settings',
    'loading': 'Loading...',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'add': 'Add',
    'search': 'Search',
    'filter': 'Filter',
    'close': 'Close',
    'back': 'Back',
    
    // Booking related
    'book_transfer': 'Book Transfer',
    'view_bookings': 'View Bookings',
    'booking_details': 'Booking Details',
    'origin': 'Origin',
    'destination': 'Destination',
    'date': 'Date',
    'time': 'Time',
    'passengers': 'Passengers',
    'luggage': 'Luggage',
    'driver': 'Driver',
    'vehicle': 'Vehicle',
    'status': 'Status',
    'price': 'Price',
    
    // Status
    'upcoming': 'Upcoming',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'paid': 'Paid',
    'pending': 'Pending',
    
    // Settings
    'personal_info': 'Personal Information',
    'language_currency': 'Language & Currency',
    'notifications': 'Notifications',
    'privacy': 'Privacy',
    'payment_methods': 'Payment Methods',
    'appearance': 'Appearance',
    'dark_mode': 'Dark Mode',
    'light_mode': 'Light Mode',
    
    // Common actions
    'submit': 'Submit',
    'continue': 'Continue',
    'confirm': 'Confirm',
    'view_details': 'View Details',
    'rate_service': 'Rate Service',
    'chat': 'Chat',
    'repeat': 'Repeat',
    'download': 'Download',
    'book_now': 'Book Now',
    'logout': 'Sign Out',
    'profile': 'Profile',

    // Dashboard & Bookings
    'welcome_back': 'Welcome Back',
    'recent_bookings': 'Recent Bookings',
    'next_trip': 'Next Trip',
    'trip_history': 'Trip History',
    'quick_actions': 'Quick Actions',
    'active_trips': 'Active Trips',
    'available_transfers': 'Available Transfers',
    'total_available': 'Total Available',
    'accept': 'Accept',
    'reject': 'Reject',
    'distance': 'Distance',
    'duration': 'Duration',
    'estimated_cost': 'Estimated Cost',
    'route_details': 'Route Details',

    // Driver specific
    'driver_panel': 'Driver Panel',
    'earnings': 'Earnings',
    'trips_completed': 'Trips Completed',
    'rating': 'Rating',
    'vehicle_status': 'Vehicle Status',
    'go_online': 'Go Online',
    'go_offline': 'Go Offline',
    'online': 'Online',
    'offline': 'Offline',
    
    // User roles
    'client': 'Client',
    'driver': 'Driver',
    'fleet_manager': 'Fleet Manager',
    'admin': 'Administrator',
    'business': 'Business',
    
    // Payment
    'add_payment_method': 'Add Payment Method',
    'credit_card': 'Credit Card',
    'debit_card': 'Debit Card',
    'paypal': 'PayPal',
    'bank_transfer': 'Bank Transfer',
    'card_number': 'Card Number',
    'expiry_date': 'Expiry Date',
    'cvv': 'CVV',
    'cardholder_name': 'Cardholder Name',
  },
  fr: {
    // Navigation
    'dashboard': 'Tableau de bord',
    'bookings': 'Mes Réservations',
    'settings': 'Paramètres',
    'loading': 'Chargement...',
    'save': 'Enregistrer',
    'cancel': 'Annuler',
    'edit': 'Modifier',
    'delete': 'Supprimer',
    'add': 'Ajouter',
    'search': 'Rechercher',
    'filter': 'Filtrer',
    'close': 'Fermer',
    'back': 'Retour',
    
    // Booking related
    'book_transfer': 'Réserver un Transfert',
    'view_bookings': 'Voir les Réservations',
    'booking_details': 'Détails de la Réservation',
    'origin': 'Origine',
    'destination': 'Destination',
    'date': 'Date',
    'time': 'Heure',
    'passengers': 'Passagers',
    'luggage': 'Bagages',
    'driver': 'Chauffeur',
    'vehicle': 'Véhicule',
    'status': 'Statut',
    'price': 'Prix',
    
    // Status
    'upcoming': 'À venir',
    'in_progress': 'En cours',
    'completed': 'Terminé',
    'cancelled': 'Annulé',
    'paid': 'Payé',
    'pending': 'En attente',
    
    // Settings
    'personal_info': 'Informations Personnelles',
    'language_currency': 'Langue et Devise',
    'notifications': 'Notifications',
    'privacy': 'Confidentialité',
    'payment_methods': 'Méthodes de Paiement',
    'appearance': 'Apparence',
    'dark_mode': 'Mode Sombre',
    'light_mode': 'Mode Clair',
    
    // Common actions
    'submit': 'Soumettre',
    'continue': 'Continuer',
    'confirm': 'Confirmer',
    'view_details': 'Voir les Détails',
    'rate_service': 'Évaluer le Service',
    'chat': 'Chat',
    'repeat': 'Répéter',
    'download': 'Télécharger',
    
    // User roles
    'client': 'Client',
    'driver': 'Chauffeur',
    'fleet_manager': 'Gestionnaire de Flotte',
    'admin': 'Administrateur',
    'business': 'Entreprise',
    
    // Payment
    'add_payment_method': 'Ajouter une Méthode de Paiement',
    'credit_card': 'Carte de Crédit',
    'debit_card': 'Carte de Débit',
    'paypal': 'PayPal',
    'bank_transfer': 'Virement Bancaire',
    'card_number': 'Numéro de Carte',
    'expiry_date': 'Date d\'Expiration',
    'cvv': 'CVV',
    'cardholder_name': 'Nom du Titulaire',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('transfermarbell-language');
    return saved || 'es';
  });

  const [currency, setCurrencyState] = useState(() => {
    const saved = localStorage.getItem('transfermarbell-currency');
    return saved || 'EUR';
  });

  const [darkMode, setDarkModeState] = useState(() => {
    const saved = localStorage.getItem('transfermarbell-dark-mode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('transfermarbell-language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('transfermarbell-currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('transfermarbell-dark-mode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
  };

  const setCurrency = (curr: string) => {
    setCurrencyState(curr);
  };

  const setDarkMode = (dark: boolean) => {
    setDarkModeState(dark);
  };

  const formatCurrency = (amount: number): string => {
    const currencyConfig = {
      EUR: { symbol: '€', position: 'after', locale: 'es-ES' },
      USD: { symbol: '$', position: 'before', locale: 'en-US' },
      GBP: { symbol: '£', position: 'before', locale: 'en-GB' },
    };

    const config = currencyConfig[currency as keyof typeof currencyConfig] || currencyConfig.EUR;
    
    try {
      const formatted = new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      
      return formatted;
    } catch (error) {
      // Fallback formatting
      const symbol = config.symbol;
      const formatted = amount.toFixed(2);
      return config.position === 'before' ? `${symbol}${formatted}` : `${formatted}${symbol}`;
    }
  };

  const t = (key: string): string => {
    const langTranslations = translations[language as keyof typeof translations] || translations.es;
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        currency,
        darkMode,
        setLanguage,
        setCurrency,
        setDarkMode,
        formatCurrency,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
