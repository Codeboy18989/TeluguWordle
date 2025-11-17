/**
 * firebase-config.js
 * Firebase configuration and initialization for Telugu Wordle
 */

// Firebase configuration
// REPLACE THESE WITH YOUR ACTUAL FIREBASE PROJECT CREDENTIALS
// Get these from: Firebase Console > Project Settings > Your apps > Web app
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app, db;

try {
    // Initialize Firebase App
    app = firebase.initializeApp(firebaseConfig);

    // Initialize Firestore
    db = firebase.firestore();

    console.log('✅ Firebase initialized successfully');

    // Enable offline persistence for better performance
    db.enablePersistence({ synchronizeTabs: true })
        .then(() => {
            console.log('✅ Firestore offline persistence enabled');
        })
        .catch((err) => {
            if (err.code === 'failed-precondition') {
                console.warn('⚠️ Persistence failed: Multiple tabs open');
            } else if (err.code === 'unimplemented') {
                console.warn('⚠️ Persistence not available in this browser');
            }
        });
} catch (error) {
    console.error('❌ Firebase initialization failed:', error);
}

// Export Firebase instances
const FirebaseDB = {
    db: db,
    app: app,

    // Collection references
    collections: {
        words: () => db ? db.collection('words') : null,
        dailyWords: () => db ? db.collection('dailyWords') : null,
        stats: () => db ? db.collection('stats') : null
    },

    // Check if Firebase is initialized
    isInitialized: () => {
        return db !== null && db !== undefined;
    }
};

// Make available globally
window.FirebaseDB = FirebaseDB;
