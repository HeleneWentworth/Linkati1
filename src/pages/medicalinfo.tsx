import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import styles from '../styles/main.module.css';
import { useRouter } from 'next/router'; // Import useRouter for navigation

const MedicalInfo: React.FC = () => {
  const [medicalInfo, setMedicalInfo] = useState<any>(null);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const router = useRouter(); // Use the router for navigation

  useEffect(() => {
    const fetchMedicalInfo = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = db.collection('users').doc(currentUser.uid);
        const userSnapshot = await userRef.get();
        if (userSnapshot.exists) {
          const userData = userSnapshot.data();
          if (userData && userData.medicalInfo) {
            setMedicalInfo(userData.medicalInfo);
          }
        }
      }
    };
    fetchMedicalInfo();
  }, [auth, db]);

  const handleEditMedicalInfo = () => {
    router.push('/editmedicalinfo'); // Redirect to edit medical info page
  };

  const handleGoBack = () => {
    router.push('/main');
  };
  

  return (
    <div className={styles.container}>
      <div className={styles['med-head']}> Medical Info</div>
      {medicalInfo ? (
        <div>
          <p className={styles['allergies']}>Allergies: {medicalInfo.allergies}</p>
          <p className={styles['blood']}>Blood Type: {medicalInfo.bloodType}</p>
        </div>
      ) : (
        <div className={styles['no-info']}>No medical information available</div>
      )}
      <button className={styles.editMed} onClick={handleEditMedicalInfo}>Edit Medical Info</button>

      <button className={styles.backBut} onClick={handleGoBack}>Back</button>

    </div>
  );
};





export default MedicalInfo;
