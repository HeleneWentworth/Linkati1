import React, { useState } from 'react';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import styles from '../styles/main.module.css';
import Link from 'next/link';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      setMessage('Check your inbox for further instructions');
    } catch (error) {
      setError('Error resetting password');
      console.error('Error sending password reset email', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backs}>Reset Your Password</div>
      <form onSubmit={handleResetPassword}>
        <div>
          <label className={styles.label}>
            Email:
            <input
              type="email"
              className={styles.emails}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        {message && <div>{message}</div>}
        {error && <div>{error}</div>}
        <button type="submit" className={styles.submit}>
          Send Password Reset Email
        </button>
      </form>
      <Link href="/login" passHref>
        <button className={styles.terms}><u>Back to Login</u></button>
      </Link>
    </div>
  );
};

export default ForgotPassword;
