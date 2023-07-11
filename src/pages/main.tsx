import React from 'react';
import firebase from '../../firebaseConfig';

const MainPage: React.FC = () => {
  // Retrieve user details from Firebase and display them
  const user = firebase.auth().currentUser;

  return (
    <div>
      <h1>Main Page</h1>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}!</p>
          {/* Display additional user details */}
        </div>
      ) : (
        <p>Please sign in to view this page.</p>
      )}
    </div>
  );
};

export default MainPage;
