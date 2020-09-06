import React, { Component } from 'react';
import '../Common/style.css';
import './hallOfFame.css';
// import {Redirect} from 'react-router';

class HallOfFame extends Component {

    render() {

        // if (!localStorage.getItem('GameUserId')) {
        //     return (<Redirect to="/" />)
        // }

        return (
            <div className="p-5">

                <div className="row">
                    <div className="col-md-2">
                        <a href="/">
                            <button className="btn blueBackground text-white display-4">
                                <i class="fas fa-home display-4"></i> Home
                            </button>
                        </a>
                    </div>
                    <div className="col-md-8">
                        <p className="display-4 font-weight-bold text-warning text-center">Hall Of Fame</p>
                    </div>
                </div>


                <div className="text-center">

                </div>

                <div className="mt-3 mb-3 divider"></div>
                <div className="row">
                    <div className="col-md-4 offset-md-1 blueText">
                        <div className="bg-light p-2">
                            <h3 className="bg-warning font-weight-bolder p-2 text-center">Tournament 1</h3>
                            <p className="text-justify">
                                Declare is a simple card game. This game was being played by a group 
                                of friends for years has now become an international tournament. The 
                                journey has been incredible.
                            </p>

                            <p className="text-justify">
                                When so many things moved online due to the pandemic, Declare was also 
                                destined to move online as well. It has been a joy to share this game 
                                with all of you. With the increasing popularity of the game, we decided 
                                to have a tournament. The first-ever Declare tournament was conducted on 
                                5th Sept and 6th Sept of 2020. The tournament had 16 sign-ups, and it 
                                has been one incredible tournament. A big thank you to all the 
                                participants for making this an amazing success.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-5 offset-md-1 playerInfo">

                        {/* <div className="zIndexForeground p-3">
                            <img src="/HallOfFame/tournament-1.png" alt="winner-1" className="playerImage" />
                        </div> */}

                        <div className="bg-light p-2 zIndexBackground">
                            <h3 className="bg-warning font-weight-bolder p-2 blueText  text-center">Jayasurya Pinaki</h3>
                            <h6 className="font-weight-bolder p-2 blueBackground text-white  text-center">Winner</h6>
                            <div className="blueText">
                                <h4 className="font-weight-bolder">Runner up: <span className="font-weight-light">Anjali Ramesh</span></h4>
                                <h4 className="font-weight-bolder">Second runner up: <span className="font-weight-light">Sujith R</span></h4>
                                <p><span className="font-weight-bold">Semi finalists: </span>Aditya Vaidyanathan, Jampana Sriteja, Jishnu Mohan</p>
                                <h6>Participants: <span className="font-weight-light">Ameya Vaidyanathan, Arshmeen Baveja, Chandher Shekar R, Charumitra Sardana, Karthekeyan Sampath, Lipi Bag, Nitish Kumar, Shaivya Sahare, Sravanth Km</span></h6>
                                <br/>
                                <p><span className="font-weight-bold">MVP:</span> ANJALI <span className="font-italic">Clutch Queen</span> RAMESH for her never dying attitude</p>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="mt-3 mb-3 divider"></div>

            </div>
        )
    }
}
//export HallOfFame Component
export default HallOfFame;