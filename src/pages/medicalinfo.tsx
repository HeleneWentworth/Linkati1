import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from '../../firebaseConfig';
import { useRouter } from 'next/router';

// Initialize Firebase app
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const MedicalInfo: React.FC = () => {
  const [medicalInfo, setMedicalInfo] = useState({
    name: '',
    age: '',
    condition: '',
    allergies: '',
    bloodType: '',
  });

  const auth = firebase.auth();
  const db = firebase.firestore();
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMedicalInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = db.collection('users').doc(currentUser.uid);

        await userRef.update({
          medicalInfo: medicalInfo,
        });

        console.log('Medical info saved to Firestore');
        router.push('/main'); // Redirect to the main page
      } else {
        console.warn('Current user is not authenticated');
      }
    } catch (error) {
      console.error('Error saving medical info to Firestore', error);
    }
  };

  return (
    <div>
      <h1>Medical Info Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
         
        </div>
        <div>
          
        </div>
        <div>
          <label>
            Condition:
            <input
              type="text"
              name="condition"
              value={medicalInfo.condition}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Allergies:
            <input
              type="text"
              name="allergies"
              value={medicalInfo.allergies}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Blood Type:
            <input
              type="text"
              name="bloodType"
              value={medicalInfo.bloodType}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default MedicalInfo;
