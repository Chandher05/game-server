import React, { Component } from 'react';
import CommonCards from './commonCards';
import MyCards from './myCards';
import GameScores from './gameScores';
import OtherPlayers from './otherPlayers';
import axios from 'axios';
import { Redirect } from 'react-router';

class GameRoom extends Component {

	constructor() {
		super() 
		this.state = {
			message: '',
			invalidGame: false
		}
	}

	componentDidMount () {
		axios.get(`/game/validGame/${this.props.match.params.gameId}`)
		.catch(() => {
			this.setState({
				invalidGame: true
			})
		})
	}

	render() {

		if (!localStorage.getItem('GameUserId')) {
			return (<Redirect to="/" />)
		}

		if (this.state.invalidGame === true) {
			return (<Redirect to="/joinGame" />)
		}

		return (
			<div className="row">
				<div className="col-md-3">
					<OtherPlayers gameId={this.props.match.params.gameId}/>
				</div>
				<div className="col-md-6">
					<div>
						<CommonCards gameId={this.props.match.params.gameId} />
					</div>
					<div>
						<GameScores gameId={this.props.match.params.gameId} />
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