import React, { useEffect, useState } from "react";
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate
} from "react-router-dom";
import { auth } from "./Firebase/config";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useStoreActions } from 'easy-peasy';

import Home from "../Pages/Home/Home";
import GoogleLogin from "../Pages/Login/Login";

function PageRoutes() {
	const [authenticated, setAuth] = useState(false);
	const handleAuth = (value) => {
		setAuth(value)
	}

	return (
		<BrowserRouter >
			<Routes>
				<Route path="/login" element={<GoogleLogin />} />
				<Route path="/" element={<PrivateGoogleRoute><Home /></PrivateGoogleRoute>} />
			</Routes>
		</BrowserRouter>
	)
}

export default PageRoutes;

function PrivateGoogleRoute({ children, ...rest }) {
	const [user, loading, error] = useAuthState(auth);
	const setAuthId = useStoreActions((actions) => actions.setAuthId);
	const setUserName = useStoreActions((actions) => actions.setUserName);
	const setPhotoURL = useStoreActions((actions) => actions.setPhotoURL);

	console.log(`Autheticated - ${auth}`)
	// console.log(`User - ${user.getIdToken()}`)

	useEffect(() => {

		const idToken = async () => {
			// console.log(await user.getIdToken())
			if (user) {
				await user.getIdToken().then(function (idToken) {  // <------ Check this line
					console.log(idToken); // It shows the Firebase token now
					setAuthId({ authId: idToken });
					return idToken;
				});
				setUserName({ userName: user.displayName })
				setPhotoURL({ photoURL: user.photoURL })
			}
		}
		idToken()
	}, [user, setAuthId])


	if (loading) {
		return 'loading'
	}
	if (error) {
		return 'Something has gone wrong'
	}

	return user ? children : <Navigate to="/login" />;
}
