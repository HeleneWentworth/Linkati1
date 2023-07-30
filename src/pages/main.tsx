import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { FaFacebook, FaTwitter, FaInstagram, FaPlus } from 'react-icons/fa';
import firebaseConfig from '../../firebaseConfig';
import styles from '../styles/main.module.css';
import ShareFacebookButtonPage from '@/components/ShareFacebookButtonPage';

// Initialize Firebase app
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const MainPage: React.FC = () => {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [additionalPictureUrl, setAdditionalPictureUrl] = useState<string | null>(null);
  const [medicalInfo, setMedicalInfo] = useState<any>(null); // Updated state for medical information
  const [users, setUsers] = useState<any[]>([]); // State for users
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [bio, setBio] = useState<string>('');
  const [socialMedia, setSocialMedia] = useState<{ [key: string]: string }>({});
  const imageInputRef = useRef<HTMLInputElement>(null);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();
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

            if (userData && userData.additionalPictureUrl) {
              setAdditionalPictureUrl(userData.additionalPictureUrl); // Set the additional picture URL from Firestore
            } else {
              console.warn('Additional picture URL not found in Firestore');
            }

            if (userData && userData.medicalInfo) {
              setMedicalInfo(userData.medicalInfo); // Set the medical information from Firestore
            } else {
              console.warn('Medical info not found in Firestore');
            }

            if (userData && userData.bio) {
              setBio(userData.bio); // Set the bio from Firestore
            } else {
              console.warn('Bio not found in Firestore');
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

    const fetchUsers = async () => {
      try {
        const usersSnapshot = await db.collection('users').get();
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
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

  const handleEditBio = () => {
    setIsEditingImage(true);
  };
  

  const handleProfileImageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      uploadImageToStorage(file, 'profile')
        .then((downloadUrl) => {
          setProfilePictureUrl(downloadUrl);
          setIsEditingImage(false);
          saveProfilePicture(downloadUrl);
        })
        .catch((error) => {
          console.error('Error uploading profile picture', error);
        });
    }
  };

  const handleAdditionalImageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      uploadImageToStorage(file, 'additional')
        .then((downloadUrl) => {
          setAdditionalPictureUrl(downloadUrl);
          saveAdditionalPicture(downloadUrl);
        })
        .catch((error) => {
          console.error('Error uploading additional picture', error);
        });
    }
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.target.value);
  };

  const saveBio = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = db.collection('users').doc(currentUser.uid);
        await userRef.update({ bio });
        setIsEditingImage(false); // Set editing mode to false
      } else {
        console.warn('Current user is not authenticated');
      }
    } catch (error) {
      console.error('Error saving bio', error);
    }
  };

  const uploadImageToStorage = (file: File, prefix: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = storage.ref();
      const imageRef = storageRef.child(`${prefix}_${Date.now()}`);
      const uploadTask = imageRef.put(file);

      uploadTask.on(
        'state_changed',
        () => {
          // Progress monitoring can be added here if needed
        },
        (error) => {
          reject(error);
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadUrl) => {
              resolve(downloadUrl);
            })
            .catch((error) => {
              reject(error);
            });
        }
      );
    });
  };

  const saveProfilePicture = async (downloadUrl: string) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = db.collection('users').doc(currentUser.uid);
        await userRef.update({ profilePictureUrl: downloadUrl });
      } else {
        console.warn('Current user is not authenticated');
      }
    } catch (error) {
      console.error('Error saving profile picture', error);
    }
  };

  const saveAdditionalPicture = async (downloadUrl: string) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = db.collection('users').doc(currentUser.uid);
        await userRef.update({ additionalPictureUrl: downloadUrl });
      } else {
        console.warn('Current user is not authenticated');
      }
    } catch (error) {
      console.error('Error saving additional picture', error);
    }
  };

  const handleEditProfileImage = () => {
    setIsEditingImage(true);
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const generateProfileUrl = (username: string) => {
    return `https://your-linkati-profile-url/${username}`;
  };

  const handleEditProfile = () => {
    router.push('/editprofile');
  };

  const handleAddSocialMedia = () => {
    router.push('/addsocialmedia');
  };

  return (
    <div className={styles.container}>
      <div className={styles['user']}>User Profile</div>

      <div className={styles['picture-container']}>
        {additionalPictureUrl && (
          <img
            src={additionalPictureUrl}
            alt="Additional Picture"
            className={styles['additional-picture']}
          />
        )}

        <div className={styles['profile-picture']}>
          {profilePictureUrl ? (
            <img
              src={profilePictureUrl}
              alt="Profile Picture"
              className={styles['profile']}
              onClick={handleEditProfileImage}
            />
          ) : (
            <div className={styles['no-picture']}>No profile picture available</div>
          )}

          {isEditingImage && (
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageInputChange}
              ref={imageInputRef}
              style={{ display: 'none' }}
            />
          )}
        </div>
      </div>

      <div className={styles['logout-button']}>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className={styles['bio-container']}>
  {isEditingImage ? (
    <>
      <h2>Bio</h2>
      <textarea
        value={bio}
        onChange={handleBioChange}
        placeholder="Enter your bio"
        className={styles['bio-input']}
      />
      <button onClick={saveBio} className={styles['save-button']}>
        Save Bio
      </button>
    </>
  ) : (
    <>
      <h2>Bio</h2>
      <p>{bio}</p>
      <button onClick={handleEditBio} className={styles['edit-button']}>
        Edit Bio
      </button>
    </>
  )}
</div>


      <div className={styles['medical-info']}>
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

        <div className={styles['medical-buttons']}>
          <button onClick={handleMedicalInfo}>View Medical Info</button>
          <button onClick={handleEditMedicalInfo}>Edit Medical Info</button>
        </div>
      </div>

      {Object.entries(socialMedia).map(([socialMediaId, username]) => (
        <div key={socialMediaId} className={styles['social-media-icon']}>
          {socialMediaId === 'facebook' && <FaFacebook />}
          {socialMediaId === 'twitter' && <FaTwitter />}
          {socialMediaId === 'instagram' && <FaInstagram />}
          <p>{username}</p>
        </div>
      ))}

      {users.length > 0 && (
        <ShareFacebookButtonPage
          userId={users[0].id}
          url={generateProfileUrl(users[0].username)}
          title={`Profile - ${users[0].name}`}
          description={`Check out ${users[0].name}'s profile on Linkati`}
          imageUrl="https://example.com/linkati-profile-image.jpg"
        />
      )}

      <div className={styles['edit-profile-button']}>
        <button onClick={handleEditProfile}>Edit Profile</button>
      </div>

      <div className={styles['add-social-media-button']}>
        <button onClick={handleAddSocialMedia}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default MainPage;
