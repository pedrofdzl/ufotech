import firebase from "firebase/compat/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyASpfWmZuA8Urvv1J1J_2DPV_b0I3_-gBs",
  authDomain: "heb-route.firebaseapp.com",
  projectId: "heb-route",
  storageBucket: "heb-route.appspot.com",
  messagingSenderId: "324123502324",
  appId: "1:324123502324:web:f7990e8762882b8beca0a1"
};

export const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);