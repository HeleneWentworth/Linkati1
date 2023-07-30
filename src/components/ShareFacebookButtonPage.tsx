// import React from 'react';
// import Head from 'next/head';
// import { useRouter } from 'next/router';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import firebaseConfig from '../../firebaseConfig';

// // Initialize Firebase app
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// interface ShareFacebookButtonPageProps {
//   userId: string;
//   url: string;
//   title: string;
//   description: string;
//   imageUrl: string;
// }

// const ShareFacebookButtonPage: React.FC<ShareFacebookButtonPageProps> = ({
//   userId,
//   url,
//   title,
//   description,
//   imageUrl,
// }) => {
//   const auth = firebase.auth();
//   const router = useRouter();

//   const handleShare = () => {
//     auth.signInAnonymously() // Sign in anonymously to obtain an access token
//       .then(() => {
//         const currentUser = auth.currentUser;
//         if (currentUser) {
//           currentUser.getIdToken() // Get the user's access token
//             .then((accessToken) => {
//               const apiEndpoint = `https://graph.facebook.com/${userId}/feed`; // API endpoint for posting to the user's feed
//               const message = `${title}\n\n${description}\n\n${url}`; // Message to be posted

//               fetch(apiEndpoint, {
//                 method: 'POST',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   message,
//                   access_token: accessToken,
//                 }),
//               })
//                 .then((response) => {
//                   if (response.ok) {
//                     console.log('Shared successfully');
//                     router.push('/success'); // Redirect to success page after successful share
//                   } else {
//                     console.error('Error sharing to Facebook:', response);
//                   }
//                 })
//                 .catch((error) => {
//                   console.error('Error sharing to Facebook:', error);
//                 });
//             })
//             .catch((error) => {
//               console.error('Error getting user access token:', error);
//             });
//         }
//       })
//       .catch((error) => {
//         console.error('Error signing in anonymously:', error);
//       });
//   };

//   return (
//     <>
//       <Head>
//         <script async defer src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v11.0" nonce="X5JW23s6"></script>
//       </Head>
//       <button onClick={handleShare}>Share to Facebook</button>
//     </>
//   );
// };

// export default ShareFacebookButtonPage;


import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../../firebaseConfig';
import FacebookLogin, { ReactFacebookLoginInfo } from 'react-facebook-login';

interface ShareFacebookButtonPageProps {
  userId: string;
  url: string;
  title: string;
  description: string;
  imageUrl: string;
}

const ShareFacebookButtonPage: React.FC<ShareFacebookButtonPageProps> = ({
  userId,
  url,
  title,
  description,
  imageUrl,
}) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle the login status change
  const statusChangeCallback = (response: any) => {
    if (response.status === 'connected') {
      console.log('User is logged in and authenticated.');
      // You can do additional actions when the user is logged in and authenticated
    } else if (response.status === 'not_authorized') {
      console.log('User is logged in but not authorized.');
    } else {
      console.log('User is not logged into Facebook.');
    }
  };

  // Function to share the content to Facebook
  const shareToFacebook = async (accessToken: string | Promise<string> | undefined) => {
    if (!accessToken) {
      console.log('Access token is undefined or empty.');
      return;
    }
  
    try {
      // If the accessToken is a promise, await it to get the actual string value
      if (accessToken instanceof Promise) {
        accessToken = await accessToken;
      }
  
      // Use the accessToken to share to Facebook
      // ... (rest of the function remains unchanged)
    } catch (error) {
      console.error('Error sharing to Facebook:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Load the Facebook SDK asynchronously
    if (window.FB) {
      window.FB.init({
        appId: '832982661763892', // Replace with your actual Facebook App ID
        cookie: true,
        xfbml: true,
        version: 'v11.0',
      });

      window.FB.AppEvents.logPageView();

      // Check the user's login status and call statusChangeCallback
      window.FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
      });
    }
  }, []);

  // Function to check the login state when the Facebook login button is clicked
  const checkLoginState = () => {
    if (window.FB) {
      window.FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
      });
    }
  };

  // Create a string containing the fb:login-button HTML code
  const fbLoginButtonHTML = `
    <fb:login-button 
      scope="public_profile,email"
      onlogin="checkLoginState();">
    </fb:login-button>
  `;

  return (
    <>
      <Head>
        {/* Add the Facebook SDK script directly within the component */}
        <script async defer src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v11.0" nonce="X5JW23s6"></script>
      </Head>
      {isLoggedIn ? (
        <button onClick={() => shareToFacebook(firebase.auth().currentUser?.getIdToken())}>
          Share to Facebook
        </button>
      ) : (
        <div
          className="facebook-login-button"
          dangerouslySetInnerHTML={{ __html: fbLoginButtonHTML }}
        />
      )}
    </>
  );
};

export default ShareFacebookButtonPage;
