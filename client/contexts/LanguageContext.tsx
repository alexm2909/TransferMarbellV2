import React, { createContext, useContext, useState, useEffect } from "react";

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
export interface Translations {
  // Navigation
  "nav.services": string;
  "nav.fleet": string;
  "nav.business": string;
  "nav.support": string;
  "nav.signin": string;
  "nav.register": string;
  "nav.dashboard": string;

  // Homepage
  "home.title": string;
  "home.subtitle": string;
  "home.description": string;
  "home.bookingTitle": string;
  "home.bookingDescription": string;
  "home.from": string;
  "home.to": string;
  "home.date": string;
  "home.time": string;
  "home.continue": string;
  "home.nextStep": string;
  "home.whyChoose": string;
  "home.whyChooseDesc": string;
  "home.becomeDriver": string;
  "home.becomeDriverDesc": string;
  "home.readyToBook": string;
  "home.readyToBookDesc": string;
  "home.bookNow": string;
  "home.viewFleet": string;

  // Features
  "features.professionalDrivers": string;
  "features.professionalDriversDesc": string;
  "features.topRated": string;
  "features.topRatedDesc": string;
  "features.realTimeChat": string;
  "features.realTimeChatDesc": string;

  // Driver section
  "driver.title": string;
  "driver.description": string;
  "driver.earnUpTo": string;
  "driver.flexibleHours": string;
  "driver.insuranceSupport": string;
  "driver.noUpfrontCosts": string;
  "driver.applyToDrive": string;
  "driver.needAccount": string;
  "driver.signUp": string;
  "driver.signIn": string;

  // Footer
  "footer.services": string;
  "footer.airportTransfers": string;
  "footer.cityTransfers": string;
  "footer.businessTransport": string;
  "footer.groupBookings": string;
  "footer.support": string;
  "footer.helpCenter": string;
  "footer.contactUs": string;
  "footer.driverPortal": string;
  "footer.fleetManager": string;
  "footer.company": string;
  "footer.aboutUs": string;
  "footer.careers": string;
  "footer.privacyPolicy": string;
  "footer.termsOfService": string;
  "footer.copyright": string;

  // Dashboard
  "dashboard.welcome": string;
  "dashboard.controlPanel": string;
  "dashboard.client": string;
  "dashboard.driver": string;
  "dashboard.admin": string;
  "dashboard.driverApplication": string;
  "dashboard.applicationPending": string;
  "dashboard.applicationApproved": string;
  "dashboard.applicationRejected": string;
  "dashboard.pendingApproval": string;
  "dashboard.approved": string;
  "dashboard.contactSupport": string;
  "dashboard.becomeDriver": string;
  "dashboard.becomeDriverDesc": string;
  "dashboard.apply": string;
  "dashboard.myBookings": string;
  "dashboard.confirmed": string;
  "dashboard.passengers": string;
  "dashboard.luggage": string;
  "dashboard.newBooking": string;

  // Admin Panel
  "admin.title": string;
  "admin.description": string;
  "admin.totalUsers": string;
  "admin.pendingRequests": string;
  "admin.activeDisputes": string;
  "admin.totalRevenue": string;
  "admin.trips": string;
  "admin.drivers": string;
  "admin.pricing": string;
  "admin.disputes": string;
  "admin.ministry": string;
  "admin.system": string;
  "admin.driverApplications": string;
  "admin.search": string;
  "admin.all": string;
  "admin.pending": string;
  "admin.approved": string;
  "admin.rejected": string;
  "admin.viewDetails": string;
  "admin.viewDocuments": string;
  "admin.approve": string;
  "admin.reject": string;

  // Booking
  "booking.title": string;
  "booking.selectVehicle": string;
  "booking.passengers": string;
  "booking.luggage": string;
  "booking.price": string;
  "booking.confirm": string;
  "booking.payment": string;
  "booking.summary": string;

  // Common
  "common.loading": string;
  "common.error": string;
  "common.success": string;
  "common.cancel": string;
  "common.save": string;
  "common.delete": string;
  "common.edit": string;
  "common.view": string;
  "common.search": string;
  "common.filter": string;
  "common.yes": string;
  "common.no": string;
  "common.email": string;
  "common.password": string;
  "common.name": string;
  "common.phone": string;
  "common.address": string;
  "common.city": string;
  "common.date": string;
  "common.time": string;
  "common.status": string;
  "common.actions": string;

  // Auth
  "auth.signIn": string;
  "auth.signUp": string;
  "auth.email": string;
  "auth.password": string;
  "auth.confirmPassword": string;
  "auth.forgotPassword": string;
  "auth.resetPassword": string;
  "auth.sendResetLink": string;
  "auth.backToSignIn": string;
  "auth.noAccount": string;
  "auth.haveAccount": string;
  "auth.createAccount": string;
  "auth.signInAccount": string;
  "auth.enterEmail": string;
  "auth.enterPassword": string;
  "auth.fullName": string;
  "auth.phoneNumber": string;
  "auth.agreeTerms": string;
  "auth.termsAndConditions": string;
  "auth.privacyPolicy": string;
  "auth.invalidCredentials": string;
  "auth.passwordTooShort": string;
  "auth.emailRequired": string;
  "auth.passwordRequired": string;
  "auth.nameRequired": string;
  "auth.phoneRequired": string;
  "auth.passwordMismatch": string;
  "auth.emailInvalid": string;

  // Missing translations
  "book_transfer": string;
  "view_bookings": string;
  "settings": string;
  "logout": string;
  "available_transfers": string;
  "total_available": string;
  "accept": string;
  "reject": string;
  "credit_card": string;
  "debit_card": string;
  "paypal": string;
  "bank_transfer": string;
  "payment_methods": string;
  "add_payment_method": string;
  "card_number": string;
  "expiry_date": string;
  "cvv": string;
  "cardholder_name": string;
  "cancel": string;
  "add": string;
}

// Spanish translations (default)
export const translations: Record<string, Translations> = {
  es: {
    // Navigation
    "nav.services": "Servicios",
    "nav.fleet": "Flota",
    "nav.business": "Empresas",
    "nav.support": "Soporte",
    "nav.signin": "Iniciar Sesión",
    "nav.register": "Registrarse",
    "nav.dashboard": "Panel",

    // Homepage
    "home.title": "Traslados Privados Premium",
    "home.subtitle": "Hechos Simples",
    "home.description": "Reserva traslados profesionales al aeropuerto, viajes urbanos y transporte privado por la Costa del Sol. Confiable, cómodo y siempre puntual.",
    "home.bookingTitle": "Reserva tu Traslado",
    "home.bookingDescription": "Introduce los detalles de tu viaje para comenzar",
    "home.from": "Desde",
    "home.to": "Hasta",
    "home.date": "Fecha",
    "home.time": "Hora",
    "home.continue": "Continuar Reserva",
    "home.nextStep": "Siguiente: Selecciona tipo de vehículo, pasajeros y completa tu reserva",
    "home.whyChoose": "¿Por qué elegir Transfermarbell?",
    "home.whyChooseDesc": "Experimenta la diferencia con nuestro servicio premium de traslados privados",
    "home.becomeDriver": "Conviértete en Conductor",
    "home.becomeDriverDesc": "Únete a nuestra red de conductores profesionales y empieza a ganar dinero con tu vehículo. Horario flexible, tarifas competitivas y soporte cuando lo necesites.",
    "home.readyToBook": "¿Listo para Reservar tu Traslado?",
    "home.readyToBookDesc": "Únete a miles de clientes satisfechos que confían en Transfermarbell para sus necesidades de transporte privado por la Costa del Sol.",
    "home.bookNow": "Reservar Ahora",
    "home.viewFleet": "Ver Nuestra Flota",

    // Features
    "features.professionalDrivers": "Conductores Profesionales",
    "features.professionalDriversDesc": "Conductores licenciados y verificados",
    "features.topRated": "Servicio Mejor Valorado",
    "features.topRatedDesc": "Calificación promedio de 4.9/5",
    "features.realTimeChat": "Chat en Tiempo Real",
    "features.realTimeChatDesc": "Chatea con tu conductor",

    // Driver section
    "driver.title": "Conviértete en Conductor",
    "driver.description": "Únete a nuestra red de conductores profesionales y empieza a ganar dinero con tu vehículo. Horario flexible, tarifas competitivas y soporte cuando lo necesites.",
    "driver.earnUpTo": "Gana hasta €2,000+ por mes",
    "driver.flexibleHours": "Horarios flexibles",
    "driver.insuranceSupport": "Seguro y soporte incluidos",
    "driver.noUpfrontCosts": "Sin costos iniciales",
    "driver.applyToDrive": "Aplicar para Conducir",
    "driver.needAccount": "Necesitas una cuenta para aplicar como conductor",
    "driver.signUp": "Registrarse",
    "driver.signIn": "Iniciar Sesión",

    // Footer
    "footer.services": "Servicios",
    "footer.airportTransfers": "Traslados al Aeropuerto",
    "footer.cityTransfers": "Traslados Urbanos",
    "footer.businessTransport": "Transporte Empresarial",
    "footer.groupBookings": "Reservas Grupales",
    "footer.support": "Soporte",
    "footer.helpCenter": "Centro de Ayuda",
    "footer.contactUs": "Contáctanos",
    "footer.driverPortal": "Portal del Conductor",
    "footer.fleetManager": "Gestor de Flota",
    "footer.company": "Empresa",
    "footer.aboutUs": "Acerca de Nosotros",
    "footer.careers": "Carreras",
    "footer.privacyPolicy": "Política de Privacidad",
    "footer.termsOfService": "Términos de Servicio",
    "footer.copyright": "© 2024 Transfermarbell. Todos los derechos reservados.",

    // Dashboard
    "dashboard.welcome": "Bienvenido",
    "dashboard.controlPanel": "Panel de control para",
    "dashboard.client": "Cliente",
    "dashboard.driver": "Conductor",
    "dashboard.admin": "Administrador",
    "dashboard.driverApplication": "Estado de Solicitud de Conductor",
    "dashboard.applicationPending": "Solicitud Pendiente de Aprobación",
    "dashboard.applicationApproved": "¡Solicitud Aprobada!",
    "dashboard.applicationRejected": "Solicitud Rechazada",
    "dashboard.pendingApproval": "Tu solicitud está siendo revisada por nuestro equipo.",
    "dashboard.approved": "Ya puedes comenzar a recibir solicitudes de viaje.",
    "dashboard.contactSupport": "Contacta con soporte para más información.",
    "dashboard.becomeDriver": "¿Quieres ser conductor?",
    "dashboard.becomeDriverDesc": "Únete a nuestro equipo de conductores profesionales y empieza a ganar dinero con tu vehículo.",
    "dashboard.apply": "Aplicar",
    "dashboard.myBookings": "Mis Reservas",
    "dashboard.confirmed": "Confirmado",
    "dashboard.passengers": "pasajeros",
    "dashboard.luggage": "maleta",
    "dashboard.newBooking": "Nueva Reserva",

    // Admin Panel
    "admin.title": "Panel de Administración",
    "admin.description": "Gestiona usuarios, aprobaciones y configura el sistema",
    "admin.totalUsers": "Usuarios Totales",
    "admin.pendingRequests": "Solicitudes Pendientes",
    "admin.activeDisputes": "Disputas Activas",
    "admin.totalRevenue": "Ingresos Totales",
    "admin.trips": "Viajes",
    "admin.drivers": "Conductores",
    "admin.pricing": "Precios",
    "admin.disputes": "Disputas",
    "admin.ministry": "Ministerio",
    "admin.system": "Sistema",
    "admin.driverApplications": "Solicitudes de Conductores",
    "admin.search": "Buscar conductor...",
    "admin.all": "Todos",
    "admin.pending": "Pendientes",
    "admin.approved": "Aprobados",
    "admin.rejected": "Rechazados",
    "admin.viewDetails": "Ver Detalles",
    "admin.viewDocuments": "Ver Documentos",
    "admin.approve": "Aprobar",
    "admin.reject": "Rechazar",

    // Booking
    "booking.title": "Reservar Traslado",
    "booking.selectVehicle": "Seleccionar Vehículo",
    "booking.passengers": "Pasajeros",
    "booking.luggage": "Equipaje",
    "booking.price": "Precio",
    "booking.confirm": "Confirmar",
    "booking.payment": "Pago",
    "booking.summary": "Resumen",

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

    // Auth
    "auth.signIn": "Iniciar Sesión",
    "auth.signUp": "Registrarse",
    "auth.email": "Email",
    "auth.password": "Contraseña",
    "auth.confirmPassword": "Confirmar Contraseña",
    "auth.forgotPassword": "¿Olvidaste tu contraseña?",
    "auth.resetPassword": "Restablecer Contraseña",
    "auth.sendResetLink": "Enviar Enlace de Restablecimiento",
    "auth.backToSignIn": "Volver a Iniciar Sesión",
    "auth.noAccount": "¿No tienes una cuenta?",
    "auth.haveAccount": "¿Ya tienes una cuenta?",
    "auth.createAccount": "Crear cuenta",
    "auth.signInAccount": "Iniciar sesión",
    "auth.enterEmail": "Introduce tu email",
    "auth.enterPassword": "Introduce tu contraseña",
    "auth.fullName": "Nombre completo",
    "auth.phoneNumber": "Número de teléfono",
    "auth.agreeTerms": "Acepto los",
    "auth.termsAndConditions": "Términos y Condiciones",
    "auth.privacyPolicy": "Política de Privacidad",
    "auth.invalidCredentials": "Credenciales inválidas",
    "auth.passwordTooShort": "La contraseña debe tener al menos 6 caracteres",
    "auth.emailRequired": "El email es requerido",
    "auth.passwordRequired": "La contraseña es requerida",
    "auth.nameRequired": "El nombre es requerido",
    "auth.phoneRequired": "El teléfono es requerido",
    "auth.passwordMismatch": "Las contraseñas no coinciden",
    "auth.emailInvalid": "Email inválido",

    // Missing translations
    "book_transfer": "Reservar Traslado",
    "view_bookings": "Ver Reservas",
    "settings": "Configuración",
    "logout": "Cerrar Sesión",
    "available_transfers": "Traslados Disponibles",
    "total_available": "Total Disponibles",
    "accept": "Aceptar",
    "reject": "Rechazar",
    "credit_card": "Tarjeta de Crédito",
    "debit_card": "Tarjeta de Débito",
    "paypal": "PayPal",
    "bank_transfer": "Transferencia Bancaria",
    "payment_methods": "Métodos de Pago",
    "add_payment_method": "Agregar Método de Pago",
    "card_number": "Número de Tarjeta",
    "expiry_date": "Fecha de Vencimiento",
    "cvv": "CVV",
    "cardholder_name": "Nombre del Titular",
    "cancel": "Cancelar",
    "add": "Agregar",
  },

  en: {
    // Navigation
    "nav.services": "Services",
    "nav.fleet": "Fleet",
    "nav.business": "Business",
    "nav.support": "Support",
    "nav.signin": "Sign In",
    "nav.register": "Register",
    "nav.dashboard": "Dashboard",

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
    "home.becomeDriver": "Become a Driver",
    "home.becomeDriverDesc": "Join our network of professional drivers and start earning money with your vehicle. Flexible schedule, competitive rates, and support when you need it.",
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

    // Driver section
    "driver.title": "Become a Driver",
    "driver.description": "Join our network of professional drivers and start earning money with your vehicle. Flexible schedule, competitive rates, and support when you need it.",
    "driver.earnUpTo": "Earn up to €2,000+ per month",
    "driver.flexibleHours": "Flexible working hours",
    "driver.insuranceSupport": "Insurance and support included",
    "driver.noUpfrontCosts": "No upfront costs",
    "driver.applyToDrive": "Apply to Drive",
    "driver.needAccount": "You need an account to apply as a driver",
    "driver.signUp": "Sign Up",
    "driver.signIn": "Sign In",

    // Footer
    "footer.services": "Services",
    "footer.airportTransfers": "Airport Transfers",
    "footer.cityTransfers": "City Transfers",
    "footer.businessTransport": "Business Transport",
    "footer.groupBookings": "Group Bookings",
    "footer.support": "Support",
    "footer.helpCenter": "Help Center",
    "footer.contactUs": "Contact Us",
    "footer.driverPortal": "Driver Portal",
    "footer.fleetManager": "Fleet Manager",
    "footer.company": "Company",
    "footer.aboutUs": "About Us",
    "footer.careers": "Careers",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.termsOfService": "Terms of Service",
    "footer.copyright": "© 2024 Transfermarbell. All rights reserved.",

    // Dashboard
    "dashboard.welcome": "Welcome",
    "dashboard.controlPanel": "Control panel for",
    "dashboard.client": "Client",
    "dashboard.driver": "Driver",
    "dashboard.admin": "Administrator",
    "dashboard.driverApplication": "Driver Application Status",
    "dashboard.applicationPending": "Application Pending Approval",
    "dashboard.applicationApproved": "Application Approved!",
    "dashboard.applicationRejected": "Application Rejected",
    "dashboard.pendingApproval": "Your application is being reviewed by our team.",
    "dashboard.approved": "You can now start receiving trip requests.",
    "dashboard.contactSupport": "Contact support for more information.",
    "dashboard.becomeDriver": "Want to become a driver?",
    "dashboard.becomeDriverDesc": "Join our team of professional drivers and start earning money with your vehicle.",
    "dashboard.apply": "Apply",
    "dashboard.myBookings": "My Bookings",
    "dashboard.confirmed": "Confirmed",
    "dashboard.passengers": "passengers",
    "dashboard.luggage": "luggage",
    "dashboard.newBooking": "New Booking",

    // Admin Panel
    "admin.title": "Administration Panel",
    "admin.description": "Manage users, approvals and configure the system",
    "admin.totalUsers": "Total Users",
    "admin.pendingRequests": "Pending Requests",
    "admin.activeDisputes": "Active Disputes",
    "admin.totalRevenue": "Total Revenue",
    "admin.trips": "Trips",
    "admin.drivers": "Drivers",
    "admin.pricing": "Pricing",
    "admin.disputes": "Disputes",
    "admin.ministry": "Ministry",
    "admin.system": "System",
    "admin.driverApplications": "Driver Applications",
    "admin.search": "Search driver...",
    "admin.all": "All",
    "admin.pending": "Pending",
    "admin.approved": "Approved",
    "admin.rejected": "Rejected",
    "admin.viewDetails": "View Details",
    "admin.viewDocuments": "View Documents",
    "admin.approve": "Approve",
    "admin.reject": "Reject",

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

    // Auth
    "auth.signIn": "Sign In",
    "auth.signUp": "Sign Up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.forgotPassword": "Forgot your password?",
    "auth.resetPassword": "Reset Password",
    "auth.sendResetLink": "Send Reset Link",
    "auth.backToSignIn": "Back to Sign In",
    "auth.noAccount": "Don't have an account?",
    "auth.haveAccount": "Already have an account?",
    "auth.createAccount": "Create account",
    "auth.signInAccount": "Sign in",
    "auth.enterEmail": "Enter your email",
    "auth.enterPassword": "Enter your password",
    "auth.fullName": "Full name",
    "auth.phoneNumber": "Phone number",
    "auth.agreeTerms": "I agree to the",
    "auth.termsAndConditions": "Terms and Conditions",
    "auth.privacyPolicy": "Privacy Policy",
    "auth.invalidCredentials": "Invalid credentials",
    "auth.passwordTooShort": "Password must be at least 6 characters",
    "auth.emailRequired": "Email is required",
    "auth.passwordRequired": "Password is required",
    "auth.nameRequired": "Name is required",
    "auth.phoneRequired": "Phone is required",
    "auth.passwordMismatch": "Passwords do not match",
    "auth.emailInvalid": "Invalid email",
  },

  fr: {
    // Navigation
    "nav.services": "Services",
    "nav.fleet": "Flotte",
    "nav.business": "Entreprises",
    "nav.support": "Support",
    "nav.signin": "Se Connecter",
    "nav.register": "S'inscrire",
    "nav.dashboard": "Tableau de Bord",

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
    "home.becomeDriver": "Devenir Chauffeur",
    "home.becomeDriverDesc": "Rejoignez notre réseau de chauffeurs professionnels et commencez à gagner de l'argent avec votre véhicule. Horaires flexibles, tarifs compétitifs et support quand vous en avez besoin.",
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

    // Driver section
    "driver.title": "Devenir Chauffeur",
    "driver.description": "Rejoignez notre réseau de chauffeurs professionnels et commencez à gagner de l'argent avec votre véhicule. Horaires flexibles, tarifs compétitifs et support quand vous en avez besoin.",
    "driver.earnUpTo": "Gagnez jusqu'à 2 000 €+ par mois",
    "driver.flexibleHours": "Horaires flexibles",
    "driver.insuranceSupport": "Assurance et support inclus",
    "driver.noUpfrontCosts": "Pas de coûts initiaux",
    "driver.applyToDrive": "Postuler pour Conduire",
    "driver.needAccount": "Vous avez besoin d'un compte pour postuler comme chauffeur",
    "driver.signUp": "S'inscrire",
    "driver.signIn": "Se Connecter",

    // Footer
    "footer.services": "Services",
    "footer.airportTransfers": "Transferts d'Aéroport",
    "footer.cityTransfers": "Transferts Urbains",
    "footer.businessTransport": "Transport d'Entreprise",
    "footer.groupBookings": "Réservations de Groupe",
    "footer.support": "Support",
    "footer.helpCenter": "Centre d'Aide",
    "footer.contactUs": "Nous Contacter",
    "footer.driverPortal": "Portail Chauffeur",
    "footer.fleetManager": "Gestionnaire de Flotte",
    "footer.company": "Entreprise",
    "footer.aboutUs": "À Propos",
    "footer.careers": "Carrières",
    "footer.privacyPolicy": "Politique de Confidentialité",
    "footer.termsOfService": "Conditions de Service",
    "footer.copyright": "© 2024 Transfermarbell. Tous droits réservés.",

    // Dashboard
    "dashboard.welcome": "Bienvenue",
    "dashboard.controlPanel": "Panneau de contrôle pour",
    "dashboard.client": "Client",
    "dashboard.driver": "Chauffeur",
    "dashboard.admin": "Administrateur",
    "dashboard.driverApplication": "Statut de Candidature Chauffeur",
    "dashboard.applicationPending": "Candidature en Attente d'Approbation",
    "dashboard.applicationApproved": "Candidature Approuvée!",
    "dashboard.applicationRejected": "Candidature Rejetée",
    "dashboard.pendingApproval": "Votre candidature est en cours d'examen par notre équipe.",
    "dashboard.approved": "Vous pouvez maintenant commencer à recevoir des demandes de voyage.",
    "dashboard.contactSupport": "Contactez le support pour plus d'informations.",
    "dashboard.becomeDriver": "Voulez-vous devenir chauffeur?",
    "dashboard.becomeDriverDesc": "Rejoignez notre équipe de chauffeurs professionnels et commencez à gagner de l'argent avec votre véhicule.",
    "dashboard.apply": "Postuler",
    "dashboard.myBookings": "Mes Réservations",
    "dashboard.confirmed": "Confirmé",
    "dashboard.passengers": "passagers",
    "dashboard.luggage": "bagage",
    "dashboard.newBooking": "Nouvelle Réservation",

    // Admin Panel
    "admin.title": "Panneau d'Administration",
    "admin.description": "Gérez les utilisateurs, les approbations et configurez le système",
    "admin.totalUsers": "Total Utilisateurs",
    "admin.pendingRequests": "Demandes en Attente",
    "admin.activeDisputes": "Disputes Actives",
    "admin.totalRevenue": "Revenus Totaux",
    "admin.trips": "Voyages",
    "admin.drivers": "Chauffeurs",
    "admin.pricing": "Tarification",
    "admin.disputes": "Disputes",
    "admin.ministry": "Ministère",
    "admin.system": "Système",
    "admin.driverApplications": "Candidatures Chauffeur",
    "admin.search": "Rechercher chauffeur...",
    "admin.all": "Tous",
    "admin.pending": "En Attente",
    "admin.approved": "Approuvés",
    "admin.rejected": "Rejetés",
    "admin.viewDetails": "Voir Détails",
    "admin.viewDocuments": "Voir Documents",
    "admin.approve": "Approuver",
    "admin.reject": "Rejeter",

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

    // Auth
    "auth.signIn": "Se Connecter",
    "auth.signUp": "S'inscrire",
    "auth.email": "Email",
    "auth.password": "Mot de Passe",
    "auth.confirmPassword": "Confirmer Mot de Passe",
    "auth.forgotPassword": "Mot de passe oublié?",
    "auth.resetPassword": "Réinitialiser Mot de Passe",
    "auth.sendResetLink": "Envoyer Lien de Réinitialisation",
    "auth.backToSignIn": "Retour à la Connexion",
    "auth.noAccount": "Pas de compte?",
    "auth.haveAccount": "Déjà un compte?",
    "auth.createAccount": "Créer un compte",
    "auth.signInAccount": "Se connecter",
    "auth.enterEmail": "Entrez votre email",
    "auth.enterPassword": "Entrez votre mot de passe",
    "auth.fullName": "Nom complet",
    "auth.phoneNumber": "Numéro de téléphone",
    "auth.agreeTerms": "J'accepte les",
    "auth.termsAndConditions": "Conditions Générales",
    "auth.privacyPolicy": "Politique de Confidentialité",
    "auth.invalidCredentials": "Identifiants invalides",
    "auth.passwordTooShort": "Le mot de passe doit contenir au moins 6 caractères",
    "auth.emailRequired": "L'email est requis",
    "auth.passwordRequired": "Le mot de passe est requis",
    "auth.nameRequired": "Le nom est requis",
    "auth.phoneRequired": "Le téléphone est requis",
    "auth.passwordMismatch": "Les mots de passe ne correspondent pas",
    "auth.emailInvalid": "Email invalide",
  },

  de: {
    // Navigation
    "nav.services": "Dienstleistungen",
    "nav.fleet": "Flotte",
    "nav.business": "Geschäfte",
    "nav.support": "Support",
    "nav.signin": "Anmelden",
    "nav.register": "Registrieren",
    "nav.dashboard": "Dashboard",

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
    "home.becomeDriver": "Fahrer Werden",
    "home.becomeDriverDesc": "Treten Sie unserem Netzwerk professioneller Fahrer bei und verdienen Sie Geld mit Ihrem Fahrzeug. Flexible Arbeitszeiten, wettbewerbsfähige Preise und Support, wenn Sie ihn brauchen.",
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

    // Driver section
    "driver.title": "Fahrer Werden",
    "driver.description": "Treten Sie unserem Netzwerk professioneller Fahrer bei und verdienen Sie Geld mit Ihrem Fahrzeug. Flexible Arbeitszeiten, wettbewerbsfähige Preise und Support, wenn Sie ihn brauchen.",
    "driver.earnUpTo": "Verdienen Sie bis zu 2.000 €+ pro Monat",
    "driver.flexibleHours": "Flexible Arbeitszeiten",
    "driver.insuranceSupport": "Versicherung und Support inbegriffen",
    "driver.noUpfrontCosts": "Keine Vorabkosten",
    "driver.applyToDrive": "Als Fahrer Bewerben",
    "driver.needAccount": "Sie benötigen ein Konto, um sich als Fahrer zu bewerben",
    "driver.signUp": "Registrieren",
    "driver.signIn": "Anmelden",

    // Footer
    "footer.services": "Dienstleistungen",
    "footer.airportTransfers": "Flughafentransfers",
    "footer.cityTransfers": "Stadttransfers",
    "footer.businessTransport": "Geschäftstransport",
    "footer.groupBookings": "Gruppenbuchungen",
    "footer.support": "Support",
    "footer.helpCenter": "Hilfezentrum",
    "footer.contactUs": "Kontaktieren Sie Uns",
    "footer.driverPortal": "Fahrer-Portal",
    "footer.fleetManager": "Flottenmanager",
    "footer.company": "Unternehmen",
    "footer.aboutUs": "Über Uns",
    "footer.careers": "Karrieren",
    "footer.privacyPolicy": "Datenschutzrichtlinie",
    "footer.termsOfService": "Nutzungsbedingungen",
    "footer.copyright": "© 2024 Transfermarbell. Alle Rechte vorbehalten.",

    // Dashboard
    "dashboard.welcome": "Willkommen",
    "dashboard.controlPanel": "Kontrollpanel für",
    "dashboard.client": "Kunde",
    "dashboard.driver": "Fahrer",
    "dashboard.admin": "Administrator",
    "dashboard.driverApplication": "Fahrer-Bewerbungsstatus",
    "dashboard.applicationPending": "Bewerbung Wartet auf Genehmigung",
    "dashboard.applicationApproved": "Bewerbung Genehmigt!",
    "dashboard.applicationRejected": "Bewerbung Abgelehnt",
    "dashboard.pendingApproval": "Ihre Bewerbung wird von unserem Team überprüft.",
    "dashboard.approved": "Sie können jetzt Reiseanfragen erhalten.",
    "dashboard.contactSupport": "Kontaktieren Sie den Support für weitere Informationen.",
    "dashboard.becomeDriver": "Möchten Sie Fahrer werden?",
    "dashboard.becomeDriverDesc": "Treten Sie unserem Team professioneller Fahrer bei und verdienen Sie Geld mit Ihrem Fahrzeug.",
    "dashboard.apply": "Bewerben",
    "dashboard.myBookings": "Meine Buchungen",
    "dashboard.confirmed": "Bestätigt",
    "dashboard.passengers": "Passagiere",
    "dashboard.luggage": "Gepäck",
    "dashboard.newBooking": "Neue Buchung",

    // Admin Panel
    "admin.title": "Verwaltungspanel",
    "admin.description": "Benutzer verwalten, Genehmigungen und System konfigurieren",
    "admin.totalUsers": "Gesamtbenutzer",
    "admin.pendingRequests": "Ausstehende Anfragen",
    "admin.activeDisputes": "Aktive Streitigkeiten",
    "admin.totalRevenue": "Gesamtumsatz",
    "admin.trips": "Fahrten",
    "admin.drivers": "Fahrer",
    "admin.pricing": "Preisgestaltung",
    "admin.disputes": "Streitigkeiten",
    "admin.ministry": "Ministerium",
    "admin.system": "System",
    "admin.driverApplications": "Fahrer-Bewerbungen",
    "admin.search": "Fahrer suchen...",
    "admin.all": "Alle",
    "admin.pending": "Ausstehend",
    "admin.approved": "Genehmigt",
    "admin.rejected": "Abgelehnt",
    "admin.viewDetails": "Details Anzeigen",
    "admin.viewDocuments": "Dokumente Anzeigen",
    "admin.approve": "Genehmigen",
    "admin.reject": "Ablehnen",

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

    // Auth
    "auth.signIn": "Anmelden",
    "auth.signUp": "Registrieren",
    "auth.email": "E-Mail",
    "auth.password": "Passwort",
    "auth.confirmPassword": "Passwort Bestätigen",
    "auth.forgotPassword": "Passwort vergessen?",
    "auth.resetPassword": "Passwort Zurücksetzen",
    "auth.sendResetLink": "Reset-Link Senden",
    "auth.backToSignIn": "Zurück zur Anmeldung",
    "auth.noAccount": "Kein Konto?",
    "auth.haveAccount": "Bereits ein Konto?",
    "auth.createAccount": "Konto erstellen",
    "auth.signInAccount": "Anmelden",
    "auth.enterEmail": "E-Mail eingeben",
    "auth.enterPassword": "Passwort eingeben",
    "auth.fullName": "Vollständiger Name",
    "auth.phoneNumber": "Telefonnummer",
    "auth.agreeTerms": "Ich stimme den",
    "auth.termsAndConditions": "Geschäftsbedingungen",
    "auth.privacyPolicy": "Datenschutzrichtlinie",
    "auth.invalidCredentials": "Ungültige Anmeldedaten",
    "auth.passwordTooShort": "Passwort muss mindestens 6 Zeichen haben",
    "auth.emailRequired": "E-Mail ist erforderlich",
    "auth.passwordRequired": "Passwort ist erforderlich",
    "auth.nameRequired": "Name ist erforderlich",
    "auth.phoneRequired": "Telefon ist erforderlich",
    "auth.passwordMismatch": "Passwörter stimmen nicht überein",
    "auth.emailInvalid": "Ungültige E-Mail",
  },

  it: {
    // Navigation
    "nav.services": "Servizi",
    "nav.fleet": "Flotta",
    "nav.business": "Business",
    "nav.support": "Supporto",
    "nav.signin": "Accedi",
    "nav.register": "Registrati",
    "nav.dashboard": "Dashboard",

    // Homepage
    "home.title": "Trasferimenti Privati Premium",
    "home.subtitle": "Resi Semplici",
    "home.description": "Prenota trasferimenti aeroportuali professionali, corse urbane e trasporti privati sulla Costa del Sol. Affidabile, confortevole e sempre puntuale.",
    "home.bookingTitle": "Prenota il Tuo Trasferimento",
    "home.bookingDescription": "Inserisci i dettagli del tuo viaggio per iniziare",
    "home.from": "Da",
    "home.to": "A",
    "home.date": "Data",
    "home.time": "Ora",
    "home.continue": "Continua Prenotazione",
    "home.nextStep": "Prossimo: Seleziona tipo di veicolo, passeggeri e completa la prenotazione",
    "home.whyChoose": "Perché Scegliere Transfermarbell?",
    "home.whyChooseDesc": "Scopri la differenza con il nostro servizio premium di trasferimenti privati",
    "home.becomeDriver": "Diventa Autista",
    "home.becomeDriverDesc": "Unisciti alla nostra rete di autisti professionali e inizia a guadagnare con il tuo veicolo. Orari flessibili, tariffe competitive e supporto quando ne hai bisogno.",
    "home.readyToBook": "Pronto a Prenotare il Tuo Trasferimento?",
    "home.readyToBookDesc": "Unisciti a migliaia di clienti soddisfatti che si affidano a Transfermarbell per le loro esigenze di trasporto privato sulla Costa del Sol.",
    "home.bookNow": "Prenota Ora",
    "home.viewFleet": "Vedi la Nostra Flotta",

    // Features
    "features.professionalDrivers": "Autisti Professionali",
    "features.professionalDriversDesc": "Autisti autorizzati e verificati",
    "features.topRated": "Servizio Più Votato",
    "features.topRatedDesc": "Valutazione media 4.9/5",
    "features.realTimeChat": "Chat in Tempo Reale",
    "features.realTimeChatDesc": "Chatta con il tuo autista",

    // Driver section
    "driver.title": "Diventa Autista",
    "driver.description": "Unisciti alla nostra rete di autisti professionali e inizia a guadagnare con il tuo veicolo. Orari flessibili, tariffe competitive e supporto quando ne hai bisogno.",
    "driver.earnUpTo": "Guadagna fino a €2.000+ al mese",
    "driver.flexibleHours": "Orari flessibili",
    "driver.insuranceSupport": "Assicurazione e supporto inclusi",
    "driver.noUpfrontCosts": "Nessun costo iniziale",
    "driver.applyToDrive": "Candidati per Guidare",
    "driver.needAccount": "Hai bisogno di un account per candidarti come autista",
    "driver.signUp": "Registrati",
    "driver.signIn": "Accedi",

    // Footer
    "footer.services": "Servizi",
    "footer.airportTransfers": "Trasferimenti Aeroportuali",
    "footer.cityTransfers": "Trasferimenti Urbani",
    "footer.businessTransport": "Trasporto Business",
    "footer.groupBookings": "Prenotazioni Gruppo",
    "footer.support": "Supporto",
    "footer.helpCenter": "Centro Assistenza",
    "footer.contactUs": "Contattaci",
    "footer.driverPortal": "Portale Autista",
    "footer.fleetManager": "Gestore Flotta",
    "footer.company": "Azienda",
    "footer.aboutUs": "Chi Siamo",
    "footer.careers": "Carriere",
    "footer.privacyPolicy": "Politica sulla Privacy",
    "footer.termsOfService": "Termini di Servizio",
    "footer.copyright": "© 2024 Transfermarbell. Tutti i diritti riservati.",

    // Dashboard
    "dashboard.welcome": "Benvenuto",
    "dashboard.controlPanel": "Pannello di controllo per",
    "dashboard.client": "Cliente",
    "dashboard.driver": "Autista",
    "dashboard.admin": "Amministratore",
    "dashboard.driverApplication": "Stato Candidatura Autista",
    "dashboard.applicationPending": "Candidatura in Attesa di Approvazione",
    "dashboard.applicationApproved": "Candidatura Approvata!",
    "dashboard.applicationRejected": "Candidatura Respinta",
    "dashboard.pendingApproval": "La tua candidatura è in fase di revisione dal nostro team.",
    "dashboard.approved": "Ora puoi iniziare a ricevere richieste di viaggio.",
    "dashboard.contactSupport": "Contatta il supporto per maggiori informazioni.",
    "dashboard.becomeDriver": "Vuoi diventare autista?",
    "dashboard.becomeDriverDesc": "Unisciti al nostro team di autisti professionali e inizia a guadagnare con il tuo veicolo.",
    "dashboard.apply": "Candidati",
    "dashboard.myBookings": "Le Mie Prenotazioni",
    "dashboard.confirmed": "Confermato",
    "dashboard.passengers": "passeggeri",
    "dashboard.luggage": "bagaglio",
    "dashboard.newBooking": "Nuova Prenotazione",

    // Admin Panel
    "admin.title": "Pannello di Amministrazione",
    "admin.description": "Gestisci utenti, approvazioni e configura il sistema",
    "admin.totalUsers": "Utenti Totali",
    "admin.pendingRequests": "Richieste in Attesa",
    "admin.activeDisputes": "Controversie Attive",
    "admin.totalRevenue": "Ricavi Totali",
    "admin.trips": "Viaggi",
    "admin.drivers": "Autisti",
    "admin.pricing": "Prezzi",
    "admin.disputes": "Controversie",
    "admin.ministry": "Ministero",
    "admin.system": "Sistema",
    "admin.driverApplications": "Candidature Autista",
    "admin.search": "Cerca autista...",
    "admin.all": "Tutti",
    "admin.pending": "In Attesa",
    "admin.approved": "Approvati",
    "admin.rejected": "Respinti",
    "admin.viewDetails": "Vedi Dettagli",
    "admin.viewDocuments": "Vedi Documenti",
    "admin.approve": "Approva",
    "admin.reject": "Respingi",

    // Booking
    "booking.title": "Prenota Trasferimento",
    "booking.selectVehicle": "Seleziona Veicolo",
    "booking.passengers": "Passeggeri",
    "booking.luggage": "Bagagli",
    "booking.price": "Prezzo",
    "booking.confirm": "Conferma",
    "booking.payment": "Pagamento",
    "booking.summary": "Riepilogo",

    // Common
    "common.loading": "Caricamento...",
    "common.error": "Errore",
    "common.success": "Successo",
    "common.cancel": "Annulla",
    "common.save": "Salva",
    "common.delete": "Elimina",
    "common.edit": "Modifica",
    "common.view": "Visualizza",
    "common.search": "Cerca",
    "common.filter": "Filtra",
    "common.yes": "Sì",
    "common.no": "No",
    "common.email": "Email",
    "common.password": "Password",
    "common.name": "Nome",
    "common.phone": "Telefono",
    "common.address": "Indirizzo",
    "common.city": "Città",
    "common.date": "Data",
    "common.time": "Ora",
    "common.status": "Stato",
    "common.actions": "Azioni",

    // Auth
    "auth.signIn": "Accedi",
    "auth.signUp": "Registrati",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Conferma Password",
    "auth.forgotPassword": "Password dimenticata?",
    "auth.resetPassword": "Reimposta Password",
    "auth.sendResetLink": "Invia Link di Reset",
    "auth.backToSignIn": "Torna al Login",
    "auth.noAccount": "Non hai un account?",
    "auth.haveAccount": "Hai già un account?",
    "auth.createAccount": "Crea account",
    "auth.signInAccount": "Accedi",
    "auth.enterEmail": "Inserisci la tua email",
    "auth.enterPassword": "Inserisci la tua password",
    "auth.fullName": "Nome completo",
    "auth.phoneNumber": "Numero di telefono",
    "auth.agreeTerms": "Accetto i",
    "auth.termsAndConditions": "Termini e Condizioni",
    "auth.privacyPolicy": "Politica sulla Privacy",
    "auth.invalidCredentials": "Credenziali non valide",
    "auth.passwordTooShort": "La password deve essere di almeno 6 caratteri",
    "auth.emailRequired": "L'email è richiesta",
    "auth.passwordRequired": "La password è richiesta",
    "auth.nameRequired": "Il nome è richiesto",
    "auth.phoneRequired": "Il telefono è richiesto",
    "auth.passwordMismatch": "Le password non corrispondono",
    "auth.emailInvalid": "Email non valida",
  }
};

// Language context type
interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: keyof Translations) => string;
  availableLanguages: Language[];
  formatCurrency: (amount: number) => string;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language provider component
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>(() => {
    // Try to get language from localStorage first
    const saved = localStorage.getItem("transfermarbell_language");
    if (saved && translations[saved]) {
      return saved;
    }
    
    // Try to detect browser language
    const browserLang = navigator.language.split("-")[0];
    if (translations[browserLang]) {
      return browserLang;
    }
    
    // Default to Spanish
    return "es";
  });

  // Translation function
  const t = (key: keyof Translations): string => {
    return translations[language]?.[key] || translations["es"][key] || key;
  };

  // Set language function with persistence
  const setLanguage = (newLanguage: string) => {
    if (translations[newLanguage]) {
      setLanguageState(newLanguage);
      localStorage.setItem("transfermarbell_language", newLanguage);
    }
  };

  // Effect to save language preference
  useEffect(() => {
    localStorage.setItem("transfermarbell_language", language);
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    availableLanguages: LANGUAGES,
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
