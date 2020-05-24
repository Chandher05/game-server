import React, { Component } from 'react';
import GameCards from '../../APIs/gameCards';
import CardValues from '../../constants/cardValues';

class CommonGameCards extends Component {

    constructor() {
        super()
        this.state = {
            cardOnTop: null,
            previousDroppedCard: [],
            previousDroppedPlayer: null
        }
    }

    componentDidMount() {
        setInterval(() => {
            GameCards(this.props.gameId, (cardOnTop, previousDroppedCard, previousDroppedPlayer) => {
                console.log(cardOnTop, previousDroppedCard, previousDroppedPlayer)
                this.setState({
                    cardOnTop: cardOnTop,
                    previousDroppedCard: previousDroppedCard,
                    previousDroppedPlayer: previousDroppedPlayer
                })
            })
        }, 1000);
    }

    render() {
        let cardNames = []
        for (var card of this.state.previousDroppedCard) {
            cardNames.push(<p>{CardValues[card]}</p>)
        }

        return (
            <div>
                <p>Card On Top: {CardValues[this.state.cardOnTop]}</p>
                <p>Dropped by: {this.state.previousDroppedPlayer}</p>
                <div>{cardNames}</div>

            </div>
        );
    }

}
//export commonGameCards Component
export default CommonGameCards;