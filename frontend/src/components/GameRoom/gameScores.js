import React, { Component } from 'react';
import GameStatus from '../../APIs/commonGameStatus';

class GameScoresComponent extends Component {

    constructor() {
        super()
        this.state = {
            scores: []
        }
    }

    componentDidMount() {
        GameStatus(this.props.gameId, localStorage.getItem('GameUserId'), (data) => {
            this.setState({
                scores: data.scores
            })
        })
    }

    render() {

        if (this.state.scores.length === 0) {
            return (null)
        }

        // 4 - 4 - 4
        // 3 - 3 - 3 - 3
        // 4 - 2 - 2 - 2 - 2 - 2
        // 2 - 2 - 2 - 2 - 2 - 2 - 2

        var numberOfRounds = this.state.scores[0].roundScores ? this.state.scores[0].roundScores.length : 0
        var scoresRows = []
        var firstColClass,
            otherColClass
        switch (this.state.scores.length) {
            case 2:
                firstColClass = "col-md-4 text-center"
                otherColClass = "col-md-4 text-center"
                break;
            case 3:
                firstColClass = "col-md-3 text-center"
                otherColClass = "col-md-3 text-center"
                break;
            case 4:
                firstColClass = "col-md-4 text-center"
                otherColClass = "col-md-2 text-center"
                break;
            case 5:
                firstColClass = "col-md-2 text-center"
                otherColClass = "col-md-2 text-center"
                break;

            default:
                break;
        }
        var temp,
            person,
            index
        temp = [<div className={`${firstColClass} font-weight-bold`} key="Heading"></div>]
        for (person of this.state.scores) {
            temp.push(<div className={`${otherColClass} font-weight-bold text-break`} key={person.userName}>{person.userName}</div>)
        }
        scoresRows.push(<div className="row" key={person.userName}>{temp}</div>)

        for (index = 0; index < numberOfRounds; index++) {
            temp = [<div className={firstColClass} key={index}>Round {index + 1}</div>]
            for (person of this.state.scores) {
                if (person.roundScores[index] === -1) {
                    temp.push(<div className={`${otherColClass}`} key={person.userName+index}>-</div>)
                } else {
                    temp.push(<div className={`${otherColClass}`} key={person.userName+index}>{person.roundScores[index]}</div>)
                }
            }
            scoresRows.push(<div className="row"  key={index + "Row"}>{temp}</div>)
        }

        temp = [<div className={firstColClass} key={numberOfRounds + 1}>Round {numberOfRounds + 1}</div>]
        for (person of this.state.scores) {
            temp.push(<div className={`${otherColClass}`} key={person.userName + numberOfRounds + 1}>-</div>)
        }
        scoresRows.push(<div className="row" key={person.userName + numberOfRounds + 1}>{temp}</div>)

        temp = [<div className={`${firstColClass} font-weight-bold`} key="Total">Total</div>]
        for (person of this.state.scores) {
            if (person.score > 100) {
                temp.push(<div className={`${otherColClass} font-weight-bold text-danger`} key={person.userName}>{person.score}</div>)
            } else {
                temp.push(<div className={`${otherColClass} font-weight-bold`} key={person.userName}>{person.score}</div>)
            }
        }
        scoresRows.push(<div className="row" key={"TotalRow"}>{temp}</div>)

        return (
            <div className="border">
                {scoresRows}
            </div>
        );
    }

}
//export GameScoresComponent Component
export default GameScoresComponent;