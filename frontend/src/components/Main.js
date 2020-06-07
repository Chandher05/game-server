import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Landing from './Common/Landing';
import Login from './Authentication/login'; 
import CreateAccount from './Authentication/createAccount'; 

import JoinGame from './GameRoom/joinGame';
import GameRoom from './GameRoom/gameRoom';
import SpectateRoom from './GameRoom/spectate';

import ErrorPage from './Authentication/errorPage';
import Rules from './Common/Rules';
import WaitingScreen from './Common/WaitingScreen';
import ReportError from './Common/ReportError';

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
                    <Route path="/gameRoom/:gameId" component={GameRoom}/>
                    <Route path="/spectate/:gameId" component={SpectateRoom}/>

                    <Route path="/rules" component={Rules}/>
                    <Route path="/waitingScreen" component={WaitingScreen}/>
                    <Route path="/report" component={ReportError}/>

                    <Route component={ErrorPage}/>
                </Switch>
            </div>
        )
    }
}
//Export The Main Component
export default Main;