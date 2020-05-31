var areCardsSame = (arr) => {
    var value = null
    for (var card of arr) {
        if (value !== null && (card - value) % 13 !== 0) {
            return false
        }
        value = card
    }
    return true
}

export default areCardsSame;