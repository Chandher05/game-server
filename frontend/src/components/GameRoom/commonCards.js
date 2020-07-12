import React, { Component } from 'react';
import CardImages from '../../constants/cardImages';
import AreCardsSame from '../../constants/areCardsSame';
import GameStatus from '../../APIs/commonGameStatus';

class CommonGameCards extends Component {

    constructor() {
        super()
        this.state = {
            cardOnTop: null,
            previousDroppedCard: [],
            previousDroppedPlayer: null,
            action: null,
            isFetched: false,
            currentCards: {
                previousDroppedCard: []
            }
        }
    }

    componentDidMount() {
        GameStatus(this.props.gameId, localStorage.getItem('GameUserId'), (data) => {
            this.setState({
                currentCards: data.currentCards
            })
        })
    }

    render() {

        let cardNames = []
        if (AreCardsSame(this.state.currentCards.previousDroppedCard)) {
            for (var card of this.state.currentCards.previousDroppedCard) {
                cardNames.push(
                    <div className="col-md-3 p-1 text-center" key={card}>
                        <img src={CardImages[card]} alt="card" style={{ height: 100 + "px" }} />
                    </div>
                )
            }
        }

        return (
            <div className="mt-5">
                <div className="row">
                    <div className="col-md-10">
                        <h1 className="font-weight-light text-break">{this.state.currentCards.previousDroppedPlayer} {this.state.currentCards.action}</h1>
                        <p className="font-weight-bold">Card(s) on the table</p>
                        <div className="row" style={{ height: 20 + "vh" }}>
                            {cardNames}
                        </div>
                    </div>
                    <div className="col-md-2 text-center">
                        <img src="/deck.png" alt="cardDeck" style={{ width: 100 + "%" }} />
                        <span className="font-weight-bold">Deck</span>
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col-md-12">
                    </div>
                </div> */}
                {/* <div className="row" style={{height: 25 + "vh"}}>
                    {cardNames}
                </div> */}

            </div>
        );
    }

}
//export commonGameCards Component
export default CommonGameCards;