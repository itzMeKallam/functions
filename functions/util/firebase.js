const firebase = require('firebase')
const admin = require('firebase-admin')
const db = admin.firestore()

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcXt3C2pYygWFCvlVVG9yA5tnGV-IQBGU",
  authDomain: "learning-6922e.firebaseapp.com",
  projectId: "learning-6922e",
  storageBucket: "learning-6922e.appspot.com",
  messagingSenderId: "613846024440",
  appId: "1:613846024440:web:5b62ac5cbbeca201663b0d",
  measurementId: "G-HBY3V26QEE"
};

  firebase.initializeApp(firebaseConfig)


module.exports = {firebase, db, firebaseConfig, admin}