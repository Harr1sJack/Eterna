import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBuKjIt5YFc81u6OESUAtwZ0cAxSluJilg",
    authDomain: "eterna-marketplace.firebaseapp.com",
    projectId: "eterna-marketplace",
    storageBucket: "eterna-marketplace.firebasestorage.app",
    messagingSenderId: "336953358347",
    appId: "1:336953358347:web:aff8b786057d7a8d406f0e",
    measurementId: "G-SNGGL97QZR"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);

export default app;