import React, { Component } from 'react';
import GameCards from '../../APIs/gameCards';
import CardNames from '../../constants/cardNames';

class CommonGameCards extends Component {

    constructor() {
        super()
        this.state = {
            cardOnTop: null,
            previousDroppedCard: [],
            previousDroppedPlayer: null,
            action: null
        }
    }

    componentDidMount() {
        setInterval(() => {
            GameCards(this.props.gameId, (cardOnTop, previousDroppedCard, previousDroppedPlayer, action) => {
                this.setState({
                    cardOnTop: cardOnTop,
                    previousDroppedCard: previousDroppedCard,
                    previousDroppedPlayer: previousDroppedPlayer,
                    action: action
                })
            })
        }, 1000);
    }

    render() {
        let cardNames = []
        for (var card of this.state.previousDroppedCard) {
            cardNames.push(<p>{CardNames[card]}</p>)
        }

        return (
            <div>
                <p>Card On Top: {CardNames[this.state.cardOnTop]}</p>
                <p>{this.state.previousDroppedPlayer} {this.state.action}</p>
                <p>Dropped card(s)</p>
                <div>{cardNames}</div>

            </div>
        );
    }

}
//export commonGameCards Component
export default CommonGameCards;