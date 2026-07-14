import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC9ocROMUMbLfz-bU0ZhhR7-WSJzu2rpr0",
  authDomain: "project-14720b5d-48da-442a-b1c.firebaseapp.com",
  projectId: "project-14720b5d-48da-442a-b1c",
  storageBucket: "project-14720b5d-48da-442a-b1c.firebasestorage.app",
  messagingSenderId: "563992701301",
  appId: "1:563992701301:web:bda5eb7ddd4ddbec838b3c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-magashopsouvenir-98c625bb-810b-4630-8978-937ac8b1acf9");
export const storage = getStorage(app);
