import React, { Component } from 'react';
import axios from 'axios';
import AllPlayers from '../../APIs/allPlayers';
import { Redirect } from 'react-router';

class OtherPlayers extends Component {

    constructor() {
        super()
        this.state = {
            currentPlayer: null,
            cardsCount: null,
            hostPlayer: null,
            isRoundComplete: false,
            redirect: null
        }
    }

    componentDidMount() {

        setInterval(() => {

            AllPlayers(this.props.gameId, (currentPlayer, cardsCount, hostPlayer, isRoundComplete) => {
                this.setState({
                    currentPlayer: currentPlayer,
                    cardsCount: cardsCount,
                    hostPlayer: hostPlayer,
                    isRoundComplete: isRoundComplete
                })
            })

        }, 1000)
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

        if (this.state.cardsCount === null) {
            return (null)
        } else if (this.state.redirect !== null) {
            return (this.state.redirect)
        }

        let cards = [],
            background,
            numberOfActivePlayers = 0

        for (var player in this.state.cardsCount) {
            if (player === this.state.currentPlayer) {
                background = "bg-warning"
            } else {
                background = "bg-light"
            }
            var showCards = []
            for (var index = 0; index < this.state.cardsCount[player].count; index++) {
                showCards.push(<i class="fas fa-square text-secondary p-1"></i>)
            }
            cards.push(
                <div className={`row p-2 ${background}`}>
                    <div className="col-md-5">{this.state.cardsCount[player].userName}</div>
                    <div className="col-md-5">{showCards}</div>
                    {
                        this.state.hostPlayer === player ?
                            <div className="col-md-2"><i className="fas fa-star"></i></div> :
                            this.state.cardsCount[player].hasQuit === true ?
                                <div className="col-md-2"><i className="fas fa-running"></i></div> :
                                null
                    }
                </div>
            )
            if (this.state.cardsCount[player].hasQuit) {
                numberOfActivePlayers++
            }
        }

        return (
            <div className="m-5">
                {cards}
                {
                    this.state.isRoundComplete === true ?
                        this.state.hostPlayer === localStorage.getItem('GameUserId') ?
                            <div className="m-2">
                                <img src="/loading.gif" style={{ width: 25 + "px" }} alt="loading" /> Please start the next round
                    </div> :
                            <div className="m-2">
                                <img src="/loading.gif" style={{ width: 25 + "px" }} alt="loading" /> Waiting for host to start the next round
                    </div> :
                        null
                }
                {
                    this.state.hostPlayer === localStorage.getItem('GameUserId') ?
                        numberOfActivePlayers === 1 ?
                            <div className="text-center">
                                <button className="btn btn-danger m-5 p-2" onClick={this.leaveGame}>Leave Game</button>
                            </div> :
                            null :
                        <div className="text-center">
                            <button className="btn btn-danger m-5 p-2" onClick={this.leaveGame}>Leave Game</button>
                        </div>

                }
            </div>
        );
    }

}
//export OtherPlayers Component
export default OtherPlayers;