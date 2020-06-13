import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import PlayerStats from '../Stats/playerStats';
import GameStatus from '../../APIs/commonGameStatus';
import "../Common/style.css";

class PlayerDetails extends Component {

    render() {
        return (
            <div>
                <div className={`row p-2 ${this.props.background}`}>
                    <div className="col-md-5 text-break showPointer" data-toggle="modal" data-target={`#${this.props.userName}_stats`}>{this.props.userName}</div>
                    <div className="col-md-5">{this.props.showCards}</div>
                    {
                        this.props.hostPlayer === this.props.player ?
                            <div className="col-md-2"><i className="fas fa-star"></i></div> :
                            this.props.hasQuit === true ?
                                <div className="col-md-2"><i className="fas fa-running"></i></div> :
                                null
                    }
                </div>

                <div className="modal fade" id={`${this.props.userName}_stats`} tabIndex="-1" role="dialog" aria-labelledby={`${this.props.userName}_label`} aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={`${this.props.userName}_label`}>{this.props.userName} <span className="font-weight-light"> - Stats</span></h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body"><PlayerStats userId={this.props.player} /></div>
                        </div>
                    </div>
                </div>

            </div>

        )
    }

}

class OtherPlayers extends Component {

    constructor() {
        super()
        this.state = {
            isFetched: false,
            currentPlayer: null,
            cardsCount: null,
            hostPlayer: null,
            isRoundComplete: false,
            redirect: null,
            player: null,
            action: null,
            allPlayers: []
        }
    }

    componentDidMount() {
        GameStatus(this.props.gameId, localStorage.getItem('GameUserId'), (data) => {
            this.setState({
                allPlayers: data.allPlayers
            })
        })
    }

    leaveGame = () => {
        const reqBody = {
            gameId: this.props.gameId,
            userId: localStorage.getItem('GameUserId')
        }
        axios.post(`/game/quitFromGame`, reqBody)
            .then(() => {
                this.setState({
                    redirect: <Redirect to="/joinGame" />,
                })
            })
    }

    render() {

        if (this.state.redirect !== null) {
            return (this.state.redirect)
        }

        let cards = [],
            background,
            currentPlayerUserName,
            hostPlayerName

        for (var player in this.state.allPlayers.cardsCount) {
            if (player === this.state.allPlayers.currentPlayer) {
                currentPlayerUserName = this.state.allPlayers.cardsCount[player].userName
            }
            if (player === this.state.allPlayers.currentPlayer && this.state.allPlayers.isRoundComplete !== true) {
                background = "bg-warning"
            } else if (this.state.allPlayers.isRoundComplete === true) {
                background = "bg-secondary text-white"
            } else {
                background = "bg-light"
            }
            var showCards = []
            if (this.state.allPlayers.isRoundComplete === true) {
                showCards.push(<p className="font-weight-bold text-center" key={player.userName + "Score"}>{this.state.allPlayers.cardsCount[player].score}</p>)
            } else {
                for (var index = 0; index < this.state.allPlayers.cardsCount[player].count; index++) {
                    showCards.push(<i className="fas fa-square text-secondary p-1" key={player.userName + "Card" + index}></i>)
                }
            }
            cards.push(
                <PlayerDetails background={background} userName={this.state.allPlayers.cardsCount[player].userName}
                    showCards={showCards} hostPlayer={this.state.allPlayers.hostPlayer}
                    player={player} hasQuit={this.state.allPlayers.cardsCount[player].hasQuit} key={this.state.allPlayers.cardsCount[player].userName + "Details"}/>
            )
            if (this.state.allPlayers.hostPlayer === player) {
                hostPlayerName = this.state.allPlayers.cardsCount[player].userName
            }
        }

        return (
            <div className="m-5">
                <a href="/rules" target="_blank">
                    <button className="btn btn-dark mb-5 w-100">View Rules</button>
                </a>
                {cards}
                {
                    this.state.allPlayers.isRoundComplete === true && this.state.allPlayers.isEnded === false ?
                        this.state.allPlayers.hostPlayer === localStorage.getItem('GameUserId') ?
                            <div className="mt-5">
                                <p className="font-weight-bold text-center">{currentPlayerUserName} has declared</p>
                                <img src="/loading.gif" style={{ width: 25 + "px" }} alt="loading" /> Please start the next round
                            </div> :
                            <div className="mt-5">
                                <p className="font-weight-bold text-center">{currentPlayerUserName} has declared</p>
                                <img src="/loading.gif" style={{ width: 25 + "px" }} alt="loading" /><span className="text-break"> Waiting for {hostPlayerName} to start the next round</span>
                            </div> :
                    this.state.allPlayers.isEnded === true ?
                        this.state.allPlayers.hostPlayer === localStorage.getItem('GameUserId') ?
                        <div className="mt-5">
                            <img src="/loading.gif" style={{ width: 25 + "px" }} alt="loading" /> Please start new game
                        </div> :
                        <div className="mt-5">
                            <p className="font-weight-bold text-center">{currentPlayerUserName} has declared</p>
                            <img src="/loading.gif" style={{ width: 25 + "px" }} alt="loading" /><span className="text-break"> Waiting for {hostPlayerName} to start new game</span>
                        </div> :
                    null
                }
                {
                    this.state.allPlayers.isEnded === false ?
                        <div className="text-center">
                            <button className="btn btn-danger m-5 p-2" onClick={this.leaveGame}>Leave Game</button>
                        </div> :
                        null
                }
            </div>
        );
    }

}
//export OtherPlayers Component
export default OtherPlayers;