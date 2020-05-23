import Game from '../models/mongoDB/game';

var generateId = (length) => {
    return new Promise(async (resolve) => {
        var result;
        while (true) {
            result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            let game = await Game.findOne({
                gameId: result
            })
            if (!game) {
                resolve(result)
                break
            }
        }
    })
}

export default generateId;