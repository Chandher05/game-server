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
		axios.get(`/game/currentGame/${localStorage.getItem('GameUserId')}`)
			.then((response) => {
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
		}, 1000);
	}

	updateGameId = (gameId) => {
		this.setState({
			gameId: gameId
		})
	}

	render() {

		if (!localStorage.getItem('GameUserId')) {
			return (<Redirect to={`/login${this.props.location.search}`} />)
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
					<div className="row p-5">
						<div className="col-md-8 offset-md-2 text-center">
							<p className="font-weight-bold">Sponsored by</p>
							<a href="https://hostelit.in/" target="_blank" rel="noopener noreferrer">
								<img src="hostelit.jfif" className="rounded" style={{ width: 100 + "%" }} alt="gameLogo" />
							</a>
						</div>
						<div className="col-md-2">
							<UserOperations />
						</div>
					</div>
					<GameIdHandler gameId={this.state.gameId} updateGameId={this.updateGameId} />
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