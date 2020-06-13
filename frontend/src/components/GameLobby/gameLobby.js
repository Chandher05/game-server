import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import IsValidUser from '../Authentication/isValidUser';

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

class GameLobby extends Component {

    constructor() {
        super()
        this.state = {
            redirect: null
        }
    }

    startGame = () => {
        const reqBody = {
            gameId: this.props.gameId
        }
        axios.post(`/game/start`, reqBody)
    }

    quitGame = () => {
        const reqBody = {
            gameId: this.props.gameId,
            userId: localStorage.getItem('GameUserId')
        }
        axios.post(`/game/quitFromLobby`, reqBody)
            .then(() => {
                this.setState({
                    redirect: <Redirect to="/joinGame" />
                })
            })
            this.props.updateGameId(null)

    }

    copyText = () => {
        this.textArea.select()
        document.execCommand('Copy')
    }

    render() {

        if (this.state.redirect !== null) {
            return (this.state.redirect)
        }

        let playersInGame = []
        for (var player of this.props.activePlayersInGame) {
            if (this.props.createdUser === player._id && this.props.createdUser === localStorage.getItem('GameUserId')) {
                playersInGame.push(
                    <div className="row">
                        <div className="col-md-6 text-right p-3">
                            <h3 className="font-weight-light">{player.userName}</h3>
                        </div>
                    </div>
                )
            } else if (this.props.createdUser === localStorage.getItem('GameUserId')) {
                playersInGame.push(<UserInfo gameId={this.props.gameId} player={player} />)
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
                {/* <IsValidUser /> */}
                <div className="row p-5">
                    <div className="col-md-12">
                        <p className="display-4 text-center">
                            Game ID: <span className="font-weight-bold">{this.props.gameId}</span>
                            <i class="fas fa-copy ml-3 text-secondary display-4 showPointer" onClick={this.copyText}></i>
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <textarea
                            ref={(textarea) => this.textArea = textarea}
                            value={window.location.origin.concat("/joinGame?").concat(this.props.gameId)}
                            style={{ resize: "none" }}
                            className="w-100 rounded text-center"
                        />
                    </div>
                </div>

                {playersInGame}

                <div className="row">

                    {
                        this.props.createdUser === localStorage.getItem('GameUserId') ?
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