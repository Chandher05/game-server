import Users from '../models/mongoDB/users';
import GameMember from '../models/mongoDB/gameMember';
import Game from '../models/mongoDB/game';

var updateUserModule = () => {
    return new Promise(async (resolve) => {
        console.log("Updating user module")
        let allUsers = await Users.find()
        for (var user of allUsers) {
            let numberOfGames = await GameMember.find({
                userId: user._id
            })
            await Users.findByIdAndUpdate(
                user._id,
                {
                    totalGames: numberOfGames.length
                }
            )
        }
        console.log("Updated user module")
        // await Game.deleteMany()
        // await GameMember.deleteMany()
    })
}

updateUserModule();