# chef-node

[![NPM version](https://badge.fury.io/js/chef.png)](http://badge.fury.io/js/chef)
[![Build Status](https://travis-ci.org/sgentle/chef-node.png)](https://travis-ci.org/sgentle/chef-node)
[![Code Climate](https://codeclimate.com/github/sgentle/chef-node.png)](https://codeclimate.com/github/sgentle/chef-node)

A simple [Chef](http://www.opscode.com/chef/) client for Node.js. Handles the
authentication so you can get on with Cheffing.

## Install

    npm install chef

## Examples

Add role `bar` to node `foo`'s run list.

```javascript
var fs = require('fs'),
    chef = require('chef'),
    key = fs.readFileSync('/path/to/key.file.pem'),
    client = chef.createClient('username', key, 'http://chef.server.com:4000');

client.get('/nodes/foo', function(err, res, body) {
    if (err) { return console.log(err); }
    body.run_list.push('role[bar]');
    client.put('/nodes/foo', body, function(err, res, body) {
        console.log(err ? err : body);
    });
});
```

## Methods

The `client` object supports `delete`, `get`, `post` and `put` methods
and accepts relative and absolute URLs (so you can use URLs returned in
responses.)

## License

The MIT License (MIT)

Copyright (c) 2013 Sam Gentle

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
