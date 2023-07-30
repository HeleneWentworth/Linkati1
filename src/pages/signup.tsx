    // Import necessary modules
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import styles from '../styles/main.module.css'; // Import the CSS module

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUGJqRt3qXZB9HgLfMgB_cvtMGzuT9Tvo",
  authDomain: "linkati1.firebaseapp.com",
  projectId: "linkati1",
  storageBucket: "linkati1.appspot.com",
  messagingSenderId: "72897008862",
  appId: "1:72897008862:web:31773705db7fff670a5e4f",
  measurementId: "G-4T0Y90X9BZ",
    googleWebClientId:"72897008862-k2n3g1ik476s1j88db9vrb78udbed7re.apps.googleusercontent.com"

};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Add the type declaration for 'AppleID'
declare global {
  interface Window {
    AppleID: any;
  }
}

// Create a Firestore reference
const db = firebase.firestore();

const SignUpPage: React.FC = () => {
  // State variables for form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const router = useRouter();

  // Function to handle email and password sign-up
  const handleEmailPasswordSignUp = async () => {
    try {
      // Get the authentication and storage instances
      const auth = firebase.auth();
      const storage = firebase.storage();

      // Create the user with email and password
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);

      if (userCredential.user) {
        // Get the newly created user's UID
        const userId = userCredential.user.uid;

        // Upload the profile picture to Firebase Storage
        if (profilePicture) {
          const storageRef = storage.ref();
          const profilePictureRef = storageRef.child(`profilePictures/${userId}`);
          await profilePictureRef.put(profilePicture);
          const profilePictureUrl = await profilePictureRef.getDownloadURL();

          // Set the user data in the "users" collection using the user's UID as the document ID
          await db.collection('users').doc(userId).set({
            firstName,
            lastName,
            email,
            phoneNumber,
            profilePictureUrl,
          });

          console.log('Registration details saved to Firestore');

          // Redirect the user to the main page
          router.push('/main');
        }
      }
    } catch (error) {
      console.error('Error saving registration details to Firestore', error);
    }
  };

  // Function to handle Google sign-up
  const handleGoogleSignUp = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCredential = await firebase.auth().signInWithPopup(provider);

      if (userCredential.user) {
        const user = userCredential.user;

        // Set the user data in the "users" collection using the user's UID as the document ID
        await db.collection('users').doc(user.uid).set({
          firstName: user.displayName,
          email: user.email,
          profilePictureUrl: user.photoURL,
        });

        console.log('Google registration details saved to Firestore');

        // Redirect the user to the main page
        router.push('/main');
      }
    } catch (error) {
      console.error('Error signing up with Google', error);
    }
  };

  // Function to handle Apple sign-up
  const handleAppleSignUp = async () => {
    try {
      // Initialize Apple Sign-In
      const { AppleID } = window;
      const appleSignInRequest = {
        requestedScopes: [AppleID.Scope.EMAIL, AppleID.Scope.FULL_NAME],
      };
      const appleCredential = await AppleID.auth.signIn(appleSignInRequest);

      // Use the obtained credential to sign in with Firebase Auth
      const provider = new firebase.auth.OAuthProvider('apple.com');
      provider.setCustomParameters({
        id_token: appleCredential.identityToken, // Set the idToken in the provider
      });
      const userCredential = await firebase.auth().signInWithPopup(provider);

      if (userCredential.user) {
        const user = userCredential.user;

        // Set the user data in the "users" collection using the user's UID as the document ID
        await db.collection('users').doc(user.uid).set({
          firstName: user.displayName,
          email: user.email,
          profilePictureUrl: user.photoURL,
        });

        console.log('Apple registration details saved to Firestore');

        // Redirect the user to the main page
        router.push('/main');
      }
    } catch (error) {
      console.error('Error signing up with Apple', error);
    }
  };

  // Function to handle form submission
  const handleSignUp = (event: React.FormEvent) => {
    event.preventDefault();
    handleEmailPasswordSignUp();
  };

  // Function to handle profile picture selection
  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setProfilePicture(file);
    }
  };

  // Load Apple Sign-In script when component mounts
  useEffect(() => {
    // Load Apple Sign-In script
    const { AppleID } = window;
    if (AppleID) {
      AppleID.auth.init({
        clientId: 'linkati-f318a', // Your Apple Sign-In client ID
      });
    }
  }, []);

  // JSX for the sign-up form
  return (
    <div className={styles.container}>
      <div className={styles.register}>Register</div>
      <form onSubmit={handleSignUp}>
        <div>
          <label className={styles.label}>
            First Name:
            <input
              type="text" className={styles.name} value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
          </label>
        </div>
        <div>
          <label className={styles.label}>
            Last Name:
            <input
              type="text" className={styles.lastname}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label className={styles.label}>
          Email Address:<input type="email" className={styles.emails} value={email} onChange={(e) => setEmail(e.target.value)}/>
          </label>
        </div>
        <div>
          <label className={styles.label}>
            Password:
            <input
              type="password" className={styles.passwords}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label className={styles.label}>
            Phone Number:
            <input
              type="text" className={styles.number}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label className={styles.label}>
            Profile Picture:
            <input
              type="file"
              className={styles.picture}
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
          </label>
        </div>
        <button className={styles.submit} type="submit">
          Sign Up
        </button>
      </form>

     
    </div>
  );
};

export default SignUpPage;
