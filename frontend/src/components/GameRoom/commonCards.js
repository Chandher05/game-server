import React, { Component } from 'react';
import GameCards from '../../APIs/gameCards';
import CardImages from '../../constants/cardImages';

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
            // cardNames.push(<p>{CardNames[card]}</p>)				
            cardNames.push(
                <div className="col-md-3 p-1 text-center">
                    <img src={CardImages[card]} alt="card" style={{height: 100 + "px"}} />
                </div>
            )
        }

        return (
            <div>
                {/* <p className={{minHeight: 1}}>Card On Top: {CardNames[this.state.cardOnTop]}</p> */}
                <div className="row" style={{minHeight: 25 + "vh"}}>
                    <div className="col-md-10">
                        <p className="display-4">{this.state.previousDroppedPlayer} {this.state.action}</p>
                    </div>
                    <div className="col-md-2 text-center">
                        <img src="/deck.png" alt="cardDeck" style={{width: 100 + "%"}} />
                        <span className="font-weight-bold">Deck</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <p className="font-weight-bold">Card(s) on the table</p>
                    </div>
                </div>
                <div className="row" style={{height: 25 + "vh"}}>
                    {cardNames}
                </div>
                {/* <p>Dropped card(s)</p>
                <div className="">{cardNames}</div> */}

            </div>
        );
    }

}
//export commonGameCards Component
export default CommonGameCards;