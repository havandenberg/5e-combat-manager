/* eslint-disable */
import firebase from 'firebase';

try {
  const config = {
    apiKey: 'AIzaSyAXuL1_Asb5v1ekKzHrRv6EOJfvaxra8IM',
    authDomain: 'combat-manager-dev.firebaseapp.com',
    databaseURL: 'https://combat-manager-dev.firebaseio.com',
    storageBucket: 'combat-manager-dev.appspot.com',
    messagingSenderId: '920846101857'
  };

  firebase.initializeApp(config);
} catch (e) {
  console.log('Firebase connection failed');
}

export const firebaseRef = firebase.database().ref();
export default firebase;
