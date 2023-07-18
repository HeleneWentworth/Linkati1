import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/main.module.css'; // Import the CSS module

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

  const handleGoogleSignIn = () => {
    // Implement Google sign-in logic
    console.log('Signing in with Google');
  };

  const handleAppleSignIn = () => {
    // Implement Apple sign-in logic
    console.log('Signing in with Apple');
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