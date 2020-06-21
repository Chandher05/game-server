import React, { Component } from 'react';
import axios from 'axios';
import '../Common/style.css';
import {Redirect} from 'react-router';

class Leaderboard extends Component {

    constructor() {
        super()
        this.state = {
            Leaderboard: [],
            sortColumn: null,
            sortTypeDecrease: null
        }
    }

    componentDidMount() {
        axios.get(`/users/leaderboard`)
            .then((response) => {
                this.setState({
                    Leaderboard: response.data
                })
            })
    }

    sortValues = (e) => {
        
        var columnNumber = parseInt(e.target.id, 10)
        var sortTypeDecrease
        if (this.state.sortColumn === columnNumber) {
            this.setState({
                sortTypeDecrease: !this.state.sortTypeDecrease
            })
            sortTypeDecrease = !this.state.sortTypeDecrease
        } else {
            this.setState({
                sortColumn: columnNumber,
                sortTypeDecrease: true
            })
            sortTypeDecrease = true
        }

        var allUserData = this.state.Leaderboard

        var scores = new Set()
        var scoresUsers = {}

        for (var userId in allUserData) {
            var user = allUserData[userId]

            switch (columnNumber) {

                case 1:
                    scores.add(parseInt(user.gamesCount, 10))
                    if (scoresUsers[user.gamesCount]) {
                        scoresUsers[user.gamesCount].push(user)
                    } else {
                        scoresUsers[user.gamesCount] = [user]
                    }
                    break;

                case 2:
                    scores.add(parseInt(user.totalWins, 10))
                    if (scoresUsers[user.totalWins]) {
                        scoresUsers[user.totalWins].push(user)
                    } else {
                        scoresUsers[user.totalWins] = [user]
                    }
                    break;

                case 3:
                    scores.add(parseInt(user.totalDeclares, 10))
                    if (scoresUsers[user.totalDeclares]) {
                        scoresUsers[user.totalDeclares].push(user)
                    } else {
                        scoresUsers[user.totalDeclares] = [user]
                    }
                    break;

                case 4:
                    scores.add(parseFloat(user.ratio))
                    if (scoresUsers[user.ratio]) {
                        scoresUsers[user.ratio].push(user)
                    } else {
                        scoresUsers[user.ratio] = [user]
                    }
                    break;

                case 5:
                    scores.add(parseInt(user.totalFifties, 10))
                    if (scoresUsers[user.totalFifties]) {
                        scoresUsers[user.totalFifties].push(user)
                    } else {
                        scoresUsers[user.totalFifties] = [user]
                    }
                    break;

                case 6:
                    scores.add(parseInt(user.totalPairs, 10))
                    if (scoresUsers[user.totalPairs]) {
                        scoresUsers[user.totalPairs].push(user)
                    } else {
                        scoresUsers[user.totalPairs] = [user]
                    }
                    break;
                
                default:

            }
        }

        var sortedScores
        if (sortTypeDecrease === true) {
            sortedScores = Array.from(scores).sort(function (a, b) { return b - a })
        } else {
            sortedScores = Array.from(scores).sort(function (a, b) { return a - b })
        }

        var sortedUsers = []
        for (var value of sortedScores) {
            if (columnNumber === 4) {
                sortedUsers = sortedUsers.concat(scoresUsers[value.toFixed(2)])
            } else {
                sortedUsers = sortedUsers.concat(scoresUsers[value])
            }
        }

        this.setState({
            Leaderboard: sortedUsers
        })

    }

    render() {

        if (!localStorage.getItem('GameUserId')) {
            return (<Redirect to="/" />)
        } else if (this.state.Leaderboard.length === 0) {
            return (
                <div className="text-center p-5">
                    <a href="/"><button className="btn btn-success">Return back</button></a>
                    <h2><img src="/loading.gif" style={{ width: 50 + "px" }} alt="loading" className="m-4" />Fetching leaderboard...</h2>
                </div>
            )
        }

        var allUserData = [],
            user,
            count = 1
        for (var userId in this.state.Leaderboard) {
            user = this.state.Leaderboard[userId]

            let background = ""
            if (localStorage.getItem('GameUserId') === user.userId.toString()) {
                background = "bg-warning"
            }
            
            allUserData.push(
                <div className={`row p-2 border-bottom ${background}`}>
                    <div className="col-md-2 text-break"><span className="font-weight-bold">{count++}. </span> {user.userName}</div>
                    <div className="col-md-10">
                        <div className="row">
                            <div className="col-md-2 text-center">{user.gamesCount}</div>
                            <div className="col-md-2 text-center">{user.totalWins}</div>
                            <div className="col-md-2 text-center">{user.totalDeclares}</div>
                            <div className="col-md-2 text-center">{user.ratio}</div>
                            <div className="col-md-2 text-center">{user.totalFifties}</div>
                            <div className="col-md-2 text-center">{user.totalPairs}</div>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="bg-light p-5">

                    <p className="display-4 text-center">Leaderboards</p>
                    <div className="text-center">
                        <a href="/"><button className="btn btn-success mb-5 w-25"><i class="fas fa-home"></i> Play more games</button></a>
                    </div>


                    <div className="row font-weight-bold p-2 border-bottom">
                        <div className="col-md-2">Username</div>
                        <div className="col-md-10">
                            <div className="row">
                                <div className="col-md-2 text-center"># Games <i class="fas fa-sort showPointer" onClick={this.sortValues} id="1"></i></div>
                                <div className="col-md-2 text-center">Wins <i class="fas fa-sort showPointer" onClick={this.sortValues} id="2"></i></div>
                                <div className="col-md-2 text-center">Declares <i class="fas fa-sort showPointer" onClick={this.sortValues} id="3"></i></div>
                                <div className="col-md-2 text-center">Per game <i class="fas fa-sort showPointer" onClick={this.sortValues} id="4"></i></div>
                                <div className="col-md-2 text-center">+50's <i class="fas fa-sort showPointer" onClick={this.sortValues} id="5"></i></div>
                                <div className="col-md-2 text-center">-25's <i class="fas fa-sort showPointer" onClick={this.sortValues} id="6"></i></div>
                            </div>
                        </div>
                    </div>

                    {allUserData}

            </div>
        )
    }
}
//export Leaderboard Component
export default Leaderboard;