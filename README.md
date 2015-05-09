[![Build Status](https://travis-ci.org/nackjicholson/hapi-pkg.svg?branch=master)](https://travis-ci.org/nackjicholson/hapi-pkg)

# hapi-pkg
[Hapi](http://hapijs.com) Plugin which provides a JSON API to package.json properties.

## Example

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
// GET "/pkg/name" return package name
// GET "/pkg/version" returns version number
// GET "/pkg/dependencies" returns a list of dependencies
// GET "/pkg/dependencies/lodash" returns lodash semver requirement.
```

## Options
The options you can send during registration.

**options** {object} (required)

The plugin will not load if this option is not provided as an object literal.

```javascript
server.register({
  register: require('hapi-pkg'),
  options: { pkg: 'this is a string' }
}, function(err) {
  // err: 'hapi-pkg option "pkg" is required to be an object'
});
```

**endpoint** {string} (default='pkg')

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


## Some cool stuff about hapi-pkg

#### Add custom things to package.json, and it becomes a route.
If you have any static information you want your server to expose, you can just put it in your package.json.
For example, if you wanted to provide the server with a descriptive healthcheck route "/pkg/health" for load balancing
and what not. You could add this to your package.json:

```
{
  "health": "ok"
}
```

Now your server would have a "/pkg/health" route which returns `200 OK {"health": "ok"}`. This is a contrived example,
because using "/pkg/name" is also a valid healthcheck route, but it exemplifies the ability to add things to your
package.json and have them be accessible via the api.

#### This plugin actually has nothing to do with package.json
When I started building hapi-pkg I had package.json information in mind, and so the standard thing to
provide as the `pkg` option is a reference to your project's package.json `pkg: require('./package.json')`.
Interestingly though, you can provide hapi-pkg with any object literal and it will build a JSON API to it's properties
for you. I'm sure there are applications of this feature I haven't thought of and I leave it to you guys, but here's
an example of using a custom object to provide a static api.

```javascript
var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 3000 });

var myApi = {
  ping: 'pong',
  users: [
    {
      name: 'will',
      alias: 'nackjicholson'
    },
    {
      name: 'peter',
      alias: 'spiderman'
    }
  ]
};  

server.register({
  register: require('hapi-pkg'),
  options: {
    pkg: myApi,
    endpoint: 'api'
  }
}, function(err) {
  if (err) {
    console.log(err);
  }

  server.start(function () {
    console.log('Server running at:', server.info.uri);
  });
});

// GET "/api" returns myApi object
// GET "/api/ping" => {"ping": "pong"}
// GET "/api/users" => collection of users.
// GET "/api/users/0" => {"0": {"name": "will", "alias": "nackjicholson"}}
// GET "/api/users/0/alias" => {"alias": "nackjicholson"}
```

I know that's not a perfect api...but it's pretty good for something I implemented on accident :smiley:

## Contribute

Please open issues, and if you have something to add feel free to make a Pull Request. This plugin is written in
ES6 and compiled for use by [babel](http://babeljs.io/). All code contributions should be 100% covered by tests, and
fully adherent to linting by jshint and .jscs configs.
