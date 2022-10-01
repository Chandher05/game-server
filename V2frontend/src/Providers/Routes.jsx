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
import Leaderboard from "../Pages/Home/HomePages/Leaderboard/Leaderboard";
import HallOfFame from "../Pages/Home/HomePages/HallOfFame/HallOfFame";
import Account from "../Pages/Home/HomePages/Account/Account";
import Gameroom from "../Pages/Home/HomePages/Gameroom/Gameroom"
import Rules from "../Pages/Home/HomePages/Rules/Rules";
import WaitingScreen from "../Pages/Game/WaitingScreen";
import GameRoomTable from "../Pages/Game/GameRoom";
import AdminLogin from "../Pages/Admin/Login";
import AdminHome from "../Pages/Admin/Home";
import AdminUsers from "../Pages/Admin/HomePages/Users/Users";
import AdminMessages from "../Pages/Admin/HomePages/Messages/Messages";
import AdminClaimUsername from "../Pages/Admin/HomePages/ClaimUsername/ClaimUsername";

function PageRoutes() {
	const [authenticated, setAuth] = useState(false);
	const handleAuth = (value) => {
		setAuth(value)
	}

	return (
		<BrowserRouter >
			<Routes>
				<Route path="/login" element={<PrivateGoogleLogin><GoogleLogin /></PrivateGoogleLogin>} />
				<Route path="/" element={<PrivateGoogleRoute><Home /></PrivateGoogleRoute>} >
					<Route path="/" element={<Gameroom></Gameroom>} />
					<Route path="leaderboard" element={<Leaderboard></Leaderboard>} />
					<Route path="halloffame" element={<HallOfFame></HallOfFame>} />
					<Route path="account" element={<Account></Account>} />
					<Route path="gameroom" element={<Gameroom></Gameroom>} />
					<Route path="rules" element={<Rules></Rules>} />
				</Route>
				<Route path="/admin" element={<PrivateGoogleRoute><AdminHome /></PrivateGoogleRoute>} >
					<Route path="/admin" element={<AdminLogin handleAuth={handleAuth}></AdminLogin>} />
					<Route path="/admin/users" element={<PrivateAdminRoute authenticated={authenticated}><AdminUsers></AdminUsers></PrivateAdminRoute>} />
					<Route path="/admin/messages" element={<PrivateAdminRoute authenticated={authenticated}><AdminMessages></AdminMessages></PrivateAdminRoute>} />
					<Route path="/admin/claim" element={<PrivateAdminRoute authenticated={authenticated}><AdminClaimUsername></AdminClaimUsername></PrivateAdminRoute>} />
				</Route>
				<Route path="/waiting/:gameId" element={<PrivateGoogleRoute><WaitingScreen /></PrivateGoogleRoute>} />
				<Route path="/game/:gameId" element={<PrivateGoogleRoute><GameRoomTable /></PrivateGoogleRoute>} />
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

	// console.log(`Autheticated - ${auth}`)
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

function PrivateGoogleLogin({ children, ...rest }) {
	const [user, loading, error] = useAuthState(auth);
	return user ? <Navigate to="/" /> : children;
}

function PrivateAdminRoute({ authenticated, children, ...rest }) {
	return authenticated ? children : <Navigate to="/admin" />
}