import React, { Component } from 'react';
import CommonCards from './commonCards';
import MyCards from './myCards';
import GameScores from './gameScores';
import OtherPlayers from './otherPlayers';
import WaitingScreen from '../Common/WaitingScreen';
import axios from 'axios';
import { Redirect } from 'react-router';
import GameStatus from '../../APIs/commonGameStatus';
import IsValidUser from '../Authentication/isValidUser';

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
			GameStatus(this.props.match.params.gameId, localStorage.getItem('GameUserId'), (data) => {
				this.setState({
					gameState: data
				})
			})
		}, 500)
			
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
				{/* <IsValidUser /> */}
				<div className="col-md-3">
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
				<div className="col-md-3">
					<MyCards gameId={this.props.match.params.gameId} />
				</div>
			</div>
		);
	}

}
//export GameRoom Component
export default GameRoom;