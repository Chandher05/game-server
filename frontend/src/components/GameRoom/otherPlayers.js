import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

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
            action: null
        }
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

        for (var player in this.props.allPlayers.cardsCount) {
            if (player === this.props.allPlayers.currentPlayer) {
                currentPlayerUserName = this.props.allPlayers.cardsCount[player].userName
            }
            if (player === this.props.allPlayers.currentPlayer && this.props.allPlayers.isRoundComplete !== true) {
                background = "bg-warning"
            } else if (this.props.allPlayers.isRoundComplete === true) {
                background = "bg-secondary text-white"
            } else {
                background = "bg-light"
            }
            var showCards = []
            if (this.props.allPlayers.isRoundComplete === true) {
                showCards.push(<p className="font-weight-bold text-center">{this.props.allPlayers.cardsCount[player].score}</p>)
            } else {
                for (var index = 0; index < this.props.allPlayers.cardsCount[player].count; index++) {
                    showCards.push(<i class="fas fa-square text-secondary p-1"></i>)
                }
            }
            cards.push(
                <div className={`row p-2 ${background}`}>
                    <div className="col-md-5 text-justify">{this.props.allPlayers.cardsCount[player].userName}</div>
                    <div className="col-md-5">{showCards}</div>
                    {
                        this.props.allPlayers.hostPlayer === player ?
                            <div className="col-md-2"><i className="fas fa-star"></i></div> :
                            this.props.allPlayers.cardsCount[player].hasQuit === true ?
                                <div className="col-md-2"><i className="fas fa-running"></i></div> :
                                null
                    }
                </div>
            )
            if (this.props.allPlayers.hostPlayer === player) {
                hostPlayerName = this.props.allPlayers.cardsCount[player].userName
            }
        }

        return (
            <div className="m-5">
                <a href="/rules" target="_blank">
                    <button className="btn btn-dark mb-5 w-100">View Rules</button>
                </a>
                {cards}
                {
                    this.props.allPlayers.isRoundComplete === true ?
                        this.props.allPlayers.hostPlayer === localStorage.getItem('GameUserId') ?
                            <div className="mt-5">
                                <p className="font-weight-bold text-center">{currentPlayerUserName} has declared</p>
                                <img src="/loading.gif" style={{ width: 25 + "px" }} alt="loading" /> Please start the next round
                    </div> :
                            <div className="mt-5">
                                <p className="font-weight-bold text-center">{currentPlayerUserName} has declared</p>
                                <img src="/loading.gif" style={{ width: 25 + "px" }} alt="loading" /> Waiting for {hostPlayerName} to start the next round
                    </div> :
                        null
                }
                <div className="text-center">
                    <button className="btn btn-danger m-5 p-2" onClick={this.leaveGame}>Leave Game</button>
                </div>
            </div>
        );
    }

}
//export OtherPlayers Component
export default OtherPlayers;