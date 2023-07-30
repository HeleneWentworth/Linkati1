import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

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
      <h1>Add Your Social Media</h1>
      <div>
        <label htmlFor="socialMedia">Social Media:</label>
        <select
          id="socialMedia"
          value={selectedSocialMedia}
          onChange={(e) => setSelectedSocialMedia(e.target.value)}
        >
          <option value="">Select Social Media</option>
          {socialMediaOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default AddSocialMediaPage;
