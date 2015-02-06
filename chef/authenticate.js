var hash = require('crypto').createHash,
    url = require('url'),
    sign = require('forsake').sign;

// Create a base64 encoded SHA1 hash from a string
function sha1(str) {
    return hash('sha1').update(str).digest('base64');
}

// Hash the stringified body
function bodyHash(body) {
    return sha1(body ? JSON.stringify(body) : '');
}

// Hash the path of the uri
function pathHash(uri) {
    return sha1(url.parse(uri).pathname);
}

// Generate a timestamp, formatted how Chef wants it
function timestamp() {
    return new Date().toISOString().slice(0, -5) + 'Z';
}

// Function used internally to build Chef authentication headers.
//
// Takes a client object and an options object. The client object must
// contain a user and key; the options object must include uri, method,
// and body.
//
// Returns an object that includes the required headers for
// authenticating with Chef.
module.exports = function authenticate(client, options) {
    var bh = bodyHash(options.body),
        ph = pathHash(options.uri),
        ts = timestamp(),
        user = client.user,
        canonicalReq, headers;

    canonicalReq = 'Method:' + options.method + '\n' +
        'Hashed Path:' + ph + '\n' +
        'X-Ops-Content-Hash:' + bh + '\n' +
        'X-Ops-Timestamp:' + ts + '\n' +
        'X-Ops-UserId:' + user;

    headers = {
        'X-Chef-Version': '11.6.0',
        'X-Ops-Content-Hash': bh,
        'X-Ops-Sign': 'version=1.0',
        'X-Ops-Timestamp': ts,
        'X-Ops-UserId': user
    };

    sign(canonicalReq, client.key)
        .toString('base64')
        .match(/.{1,60}/g)
        .forEach(function (hash, line) {
            headers['X-Ops-Authorization-' + (line + 1)] = hash;
        });

    return headers;
};
