import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import WaitingScreen from '../Common/WaitingScreen';

class CompleteStats extends Component {

    constructor() {
        super()
        this.state = {
            stats: null
        }
    }

    componentDidMount() {
        axios.get(`/users/stats/${localStorage.getItem('GameUserId')}`)
        .then((response) => {
            this.setState({
                stats: response.data
            })
        })
    }

    render() {

        if (!localStorage.getItem('GameUserId')) {
            return (<Redirect to="/" />)
        } else if (this.state.stats === null) {
            return (<WaitingScreen />)
        }

        const average = this.state.stats.totalDeclares / this.state.stats.gamesCount
        return (
            <div>
                <h2>Total games played: {this.state.stats.gamesCount}</h2>
                <h2>Total wins: {this.state.stats.totalWins}</h2>
                <h2>Total number of declares: {this.state.stats.totalDeclares}</h2>
                <h2>Declares per game: {average.toFixed(2)}</h2>
                <h2>+50s: {this.state.stats.totalFifties}</h2>
                <h2>-25s: {this.state.stats.totalPairs}</h2>
                <a href="/"><button className="btn btn-success">Return back</button></a>
            </div>
        )
    }
}
//export CompleteStats Component
export default CompleteStats;