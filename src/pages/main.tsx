import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from '../../firebaseConfig';
import styles from '../styles/main.module.css';


// Initialize Firebase app
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const MainPage: React.FC = () => {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [medicalInfo, setMedicalInfo] = useState<any>(null); // Updated state for medical information
  const auth = firebase.auth();
  const db = firebase.firestore();
  const router = useRouter();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userRef = db.collection('users').doc(currentUser.uid);
          const userSnapshot = await userRef.get();

          if (userSnapshot.exists) {
            const userData = userSnapshot.data();
            if (userData && userData.profilePictureUrl) {
              setProfilePictureUrl(userData.profilePictureUrl);
            } else {
              console.warn('Profile picture URL not found in Firestore');
            }

            if (userData && userData.medicalInfo) {
              setMedicalInfo(userData.medicalInfo); // Set the medical information from Firestore
            } else {
              console.warn('Medical info not found in Firestore');
            }
          } else {
            console.warn('User document does not exist in Firestore');
          }
        } else {
          console.warn('Current user is not authenticated');
        }
      } catch (error) {
        console.error('Error retrieving profile picture URL', error);
      }
    };

    fetchProfilePicture();
  }, [auth, db]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  const handleMedicalInfo = () => {
    router.push('/medicalinfo'); // Redirect to medical info page
  };

  const handleEditMedicalInfo = () => {
    router.push('/editmedicalinfo'); // Redirect to edit medical info page
  };

  return (
    <div className={styles.container}>
        <div className={styles.user}>User Profile</div>
       
      <div className="profile-picture">
        <h2>Profile Picture</h2>
        <div className={styles.profilecontainer}>
        {profilePictureUrl ? (
          <img src={profilePictureUrl} alt="Profile Picture" className={styles.profile} />
        ) : (
          <div>No profile picture available</div>
        )}
      </div>
      </div>
      <div className="logout-button">
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="medical-info">
        <h2>Medical Info</h2>
        {medicalInfo ? (
          <div>
            <p>Name: {medicalInfo.name}</p>
            <p>Allergies: {medicalInfo.allergies}</p>
            <p>Blood Type: {medicalInfo.bloodType}</p>
          </div>
        ) : (
          <div>No medical information available</div>
        )}
      </div>
      <div className="edit-medical-info">
  <button className={`${styles['blood-drop']} ${styles['bigger-icon']}`} onClick={handleMedicalInfo}>
    <i className={`material-icons ${styles['bigger-icon']}`}></i>
  </button>
</div>
      </div>
  
  );
};

export default MainPage;
