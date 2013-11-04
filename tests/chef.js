var expect = require('chai').expect,
    chef = require('../chef'),
    key = require('fs').readFileSync(__dirname + '/fixtures/example.pem'),
    nock = require('nock');

describe('chef', function () {
   describe('createClient', function () {
        it('should be a function', function () {
            expect(chef.createClient).to.be.a('function');
        });
    });

    describe('Client', function () {
        describe('Base URI', function () {
            beforeEach(function () {
                this.client = chef.createClient('test', key, 'https://example.com');
                nock('https://example.com').get('/nodes').reply(200);
            });

            it('should use the base URI when none is given in the request', function () {
                var request = this.client.get('/nodes');
                expect(request.uri.href).to.eq('https://example.com/nodes');
            });

            it('should use the URI in the argments if it is a full one', function () {
                var request = this.client.get('https://example.com/nodes');
                expect(request.uri.href).to.eq('https://example.com/nodes');
            });
        });
    });
});
