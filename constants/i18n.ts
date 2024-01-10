import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

const translations = {
  en: {
    loginTitle: 'Your Finances, 100% under your control',
    loginButton: 'Log In',
    send: 'Send',
    previousTransactionTitle1: 'My',
    previousTransactionTitle2: 'Transactions',
    viewAllTransactions: 'View All My Transactions',
    to: 'To',
    from: 'From',
    claimed: 'Claimed',
    unclaimed: 'Not Claimed',
    sendSelectContactTitle: 'Who do you want to send money to?',
    selectContactPlaceholder: 'Enter a phone number',
    enterName: 'Enter a name',
    getContacts: 'Select from phone contacts',
    searchContacts: 'Search Contacts',
    sendingTo: 'Sending to',
    youHave: 'You have',
    noteInputPlaceholder: 'Add a note or a concept',
    sending: 'Sending',
    goHome: 'Go Home',
    sent: 'Sent',
    successDescription: 'A claim link has been sent to',
    share: 'Share',
    welcomeScreenTitle: 'Claim your funds!',
    welcomeScreenSubtitle: 'It only takes 30 seconds!',
    welcomeScreenDescription:
      'With Woosh you can send money instantly. Split bills with friends effortlessly, even if they are not on Woosh.',
    getStarted: 'Get Started',
    sentYou: 'sent you',
    claimIntroScreenDescription: 'Enter your phone number to continue',
    next: 'Next',
    enterYourPhoneNumber: 'Enter your phone number',
  },
  es: {
    loginTitle: 'La manera mas facil de pagarle a tus amigos',
    loginButton: 'Iniciar Sesión',
    send: 'Enviar',
    previousTransactionTitle1: 'Mis',
    previousTransactionTitle2: 'Transacciones',
    viewAllTransactions: 'Ver Todas Mis Transacciones',
    to: 'Para',
    from: 'De',
    claimed: 'Reclamado',
    unclaimed: 'No Reclamado',
    sendSelectContactTitle: 'A quien le enviaras?',
    selectContactPlaceholder: 'Ingresa un numero de telefono',
    enterName: 'Ingresa un nombre',
    getContacts: 'Seleccionar de mis contactos',
    searchContacts: 'Buscar Contacto',
    sendingTo: 'Enviando a',
    youHave: 'Tienes',
    noteInputPlaceholder: 'Agrega una nota o concepto',
    sending: 'Enviando',
    goHome: 'Ir a Inicio',
    sent: 'Enviado',
    successDescription: 'Un link de reclamo ha sido enviado a',
    share: 'Compartir',
    welcomeScreenTitle: '¡Te enviaron fondos! ',
    welcomeScreenSubtitle: '¡Solo toma 30 segundos!',
    welcomeScreenDescription:
      'Con Woosh, envía dinero al instante y gratis a cualquier persona en el mundo y divide gastos con amigos fácilmente',
    getStarted: 'Comenzar',
    sentYou: 'te envió',
    claimIntroScreenDescription: 'Ingresa tu numero de telefono para continuar',
    next: 'Siguiente',
    enterYourPhoneNumber: 'Ingresa tu numero de telefono',
  },
};

const i18n = new I18n(translations);
// Set the key-value pairs for the different languages you want to support

// Set the locale information
i18n.locale = Localization.locale;
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.enableFallback = true;

export default i18n;
