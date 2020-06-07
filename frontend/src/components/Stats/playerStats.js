import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

class PlayerStats extends Component {

    constructor() {
        super()
        this.state = {
            stats: null
        }
    }

    componentDidMount() {
        axios.get(`/users/stats/${this.props.userId}`)
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
            return (<img src="/loading.gif" style={{ width: 50 + "px" }} alt="loading" className="m-4" />)
        }

        const average = this.state.stats.totalDeclares / this.state.stats.gamesCount
        return (
            <div>
                <h4>Total games played: {this.state.stats.gamesCount}</h4>
                <h4>Total wins: {this.state.stats.totalWins}</h4>
                <h4>Total number of declares: {this.state.stats.totalDeclares}</h4>
                <h4>Declares per game: {average.toFixed(2)}</h4>
                <h4>+50s: {this.state.stats.totalFifties}</h4>
                <h4>-25s: {this.state.stats.totalPairs}</h4>
            </div>
        )
    }
}
//export PlayerStats Component
export default PlayerStats;