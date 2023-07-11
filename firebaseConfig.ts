// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';

// const firebaseConfig = {
//     apiKey: "AIzaSyCUGJqRt3qXZB9HgLfMgB_cvtMGzuT9Tvo",
//   authDomain: "linkati1.firebaseapp.com",
//   projectId: "linkati1",
//   storageBucket: "linkati1.appspot.com",
//   messagingSenderId: "72897008862",
//   appId: "1:72897008862:web:31773705db7fff670a5e4f",
//   measurementId: "G-4T0Y90X9BZ"
// };

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// export default firebase;

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCUGJqRt3qXZB9HgLfMgB_cvtMGzuT9Tvo",
    authDomain: "linkati1.firebaseapp.com",
    projectId: "linkati1",
    storageBucket: "linkati1.appspot.com",
    messagingSenderId: "72897008862",
    appId: "1:72897008862:web:31773705db7fff670a5e4f",
    measurementId: "G-4T0Y90X9BZ"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
