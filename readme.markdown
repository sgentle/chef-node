node-chef
=========

Handles the basic authentication so you can get on with Cheffing.

### Install

~~~sh
$ npm install chef
~~~

### Examples

Add role `bar` to node `foo`'s run list.

~~~javascript
var fs = require('fs'),
    chef = require('chef');

fs.readFile('/path/tp/pem.file', function (err, key) {
    var client = chef.createClient('username', key, 'http://chef.server.com:4000');

    client.get('/nodes/foo', function(err, res, body) {
        if (err) return console.log(err);
        body.run_list.push('role[bar]');
        client.put('/nodes/foo', body, function(err, res, body) {
            console.log(err ? err : body);
        });
    });
});
~~~

### Methods

The `client` object supports `delete`, `get`, `patch`, `post` and `put` methods and
accepts relative and absolute URLs (so you can use URLs returned in responses).
