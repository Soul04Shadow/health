import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
   apiKey: "AIzaSyBvhpLpdQZ5jh9HcmXl_MS60PGmP715Res",
  authDomain: "healthbridge-5dee8.firebaseapp.com",
  projectId: "healthbridge-5dee8",
  storageBucket: "healthbridge-5dee8.firebasestorage.app",
  messagingSenderId: "191206764523",
  appId: "1:191206764523:web:a4933d6c280c35424133ae",
  measurementId: "G-L0YHG74H0D"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
