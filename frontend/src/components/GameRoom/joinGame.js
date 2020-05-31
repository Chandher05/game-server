import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import CreateGame from '../../APIs/createGame';
import '../Common/style.css';


class UserInfo extends Component {

	kickPlayer = () => {
		const reqBody = {
			gameId: this.props.gameId,
			userId: this.props.player._id
		}
		axios.post(`/game/quitFromLobby`, reqBody)
	}

	render() {
		return (
			<div className="row">
				<div className="col-md-6 text-right p-3">
					<h3 className="font-weight-light">{this.props.player.userName}</h3>
				</div>
				<div className="col-md-6 text-left p-3">
					<button className="btn btn-danger" onClick={this.kickPlayer}>Remove player</button>
				</div>
			</div>
		)
	}
}

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
				console.log(response.data)
				if (response.status === 200) {
					this.setState({
						showJoinGame: false,
						gameId: response.data.gameId,
						createdUser: response.data.createdUser
					})
				} else if (this.props.location.search) {
					this.setState({
						gameId: this.props.location.search.substr(1)
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
							redirect: `/gameRoom/${error.response.data.gameId}`
						})
					}
				}
				this.setState({
					isFetched: true
				})
			})
		setInterval(() => {
			CreateGame((this.state.gameId), (err, players, isStarted) => {

				this.setState({
					activePlayersInGame: players,
				})
				var isPartOfGame = false
				for (var player of players) {
					if (player._id === localStorage.getItem('GameUserId')) {
						isPartOfGame = true
						break
					}
				}
				if (isStarted === true && isPartOfGame === true) {
					this.setState({
						redirect: `/gameRoom/${this.state.gameId}`
					})
				} else if (this.state.showJoinGame === false && isPartOfGame === false) {
					this.setState({
						gameId: null,
						showJoinGame: true
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
					createdUser: response.data.createdUser,
					showJoinGame: false
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
						errMsg: "Invalid game ID"
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

	spectateGame = () => {
		this.setState({
			errMsg: ""
		})
		axios.get(`/game/validGame/${this.state.gameId}`)
		.then(() => {
			this.setState({
				redirect: `/spectate/${this.state.gameId}`
			})
		})
		.catch(() => {
			this.setState({
				errMsg: "Invalid game ID"
			})
		})
	}

	quitGame = () => {
		const reqBody = {
			gameId: this.state.gameId,
			userId: localStorage.getItem('GameUserId')
		}
		axios.post(`/game/quitFromLobby`, reqBody)
			.then(() => {
				this.setState({
					showJoinGame: true,
					gameId: null
				})
			})
	}

	logout = () => {
		localStorage.removeItem('GameUserId')
		localStorage.removeItem('GameUserName')
		window.location.reload()
	}

	copyText = () => {
		this.textArea.select()
		document.execCommand('Copy')
	}

	render() {

		if (!localStorage.getItem('GameUserId')) {
			return (<Redirect to={`/login${this.props.location.search}`} />)
		}

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
						<div className="col-md-8 offset-md-2 text-center">
							<p className="font-weight-bold">Sponsored by</p>
							<a href="https://hostelit.in/" target="_blank" rel="noopener noreferrer">
								<img src="hostelit.jpeg" style={{ width: 100 + "%" }} alt="gameLogo" />
							</a>
						</div>
						<div className="col-md-2">
							<div>
								<button className="btn btn-danger w-100" onClick={this.logout}><i class="fas fa-sign-out-alt"></i> Logout</button>
							</div>
							<div className="pt-3">
								<a href="/rules" target="_blank">
									<button className="btn btn-dark w-100">View Rules</button>
								</a>
							</div>
						</div>
					</div>
					<div className="text-center pt-5 row">
						<div className="col-md-8 offset-md-2 text-center">
							<button className="btn btn-success p-3 w-100" onClick={this.createGame}>Create new Game</button>
						</div>
					</div>
					<div className="row p-5">
						<div className="col-md-2 offset-md-2">
							<button className="btn btn-info w-100 p-3" onClick={this.spectateGame}>Spectate</button>
						</div>
						<div className="col-md-4">
							<input className="form-control" type="text" value={this.state.gameId} onChange={this.gameIdChangeHandler} placeholder="Enter game ID" />
							<p className="text-danger text-center">{this.state.errMsg}</p>
						</div>
						<div className="col-md-2">
							<button className="btn btn-primary w-100 p-3" onClick={this.joinGame}>Join Game</button>
						</div>
					</div>
				</div>
			);
		}

		let playersInGame = []
		for (var player of this.state.activePlayersInGame) {
			if (this.state.createdUser === player._id && this.state.createdUser === localStorage.getItem('GameUserId')) {
				playersInGame.push(
					<div className="row">
						<div className="col-md-6 text-right p-3">
							<h3 className="font-weight-light">{player.userName}</h3>
						</div>
					</div>
				)
			} else if (this.state.createdUser === localStorage.getItem('GameUserId')) {
				playersInGame.push(<UserInfo gameId={this.state.gameId} player={player} />)
			} else {
				playersInGame.push(
					<div className="row">
						<div className="col-md-6 offset-md-3 text-center p-3">
							<h3 className="font-weight-light">{player.userName}</h3>
						</div>
					</div>
				)
			}
		}

		if (playersInGame.length === 0) {
			return (null)
		}

		return (
			<div>
				<div className="row p-5">
					<div className="col-md-12">
						<p className="display-4 text-center">
							Game ID: <span className="font-weight-bold">{this.state.gameId}</span>
							<i class="fas fa-copy ml-3 text-secondary display-4 showPointer" onClick={this.copyText}></i>
						</p>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 offset-md-3">
						<textarea
							ref={(textarea) => this.textArea = textarea}
							value={window.location.origin.concat("/joinGame?").concat(this.state.gameId)}
							style={{ resize: "none" }}
							className="w-100 rounded text-center"
						/>
					</div>
				</div>

				{playersInGame}

				<div className="row">

					{
						this.state.createdUser === localStorage.getItem('GameUserId') ?
							playersInGame.length > 1 ?
								<div className="col-md-12 text-center pt-5">
									<button className="btn btn-success w-25" onClick={this.startGame}>Start Game</button>
								</div> :
								<div className="col-md-12 text-center">
									<div>
										<img src="/loading.gif" style={{ width: 25 + "px" }} alt="loading" className="m-4" /> Waiting for players to join the game
							</div>
									<div>
										<button className="btn btn-danger w-25" onClick={this.quitGame}>Quit game</button>
									</div>
								</div> :
							<div className="col-md-12 text-center">
								<div>
									<img src="/loading.gif" style={{ width: 25 + "px" }} alt="loading" className="m-4" /> Waiting for host to start the game
						</div>
								<div>
									<button className="btn btn-danger w-25" onClick={this.quitGame}>Quit game</button>
								</div>
							</div>
					}

				</div>


			</div>
		)

	}


}

//export JoinGame Component
export default JoinGame;