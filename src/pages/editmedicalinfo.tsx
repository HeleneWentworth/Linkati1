import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from '../../firebaseConfig';

// Initialize Firebase app
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const EditMedicalInfoPage: React.FC = () => {
  const [medicalInfo, setMedicalInfo] = useState({
    name: '',
    allergies: '',
    bloodType: '',
  });
  const auth = firebase.auth();
  const db = firebase.firestore();
  const router = useRouter();

  useEffect(() => {
    const fetchMedicalInfo = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userRef = db.collection('users').doc(currentUser.uid);
          const userSnapshot = await userRef.get();

          if (userSnapshot.exists) {
            const userData = userSnapshot.data();
            if (userData && userData.medicalInfo) {
              setMedicalInfo(userData.medicalInfo);
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
        console.error('Error retrieving medical info from Firestore', error);
      }
    };

    fetchMedicalInfo();
  }, [auth, db]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMedicalInfo((prevMedicalInfo) => ({
      ...prevMedicalInfo,
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

        console.log('Medical info updated in Firestore');
        router.push('/main'); // Redirect to the main page after updating
      } else {
        console.warn('Current user is not authenticated');
      }
    } catch (error) {
      console.error('Error updating medical info in Firestore', error);
    }
  };

  return (
    <div>
      <h1>Edit Medical Info</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={medicalInfo.name}
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
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditMedicalInfoPage;
