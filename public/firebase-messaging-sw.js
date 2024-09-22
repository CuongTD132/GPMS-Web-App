// This sample application is using 9.22, make sure you are importing the same version

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getMessaging } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-sw.js';

const firebaseApp = initializeApp({
    projectId: 'gpms-9bf3e',
    appId: '1:552692924572:web:5b051a734e7e2dd41d6d59',
    storageBucket: 'gpms-9bf3e.appspot.com',
    // locationId: 'us-central',
    apiKey: 'AIzaSyAKEPcAovTGKGyLYt4IiWgtK2ePZV7VJJ0',
    authDomain: 'gpms-9bf3e.firebaseapp.com',
    messagingSenderId: '552692924572',
});

const messaging = getMessaging(firebaseApp);
