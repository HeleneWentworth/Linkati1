import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import styles from '../styles/main.module.css'

const socialMediaOptions = [
  { id: 'facebook', name: 'Facebook', icon: FaFacebook },
  { id: 'twitter', name: 'Twitter', icon: FaTwitter },
  { id: 'instagram', name: 'Instagram', icon: FaInstagram },
  // Add more social media options here
];

const AddSocialMediaPage: React.FC = () => {
  const router = useRouter();
  const [selectedSocialMedia, setSelectedSocialMedia] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  const handleSave = () => {
    // Save the selected social media and username in a persistent storage or database
    // Here, we can assume that the data is saved successfully

    // Redirect the user back to the main page
    router.push('/main');
  };

  const handleCancel = () => {
    // Redirect the user back to the main page
    router.push('/main');
  };

  return (
    <div>
       <div className={styles.container}>
       <div className={styles.add}>Add Your Social Media</div>
      <div>
        <label className={styles.label} htmlFor="socialMedia">Social Media:</label>
        <select className={styles.socialMediaForm__dropdown}
          id="socialMedia"
          value={selectedSocialMedia}
          onChange={(e) => setSelectedSocialMedia(e.target.value)}
        >
          <option value="">Select</option>
          {socialMediaOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={styles.labeluser} htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          className={styles.username1}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>

        <button className={styles.buttonSave} onClick={handleSave}>Save</button>
        <button className={styles.buttonCancel} onClick={handleCancel}>Cancel</button>
      </div>
    </div>
    </div>
  );
};

export default AddSocialMediaPage;
