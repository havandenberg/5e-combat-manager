/* eslint-disable */
import firebase from 'firebase';

try {
  const config = {
    apiKey: 'AIzaSyAOyBEc5oCGY2Sh2fOBBbXVTQo1AEbhQ_0',
    authDomain: 'ecombatmanager-7896c.firebaseapp.com',
    databaseURL: 'https://ecombatmanager-7896c.firebaseio.com',
    storageBucket: 'ecombatmanager-7896c.appspot.com',
    messagingSenderId: '813490613492'
  };

  firebase.initializeApp(config);
} catch (e) {
  console.log('Firebase connection failed');
}

export const firebaseRef = firebase.database().ref();
export default firebase;
