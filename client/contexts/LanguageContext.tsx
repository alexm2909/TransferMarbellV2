import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Language interface
export interface Language {
  code: string;
  name: string;
  flag: string;
}

// Available languages
export const LANGUAGES: Language[] = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

// Translation keys and their values for each language
export type Translations = Record<string, string>;

// Cleaned translations (removed auth/dashboard/admin/driver-related keys)
export const translations: Record<string, any> = {
  es: {
    // Navigation
    "nav.services": "Servicios",
    "nav.fleet": "Flota",
    "nav.business": "Empresas",
    "nav.support": "Soporte",

    // Homepage
    "home.title": "Traslados Privados Premium",
    "home.subtitle": "Hechos Simples",
    "home.description":
      "Reserva traslados profesionales al aeropuerto, viajes urbanos y transporte privado por la Costa del Sol. Confiable, cómodo y siempre puntual.",
    "home.bookingTitle": "Reserva tu Traslado",
    "home.bookingDescription": "Introduce los detalles de tu viaje para comenzar",
    "home.from": "Desde",
    "home.to": "Hasta",
    "home.date": "Fecha",
    "home.time": "Hora",
    "home.continue": "Continuar Reserva",
    "home.nextStep":
      "Siguiente: Selecciona tipo de vehículo, pasajeros y completa tu reserva",
    "home.whyChoose": "¿Por qué elegir Transfermarbell?",
    "home.whyChooseDesc":
      "Experimenta la diferencia con nuestro servicio premium de traslados privados",
    "home.readyToBook": "¿Listo para Reservar tu Traslado?",
    "home.readyToBookDesc":
      "Únete a miles de clientes satisfechos que confían en Transfermarbell para sus necesidades de transporte privado por la Costa del Sol.",
    "home.bookNow": "Reservar Ahora",
    "home.viewFleet": "Ver Nuestra Flota",

    // Features
    "features.professionalDrivers": "Conductores Profesionales",
    "features.professionalDriversDesc": "Conductores licenciados y verificados",
    "features.topRated": "Servicio Mejor Valorado",
    "features.topRatedDesc": "Calificación promedio de 4.9/5",
    "features.realTimeChat": "Chat en Tiempo Real",
    "features.realTimeChatDesc": "Chatea con tu conductor",

    // Footer
    "footer.services": "Servicios",
    "footer.airportTransfers": "Traslados al Aeropuerto",
    "footer.cityTransfers": "Traslados Urbanos",
    "footer.businessTransport": "Transporte Empresarial",
    "footer.groupBookings": "Reservas Grupales",
    "footer.support": "Soporte",
    "footer.helpCenter": "Centro de Ayuda",
    "footer.contactUs": "Contáctanos",
    "footer.company": "Empresa",
    "footer.aboutUs": "Acerca de Nosotros",
    "footer.careers": "Carreras",
    "footer.privacyPolicy": "Política de Privacidad",
    "footer.termsOfService": "Términos de Servicio",
    "footer.copyright": "© 2024 Transfermarbell. Todos los derechos reservados.",

    // Booking
    "booking.title": "Reservar Traslado",
    "booking.backToHome": "Volver al Inicio",
    "booking.completeBooking": "Completa tu Reserva",
    "booking.fillDetails": "Rellena los detalles a continuación para reservar tu traslado privado",
    "booking.selectVehicle": "Seleccionar Vehículo",
    "booking.passengers": "Pasajeros",
    "booking.luggage": "Equipaje",
    "booking.price": "Precio",
    "booking.confirm": "Confirmar",
    "booking.payment": "Pago",
    "booking.summary": "Resumen",
    "booking.routeDetails": "Detalles de la Ruta",
    "booking.journeyDetails": "Detalles del Viaje",
    "booking.vehicleSelection": "Selección de Vehículo",
    "booking.additionalDetails": "Detalles Adicionales",
    "booking.flightNumber": "Número de Vuelo",
    "booking.specialRequests": "Solicitudes Especiales",

    // Common
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.cancel": "Cancelar",
    "common.save": "Guardar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.view": "Ver",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.yes": "Sí",
    "common.no": "No",
    "common.email": "Email",
    "common.password": "Contraseña",
    "common.name": "Nombre",
    "common.phone": "Teléfono",
    "common.address": "Dirección",
    "common.city": "Ciudad",
    "common.date": "Fecha",
    "common.time": "Hora",
    "common.status": "Estado",
    "common.actions": "Acciones",

    // Helpers
    book_transfer: "Reservar Traslado",
    view_bookings: "Ver Reservas",
    settings: "Configuración",
    logout: "Cerrar Sesión",
    available_transfers: "Traslados Disponibles",
    total_available: "Total Disponibles",
    accept: "Aceptar",
    reject: "Rechazar",
    credit_card: "Tarjeta de Crédito",
    debit_card: "Tarjeta de Débito",
    paypal: "PayPal",
    bank_transfer: "Transferencia Bancaria",
    payment_methods: "Métodos de Pago",
    add_payment_method: "Agregar Método de Pago",
    card_number: "Número de Tarjeta",
    expiry_date: "Fecha de Vencimiento",
    cvv: "CVV",
    cardholder_name: "Nombre del Titular",
    add: "Agregar",
  },

  en: {
    // Navigation
    "nav.services": "Services",
    "nav.fleet": "Fleet",
    "nav.business": "Business",
    "nav.support": "Support",

    // Homepage
    "home.title": "Premium Private Transfers",
    "home.subtitle": "Made Simple",
    "home.description": "Book professional airport transfers, city rides, and private transportation across Costa del Sol. Reliable, comfortable, and always on time.",
    "home.bookingTitle": "Book Your Transfer",
    "home.bookingDescription": "Enter your journey details to get started",
    "home.from": "From",
    "home.to": "To",
    "home.date": "Date",
    "home.time": "Time",
    "home.continue": "Continue Booking",
    "home.nextStep": "Next: Select vehicle type, passengers, and complete your booking",
    "home.whyChoose": "Why Choose Transfermarbell?",
    "home.whyChooseDesc": "Experience the difference with our premium private transfer service",
    "home.readyToBook": "Ready to Book Your Transfer?",
    "home.readyToBookDesc": "Join thousands of satisfied customers who trust Transfermarbell for their private transportation needs across Costa del Sol.",
    "home.bookNow": "Book Now",
    "home.viewFleet": "View Our Fleet",

    // Features
    "features.professionalDrivers": "Professional Drivers",
    "features.professionalDriversDesc": "Licensed and verified drivers",
    "features.topRated": "Top Rated Service",
    "features.topRatedDesc": "4.9/5 average rating",
    "features.realTimeChat": "Real-time Chat",
    "features.realTimeChatDesc": "Chat with your driver",

    // Footer
    "footer.services": "Services",
    "footer.airportTransfers": "Airport Transfers",
    "footer.cityTransfers": "City Transfers",
    "footer.businessTransport": "Business Transport",
    "footer.groupBookings": "Group Bookings",
    "footer.support": "Support",
    "footer.helpCenter": "Help Center",
    "footer.contactUs": "Contact Us",
    "footer.company": "Company",
    "footer.aboutUs": "About Us",
    "footer.careers": "Careers",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.termsOfService": "Terms of Service",
    "footer.copyright": "© 2024 Transfermarbell. All rights reserved.",

    // Booking
    "booking.title": "Book Transfer",
    "booking.selectVehicle": "Select Vehicle",
    "booking.passengers": "Passengers",
    "booking.luggage": "Luggage",
    "booking.price": "Price",
    "booking.confirm": "Confirm",
    "booking.payment": "Payment",
    "booking.summary": "Summary",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.yes": "Yes",
    "common.no": "No",
    "common.email": "Email",
    "common.password": "Password",
    "common.name": "Name",
    "common.phone": "Phone",
    "common.address": "Address",
    "common.city": "City",
    "common.date": "Date",
    "common.time": "Time",
    "common.status": "Status",
    "common.actions": "Actions",

    // Helpers
    book_transfer: "Book Transfer",
    view_bookings: "View Bookings",
    settings: "Settings",
    logout: "Logout",
    available_transfers: "Available Transfers",
    total_available: "Total Available",
    accept: "Accept",
    reject: "Reject",
    credit_card: "Credit Card",
    debit_card: "Debit Card",
    paypal: "PayPal",
    bank_transfer: "Bank Transfer",
    payment_methods: "Payment Methods",
    add_payment_method: "Add Payment Method",
    card_number: "Card Number",
    expiry_date: "Expiry Date",
    cvv: "CVV",
    cardholder_name: "Cardholder Name",
    add: "Add",
  },

  fr: {
    // Navigation
    "nav.services": "Services",
    "nav.fleet": "Flotte",
    "nav.business": "Entreprises",
    "nav.support": "Support",

    // Homepage
    "home.title": "Transferts Privés Premium",
    "home.subtitle": "Rendus Simples",
    "home.description": "Réservez des transferts professionnels d'aéroport, des trajets urbains et du transport privé sur la Costa del Sol. Fiable, confortable et toujours à l'heure.",
    "home.bookingTitle": "Réservez Votre Transfert",
    "home.bookingDescription": "Entrez les détails de votre voyage pour commencer",
    "home.from": "De",
    "home.to": "À",
    "home.date": "Date",
    "home.time": "Heure",
    "home.continue": "Continuer la Réservation",
    "home.nextStep": "Suivant: Sélectionnez le type de véhicule, les passagers et complétez votre réservation",
    "home.whyChoose": "Pourquoi Choisir Transfermarbell?",
    "home.whyChooseDesc": "Découvrez la différence avec notre service premium de transferts privés",
    "home.readyToBook": "Prêt à Réserver Votre Transfert?",
    "home.readyToBookDesc": "Rejoignez des milliers de clients satisfaits qui font confiance à Transfermarbell pour leurs besoins de transport privé sur la Costa del Sol.",
    "home.bookNow": "Réserver Maintenant",
    "home.viewFleet": "Voir Notre Flotte",

    // Features
    "features.professionalDrivers": "Chauffeurs Professionnels",
    "features.professionalDriversDesc": "Chauffeurs licenciés et vérifiés",
    "features.topRated": "Service Très Bien Noté",
    "features.topRatedDesc": "Note moyenne de 4.9/5",
    "features.realTimeChat": "Chat en Temps Réel",
    "features.realTimeChatDesc": "Chattez avec votre chauffeur",

    // Footer
    "footer.services": "Services",
    "footer.airportTransfers": "Transferts d'Aéroport",
    "footer.cityTransfers": "Transferts Urbains",
    "footer.businessTransport": "Transport d'Entreprise",
    "footer.groupBookings": "Réservations de Groupe",
    "footer.support": "Support",
    "footer.helpCenter": "Centre d'Aide",
    "footer.contactUs": "Nous Contacter",
    "footer.company": "Entreprise",
    "footer.aboutUs": "À Propos",
    "footer.careers": "Carrières",
    "footer.privacyPolicy": "Politique de Confidentialité",
    "footer.termsOfService": "Conditions de Service",
    "footer.copyright": "© 2024 Transfermarbell. Tous droits réservés.",

    // Booking
    "booking.title": "Réserver Transfert",
    "booking.selectVehicle": "Sélectionner Véhicule",
    "booking.passengers": "Passagers",
    "booking.luggage": "Bagages",
    "booking.price": "Prix",
    "booking.confirm": "Confirmer",
    "booking.payment": "Paiement",
    "booking.summary": "Résumé",

    // Common
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.success": "Succès",
    "common.cancel": "Annuler",
    "common.save": "Sauvegarder",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.view": "Voir",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.yes": "Oui",
    "common.no": "Non",
    "common.email": "Email",
    "common.password": "Mot de Passe",
    "common.name": "Nom",
    "common.phone": "Téléphone",
    "common.address": "Adresse",
    "common.city": "Ville",
    "common.date": "Date",
    "common.time": "Heure",
    "common.status": "Statut",
    "common.actions": "Actions",

    // Helpers
    book_transfer: "Book Transfer",
    view_bookings: "View Bookings",
    settings: "Settings",
    logout: "Logout",
    available_transfers: "Available Transfers",
    total_available: "Total Available",
    accept: "Accept",
    reject: "Reject",
    credit_card: "Credit Card",
    debit_card: "Debit Card",
    paypal: "PayPal",
    bank_transfer: "Bank Transfer",
    payment_methods: "Payment Methods",
    add_payment_method: "Add Payment Method",
    card_number: "Card Number",
    expiry_date: "Expiry Date",
    cvv: "CVV",
    cardholder_name: "Cardholder Name",
    add: "Add",
  },

  de: {
    // Navigation
    "nav.services": "Dienstleistungen",
    "nav.fleet": "Flotte",
    "nav.business": "Geschäfte",
    "nav.support": "Support",

    // Homepage
    "home.title": "Premium Private Transfers",
    "home.subtitle": "Einfach Gemacht",
    "home.description": "Buchen Sie professionelle Flughafentransfers, Stadtfahrten und privaten Transport an der Costa del Sol. Zuverlässig, komfortabel und immer pünktlich.",
    "home.bookingTitle": "Buchen Sie Ihren Transfer",
    "home.bookingDescription": "Geben Sie Ihre Reisedetails ein, um zu beginnen",
    "home.from": "Von",
    "home.to": "Nach",
    "home.date": "Datum",
    "home.time": "Zeit",
    "home.continue": "Buchung Fortsetzen",
    "home.nextStep": "Weiter: Fahrzeugtyp, Passagiere auswählen und Buchung abschließen",
    "home.whyChoose": "Warum Transfermarbell Wählen?",
    "home.whyChooseDesc": "Erleben Sie den Unterschied mit unserem Premium-Service für private Transfers",
    "home.readyToBook": "Bereit, Ihren Transfer zu Buchen?",
    "home.readyToBookDesc": "Schließen Sie sich Tausenden zufriedener Kunden an, die Transfermarbell für ihre privaten Transportbedürfnisse an der Costa del Sol vertrauen.",
    "home.bookNow": "Jetzt Buchen",
    "home.viewFleet": "Unsere Flotte Ansehen",

    // Features
    "features.professionalDrivers": "Professionelle Fahrer",
    "features.professionalDriversDesc": "Lizenzierte und verifizierte Fahrer",
    "features.topRated": "Bestbewerteter Service",
    "features.topRatedDesc": "4.9/5 Durchschnittsbewertung",
    "features.realTimeChat": "Echtzeit-Chat",
    "features.realTimeChatDesc": "Chatten Sie mit Ihrem Fahrer",

    // Footer
    "footer.services": "Dienstleistungen",
    "footer.airportTransfers": "Flughafentransfers",
    "footer.cityTransfers": "Stadttransfers",
    "footer.businessTransport": "Geschäftstransport",
    "footer.groupBookings": "Gruppenbuchungen",
    "footer.support": "Support",
    "footer.helpCenter": "Hilfezentrum",
    "footer.contactUs": "Kontaktieren Sie Uns",
    "footer.company": "Unternehmen",
    "footer.aboutUs": "Über Uns",
    "footer.careers": "Karrieren",
    "footer.privacyPolicy": "Datenschutzrichtlinie",
    "footer.termsOfService": "Nutzungsbedingungen",
    "footer.copyright": "© 2024 Transfermarbell. Alle Rechte vorbehalten.",

    // Booking
    "booking.title": "Transfer Buchen",
    "booking.selectVehicle": "Fahrzeug Auswählen",
    "booking.passengers": "Passagiere",
    "booking.luggage": "Gepäck",
    "booking.price": "Preis",
    "booking.confirm": "Bestätigen",
    "booking.payment": "Zahlung",
    "booking.summary": "Zusammenfassung",

    // Common
    "common.loading": "Laden...",
    "common.error": "Fehler",
    "common.success": "Erfolg",
    "common.cancel": "Abbrechen",
    "common.save": "Speichern",
    "common.delete": "Löschen",
    "common.edit": "Bearbeiten",
    "common.view": "Anzeigen",
    "common.search": "Suchen",
    "common.filter": "Filtern",
    "common.yes": "Ja",
    "common.no": "Nein",
    "common.email": "E-Mail",
    "common.password": "Passwort",
    "common.name": "Name",
    "common.phone": "Telefon",
    "common.address": "Adresse",
    "common.city": "Stadt",
    "common.date": "Datum",
    "common.time": "Zeit",
    "common.status": "Status",
    "common.actions": "Aktionen",

    // Helpers
    book_transfer: "Book Transfer",
    view_bookings: "View Bookings",
    settings: "Settings",
    logout: "Logout",
    available_transfers: "Available Transfers",
    total_available: "Total Available",
    accept: "Accept",
    reject: "Reject",
    credit_card: "Credit Card",
    debit_card: "Debit Card",
    paypal: "PayPal",
    bank_transfer: "Bank Transfer",
    payment_methods: "Payment Methods",
    add_payment_method: "Add Payment Method",
    card_number: "Card Number",
    expiry_date: "Expiry Date",
    cvv: "CVV",
    cardholder_name: "Cardholder Name",
    add: "Add",
  },
};

// Language context type
interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  availableLanguages: Language[];
  formatCurrency: (amount: number) => string;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Language provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize with value from localStorage immediately
  const [language, setLanguageState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("transfermarbell_language");
      if (saved && translations[saved]) {
        return saved;
      }
    } catch (error) {
      console.warn("Error reading language from localStorage:", error);
    }

    // Default to Spanish
    return "es";
  });

  // Translation function with fallbacks for missing keys
  const t = (key: string): string => {
    // Define fallbacks for missing translations
    const fallbacks: Record<string, string> = {
      book_transfer: "Book Transfer",
      view_bookings: "View Bookings",
      settings: "Settings",
      logout: "Logout",
      available_transfers: "Available Transfers",
      total_available: "Total Available",
      accept: "Accept",
      reject: "Reject",
      credit_card: "Credit Card",
      debit_card: "Debit Card",
      paypal: "PayPal",
      bank_transfer: "Bank Transfer",
      payment_methods: "Payment Methods",
      add_payment_method: "Add Payment Method",
      card_number: "Card Number",
      expiry_date: "Expiry Date",
      cvv: "CVV",
      cardholder_name: "Cardholder Name",
      add: "Add",
    };

    // Try current language first, then Spanish, then English fallback, then the key itself
    return (
      translations[language]?.[key as keyof Translations] ||
      translations["es"]?.[key as keyof Translations] ||
      fallbacks[key] ||
      key
    );
  };

  // Set language function
  const setLanguage = (newLanguage: string) => {
    if (translations[newLanguage] && newLanguage !== language) {
      setLanguageState(newLanguage);
      localStorage.setItem("transfermarbell_language", newLanguage);
    }
  };

  // Save to localStorage when language changes
  useEffect(() => {
    localStorage.setItem("transfermarbell_language", language);
  }, [language]);

  // Currency formatting function
  const formatCurrency = (amount: number): string => {
    return `€${amount.toFixed(2)}`;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    availableLanguages: LANGUAGES,
    formatCurrency,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Export default
export default LanguageContext;
