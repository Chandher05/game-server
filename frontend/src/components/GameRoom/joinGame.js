import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import CreateGame from '../../APIs/createGame';

class JoinGame extends Component {

	constructor() {
		super() 
		this.state = {
			gameId: null,
			redirect: null,
			errMsg: '',
			showJoinGame: true,
			activePlayersInGame: [],
			isFetched: false,
			createdUser: null
		}
	}
	
	componentDidMount() {
		axios.get(`/game/currentGame/${localStorage.getItem('GameUserId')}`)
		.then((response) => {
			if (response.status === 200) {
				this.setState({
					showJoinGame: false,
					gameId: response.data.gameId,
					createdUser: response.data.createdUser
				})
			}
			this.setState({
				isFetched: true
			})
		})
		.catch((error) => {
			if (error.response) {
				if (error.response.status === 409) {
					this.setState({
						redirect: `/gameRoom/${error.response.data.gameId}`,
						isFetched: true
					})
				}
			}

		})
		setInterval(() => {
			CreateGame((this.state.gameId), (err, players, isStarted) => {
				
				this.setState({
					activePlayersInGame: players,
				})
				if (isStarted === true) {
					this.setState({
						redirect: `/gameRoom/${this.state.gameId}`
					})
				}
			})
		}, 1000);
	}
	
	gameIdChangeHandler = (e) => {
		this.setState({
			gameId: e.target.value
		})
	}

	createGame = () => {
		this.setState({
			errMsg: ''
		})
		const userData = {
			userId: localStorage.getItem('GameUserId')
		}
		axios.post('/game/create', userData)
		.then((response) => {
			this.setState({
				gameId: response.data.gameId,
				createdUser: response.data.createdUser
			})
		})
		.catch((error) => {
			if (error.response) {
				if (error.response.status === 404) {
					this.setState({
						errMsg: 'Error in creating game'
					})	
				} else {
					this.setState({
						errMsg: error.response.data
					})
				}
			} else {
				this.setState({
					errMsg: 'Error in creating game'
				})
			}
		})
	}

	joinGame = () => {
		this.setState({
			errMsg: ''
		})
		const userData = {
			gameId: this.state.gameId,
			userId: localStorage.getItem('GameUserId')
		}
		axios.post('/game/join', userData)
		.then((response) => {
			if (response.status === 204) {
				this.setState({
					errMsg: response.data
				})
			} else {
				this.setState({
					gameId: response.data.gameId,
					createdUser: response.data.createdUser,
					showJoinGame: false
				})
			}
		})
		.catch((error) => {
			if (error.response) {
				if (error.response.status === 404) {
					this.setState({
						errMsg: 'Error in joining game'
					})	
				} else {
					this.setState({
						errMsg: error.response.data
					})
				}
			} else {
				this.setState({
					errMsg: 'Error in creating game'
				})
			}
		})
	}

	startGame = () => {
		const reqBody = {
			gameId: this.state.gameId
		}
		axios.post(`/game/start`, reqBody)
	}

	render() {
		
		if (this.state.isFetched === false) {
			return (null)
		}

		if (this.state.redirect !== null) {
			return (<Redirect to={this.state.redirect} />)
		}

		if (this.state.showJoinGame === true) {
			return (
				<div>
					<div className="row p-5">
						<input className="form-control" type="text" value={this.state.gameId} onChange={this.gameIdChangeHandler} />
					</div>
					<div className="text-center pt-5 row">
						<div className="col-md-2 offset-md-3">
							<button className="btn btn-primary" onClick={this.createGame}>Create Game</button>
						</div>
						<div className="col-md-2 offset-md-2">
							<button className="btn btn-primary" onClick={this.joinGame}>Join Game</button>
						</div>
					</div>
					<p className="text-danger">{this.state.errMsg}</p>
				</div>
			);
		}
		
		let playersInGame = []
		for (var player of this.state.activePlayersInGame) {
			playersInGame.push(<div className="col-md-12 text-center">{player.userName}</div>)
		}

		if (playersInGame.length === 0) {
			return (null)
		}

		return (
			<div className="row">
				{playersInGame}

				{
					this.state.createdUser === localStorage.getItem('GameUserId')?
					<div className="col-md-12 text-center">
						<button className="btn btn-success w-25" onClick={this.startGame}>Start Game</button>
					</div>:
					<div className="col-md-12 text-center">
						<img src="/loading.gif"  style={{ width: 25 + "px" }} alt="loading"/> Waiting for host to start the game
					</div>
				}
			</div>
		)

	}
	

}

//export JoinGame Component
export default JoinGame;