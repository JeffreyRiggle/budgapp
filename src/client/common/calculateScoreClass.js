export default (target, totalSpent) => {
    let newScore = 'good-score';
    let difference = target - totalSpent;
    if (difference > (.05 * target)) {
        newScore = 'warn-score';
    }
    else if (difference < 0) {
        newScore = 'bad-score';
    }
    
    return newScore;
}