import _ from 'lodash';

function ceilingN(x: number, n: number) {
    return Math.ceil(x / n) * n;
}

function floorN(x: number, n: number) {
    return Math.floor(x / n) * n;
}

const functions = {
    generateTicks(min: number, max: number, nTicks: number) {
        const sizeOfRange = max - min;
        const roundTo = sizeOfRange / nTicks;

        const realMin = floorN(min, roundTo);
        const realMax = ceilingN(max, roundTo);
        
        const step = (realMax  - realMin) / nTicks;

        return _.range(1, nTicks).map(n => realMin + (step * n));
    }
};

export default functions;
