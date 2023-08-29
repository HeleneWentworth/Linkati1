import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import 'firebase/auth';
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

const IndexPage = () => {
  const router = useRouter();
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
      // Redirect the user to the main page after successful sign-in
      router.push('/main');
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      // Check if there's already an authentication popup in progress
      if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        // Wait for the previous popup to complete before proceeding
        await firebase.auth().signInWithEmailLink(window.location.href);
        router.push('/main');
      } else {
        const provider = new firebase.auth.OAuthProvider('apple.com');
        await firebase.auth().signInWithPopup(provider);
        router.push('/main');
      }
    } catch (error) {
      const authError = error as firebase.auth.Error; // Cast the error to the correct type
  
      if (authError.code === 'auth/cancelled-popup-request') {
        // Handle cancellation here
        console.log('Popup was cancelled by the user.');
      } else {
        console.error('Error signing in with Apple', authError);
      }
    }
  };
  
  

  return (
    <div className={styles.container}>
      <div className='background'></div>
      <div className={styles.welcome}>Welcome to Linkati</div>
      <div className={styles.gif}></div>
      <div className={styles.buttoncontain}>
        <Link href="/login" passHref>
          <button className={styles.buttonL}>Log In</button>
        </Link>
        <Link href="/signup" passHref>
          <button className={styles.buttonS}>Sign Up</button>
        </Link>
        <button className={styles.buttonG} onClick={handleGoogleSignIn}>Sign Up with Google</button>
        <button className={styles.buttonA} onClick={handleAppleSignIn}>Sign Up with Apple</button>
      </div>
      <Link href="" passHref>
        <button className={styles.terms}><u>Terms & Conditions</u></button>
      </Link>
    </div>
  );
};

export default IndexPage;
