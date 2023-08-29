import React, { useState } from 'react';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../../firebaseConfig';
import styles from '../styles/main.module.css'
import Link from 'next/link';
import SignUpPage from './signup';

// Initialize Firebase app
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      // User is now logged in
      router.push('/main'); // Redirect to main page
    } catch (error) {
      setError('Invalid email or password');
      console.error('Error logging in', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.back}>Welcome Back!</div>
      <form onSubmit={handleLogin}>
        <div>
          <label className={styles.label}>
            Email:
            <input
              type="email" className={styles.emails}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
        {error && <div>{error}</div>}
        <button type="submit" className={styles.submit} >Login</button>
      </form>
      <Link href="/forgotPassword" passHref>
  <button className={styles.terms}><u>Forgot your password?</u></button>
</Link>

        <Link href="signup" passHref>
          <button className={styles.terms2}><u>Register a new user?</u></button>
        </Link>
    </div>
  );
};

export default Login;
