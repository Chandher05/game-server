import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Landing from './Common/Landing';
import Login from './Authentication/login'; 
import CreateAccount from './Authentication/createAccount'; 

import JoinGame from './GameLobby/joinGame';
import GameRoom from './GameRoom/gameRoom';
import SpectateRoom from './GameRoom/spectate';

import JoinTournament from './TournamentLobby/joinGame';
import CreateTournamentGame from './TournamentLobby/createGame';
import TournamentLobby from './TournamentLobby/gameLobby';

import ErrorPage from './Authentication/errorPage';
import Rules from './OtherFeatures/Rules';
// import WaitingScreen from './Common/WaitingScreen';
// import ReportError from './OtherFeatures/ReportError';
import PlayerStats from './Stats/completeStats';
import Leaderboard from './Stats/leaderboard';
import HallOfFame from './Stats/hallOfFame';
import UpdatePassword from './Admin/updatePassword';
import ForgotPassword from './Admin/forgotPassword';
import AdminUpdatePassword from './Admin/adminUpdatePassword';

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/" component={Landing}/>
                <Switch>
                    <Route path="/login" component={Login}/>
                    <Route path="/create-account" component={CreateAccount}/>

                    <Route path="/joinGame" component={JoinGame}/>
                    <Route path="/tournament/joinGame" component={JoinTournament}/>
                    <Route path="/tournament/create" component={CreateTournamentGame}/>
                    <Route path="/tournament/lobby/:gameId" component={TournamentLobby}/>
                    <Route path="/tournament/game/:gameId" component={JoinGame}/>
                    <Route path="/gameRoom/:gameId" component={GameRoom}/>
                    <Route path="/spectate/:gameId" component={SpectateRoom}/>

                    <Route path="/rules" component={Rules}/>
                    {/* <Route path="/waitingScreen" component={WaitingScreen}/> */}
                    {/* <Route path="/report" component={ReportError}/> */}
                    <Route path="/hall-of-fame" component={HallOfFame}/>
                    <Route path="/stats" component={PlayerStats}/>
                    <Route path="/leaderboard" component={Leaderboard}/>

                    <Route path="/admin-password-update" component={AdminUpdatePassword}/>
                    <Route path="/update-password/:userId" component={UpdatePassword}/>
                    <Route path="/forgot-password" component={ForgotPassword}/>

                    <Route component={ErrorPage}/>
                </Switch>
            </div>
        )
    }
}
//Export The Main Component
export default Main;