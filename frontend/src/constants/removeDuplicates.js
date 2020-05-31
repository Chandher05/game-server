var removeDuplicates = (arr) => {
    var visited = {}
    var newArr = []
    for (var value of arr) {
        if (value in visited) {
            continue
        }
        visited[value] = true
        newArr.push(value)
    }
    return newArr
}

export default removeDuplicates;