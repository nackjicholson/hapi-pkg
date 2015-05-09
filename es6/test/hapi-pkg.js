import assert from 'assert';
import Boom from 'boom';
import {Server} from 'hapi';
import {withData} from 'leche';
import hapiPkg from '../hapi-pkg';

let pkg = {
  foo: 'bar',
  robot: {
    beep: 'boop'
  }
};

describe('hapi-pkg', () => {
  describe('setup', () => {
    it('should error on setup if "pkg" option is not provided', (done) => {
      let server = new Server();
      server.connection();
      server.register({
        register: hapiPkg,
        options: {pkg: 'test'}
      }, (err) => {
        assert.equal(
          err,
          'hapi-pkg option "pkg" is required to be an object'
        );
        done();
      });
    });
  });

  withData({
    'default endpoint': [{pkg}, 'pkg'],
    '"info" endpoint': [{pkg, endpoint: 'info'}, 'info']
  }, (options, endpoint) => {
    describe('routes', () => {
      let server;

      beforeEach(() => {
        server = new Server();
        server.connection();
        server.register({
          register: hapiPkg,
          options: options
        }, err => err);
      });

      it(`should respond to "/${endpoint} route`, (done) => {
        server.inject(`/${endpoint}`, (res) => {
          assert.deepEqual(res.result, pkg);
          done();
        });
      });

      it(`should respond to "/${endpoint}/foo`, (done) => {
        server.inject(`/${endpoint}/foo`, (res) => {
          assert.deepEqual(res.result, {foo: pkg.foo});
          done();
        });
      });

      it(`should respond to "/${endpoint}/robot`, (done) => {
        server.inject(`/${endpoint}/robot`, (res) => {
          assert.deepEqual(res.result, {robot: pkg.robot});
          done();
        });
      });

      it(`should respond to "/${endpoint}/robot/beep`, (done) => {
        server.inject(`/${endpoint}/robot/beep`, (res) => {
          assert.deepEqual(res.result, {beep: pkg.robot.beep});
          done();
        });
      });

      it(`should return 400 on "/${endpoint}/{missingProperty}`, (done) => {
        server.inject(`/${endpoint}/missingProperty`, (res) => {
          let message = `invalid ${endpoint} property at path: missingProperty`;
          let err = Boom.badRequest(message);
          assert.deepEqual(res.result, err.output.payload);
          done();
        });
      });
    });
  });
});
