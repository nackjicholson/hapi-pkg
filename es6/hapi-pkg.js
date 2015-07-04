import Boom from 'boom';
import getPath from 'lodash/object/get';
import has from 'lodash/object/has';
import isPlainObject from 'lodash/lang/isPlainObject';
import last from 'lodash/array/last';

/**
 * Plugin registration function.
 *
 * Requires options.pkg to be an object literal. (i.e. a package.json obj)
 * The options.endpoint is a customizable string which determines the base route
 * for the plugin. This defaults to "pkg" which supplies routes like
 * "/pkg", "/pkg/version", "/pkg/dependencies" etc.
 */
function register(server, {pkg, endpoint, config}, next) {
  endpoint = endpoint || 'pkg';

  if (!isPlainObject(pkg)) {
    // Exit early and send an error.
    return next('hapi-pkg option "pkg" is required to be an object');
  }

  server.route({
    method: 'GET',
    path: `/${endpoint}/{property*}`,
    config,
    handler(request, reply) {
      let path;

      if (request.params.property) {
        path = request.params.property.split('/');
      }

      if (path && !has(pkg, path)) {
        let message = `invalid ${endpoint} property at path: ${path}`;
        return reply(Boom.badRequest(message));
      }

      if (path) {
        let key = last(path);
        let value = getPath(pkg, path);
        return reply({[key]: value});
      }

      return reply(pkg);
    }
  });

  next();
}

register.attributes = {
  // This is the hapi-pkg plugins' package.json info, not yours.
  pkg: require('../package.json'),
  multiple: true
};

export default register;
