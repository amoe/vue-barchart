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
    return Math.pow(10, Math.floor(log10(max * 0.01)));
}

function getAdjustedBounds(min, max) {
    const sizeOfRange = max - min;
    const roundTo = getRoundingTarget(max);

    const adjustedMin = floorN(min, roundTo);
    const adjustedMax = ceilingN(max, roundTo);

    return {
        min: adjustedMin,
        max: adjustedMax
    };
}


const functions = {
    generateTicks(min: number, max: number, nTicks: number) {
      
        const adjustedBounds = getAdjustedBounds(min, max);
  
        const step = (adjustedBounds.max  - adjustedBounds.min) / nTicks;

        log.debug("adjusted min was %o", adjustedBounds.min);
        log.debug("adjusted max was %o", adjustedBounds.max);
        log.debug("step was %o", step);

        return _.range(1, nTicks + 1).map(n => adjustedBounds.min + (step * n));
    },
    getAdjustedBounds
};

export default functions;
