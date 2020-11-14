import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import WaitingScreen from '../Common/WaitingScreen';
import '../Common/style.css';


class JoinGame extends Component {

	constructor() {
		super()
		this.state = {
			redirect: null,
			errMsg: '',
			isFetched: false,
			password: ""
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
	}

	passwordChangeHandler = (e) => {
		this.setState({
			password: e.target.value
		})
	}

	createGame = () => {
		if (this.state.password !== "asd") {
			this.setState({
				errMsg: "Incorrect password"
			})
		} else {
			this.setState({
				errMsg: ""
			})
			const userData = {
				userId: localStorage.getItem('GameUserId')
			}
			axios.post('/tournament/create', userData)
				.then((response) => {
					this.setState({
						redirect: `/tournament/lobby/${response.data.gameId}`
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
								<input className="form-control" type="password" value={this.state.password} onChange={this.passwordChangeHandler} placeholder="Enter password" />
								<p className="text-danger text-center">{this.state.errMsg}</p>
							</div>
							<div className="col-md-3">
								<button className="btn btn-success w-100" onClick={this.createGame}>Create Game</button>
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