var shuffle = (array) => {
    let index = array.length;
    let temp;
    let pos;

    while (index > 0) {
        pos = Math.floor(Math.random() * index);
        index--;
        temp = array[index];
        array[index] = array[pos];
        array[pos] = temp;
    }
    return array;
}

export default shuffle;