'use strict';

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _lodashObjectGet = require('lodash/object/get');

var _lodashObjectGet2 = _interopRequireDefault(_lodashObjectGet);

var _lodashObjectHas = require('lodash/object/has');

var _lodashObjectHas2 = _interopRequireDefault(_lodashObjectHas);

var _lodashLangIsPlainObject = require('lodash/lang/isPlainObject');

var _lodashLangIsPlainObject2 = _interopRequireDefault(_lodashLangIsPlainObject);

var _lodashArrayLast = require('lodash/array/last');

var _lodashArrayLast2 = _interopRequireDefault(_lodashArrayLast);

/**
 * Plugin registration function.
 *
 * Requires options.pkg to be an object literal. (i.e. a package.json obj)
 * The options.endpoint is a customizable string which determines the base route
 * for the plugin. This defaults to "pkg" which supplies routes like
 * "/pkg", "/pkg/version", "/pkg/dependencies" etc.
 */
function register(server, _ref, next) {
  var pkg = _ref.pkg;
  var endpoint = _ref.endpoint;

  endpoint = endpoint || 'pkg';

  if (!_lodashLangIsPlainObject2['default'](pkg)) {
    // Exit early and send an error.
    return next('hapi-pkg option "pkg" is required to be an object');
  }

  server.route({
    method: 'GET',
    path: '/' + endpoint + '/{property*}',
    handler: function handler(request, reply) {
      var path = undefined;

      if (request.params.property) {
        path = request.params.property.split('/');
      }

      if (path && !_lodashObjectHas2['default'](pkg, path)) {
        var message = 'invalid ' + endpoint + ' property at path: ' + path;
        return reply(_boom2['default'].badRequest(message));
      }

      if (path) {
        var key = _lodashArrayLast2['default'](path);
        var value = _lodashObjectGet2['default'](pkg, path);
        return reply(_defineProperty({}, key, value));
      }

      return reply(pkg);
    }
  });

  next();
}

register.attributes = {
  // This is the hapi-pkg plugins' package.json info, not yours.
  pkg: require('../package.json')
};

exports['default'] = register;
module.exports = exports['default'];