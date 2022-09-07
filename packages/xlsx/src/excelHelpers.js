function getLetters(number) {
    let iter = 0;
    let remaining = number;
    while (remaining > 26) {
        remaining -= 27;
        iter++;
    }

    if (iter > 26) {
        return getLetters(iter) + String.fromCharCode(64 + remaining + 1);
    }

    return String.fromCharCode(64 + iter) + String.fromCharCode(64 + remaining + 1);
}

function numberToColumn(number) {
    if (number < 27) {
        return String.fromCharCode(64 + number);
    }

    return getLetters(number);
}

module.exports = {
    numberToColumn,
};
