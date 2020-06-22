import React, { Component } from 'react';
import CommonCards from './commonCards';
import GameScores from './gameScores';
import OtherPlayers from './otherPlayers';
import WaitingScreen from '../Common/WaitingScreen';
import axios from 'axios';
import { Redirect } from 'react-router';
import CommonGameStatus from '../../APIs/commonGameStatus';
import IsValidPlayer from '../Authentication/isValidUser';

class GameRoom extends Component {

	constructor() {
		super() 
		this.state = {
			message: '',
			invalidGame: false,
			gameState: null
		}
	}

	componentDidMount () {
		axios.get(`/game/validGame/${this.props.match.params.gameId}`)
		.catch(() => {
			this.setState({
				invalidGame: true
			})
		})
		setInterval(() => {
			CommonGameStatus(this.props.match.params.gameId, localStorage.getItem('GameUserId'), (data) => {
				if (this.state.gameState === null) {
					this.setState({
						gameState: true
					})
				}
			})
		}, 1000)
			
	}

	render() {

		if (!localStorage.getItem('GameUserId')) {
			return (<Redirect to="/" />)
		}

		if (this.state.invalidGame === true) {
			return (<Redirect to="/joinGame" />)
		}

		if (!this.state.gameState) {
			return (<WaitingScreen />)
		}

		return (
			<div className="row">
				<IsValidPlayer />
				<div className="col-md-4 offset-md-1">
					<OtherPlayers gameId={this.props.match.params.gameId} allPlayers={this.state.gameState.allPlayers} />
				</div>
				<div className="col-md-6">
					<div>
						<CommonCards gameId={this.props.match.params.gameId} currentCards={this.state.gameState.currentCards} />
					</div>
					<div>
						<GameScores gameId={this.props.match.params.gameId} scores={this.state.gameState.scores} />
					</div>
				</div>
			</div>
		);
	}

}
//export GameRoom Component
export default GameRoom;