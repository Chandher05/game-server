import CalcuateScore from './calculateScore';

var roundStatus = (allPlayers) => {

    var data = {},
        lowestScore = 1000,
        lowestPlayer = [],
        score
    for (var player of allPlayers) {
        score = CalcuateScore(player.currentCards)
        if (score == lowestScore) {
            lowestPlayer.push(player.userId)
        } else if (score < lowestScore) {
            lowestPlayer = [player.userId]
            lowestScore = score
        }

        data[player.userId] = {
            userName: player.userName,
            isPair: (player.currentCards.length == 2 && (player.currentCards[0] - player.currentCards[1]) % 13 == 0),
            isLowest: false,
            isSame: false
        }
    }

    
    for (var player of lowestPlayer) {
        data[player].isLowest = true
        if (lowestPlayer.length > 1) {
            data[player].isSame = true
        }
    }
    return data
}

export default roundStatus;