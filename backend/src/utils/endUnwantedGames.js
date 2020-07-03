import cron from "node-cron"
import Game from '../models/mongoDB/game';

cron.schedule("0 0 */1 * * *", async () => {

    console.log("cleaning data")

    var allGames = await Game.find({
        isStarted: true,
        isEnded: false
    })

    for (var game of allGames) {
        let idleTime = new Date(Date.now() - game.lastPlayedTime).getHours()
        
        if (idleTime > 1) {
            await Game.findOneAndUpdate(
                {
                    gameId: game.gameId
                },
                {
                    isStarted: true,
                    isEnded: true
                }
            )
        }

    }
})