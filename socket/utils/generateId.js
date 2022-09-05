import Game from '../src/models/mongoDB/game';

var generateId = (length) => {
    return new Promise(async (resolve) => {
        var result,
            game = true;
        while (game) {
            result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            game = await Game.findOne({
                gameId: result
            })
        }
        resolve(result)
    })
}

export default generateId;