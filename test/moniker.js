var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var Moniker = require('../lib/moniker');

describe('Moniker', function() {
	it('generates string', function() {
		expect(Moniker.choose()).to.be.a('string');
	});

	it('generates string with template', function() {
		var names = Moniker.generator([Moniker.adjective, Moniker.noun], { maxSize: 7 });
		expect(names.choose()).to.be.a('string');
		expect(names.choose()).to.not.equal(names.choose());
	});
});