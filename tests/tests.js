/* global describe, expect, it, groupedTimeout, mocha, chai, sinon */
mocha.setup({
	ui: 'bdd'
});

window.expect = chai.expect;
window.assert = chai.assert;
window.should = chai.should();

describe('API', function () {

	it('module should have correct API.', function () {
		expect(groupedTimeout).to.be.a('function');
	});

	it('timeouts should have correct API.', function () {
		var timeouts = groupedTimeout();

		expect(timeouts).to.respondTo('add');
		expect(timeouts).to.respondTo('always');
		expect(timeouts).to.respondTo('clear');
		expect(timeouts).to.respondTo('clearAll');
		expect(timeouts).to.respondTo('clearAlways');
	});
});

describe('Timeouts', function () {
	it('should run a callback after a delay', function () {
		var timeouts = groupedTimeout();
		var spy = sinon.spy();

		var clock = sinon.useFakeTimers();

		timeouts.add(spy, 200);
		expect(spy.called).to.equal(false);

		clock.tick(201);
		expect(spy.calledOnce).to.equal(true);

		clock.restore();
	});

	it('should not call a callback if it has been removed', function () {
		var timeouts = groupedTimeout();
		var spy = sinon.spy();

		var clock = sinon.useFakeTimers();

		var id = timeouts.add(spy, 200);
		expect(spy.called).to.equal(false);
		timeouts.clear(id);

		clock.tick(201);
		expect(spy.called).to.equal(false);

		clock.restore();
	});
});

describe('Always', function () {

	it('should run an always after a delay', function () {
		var timeouts = groupedTimeout();
		var spy = sinon.spy();

		var clock = sinon.useFakeTimers();

		timeouts.always(spy, 200);
		expect(spy.called).to.equal(false);

		clock.tick(201);
		expect(spy.calledOnce).to.equal(true);

		clock.restore();
	});

	it('should not an always when it is cleared with clearAlways', function () {
		var timeouts = groupedTimeout();
		var spy = sinon.spy();

		var clock = sinon.useFakeTimers();

		var id = timeouts.always(spy, 200);
		expect(spy.called).to.equal(false);

		timeouts.clearAlways(id);

		clock.tick(201);
		expect(spy.called).to.equal(false);

		clock.restore();
	});

	it('should run an always immediately when clearAll is called', function () {
		var timeouts = groupedTimeout();
		var spy = sinon.spy();

		var clock = sinon.useFakeTimers();

		timeouts.always(spy, 200);
		expect(spy.called).to.equal(false);

		timeouts.clearAll();
		expect(spy.calledOnce).to.equal(true);

		clock.restore();
	});

	it('should not run a timeout after clearAll is called', function () {
		var timeouts = groupedTimeout();
		var spy = sinon.spy();

		var clock = sinon.useFakeTimers();

		timeouts.add(spy, 200);
		expect(spy.called).to.equal(false);

		timeouts.clearAll();
		expect(spy.called).to.equal(false);

		clock.restore();
	});

	it('should not run an always again after its timeout when clearAll is called', function () {
		var timeouts = groupedTimeout();
		var spy = sinon.spy();

		var clock = sinon.useFakeTimers();

		timeouts.always(spy, 200);
		expect(spy.called).to.equal(false);

		timeouts.clearAll();
		expect(spy.calledOnce).to.equal(true);

		clock.tick(201);
		expect(spy.calledOnce).to.equal(true);

		clock.restore();
	});

});

mocha.run();
