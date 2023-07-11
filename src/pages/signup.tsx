import React, { useState } from 'react';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyCUGJqRt3qXZB9HgLfMgB_cvtMGzuT9Tvo",
  authDomain: "linkati1.firebaseapp.com",
  projectId: "linkati1",
  storageBucket: "linkati1.appspot.com",
  messagingSenderId: "72897008862",
  appId: "1:72897008862:web:31773705db7fff670a5e4f",
  measurementId: "G-4T0Y90X9BZ"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const SignUpPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const router = useRouter();

  const handleEmailPasswordSignUp = async () => {
    try {
      const db = firebase.firestore();
      const auth = firebase.auth();
      const storage = firebase.storage();

      // Create the user with email and password
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (userCredential.user) {
        // Get the newly created user's UID
        const userId = userCredential.user.uid;

        // Upload the profile picture to Firebase Storage
        if (profilePicture) {
          const storageRef = storage.ref();
          const profilePictureRef = storageRef.child(`profilePictures/${userId}`);
          await profilePictureRef.put(profilePicture);
          const profilePictureUrl = await profilePictureRef.getDownloadURL();

          // Set the user data in the "users" collection using the user's UID as the document ID
          await db.collection('users').doc(userId).set({
            firstName,
            lastName,
            email,
            phoneNumber,
            profilePictureUrl,
          });

          console.log('Registration details saved to Firestore');

          // Redirect the user to the main page
          router.push('/main');
        }
      }
    } catch (error) {
      console.error('Error saving registration details to Firestore', error);
    }
  };

  const handleSignUp = (event: React.FormEvent) => {
    event.preventDefault();
    handleEmailPasswordSignUp();
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setProfilePicture(file);
    }
  };

  return (
    <div>
      <h1>Sign Up Page</h1>
      <form onSubmit={handleSignUp}>
        <div>
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Phone Number:
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Profile Picture:
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
          </label>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;
