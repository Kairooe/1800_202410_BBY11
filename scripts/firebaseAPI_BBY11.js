//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyBJ6t-FVP_xmFzAsTIZU4D1p0hiD9Vj4io",
    authDomain: "bby11-a692f.firebaseapp.com",
    projectId: "bby11-a692f",
    storageBucket: "bby11-a692f.appspot.com",
    messagingSenderId: "72066814548",
    appId: "1:72066814548:web:bd76ff6e12cd41aafcd3c1",
    measurementId: "G-4KLDBW4MCH"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
