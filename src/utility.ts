import * as _ from 'lodash';
import * as log from 'loglevel';

function log10(val) {
  return Math.log(val) / Math.LN10;
}

function ceilingN(x: number, n: number) {
    return Math.ceil(x / n) * n;
}

function floorN(x: number, n: number) {
    return Math.floor(x / n) * n;
}

function getRoundingTarget(max: number) {
    return Math.pow(10, Math.floor(log10(max)));
}

const functions = {
    generateTicks(min: number, max: number, nTicks: number) {
        const sizeOfRange = max - min;
        const roundTo = getRoundingTarget(max);

        const realMin = floorN(min, roundTo);
        const realMax = ceilingN(max, roundTo);
        
        const step = (realMax  - realMin) / nTicks;

        log.debug("real min was %o", realMin);
        log.debug("real max was %o", realMax);
        log.debug("step was %o", step);

        return _.range(1, nTicks).map(n => realMin + (step * n));
    }
};

export default functions;
