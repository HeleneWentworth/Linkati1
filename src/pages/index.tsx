import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/index.module.css'; // Import the CSS module

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

      <div className={styles.buttons}>
        <Link href="/signup" passHref>
          <button className={styles.button}>Sign Up</button>
        </Link>
        <Link href="/login" passHref>
          <button className={styles.button}>Log In</button>
        </Link>
        <button className={styles.button} onClick={handleGoogleSignIn}>Sign Up with Google</button>
        <button className={styles.button} onClick={handleAppleSignIn}>Sign Up with Apple</button>
      </div>
    </div>
  );
};

export default IndexPage;
