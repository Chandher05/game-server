import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import CreateGame from '../../APIs/gameLobby';
import RemovePlayer from '../../APIs/removePlayer';
import WaitingScreen from '../Common/WaitingScreen';

class UserInfo extends Component {

    kickPlayer = () => {
        const reqBody = {
            gameId: this.props.gameId,
            userId: this.props.player._id
        }
        axios.post(`/game/quitFromLobby`, reqBody)
        .then(() => {
            // CreateGame(reqBody.gameId, () => {

            // })
            RemovePlayer(reqBody.userId, reqBody.gameId, () => {

            })
        })
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

class GameLobby extends Component {

    constructor() {
        super()
        this.state = {
            isFetched: false,
            invalidGame: false,
            redirect: null,
            activePlayersInGame: []
        }
    }

    componentDidMount() {
        axios.get(`/tournament/validGame/${this.props.match.params.gameId}`)
            .then(() => {
				CreateGame((this.props.match.params.gameId), (players, isStarted, createdUser) => {
					this.setState({
                        activePlayersInGame: players,
						createdUser: createdUser
					})
					var isPartOfGame = false
					for (var player of players) {
						if (player._id === localStorage.getItem('GameUserId')) {
							isPartOfGame = true
							break
						}
                    }
                    if (isPartOfGame === false) {
                        // Redirect back the user
                    }
					if (isStarted === true) {
						this.setState({
							redirect: `/gameRoom/${this.props.match.params.gameId}`
						})
					}
                })
                this.setState({
                    isFetched: true
                })
            })
			.catch(() => {
				this.setState({
					invalidGame: true,
                    isFetched: true
				})
			})
    }

    startGame = () => {
        const reqBody = {
            gameId: this.props.match.params.gameId
        }
        axios.post(`/tournament/start`, reqBody)
        .then(() => {
            CreateGame((this.props.match.params.gameId), () => {
    
            })
        })
    }

    quitGame = () => {
        const reqBody = {
            gameId: this.props.match.params.gameId,
            userId: localStorage.getItem('GameUserId')
        }
        axios.post(`/tournament/quitFromLobby`, reqBody)
            .then(() => {
                this.setState({
                    redirect: "/tournament/joinGame"
                })
                // this.props.updateGameId(null)
                RemovePlayer(reqBody.userId, reqBody.gameId, () => {
    
                })
            })

    }

    copyText = () => {
        this.textArea.select()
        document.execCommand('Copy')
    }

    copyGameId = () => {
        this.gameIdtextArea.select()
        document.execCommand('Copy')
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
        
        if (this.state.invalidGame === true) {
			return (<Redirect to="/tournament/joinGame" />)
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
            } else if (this.props.createdUser === localStorage.getItem('GameUserId')) {
                playersInGame.push(<UserInfo gameId={this.props.match.params.gameId} player={player} updateGameId={this.props.updateGameId} />)
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

        // if (playersInGame.length === 0) {
        //     return (null)
        // }

        return (
            <div>
                <div className="row pt-5 pb-2">
                    <div className="col-md-12">
                        <p className="display-4 text-center">
                            Game ID: <span className="font-weight-bold">{this.props.match.params.gameId}</span>
                        </p>
                    </div>
                </div>
                <div className="row p-2">
                    <div className="col-md-5 offset-md-3">
                        <textarea
                            ref={(textarea) => this.gameIdtextArea = textarea}
                            value={this.props.match.params.gameId}
                            style={{ resize: "none" }}
                            className="w-100 rounded text-center"
                        />
                    </div>
                    <div className="col-md-1">
                        <i className="fas fa-copy ml-3 text-secondary display-4 showPointer" onClick={this.copyGameId}></i>
                    </div>
                </div>
                <div className="row p-2">
                    <div className="col-md-5 offset-md-3">
                        <textarea
                            ref={(textarea) => this.textArea = textarea}
                            value={window.location.origin.concat("/tournament/joinGame?gameId=").concat(this.props.match.params.gameId)}
                            style={{ resize: "none" }}
                            className="w-100 rounded text-center"
                        />
                    </div>
                    <div className="col-md-1">
                        <i className="fas fa-copy ml-3 text-secondary display-4 showPointer" onClick={this.copyText}></i>
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
//export GameLobby Component
export default GameLobby;