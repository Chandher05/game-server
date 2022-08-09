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
                            <h3 className="bg-warning font-weight-bolder p-2 text-center">Tournament 2</h3>
                            <h4 className="font-weight-bolder p-2 blueBackground text-white text-center">Winner: Shaivya Sahare</h4>
                            <img className="playerImage" src="/HallOfFame/winner-2.jpeg" alt="winner-1" />
                            <h6 className="text-justify">Shaivya used to the winnings from this tournament to help a organization who is trying to help street vendors rebuild their businesses post  
                                COVID. <a href="https://fundraisers.giveindia.org/fundraisers/empowering-our-street-vendors-to-rebuild-their-livelihoods" target="_blank" rel="noopener noreferrer">Link to the fundraiser</a>
                            </h6>
                            <h5 className="font-weight-bolder">Runners up: <span className="font-weight-light">Jampana Sriteja, Jishnu Mohan</span></h5>
                            <h5 className="font-weight-bolder">Finalist: <span className="font-weight-light">Charumitra Sardana</span></h5>
                            <h6>Participants: <span className="font-weight-light">Anjali Ramesh, Chandher Shekar R, Arshmeen Baveja, Rhea Miranda</span></h6>
                        </div>
                    </div>

                    <div className="col-md-5 offset-md-1 playerInfo">

                        {/* <div className="zIndexForeground p-3">
            <img src="/HallOfFame/tournament-1.png" alt="winner-1" className="playerImage" />
        </div> */}

                        <div className="bg-light p-2">
                            <div className="blueText">
                            <p className="text-justify">
                                On 23rd of January 2021, a group of people were notified about the second ever edition of the Declare Championship,
                                a chance for worthy contenders to be <span className="font-italic">declared</span> champion.
                                Each of the contenders was given a day’s notice to show up to the event, and of course, those whose plans were to
                                just play declare on a Sunday night showed up for what would turn out to be a dramatic, thrilling and
                                competitive-as-France championship
                            </p>

                            <p className="text-justify">
                                Heartbreaks, internet issues, panic, suspense – all of these graced the championship the way the contenders did. Charu, 
                                Shaivya and Teja entered the finals after their own commendable victories, and as Declare championships usually play out, 
                                each loser had a shot at the wild-card entry. Jishnu clinched the fourth spot at the finals, joining what would become a long 
                                and nail-biting finish. Multiple rounds, a 150 on the scoreboard and many -25s later, 3 finalists won two games each, making the 
                                last game the decider. Through all this, one finalist showed immense grit, intent and consistency. Shaivya Sahare was declared 
                                champion. She thanked Jishnu's 150, Charu's internet, and Teja's well, nothing because he was perfect and she doesn’t know why 
                                he lost, and the Gods of declare for their kindness, but we know she deserved it!
                            </p>

                            <p className="text-justify">
                            A huge thank you to the participants for sticking to your declare plan on Sunday night ;) and for bringing to this championship all 
                            that energy and enthusiasm. There’s no championship without banter, and all of you delivered and HOW. On 25th January, the second 
                            edition of the Declare Championship came to an end. This isn’t a <span className="font-weight-bold">goodbye</span>, but  
                            a <span className="font-weight-bold">see you in the next edition.</span> Au revoir, keep playing! 
                            </p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-3 mb-3 divider"></div>
                <div className="row">
                    <div className="col-md-4 offset-md-1 blueText">
                        <div className="bg-light p-2">
                            <h3 className="bg-warning font-weight-bolder p-2 text-center">Tournament 1</h3>
                            <h4 className="font-weight-bolder p-2 blueBackground text-white  text-center">Winner: Jayasurya Pinaki</h4>
                            <img className="playerImage" src="/HallOfFame/winner-1.jpeg" alt="winner-1" />
                            <h4 className="font-weight-bolder">Runner up: <span className="font-weight-light">Anjali Ramesh</span></h4>
                            <h4 className="font-weight-bolder">Second runner up: <span className="font-weight-light">Sujith R</span></h4>
                        </div>
                    </div>

                    <div className="col-md-5 offset-md-1 playerInfo">

                        {/* <div className="zIndexForeground p-3">
                            <img src="/HallOfFame/tournament-1.png" alt="winner-1" className="playerImage" />
                        </div> */}

                        <div className="bg-light p-2">
                            <div className="blueText">
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
                                <p><span className="font-weight-bold">Semi finalists: </span>Aditya Vaidyanathan, Jampana Sriteja, Jishnu Mohan</p>
                                <h6>Participants: <span className="font-weight-light">Ameya Vaidyanathan, Arshmeen Baveja, Chandher Shekar R, Charumitra Sardana, Karthekeyan Sampath, Lipi Bag, Nitish Kumar, Shaivya Sahare, Sravanth Km</span></h6>
                                <br />
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