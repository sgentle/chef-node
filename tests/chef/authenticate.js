var authenticate = require('../../chef/authenticate'),
    expect = require('chai').expect,
    sinon = require('sinon'),
    key = require('fs').readFileSync(__dirname + '/../fixtures/example.pem');

describe('authenticate', function () {
    beforeEach(function () {
        this.clock = sinon.useFakeTimers(0);
        this.client = { user: 'test', key: key };
        this.options = { body: '', uri: 'https://example.com/test?query=string' };
        this.headers = authenticate(this.client, this.options);
    });

    afterEach(function () {
        this.clock.restore();
    });

    it('should return an object', function () {
        expect(this.headers).to.be.an('object');
    });

    it('should have an X-Chef-Version property', function () {
        expect(this.headers).to.have.property('X-Chef-Version', '11.6.0');
    });

    it('should have an X-Ops-Content-Hash property', function () {
        expect(this.headers).to.have.property('X-Ops-Content-Hash',
                                              '2jmj7l5rSw0yVb/vlWAYkK/YBwk=');
    });

    it('should have an X-Ops-Sign property', function () {
        expect(this.headers).to.have.property('X-Ops-Sign', 'version=1.0');
    });

    it('should have an X-Ops-Timestamp property', function () {
        expect(this.headers).to.have.property('X-Ops-Timestamp',
                                              '1970-01-01T00:00:00Z');
    });

    it('should have an X-Ops-UserId property', function () {
        expect(this.headers).to.have.property('X-Ops-UserId', this.client.user);
    });

    it('should have X-Ops-Authorization-N properites', function () {
        expect(this.headers).to.have.property('X-Ops-Authorization-1',
            'KhaZ1XVgxQLGSNtFTlJqTbQzTbwwzB5i3FqgdoldtCbWoJJAAV8LZQBE6At3');
        expect(this.headers).to.have.property('X-Ops-Authorization-2',
            'WcXbvwjaIJLokAybOkdWLW5J17GFlA/3y0Mlb7bo1v3l+aFpVn2sWNzKG8MN');
        expect(this.headers).to.have.property('X-Ops-Authorization-3',
            'DKnzw6hHOgnkUK7byLi0qfEd9J0d5Vh9t4cFemFfrKwp7r+yn+yp6QxahVZK');
        expect(this.headers).to.have.property('X-Ops-Authorization-4',
            'GfwFUGH/TTE7EG8Zxiv620SvV00YozPswCcXAWgbfVOnHDfSpdzodg9q382P');
        expect(this.headers).to.have.property('X-Ops-Authorization-5',
            'SuiIOKavRlSQVGr1q7j0y7UiMrQaL9knE4A2u7ZI+FzNuddFFv9ha2k0H35c');
        expect(this.headers).to.have.property('X-Ops-Authorization-6',
            'Zcmi9CoDumYXKcei2ANcGosTktauvG+cRAA/ub7kyQ==');
    });
});
