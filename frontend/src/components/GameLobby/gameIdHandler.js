import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

class GameIdHandler extends Component {

    constructor(props) {
        super(props)
        this.state = {
            gameId: this.props.gameId,
            redirect: null,
            errMsg: '',
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
        axios.post('/game/join', userData)
            .then((response) => {
                if (response.status === 204) {
                    this.setState({
                        errMsg: "Invalid game ID"
                    })
                } else {
                    this.setState({
                        redirect: `/lobby/${this.state.gameId}`
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
							redirect: `/lobby/${this.state.gameId}`
						})
					}
				} else {
					this.setState({
						errMsg: 'Error in creating game'
					})
				}
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
                // this.props.updateGameId(response.data.gameId)
                this.setState({
                    redirect: `/lobby/${response.data.gameId}`
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

    spectateGame = () => {
        this.setState({
            errMsg: ""
        })
        axios.get(`/game/validGame/${this.state.gameId}`)
            .then(() => {
                let spectateGameData = {
                    gameId: this.state.gameId,
                    userId: localStorage.getItem('GameUserId')
                }
                axios.post(`/game/spectate`, spectateGameData)
                    .then(() => {
                        this.setState({
                            redirect: `/spectate/${this.state.gameId}`
                        })
                    })
            })
            .catch(() => {
                this.setState({
                    errMsg: "Invalid game ID"
                })
            })
    }

    render() {

        if (this.state.redirect !== null) {
            return (<Redirect to={this.state.redirect} />)
        }

        return (
            <div>
                <div className="text-center pt-1 row">
                    <div className="col-md-12 text-center">
                        <button className="btn btn-success p-3 w-100" onClick={this.createGame}>Create new Game</button>
                    </div>
                </div>
                <div className="row pt-3">
                    <div className="col-md-3">
                        <button className="btn btn-info w-100 p-3" onClick={this.spectateGame}>Spectate</button>
                    </div>
                    <div className="col-md-6">
                        <input className="form-control" type="text" value={this.state.gameId} onChange={this.gameIdChangeHandler} placeholder="Enter game ID" />
                        <p className="text-danger text-center">{this.state.errMsg}</p>
                    </div>
                    <div className="col-md-3">
                        <button className="btn btn-primary w-100 p-3" onClick={this.joinGame}>Join Game</button>
                    </div>
                </div>
            </div>
        )
    }
}
//export GameIdHandler Component
export default GameIdHandler;