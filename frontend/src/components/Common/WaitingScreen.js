import React, { Component } from 'react';
import "./style.css";

class WaitingScreen extends Component {

    reloadPage = () => {
        window.location.reload()
    }

    render() {

        return (
            <div>
                <div className="text-center m-5">
                    <p className="text-primary">Please click <span className="showPointer" onClick={this.reloadPage}>here</span> if you are not redirected in 5 seconds...</p>
                </div>
                <div className="text-center m-5 p-5">
                    <a href="/report"><p className="text-danger">Report bug</p></a>
                </div>
            </div>
        )
    }
}
//export WaitingScreen Component
export default WaitingScreen;