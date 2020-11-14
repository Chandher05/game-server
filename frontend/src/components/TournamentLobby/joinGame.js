import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import WaitingScreen from '../Common/WaitingScreen';
import '../Common/style.css';


class JoinGame extends Component {

	constructor() {
		super()
		this.state = {
			gameId: null,
			redirect: null,
			errMsg: '',
			isFetched: false
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
				this.setState({
					isFetched: true
				})
			})
			.catch(() => {
				localStorage.removeItem('GameUserId')
				localStorage.removeItem('GameUsername')
				this.setState({
					redirect: "/",
					isFetched: true
				})
			})

		axios.get(`/game/currentGame/${localStorage.getItem('GameUserId')}`)
			.then((response) => {
				if (response.status === 200) {
					this.setState({
						redirect: `/tournament/lobby/${response.data.gameId}`
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
		// var urlParams = new URLSearchParams(window.location.search);
		if (this.props.match.params.gameId) {
			this.setState({
				gameId: this.props.match.params.gameId
			})
		}
	}

	gameIdChangeHandler = (e) => {
		this.setState({
			gameId: e.target.value
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
		axios.post('/tournament/join', userData)
			.then((response) => {
				if (response.status === 204) {
					this.setState({
						errMsg: "Invalid game ID"
					})
				} else {
					this.setState({
						redirect: `/tournament/lobby/${this.state.gameId}`
					})
				}
			})
			.catch((error) => {
				if (error.response) {
					if (error.response.status === 404) {
						this.setState({
							errMsg: 'Error in joining game'
						})
					} else if (error.response.status === 409) {
						this.setState({
							errMsg: error.response.data
						})
					} else {
						this.setState({
							redirect: `/tournament/lobby/${this.state.gameId}`
						})
					}
				} else {
					this.setState({
						errMsg: 'Error in creating game'
					})
				}
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

		return (
			<div>
				<div className="row pt-5 pb-2">
					<div className="col-md-8 offset-md-2 text-center">
						<p className="display-4">Tournament</p>
						<div className="row pt-3">
							<div className="col-md-9">
								<input className="form-control" type="text" value={this.state.gameId} onChange={this.gameIdChangeHandler} placeholder="Enter game ID" />
								<p className="text-danger text-center">{this.state.errMsg}</p>
							</div>
							<div className="col-md-3">
								<button className="btn btn-primary w-100" onClick={this.joinGame}>Join Game</button>
							</div>
						</div>
					</div>
				</div>

			</div>
		);

	}


}

//export JoinGame Component
export default JoinGame;