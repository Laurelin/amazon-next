import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: 'next-ead37.firebaseapp.com',
  projectId: 'next-ead37',
  storageBucket: 'next-ead37.appspot.com',
  messagingSenderId: '212552788913',
  appId: '1:212552788913:web:a09f428aa61a54ee5a6b90',
  measurementId: 'G-EXC6L8YYBC'
};

const app = !Firebase.apps.length ? Firebase.initializeApp(firebaseConfig) : Firebase.app();
const db = app.firestore();
export default db;
