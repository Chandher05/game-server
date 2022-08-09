import React, { Component } from 'react';
import { Redirect } from 'react-router';
import "./style.css";

class WaitingScreen extends Component {

    constructor() {
        super()
        this.state = {
            redirect: null
        }
    }

    reloadPage = () => {
        window.location.reload()
    }

    logout = () => {
        localStorage.removeItem('GameUserId')
        localStorage.removeItem('GameUsername')
        this.setState({
            redirect: <Redirect to="/login" />
        })
    }

    render() {

        if (this.state.redirect) {
            return (this.state.redirect)
        }

        return (
            <div>
                <div className="text-center m-5">
                    <p className="text-primary">Please click <span className="showPointer" onClick={this.reloadPage}>here</span> if you are not redirected in 5 seconds...</p>
                </div>
                <div className="text-center m-5 p-5">
                    {/* <a href="/report"><p className="text-danger">Report bug</p></a> */}
                    <p>Write a mail to <a href="mailto:jayasurya1796@gmail.com">jayasurya1796@gmail.com</a> in case of any issues</p>
                </div>
                <div className="text-center m-5 p-5">
                    <p className="showPointer" onClick={this.logout}>Logout</p>
                </div>
            </div>
        )
    }
}
//export WaitingScreen Component
export default WaitingScreen;