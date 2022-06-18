const calculateScoreClass = (target: number, totalSpent: number): string => {
    let newScore = 'good-score';
    const difference = target - totalSpent;
    if (difference > (.05 * target)) {
        newScore = 'warn-score';
    }
    else if (difference < 0) {
        newScore = 'bad-score';
    }
    
    return newScore;
};

export default calculateScoreClass;