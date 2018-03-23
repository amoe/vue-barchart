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
