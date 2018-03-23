import {assert} from 'chai';
import utility from '../src/utility';

it('gets the correct sequence', function() {
    const ticks = utility.generateTicks(0, 100, 10);
    assert.deepEqual(ticks, [10, 20, 30, 40, 50, 60, 70, 80, 90]);
});


it('works with odd ranges', function() {
    const ticks = utility.generateTicks(27, 49, 10);
    assert.deepEqual(ticks, [23, 26, 29, 32, 35, 38, 41, 44, 47]);
});
