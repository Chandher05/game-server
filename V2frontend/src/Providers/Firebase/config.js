// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut
} from "firebase/auth";

import { useAuthState } from 'react-firebase-hooks/auth';
import { showNotification } from '@mantine/notifications';

let authTimeout; // Global variable for Auth - access token timeout
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_FIREBASE,
  authDomain: import.meta.env.VITE_API_FIREBASE_PROJECT_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_API_FIREBASE,
  appId: import.meta.env.VITE_API_FIREBASE_PROJECT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();

const auth = getAuth(app);

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    console.log('Calling POST on Login')
    await user.getIdToken().then(function (idToken) {  // <------ Check this line

      // refeshToken();
      fetch(`${import.meta.env.VITE_API}/users/login`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        method: 'POST',
      }).then(async (response) => {
        if (response.ok) {
          return user;
        } else {
          throw await response.json()
        }
      }).catch((error) => {
        signOut(auth);
        showNotification({
          variant: 'outline',
          color: 'red',
          title: 'Something went wrong!',
          message: error.msg
        })
      })
    });
    
  } catch (err) {
    signOut(auth);
    showNotification({
      variant: 'outline',
      color: 'red',
      title: 'Something went wrong!',
      message: error.msg
    })
  }
  return null;
};

const logout = () => {
  clearTimeout(authTimeout);
  sessionStorage.removeItem('access_token')
  signOut(auth);

};

const getIdTokenOfUser = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken()
  }
  else {
    err("User not available")
  }
}


// async function refeshToken() {
//   const user = auth.currentUser;
//   if (user) {
//     const idToken = await user.getIdToken(true);
//     console.log('IdTokem from Refresh Token', idToken)
//     sessionStorage.setItem("access_token", idToken)
//     authTimeout = setTimeout(() => {
//       refeshToken();
//     }, 3480000); //58 min - refresh token 
//   }
// }



export {
  auth,
  useAuthState,
  signInWithGoogle,
  logout,
  getIdTokenOfUser
};