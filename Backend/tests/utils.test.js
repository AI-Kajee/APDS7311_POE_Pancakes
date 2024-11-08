// utils.test.js
const { add, subtract } = require('../utils');

// Tests for the `add` function
test('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
});

test('adds -1 + -1 to equal -2', () => {
    expect(add(-1, -1)).toBe(-2);
});

test('adds 0 + 0 to equal 0', () => {
    expect(add(0, 0)).toBe(0);
});

// Tests for the `subtract` function
test('subtracts 5 - 2 to equal 3', () => {
    expect(subtract(5, 2)).toBe(3);
});

test('subtracts 0 - 0 to equal 0', () => {
    expect(subtract(0, 0)).toBe(0);
});
