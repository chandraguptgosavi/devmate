import { initializeApp } from "firebase/app";

function initializeFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyCUnt2S7oavErGZE54HXINxdxNOE7pneOU",
    authDomain: "devmate-ab0b3.firebaseapp.com",
    projectId: "devmate-ab0b3",
    storageBucket: "devmate-ab0b3.appspot.com",
    messagingSenderId: "346054117466",
    appId: "1:346054117466:web:8590899a145933a15d3063",
  };
  initializeApp(firebaseConfig);
}

export default initializeFirebase;
