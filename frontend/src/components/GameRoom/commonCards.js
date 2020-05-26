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
            action: null,
            isFetched: false
        }
    }

    componentDidMount() {
        setInterval(() => {
            GameCards(this.props.gameId, (cardOnTop, previousDroppedCard, previousDroppedPlayer, action) => {
                this.setState({
                    cardOnTop: cardOnTop,
                    previousDroppedCard: previousDroppedCard,
                    previousDroppedPlayer: previousDroppedPlayer,
                    action: action,
                    isFetched: true
                })
            })
        }, 1000);
    }

    render() {

        if (this.state.isFetched === false) {
            return (null)
        }

        let cardNames = []
        for (var card of this.state.previousDroppedCard) {
            cardNames.push(<p>{CardNames[card]}</p>)
        }

        return (
            <div>
                <p className={{minHeight: 1}}>Card On Top: {CardNames[this.state.cardOnTop]}</p>
                <div className="row" style={{minHeight: 25 + "vh"}}>
                    <div className="col-md-9">
                        <p className="display-4">{this.state.previousDroppedPlayer} {this.state.action}</p>
                    </div>
                    <div className="col-md-3 text-center">
                        <img src="/deck.png" alt="cardDeck" style={{width: 100 + "%"}} />
                        <span className="font-weight-bold">Deck</span>
                    </div>
                </div>
                <p>Dropped card(s)</p>
                <div className="">{cardNames}</div>

            </div>
        );
    }

}
//export commonGameCards Component
export default CommonGameCards;