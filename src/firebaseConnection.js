import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';



var firebaseConfig = {
    apiKey: "AIzaSyD_VNcnze3pUv4mt1Qs4w3-jr9AivN3eD0",
    authDomain: "curso-613b9.firebaseapp.com",
    projectId: "curso-613b9",
    storageBucket: "curso-613b9.appspot.com",
    messagingSenderId: "943547880938",
    appId: "1:943547880938:web:add854f5d8617ad61b4e93",
    measurementId: "G-F49BJW4DZY"
  };


if(!firebase.apps.length){ 
  firebase.initializeApp(firebaseConfig);
}

export default firebase; 