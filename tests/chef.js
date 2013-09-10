var expect = require('chai').expect;

describe('chef', function () {
    describe('createClient', function () {
        it('should be a function', function () {
            expect(require('chef').createClient).to.be.a('function');
        });
    });
});
