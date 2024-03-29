import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import CreateGame from '../../APIs/gameLobby';
import UserOperations from './userOperations';
import GameIdHandler from './gameIdHandler';
import GameLobby from './gameLobby';
import WaitingScreen from '../Common/WaitingScreen';
import '../Common/style.css';


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
		axios.get(`/users/profile/${localStorage.getItem('GameUserId')}`)
        .then((response) => {
            if (response.status === 204) {
                localStorage.removeItem('GameUserId')
                localStorage.removeItem('GameUsername')
                this.setState({
                    redirect: "/"
                })
            }
        })
        .catch(() => {
            localStorage.removeItem('GameUserId')
            localStorage.removeItem('GameUsername')
            this.setState({
                redirect:  "/"
            })
        })
		axios.get(`/game/currentGame/${localStorage.getItem('GameUserId')}`)
			.then((response) => {
				if (response.status === 200) {
					this.setState({
						showJoinGame: false,
						gameId: response.data.gameId,
						createdUser: response.data.createdUser
					})
					this.updateGameId(response.data.gameId)
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
		// setInterval(() => {
			if (this.state.gameId !== null) {
				CreateGame((this.state.gameId), (players, isStarted, createdUser) => {
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
							showJoinGame: true
						})
					} else if (this.state.showJoinGame === true && isPartOfGame === true) {
						this.setState({
							createdUser: createdUser,
							showJoinGame: false
						})
					}
				})
			} else {
				this.setState({
					showJoinGame: true
				})
			}
		// }, 250);
	}

	updateGameId = (gameId) => {
		this.setState({
			gameId: gameId
		})
		if (gameId == null) {
			this.setState({
				showJoinGame: true
			})
		}
		CreateGame((gameId), (players, isStarted, createdUser) => {
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
					showJoinGame: true
				})
			} else if (this.state.showJoinGame === true && isPartOfGame === true) {
				this.setState({
					createdUser: createdUser,
					showJoinGame: false
				})
			}
		})
	}

	showGameRoom = (gameId) => {
		this.setState({
			redirect: `/gameRoom/${gameId}`
		})
	}

	render() {

		if (!localStorage.getItem('GameUserId')) {
			return (<Redirect to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} />)
		}

		if (this.state.isFetched === false) {
			return (<WaitingScreen />)
		}

		if (this.state.redirect !== null) {
			return (<Redirect to={this.state.redirect} />)
		}

		if (this.state.showJoinGame === true) {
			return (
				<div>
					<div className="row pt-5 pb-2">
						<div className="col-md-8 offset-md-2 text-center">
							{/* <p className="font-weight-bold">Sponsored by</p> */}
							{/* <a href="http://collectarupee.com/" target="_blank" rel="noopener noreferrer">
								<img src="banner.png" className="rounded" style={{ width: 100 + "%" }} alt="gameLogo" />
							</a> */}
							<a href="https://hostelit.in/" target="_blank" rel="noopener noreferrer">
								<img src="hostelit.jfif" className="rounded" style={{ width: 100 + "%" }} alt="gameLogo" />
							</a>
							{/* <p className="font-italic pt-4">What are your thoughts on introducing season in leaderboard?</p>
							<p className="font-italic">Click on the give feedback button to let us know. We would love to hear from you.</p> */}
                    		<p className="pt-4">Write a mail to <span className="text-primary text-underline">jayasurya.pinaki@sjsu.edu</span> in case of any issues</p>
							<GameIdHandler gameId={this.state.gameId} updateGameId={this.updateGameId} showGameRoom={this.showGameRoom} />
						</div>
						<div className="col-md-2">
							<UserOperations />
						</div>
					</div>
					
				</div>
			);
		}

		return (
			<GameLobby gameId={this.state.gameId} activePlayersInGame={this.state.activePlayersInGame} createdUser={this.state.createdUser} updateGameId={this.updateGameId} />
		)

	}


}

//export JoinGame Component
export default JoinGame;