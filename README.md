[![Build Status](https://travis-ci.org/nackjicholson/hapi-pkg.svg?branch=master)](https://travis-ci.org/nackjicholson/hapi-pkg)

# hapi-pkg
[Hapi](http://hapijs.com) Plugin which provides a JSON API to object properties.

[![NPM](https://nodei.co/npm/hapi-pkg.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/hapi-pkg/)

## Usage

One simple source of object properties all our apps have is `package.json`.

```javascript
var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.register({
  register: require('hapi-pkg'),
  options: {
    pkg: require('./package.json')
  }
}, function(err) {
  if (err) {
    console.log(err);
  }

  server.start(function () {
    console.log('Server running at:', server.info.uri);
  });
});

// GET "/pkg" returns entire package.json
// GET "/pkg/name" return {"name": "my-module"}
// GET "/pkg/version" returns {"version": "1.0.0"}
// GET "/pkg/dependencies" returns {"dependencies": { "lodash": "^3.7.0" } }
// GET "/pkg/dependencies/lodash" returns {"lodash": "^3.7.0"}
```

#### Actually though, this plugin has nothing to do with package.json
Yeah, you can load up your `package.json`. How often is all of that data actually useful? Like never.

So why did I even write this plugin? Well, load balancers have this thing called a "healthcheck", which is a route on
your app server which is expected to be `200 OK`. I found myself writing the same "healthcheck" route on every new
hapi server I make. With `hapi-pkg` and it's endpoint option, I can configure a nice "health" route as part of
loading my plugins.

```javascript
server.register({
  register: require('hapi-pkg'),
  options: {
    pkg: {status: 'ok'},
    endpoint: 'health'
  }
}, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  
  server.start()
});
```

`GET "/health"` => `200 OK {"status": "ok"}`

#### Here's a crazy idea.
You could serve a mock api for a prototype based on some static data in JSON files or even hardcoded objects and arrays.

```javascript
let Hapi = require('hapi');
let hapiPkg = require('hapi-pkg');

let server = new Hapi.Server();
server.connection({ port: 3000 });

// Let's hard code some arrays to be our "database".
let authors =  [
  {
    name: 'will',
    alias: 'nackjicholson',
    posts: [0, 2]
  },
  {
    name: 'peter',
    alias: 'spiderman',
    posts: [1]
  }
];

let posts = [
  {
    title: 'Secret to Web Development',
    content: 'Regular stretching to prevent carpal tunnel syndrome',
    author: 0
  },
  {
    title: 'Secret to Web Slinging',
    content: 'Regular stretching to prevent carpal tunnel syndrome',
    author: 1
  }
  {
    title: 'How NOT to Build a Prototype',
    content: 'You are looking at it.',
    author: 0
  }
];

// You can load this plugin multiple times!
// Providing two new resource routes, one for "/authors" and another for "/posts"
server.register([
  {
    register: hapiPkg,
    options: {
      pkg: {authors},
      endpoint: 'authors'
    }
  },
  {
    register: hapiPkg,
    options: {
      pkg: {posts},
      endpoint: 'posts'
    }
  }
], (err) => {
  if (err) {
    throw err;
  }

  server.start(() => {
    console.log('Server running at:', server.info.uri);
  });
});

// GET "/authors" => authors collection.
// GET "/authors/0" => {"name":"will","alias":"nackjicholson","posts": [0,2]}
// GET "/authors/0/posts" => {"posts": [0,2]}
// GET "/posts" => posts collection
// GET "/posts/2/author" => {"author": 0}
```

I know that's not a perfect api, but it's pretty good for something I implemented on accident :smiley:
You're on your own for the PUT/POST/DELETE routes.

## Options
#### pkg {object} required
The plugin will not load if this option is not provided as an object literal.

```javascript
server.register({
  register: require('hapi-pkg'),
  options: { pkg: 'this is a string' }
}, function(err) {
  if (err) {
    console.log(err);
    // 'hapi-pkg option "pkg" is required to be an object' 
  }
});
```

#### endpoint {string} default:'pkg'
Routes for this plugin are prefixed with "/pkg" by default. If you'd like to customize that, you can use the `endpoint`
option.

```javascript
server.register({
  register: require('hapi-pkg'),
  options: {
    pkg: require('./package.json'),
    endpoint: 'info'
  }
}, function(err) {
  server.start()
  // hapi-pkg routes at "/info" instead of "/pkg"
});
```

### config {object} optional
Sets the route configuration options for the pkg routes. For instance this is how you would
configure an authentication strategy for your pkg routes.

```javascript
let server = new Server();
server.connection();
server.register({
  register: hapiPkg,
  options: {
    pkg: { foo: 'bar' },
    config: { id: 'pkg', description: 'foobar routes' }
  }
}, (err) => {
  if (err) { throw err; }
  let route = server.lookup('pkg');
  // logs route description "foobar routes";
  console.log(route.settings.description);
  server.start();
});
```

## Contribute
Please open issues, and if you have something to add feel free to make a Pull Request. This plugin is written in
ES6 and compiled for use by [babel](http://babeljs.io/). All code contributions should be 100% covered by tests, and
fully adherent to linting by jshint and .jscs configs.
