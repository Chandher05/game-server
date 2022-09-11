exports.getCards = (availableCards, numberOfCardsNeeded) => {
    var totalNumberOfCards,
        count = 0,
        returnCards = []
    for (count = 0; count < numberOfCardsNeeded; count ++) {
        totalNumberOfCards = availableCards.length
        var index = Math.floor(Math.random() * totalNumberOfCards)
        returnCards.push(availableCards[index])
        availableCards.splice(index, 1)
    }
    return {
        cardsForPlayer: returnCards, 
        availableCards: availableCards
    }
}

exports.shuffle = (array) => {
    array.sort(() => Math.random() - 0.5);
}