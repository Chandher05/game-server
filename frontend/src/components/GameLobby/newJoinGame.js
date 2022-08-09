import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import WaitingScreen from '../Common/WaitingScreen';
import UserOperations from './userOperations';
import GameIdHandler from './gameIdHandler';
import '../Common/style.css';


class JoinGame extends Component {

    constructor() {
        super()
        this.state = {
            gameId: null,
            redirect: null,
            errMsg: '',
            isFetched: false
        }
    }

    componentDidMount() {
        axios.get(`/users/profile/${localStorage.getItem('GameUserId')}`)
            .then((response) => {
                if (response.status === 204) {
                    localStorage.removeItem('GameUserId')
                    localStorage.removeItem('GameUsername')
                    this.setState({
                        redirect: "/"
                    })
                }
                this.setState({
                    isFetched: true
                })
            })
            .catch(() => {
                localStorage.removeItem('GameUserId')
                localStorage.removeItem('GameUsername')
                this.setState({
                    redirect: "/",
                    isFetched: true
                })
            })

        axios.get(`/game/currentGame/${localStorage.getItem('GameUserId')}`)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        redirect: `/tournament/lobby/${response.data.gameId}`
                    })
                }
                this.setState({
                    isFetched: true
                })
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 409) {
                        this.setState({
                            redirect: `/gameRoom/${error.response.data.gameId}`
                        })
                    }
                }
                this.setState({
                    isFetched: true
                })
            })
        // var urlParams = new URLSearchParams(window.location.search);
        if (this.props.match.params.gameId) {
            this.setState({
                gameId: this.props.match.params.gameId
            })
        }
    }

    gameIdChangeHandler = (e) => {
        this.setState({
            gameId: e.target.value
        })
    }

    joinGame = () => {
        this.setState({
            errMsg: ''
        })
        const userData = {
            gameId: this.state.gameId,
            userId: localStorage.getItem('GameUserId')
        }
        axios.post('/tournament/join', userData)
            .then((response) => {
                if (response.status === 204) {
                    this.setState({
                        errMsg: "Invalid game ID"
                    })
                } else {
                    this.setState({
                        redirect: `/lobby/${this.state.gameId}`
                    })
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 404) {
                        this.setState({
                            errMsg: 'Error in joining game'
                        })
                    } else if (error.response.status === 409) {
                        this.setState({
                            errMsg: error.response.data
                        })
                    } else {
                        this.setState({
                            redirect: `/lobby/${this.state.gameId}`
                        })
                    }
                } else {
                    this.setState({
                        errMsg: 'Error in creating game'
                    })
                }
            })
    }

    render() {

        if (!localStorage.getItem('GameUserId')) {
			return (<Redirect to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} />)
        }

        if (this.state.isFetched === false) {
            return (<WaitingScreen />)
        }

        if (this.state.redirect !== null) {
            return (<Redirect to={this.state.redirect} />)
        }

        return (
            <div>
                <div className="row pt-5 pb-2">
                    <div className="col-md-8 offset-md-2 text-center">
                        {/* <p className="font-weight-bold">Sponsored by</p> */}
                        {/* <a href="http://collectarupee.com/" target="_blank" rel="noopener noreferrer">
                            <img src="banner.png" className="rounded" style={{ width: 100 + "%" }} alt="gameLogo" />
                        </a> */}
                        <a href="http://hostelit.in/" target="_blank" rel="noopener noreferrer">
                            <img src="/hostelit.jfif" className="rounded" style={{ width: 100 + "%" }} alt="gameLogo" />
                        </a>
                        {/* <p className="font-italic pt-4">What are your thoughts on introducing season in leaderboard?</p>
                        <p className="font-italic">Click on the give feedback button to let us know. We would love to hear from you.</p> */}
                        <p className="pt-4">Write a mail to <span className="text-primary text-underline">jayasurya1796@gmail.com</span> in case of any issues</p>
                        <GameIdHandler gameId={this.state.gameId} />
                    </div>
                    <div className="col-md-2">
                        <UserOperations />
                    </div>
                </div>

            </div>
        );

    }


}

//export JoinGame Component
export default JoinGame;