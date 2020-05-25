import React, { Component } from 'react';
import GameScores from '../../APIs/gameScores';

class GameScoresComponent extends Component {

    constructor() {
        super()
        this.state = {
            scores: []
        }
    }

    componentDidMount() {
        setInterval(() => {
            GameScores(this.props.gameId, (scores) => {
                this.setState({
                    scores: scores,
                })
            })
        }, 1000);
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
        temp = [<div className={`${firstColClass} font-weight-bold`}></div>]
        for (person of this.state.scores) {
            temp.push(<div className={`${otherColClass} font-weight-bold`}>{person.userName}</div>)
        }
        scoresRows.push(temp)

        for (index = 0; index < numberOfRounds; index++) {
            temp = [<div className={firstColClass}>Round {index + 1}</div>]
            for (person of this.state.scores) {
                if (person.roundScores[index] === -1) {
                    temp.push(<div className={`${otherColClass}`}>-</div>)
                } else {
                    temp.push(<div className={`${otherColClass}`}>{person.roundScores[index]}</div>)
                }
            }
            scoresRows.push(temp)
        }

        temp = [<div className={firstColClass}>Round {numberOfRounds + 1}</div>]
        for (person of this.state.scores) {
            temp.push(<div className={`${otherColClass}`}>-</div>)
        }
        scoresRows.push(temp)

        temp = [<div className={`${firstColClass} font-weight-bold`}>Total</div>]
        for (person of this.state.scores) {
            if (person.score > 100) {
                temp.push(<div className={`${otherColClass} font-weight-bold text-danger`}>{person.score}</div>)
            } else {
                temp.push(<div className={`${otherColClass} font-weight-bold`}>{person.score}</div>)
            }
        }
        scoresRows.push(temp)

        return (
            <div className="row">
                {scoresRows}
            </div>
        );
    }

}
//export GameScoresComponent Component
export default GameScoresComponent;