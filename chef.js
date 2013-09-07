var hash = require('crypto').createHash,
    url = require('url'),
    pkey = require('ursa').coercePrivateKey,
    request = require('request'),
    methods = ['delete', 'get', 'post', 'put'];

function sha1(str) {
    return hash('sha1').update(str).digest('base64');
}

function Chef(user, key, base) {
    this.user = user;
    this.key = key;
    this.base = base ? base : '';
}

function req(method, uri, body, callback) {
    method = method.toUpperCase()

    // Add the base property of the client if the request does not specify the
    // full URL.
    if (uri.indexOf(this.base) !== 0) { uri = this.base + uri; }

    // Use the third parameter as the callback if a body was not given (like for
    // a GET request.)
    if (typeof body === 'function') { callback = body; body = undefined; }

    var timestamp = new Date().toISOString().slice(0, -5) + 'Z',
        pathHash = sha1(url.parse(uri).path),
        bodyHash = sha1(body ? JSON.stringify(body) : ''),

        canonicalReq = 'Method:' + method + '\n'
            + 'Hashed Path:' + pathHash + '\n'
            + 'X-Ops-Content-Hash:' + bodyHash + '\n'
            + 'X-Ops-Timestamp:' + timestamp + '\n'
            + 'X-Ops-UserId:' + this.user,

        sig = pkey(this.key).privateEncrypt(canonicalReq, 'utf8', 'base64'),

        headers = {
            Accept: 'application/json',
            'X-Ops-Timestamp': timestamp,
            'X-Ops-UserId': this.user,
            'X-Ops-Content-Hash': bodyHash,
            'X-Chef-Version': '0.10.4',
            'X-Ops-Sign': 'version=1.0'
        };

    sig.match(/.{1,60}/g).forEach(function (hash, line) {
        headers['X-Ops-Authorization-' + (line + 1)] = hash
    });

    return request(uri, {
        method: method,
        headers: headers,
        json: true,
        body: body
    }, callback);
}

methods.forEach(function (method) {
    Chef.prototype[method] = function (uri, body, callback) {
        return req.call(this, method, uri, body, callback);
    }
});

exports.createClient = function (user, key, server) {
    return new Chef(user, key, server);
};
