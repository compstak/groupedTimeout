# Grouped Timeout

The grouped timeout allows you to create a set of timeouts that can be cleared all at once. When you add a timeout you have the option of having it cancelled or run immediately when the groupedTimeout is cleared.

## Basic Usage

```javascript
var timeouts = groupedTimeout();

// use timeouts.add() just like you would setTimeout.
var timeoutId = timeouts.add(function () {
	console.log('I will run after one second unless the timeout is cleared.');
}, 1000);

// use timeouts.always() if you want to be guaranteed that the function will run.
var timeoutId = timeouts.always(function () {
	console.log('I will run after one second or immediately when the timeout is cleared.');
}, 1000);

if (weShouldntContinue) {
	// this will cancel the first callback
	// and immediately run the second.
	timeouts.clearAll();
}
```

## Methods

- `groupedTimeout.add(callback, delay)` - Adds a setTimeout. Returns the ID of the timeout as provided by setTimeout.
- `groupedTimeout.always(callback, delay)` - adds a timeout that will be run immeadiately if `clearAll()` is called.
- `groupedTimeout.clearAll()` - clears any pending timeouts and runs any callbacks added with `always`.
- `groupedTimeout.clear(timeoutId)` - runs clearTimeout.
- `groupedTimeout.clearAlways(timeoutId)` - runs clearTimeout and removes the always from the pending list.