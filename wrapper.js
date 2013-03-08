var read = require('fs').readFileSync,
    chef = require('./chef');

var instance = null;

module.exports = {
    
    auth: function (user, key, server) {
        instance = chef.createClient(user, read(key), server);
        return key;
    },

    request: function (uri, body, _) {
        if (!instance)
            throw "No credentials provided";

        var method = body && _ ? 'post' : 'get';

        return instance[method](uri, body, _);
    }

};
