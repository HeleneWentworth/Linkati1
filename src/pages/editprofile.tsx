import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import firebaseConfig from '../../firebaseConfig';
import styles from '../styles/main.module.css';

// Initialize Firebase app
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const EditProfile: React.FC = () => {
  const [bio, setBio] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const bioInputRef = useRef<HTMLTextAreaElement>(null);
  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const backgroundImageInputRef = useRef<HTMLInputElement>(null);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userRef = db.collection('users').doc(currentUser.uid);
          const userSnapshot = await userRef.get();

          if (userSnapshot.exists) {
            const userData = userSnapshot.data();
            if (userData && userData.bio) {
              setBio(userData.bio);
            }
            if (userData && userData.fontSize) {
              setFontSize(userData.fontSize);
            }
          } else {
            console.warn('User document does not exist in Firestore');
          }
        } else {
          console.warn('Current user is not authenticated');
        }
      } catch (error) {
        console.error('Error retrieving user profile', error);
      }
    };

    fetchUserProfile();
  }, [auth, db]);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = db.collection('users').doc(currentUser.uid);
        await userRef.update({
          bio,
          fontSize,
        });

        if (profilePicture) {
          const profilePictureUrl = await uploadImageToStorage(profilePicture, 'profile');
          await userRef.update({ profilePictureUrl });
        }

        if (backgroundImage) {
          const backgroundImageUrl = await uploadImageToStorage(backgroundImage, 'background');
          await userRef.update({ backgroundImageUrl });
        }

        setIsSaving(false);
        router.back(); // Navigate back to the previous page
      } else {
        console.warn('Current user is not authenticated');
      }
    } catch (error) {
      setIsSaving(false);
      console.error('Error saving user profile', error);
    }
  };

  const handleCancel = () => {
    router.back(); // Navigate back to the previous page
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.target.value);
  };

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(Number(event.target.value));
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePicture(event.target.files[0]);
    }
  };

  const handleBackgroundImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setBackgroundImage(event.target.files[0]);
    }
  };

  const uploadImageToStorage = async (file: File, prefix: string): Promise<string> => {
    try {
      setIsUploading(true);

      const storageRef = storage.ref();
      const imageRef = storageRef.child(`${prefix}_${Date.now()}`);
      const uploadTaskSnapshot = await imageRef.put(file);
      const downloadUrl = await uploadTaskSnapshot.ref.getDownloadURL();

      setIsUploading(false);
      return downloadUrl;
    } catch (error) {
      setIsUploading(false);
      console.error('Error uploading image to storage', error);
      throw error;
    }
  };

  return (
    <div className={styles.container}>
      <h1>Edit Profile</h1>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Bio:</label>
          <textarea
            ref={bioInputRef}
            className={styles.textarea}
            value={bio}
            onChange={handleBioChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Font Size:</label>
          <input
            type="range"
            min="12"
            max="24"
            step="2"
            value={fontSize}
            onChange={handleFontSizeChange}
          />
          <span className={styles.fontSize}>{fontSize}px</span>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Profile Picture:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            ref={profilePictureInputRef}
            className={styles.fileInput}
          />
          <button
            className={styles.uploadButton}
            onClick={() => profilePictureInputRef.current?.click()}
          >
            Upload
          </button>
          {profilePicture && <span className={styles.fileName}>{profilePicture.name}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Background Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundImageChange}
            ref={backgroundImageInputRef}
            className={styles.fileInput}
          />
          <button
            className={styles.uploadButton}
            onClick={() => backgroundImageInputRef.current?.click()}
          >
            Upload
          </button>
          {backgroundImage && <span className={styles.fileName}>{backgroundImage.name}</span>}
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton} onClick={handleCancel} disabled={isSaving}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSaveProfile} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
