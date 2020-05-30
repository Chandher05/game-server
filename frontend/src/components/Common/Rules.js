import React, { Component } from 'react';

class Rules extends Component {

    render() {

        return (
            <div>
                <div class="jumbotron bg-info text-white">
                    <h1 class="display-4">Declare!</h1>
                    <p class="lead">Given below are the rules for the ultimate card game.</p>
                </div>
                <div class="container-fluid  mb-md-4">
                    <ul class="list-group">
                        <li class="list-group-item">You can have 2 to up to 5 players in a single game. </li>
                        <li class="list-group-item">A standard deck of 52 cards is used for this game</li>
                        <li class="list-group-item">The aim of this game is very simple (okay, it is not that simple but it gets
                        better, trust me), to get the least points
                possible.</li>
                        <li class="list-group-item">Each card has a certain weight, that is their own number but Queen, King and
                Jack also carry a weight of 10.</li>
                        <li class="list-group-item">This games has multiple rounds.</li>
                        <li class="list-group-item">
                            Structure of each round -
                <ul class="list-group mx-md-1 px-md-2 bg-info ">
                                <li class="list-group-item">At the start of each round, each individual in the game is given 5
                                cards. But an extra card (that is 6 cards) is given to player who is starting that particular
                        round. </li>
                                <li class="list-group-item">Individuals then take turns dropping cards trying to reduce their score
                    </li>

                                <li class="list-group-item">
                                    An Individual can drop any single card or drop a group of any type (that is a pair of tens,
                                    Three cards of Queens or even four Kings but we do no allow pairing of suits. )
                    </li>
                                <li class="list-group-item">
                                    After an individual drops a card, he has been requested to pick only one card (even if the
                                    individual drops pairs, three cards or four cards) either from the deck (random card) or pick
                                    one card from the previous player's dropped cards (Notice the player who starts first has no
                                    previous dropped cards to pick from, hence given the extra card to begin with)
                    </li>
                                <li class="list-group-item">This continues in a circle, till an indvidual claims "Declare!" </li>
                                <li class="list-group-item">Okay, Yes, Will have to tell how to and What is Declare. A player can
                                only declare
                                when he has lower (not equal to) than a score of 15 when totaling his cards. An individual can
                                only declare if it is his turn (and he cannot declare in the same round as dropping their
                                cards). You declare when you are confident you have a lesser score than the others who are
                                playing.
                    </li>
                                <li class="list-group-item">What happens after they declare? </li>
                                <li class="list-group-item"> Good question, Once an individual has declared, they then everyone goes
                                on to share their scores of thier own cards as well. The individual who declared gets zero on
                                the points table
                        and the others get their respective points of the cards they were holding. </li>
                                <li class="list-group-item">If any other individual is found to have lower than the declared
                        person's score then the declared person gets a penalty of 50 points (rest stays the same). </li>
                                <li class="list-group-item">BUT (and this is what makes the game interesting), </li>
                                <li class="list-group-item">If the person who declared, declares with a pairs of any two cards (Ex:
                                (K,K) (9,9), (7,7)) has an automatic -25 on their points total in the table for that round,
                                regardless of what any other
                        individual scores. </li>
                            </ul>
                And this loop goes on till the last person is standing.
            </li>
                        <li class="list-group-item"> If any individual at any point has a cumulative point total on the table of
                        over 101, then
                        that person is out of the game and the rest continue to play, till the last man standing (which leads to
                some spectacular finishes). </li>
                        <li class="list-group-item"> The person to end up with the least points total is termed the WINNER (or which
                means, the others all are eliminated by having a score above 101)</li>
                    </ul>

                </div>
                <nav class="navbar bottom  bg-info ">
                    <p class="navbar-brand text-white">Have fun playing Declare</p>
                </nav>
            </div>
        )
    }
}
//export Rules Component
export default Rules;