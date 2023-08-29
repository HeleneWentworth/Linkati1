import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import firebaseConfig from '../../firebaseConfig';
import { useRouter } from 'next/router';
import styles from '../styles/main.module.css'; // Import the CSS module




// Initialize Firebase app
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}



const EditMedicalInfo: React.FC = () => {
  const [name, setName] = useState('');
  const [allergies, setAllergies] = useState('');
  const [bloodType, setBloodType] = useState('');

  const auth = firebase.auth();
  const db = firebase.firestore();
  const router = useRouter();

  

  const handleSave = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = db.collection('users').doc(currentUser.uid);
        await userRef.update({ 
          medicalInfo: {
            name,
            allergies,
            bloodType
          }
        });
        router.push('/medicalinfo'); // Redirect to main page after saving
      } else {
        console.warn('Current user is not authenticated');
      }
    } catch (error) {
      console.error('Error saving medical info', error);
    }
  };

  return (
    <div>
      <div className={styles.container}>
      <div className={styles.information}>Edit Medical Information</div>
      
      <div>
      <label className={styles.label}>Name:</label>
        <input value={name} className={styles.name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
      <label className={styles.label}>Allergies:</label>
        <input value={allergies} className={styles.name} onChange={(e) => setAllergies(e.target.value)} />
      </div>

      <div>
      <label className={styles.label}>Blood Type:</label>
        <input value={bloodType} className={styles.name} onChange={(e) => setBloodType(e.target.value)} />
      </div>

  
      <button onClick={handleSave} className={styles['save-button2']}>
        Save 
      </button>
    </div>
    </div>
  );
};

export default EditMedicalInfo;
