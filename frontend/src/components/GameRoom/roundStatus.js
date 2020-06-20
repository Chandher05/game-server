import React, { Component } from 'react';
import GameStatus from '../../APIs/commonGameStatus';
import './style.css';

class RoundStatus extends Component {

    constructor() {
        super()
        this.state = {
            roundStatus: null
        }
    }

    componentDidMount() {
        GameStatus(this.props.gameId, localStorage.getItem('GameUserId'), (data) => {
            this.setState({
                roundStatus: data.roundStatus
            })
        })
    }

    render() {

        if (this.state.roundStatus === null) {           
            return (null)
        }
        console.log(this.state.roundStatus)

        
        // var didCurrentPlayerDeclare = false
        var declarePlayerUserId
        for (var player in this.state.roundStatus) {
            if (this.props.declarePlayerUsername === this.state.roundStatus[player].userName) {
                // if (localStorage.getItem('GameUserId') === player) {
                    // didCurrentPlayerDeclare = true
                // }
                declarePlayerUserId = player
                break
            } 
        }
        
        
        // Is pair Wicked Wango Cards
        if (this.state.roundStatus[declarePlayerUserId].isPair === true) {
            return (
                <div className="mt-5 p-3 font-weight-bold  text-center pair">
                    {this.state.roundStatus[declarePlayerUserId].userName} had wicked wango cards
                </div>
            )
        }


        // Is not lowest bamboozled
        if (this.state.roundStatus[declarePlayerUserId].isLowest === false) {
            return (
                <div className="mt-5 p-3 font-weight-bold text-white text-center bamboozled">
                    {this.state.roundStatus[declarePlayerUserId].userName} just got bamboozled
                </div>
            )
        }

        // Is lowest and same. Not so fast
        if (this.state.roundStatus[declarePlayerUserId].isLowest === true && this.state.roundStatus[declarePlayerUserId].isSame === true) {
            return (
                <div className="mt-5 p-3 font-weight-bold text-center equalScore">
                    Slow down {this.state.roundStatus[declarePlayerUserId].userName}!
                </div>
            )
        }

        // Is lowest. Has declared
        if (this.state.roundStatus[declarePlayerUserId].isLowest === true) {
            return (
                <div className="mt-5 p-3 font-weight-bold text-white text-center declare">
                    {this.state.roundStatus[declarePlayerUserId].userName} has declared
                </div>
            )
        }

        return (null)
    }
}
//export RoundStatus Component
export default RoundStatus;