import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

const translations = {
  en: {
    loginTitle: `Send crypto to anyone who doesn't have a wallet`,
    loginButton: 'Log In',
    send: 'Send',
    previousTransactionTitle1: 'Recent',
    previousTransactionTitle2: 'Transactions',
    viewAllTransactions: 'View All My Transactions',
    to: 'To',
    from: 'From',
    claimed: 'Claimed',
    unclaimed: 'Not Claimed',
    sendSelectContactTitle: 'Who are you sending to??',
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
    sendSuccessDescription: 'Share the link with the recipient',
    share: 'Share',
    shareMessageGreeting: 'Hey',
    shareMessageText1: 'I sent you $',
    shareMessageText2: 'using Woosh enter this link to download the app and claim your money: ',
    welcomeScreenTitle: 'Claim your funds!',
    welcomeScreenSubtitle: 'It only takes 30 seconds!',
    welcomeScreenDescription:
      'With Woosh you can send money instantly. Split bills with friends effortlessly, even if they are not on Woosh.',
    getStarted: 'Get Started',
    sentYou: 'sent you',
    claimIntroScreenDescription: 'Enter your phone number to continue',
    next: 'Next',
    enterYourPhoneNumber: 'Enter your phone number',
    settingUpAccountLabel: 'Creating your account',
    claimingFundsLabel: 'Claiming your funds',
    onboardingTitle: 'Create your account to claim your funds',
    setProfilePicture: 'Set Your Profile Picture',
    uploadPhoto: 'Upload Photo',
    createAccountAndClaim: 'Create account and claim',
    welcomeClaimedTitle: 'These funds have already been claimed',
    noAccountButton: 'I dont have an account',
    request: 'Request',
    requestHeaderTitle: 'Request A Payment',
    perPerson: 'Per Person',
    requestSelectContactTitle: 'Add Contacts',
    addContact: 'Add A Contact',
    add: 'Add',
    undo: 'Undo',
    sendRequest: 'Send Request',
    requestSuccessTitle1: 'Request for',
    requestSuccessTitle2: 'was sent to',
    copyLink: 'Copy Link',
    scanQR: 'Scan QR',
    showQR: 'Show My QR',
    requesting: 'Requesting',
    editAmount: 'Edit Amount',
    enterAnAmount: 'Enter an Amount',
    enterAmount: 'Enter Amount',
    qRCopied: 'QR Detected & Copied!',
    save: 'Save',
    purchaseIn: 'Purchase in',
    joinedOn: 'Joined On',
    name: 'Name',
    ethAddress: 'ETH Address',
    help: 'Help',
    notifications: 'Notifications',
    theme: 'Theme',
    logOut: 'Log Out',
    helpTitle: 'Have a question?\nRan into an issue?\nFound a bug?',
    helpQ1: 'WhatsApp Group',
    helpA1: 'Share bugs or ask questions. Reach out out here if it’s not a private topic.',
    helpQ2: 'Private Chat',
    helpA2: 'Delicate topic you don’t want others knowing about?',
    helpQ3: 'On/Off Ramp Funds?',
    helpA3:
      'We’re in testing mode! There’s no way to add or remove funds. At the end of the trail you’ll get a message from us asking if you want to cash out.\n\nAll money on Woosh is Test Money. You’ll get a pay out in MXN at the end of testing week.',
    cancel: 'Cancel',
    sentTo: 'Sent to',
    shareTransaction: 'Share Transaction',
    viewOnBlockchain: 'View on the blockchain',
  },
  es: {
    loginTitle: 'La manera más fácil de recibir dinero de tus amigos',
    loginButton: 'Iniciar Sesión',
    send: 'Enviar',
    previousTransactionTitle1: 'Transacciones',
    previousTransactionTitle2: 'Recientes',
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
    sendSuccessDescription: 'Comparte el link para que reclamen sus fondos',
    share: 'Compartir',
    shareMessageGreeting: 'Hola',
    shareMessageText1: 'Te envie $',
    shareMessageText2:
      'usando Woosh entra a este link para descargar la app y reclamar tus fondos: ',
    welcomeScreenTitle: '¡Te enviaron fondos! ',
    welcomeScreenSubtitle: '¡Solo toma 30 segundos!',
    welcomeScreenDescription:
      'Con Woosh, envía dinero al instante y gratis a cualquier persona en el mundo y divide gastos con amigos fácilmente',
    getStarted: 'Comenzar',
    sentYou: 'te envió',
    claimIntroScreenDescription: 'Ingresa tu numero de telefono para continuar',
    next: 'Siguiente',
    enterYourPhoneNumber: 'Ingresa tu numero de telefono',
    settingUpAccountLabel: 'Creando tu cuenta',
    claimingFundsLabel: 'Reclamando tus fondos',
    onboardingTitle: 'Crea tu cuenta para reclamar tus fondos',
    setProfilePicture: 'Selecciona tu foto de perfil',
    uploadPhoto: 'Subir Foto',
    createAccountAndClaim: 'Crear cuenta y reclamar',
    welcomeClaimedTitle: 'Estos fondos ya fueron reclamados',
    noAccountButton: 'No tengo una cuenta',
    request: 'Solicitar',
    requestHeaderTitle: 'Solicitar Pago',
    perPerson: 'Por Persona',
    requestSelectContactTitle: 'Agrega contactos',
    addContact: 'Agregar Un Contacto',
    add: 'Agregar',
    undo: 'Deshacer',
    sendRequest: 'Enviar Solicitud',
    requestSuccessTitle1: 'Solicitud por',
    requestSuccessTitle2: 'fue enviada a',
    copyLink: 'Copiar Link',
    scanQR: 'Escanear QR',
    showQR: 'Mostrar Mi QR',
    requesting: 'Solicitando',
    editAmount: 'Editar Cantidad',
    enterAnAmount: 'Ingresar una Cantidad',
    enterAmount: 'Ingresa Cantidad',
    qRCopied: 'QR Detectado y Copiado!',
    save: 'Guardar',
    purchaseIn: 'Comprado en',
    joinedOn: 'Unido el',
    name: 'Nombre',
    ethAddress: 'Dirección ETH',
    help: 'Ayuda',
    notifications: 'Notificaciones',
    theme: 'Tema',
    logOut: 'Cerrar sesión',
    helpTitle: '¿Tienes alguna pregunta?\n¿Te encontraste con un problema?\n¿Encontraste un error?',
    helpQ1: 'Grupo de WhatsApp',
    helpA1: 'Comparte errores o haz preguntas. Comunícate aquí si no es un tema privado.',
    helpQ2: 'Chat privado',
    helpA2: '¿Tema delicado del que no quieres que otros se enteren?',
    helpQ3: '¿Fondos de entrada/salida?',
    helpA3:
      '¡Estamos en modo de prueba! No hay forma de agregar o quitar fondos. Al final del periodo de prueba, recibirás un mensaje nuestro preguntándote si deseas retirarlos.\n\nTodo el dinero en Woosh es dinero de prueba. Recibirás un pago en MXN al final de la semana de pruebas.',
    cancel: 'Cancelar',
    sentTo: 'Enviado a',
    shareTransaction: 'Compartir Transacción',
    viewOnBlockchain: 'Ver en la blockchain',
  },
};

const i18n = new I18n(translations);
// Set the key-value pairs for the different languages you want to support

// Set the locale information
i18n.locale = Localization.locale;
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.enableFallback = true;

export default i18n;
