var cardValue = (number) => {
    var pos = number % 13
    if (pos === 0 || pos > 10) {
        return 10
    }
    return pos
}

export default cardValue;