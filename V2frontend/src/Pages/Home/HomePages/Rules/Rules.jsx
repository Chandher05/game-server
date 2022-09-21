

function Rules() {

  return <div>
    <div>
      <ul>
        <li>You can have 2 to up to 5 players in a single game. </li>
        <li>A standard deck of 52 cards is used for this game</li>
        <li>The aim of this game is very simple (okay, it is not that simple but it gets
          better, trust me), to get the least points
          possible.</li>
        <li>Each card has a certain weight, that is their own number but Queen, King and
          Jack also carry a weight of 10.</li>
        <li>This games has multiple rounds.</li>
        <li>
          Structure of each round -
          <ul>
            <li>At the start of each round, each individual in the game is given 5
              cards. But an extra card (that is 6 cards) is given to player who is starting that particular
              round. </li>
            <li>Individuals then take turns dropping cards trying to reduce their score
            </li>

            <li>
              An Individual can drop any single card or drop a group of any type (that is a pair of tens,
              Three cards of Queens or even four Kings but we do no allow pairing of suits. )
            </li>
            <li>
              After an individual drops a card, he has been requested to pick only one card (even if the
              individual drops pairs, three cards or four cards) either from the deck (random card) or pick
              one card from the previous player's dropped cards (Notice the player who starts first has no
              previous dropped cards to pick from, hence given the extra card to begin with)
            </li>
            <li>This continues in a circle, till an indvidual claims "Declare!" </li>
            <li>Okay, Yes, Will have to tell how to and What is Declare. A player can
              only declare
              when he has lower (not equal to) than a score of 15 when totaling his cards. An individual can
              only declare if it is his turn (and he cannot declare in the same round as dropping their
              cards). You declare when you are confident you have a lesser score than the others who are
              playing.
            </li>
            <li>What happens after they declare? </li>
            <li> Good question, Once an individual has declared, they then everyone goes
              on to share their scores of thier own cards as well. The individual who declared gets zero on
              the points table
              and the others get their respective points of the cards they were holding. </li>
            <li>If any other individual is found to have lower than the declared
              person's score then the declared person gets a penalty of 50 points (rest stays the same). </li>
            <li>BUT (and this is what makes the game interesting), </li>
            <li>If the person who declared, declares with a pairs of any two cards (Ex:
              (K,K) (9,9), (7,7)) has an automatic -25 on their points total in the table for that round,
              regardless of what any other
              individual scores. </li>
          </ul>
          And this loop goes on till the last person is standing.
        </li>
        <li> If any individual at any point has a cumulative point total on the table of
          over 101, then
          that person is out of the game and the rest continue to play, till the last man standing (which leads to
          some spectacular finishes). </li>
        <li> The person to end up with the least points total is termed the WINNER (or which
          means, the others all are eliminated by having a score above 101)</li>
      </ul>

    </div>
    <nav>
      <p>Have fun playing Declare</p>
    </nav>
  </div>
}

export default Rules;