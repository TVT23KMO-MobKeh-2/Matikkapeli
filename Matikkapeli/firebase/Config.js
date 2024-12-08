import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, where, query, doc, deleteDoc } from "firebase/firestore";
import ENV from "../env";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: ENV.FIREBASE_API_KEY,
    authDomain: ENV.FIREBASE_AUTH_DOMAIN,
    projectId: ENV.FIREBASE_PROJECT_ID,
    storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
    appId: ENV.FIREBASE_APP_ID
  };

  const app = initializeApp(firebaseConfig)

  const firestore = getFirestore()

  const PLAYERSTATS = 'playerstats'
  const PLAYERSETTINGS = 'playersettings';

  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });

  export {
    firestore,
    collection,
    addDoc,
    PLAYERSTATS,
    PLAYERSETTINGS,
    where,
    query,
    getDocs,
    updateDoc,
    doc,
    deleteDoc,
    auth
  }
