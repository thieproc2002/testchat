import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyDgKK4oyz2iArZvqJFCXb2R7ffdeY1oNOs",
  authDomain: "zalo-46e97.firebaseapp.com",
  databaseURL: "https://zalo-46e97-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zalo-46e97",
  storageBucket: "zalo-46e97.appspot.com",
  messagingSenderId: "659411315708",
  appId: "1:659411315708:web:7d5c4e9e437dd03fc76079",
  measurementId: "G-3GH10DQ7H5"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}
