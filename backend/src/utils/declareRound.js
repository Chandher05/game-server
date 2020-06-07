import Game from '../models/mongoDB/game';
import Users from '../models/mongoDB/users';
import GameMember from '../models/mongoDB/gameMember';
import CardValues from './cardValues';

var endGame = (gameId, userName, isAutoPlay) => {
    return new Promise( async(resolve) => {
        await Game.findOneAndUpdate(
            {
                gameId: gameId
            },
            {
                isEnded: true,
                previousDroppedPlayer: userName,
                lastPlayedAction: "has won the game"
            }
        )
        
        if (isAutoPlay == false) {
            await Users.findOneAndUpdate(
                {
                    userName: userName
                },
                {
                    $inc: {
                        totalWins: 1
                    }
                }
            )
        }

        resolve()
    })
}

var updateStats = (userId, score) => {
    return new Promise(async(resolve) => {
        let params = {
                totalDeclares: 1
        }
        if (score == -25) {
            params.totalPairs = 1
        } else if (score == 50) {
            params.totalFifties = 1
        }
        await Users.findByIdAndUpdate(
            userId,
            {
                $inc: params
            }
        )
        resolve()
    })
}

var declareRound = (gameId, userId, isAutoPlay) => {
    return new Promise( async (resolve) => {
        let game = await Game.findOne({
            gameId: gameId
        })

        if (game.isRoundComplete === true) {
            console.log("Round is complete")
            resolve()
            return
        }
        
        if (game.currentPlayer.toString() != userId) {
            console.log("Not current player")
            resolve()
            return
        }

        let gameMembers = await GameMember.find({
            gameId: gameId
		})
		
		let min = 1000,
			playerScore,
			total,
			isPair = false,
			allScores = {},
			beforeScores = {},
			lastPlayedAction,
			playerUserName
		

		// Calculate score of each player in the game
		for (var player of gameMembers) {
            beforeScores[player.userId.toString()] = player.score
            if (player.isAlive == false) {
                continue
            }
			total = 0
			for (var card of player.currentCards) {
				
				total += CardValues(card)
			}
			if (player.userId.toString() == userId) {
				playerUserName = player.userName
				if (player.currentCards.length == 2 && (player.currentCards[0] - player.currentCards[1]) % 13 == 0 ) {
					isPair = true
					playerScore = -25
					lastPlayedAction = "declared with a pair"
				} else {
					playerScore = total
					lastPlayedAction = `declared with ${total} points` 
				}
			} else {
                min = Math.min(total, min)
            }
			allScores[player.userId.toString()] = total
		}

        // Check if person declared has the lowest sum and reassign scores accordingly
		if (isPair == false && playerScore < min) {
			allScores[userId] = 0
		} else if (isPair == false && playerScore > min) {
			allScores[userId] = 50
		} else if (isPair == false && playerScore == min) {
			allScores[userId] *= 2
		} else {
			allScores[userId] = -25
		}

		// Update game status to ended
		await Game.findOneAndUpdate(
			{
				gameId: gameId
			},
			{
				previousDroppedPlayer: playerUserName,
				lastPlayedAction: lastPlayedAction,
                isRoundComplete: true,
                previousDroppedCards: [],
                lastPlayedTime: Date.now(),
                $inc: {
                    roundsComplete: 1
                }
			}
        )

        let numberOfActivePlayers = 0
        let activePlayerName = "No one"
        // Update scores of all members
        for (var player in beforeScores) {
            var previousScore = beforeScores[player]
            if (previousScore > 100) {
                await GameMember.findOneAndUpdate(
                    {
                        gameId: gameId,
                        userId: player
                    },
                    {
                        $push: {
                            roundScores: -1
                        }
                    }
                )
            } else if (previousScore + allScores[player] > 100) {
                await GameMember.findOneAndUpdate(
                    {
                        gameId: gameId,
                        userId: player
                    },
                    {
                        $inc: {
                            score: allScores[player]
                        },
                        $push: {
                            roundScores: allScores[player]
                        },
                        isAlive: false
                    }
                )
            } else if (previousScore < 101) {
                numberOfActivePlayers += 1
                var temp = await GameMember.findOneAndUpdate(
                    {
                        gameId: gameId,
                        userId: player
                    },
                    {
                        $inc: {
                            score: allScores[player]
                        },
                        $push: {
                            roundScores: allScores[player]
                        }
                    }
                )  
                activePlayerName = temp.userName 
            }

        }

        // End the game if lesser than 2 players are active
        if (numberOfActivePlayers < 2) {
            await endGame(gameId, activePlayerName, isAutoPlay)
        }
        if (isAutoPlay == false) {
            await updateStats(userId, playerScore)
        }

        resolve()
    })

}

export default declareRound;