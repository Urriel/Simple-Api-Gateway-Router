/* global describe test expect */

const event = require('./events/simple-routing');
const Router = require('../src');

describe('Simple Routing handling', () => {
  test('Should be able to handle a request', () => {
    const router = new Router({
      event,
      callback: (err, res) => {
        const { statusCode, body } = res;

        expect(statusCode).toBe(200);
        expect(JSON.parse(body)).toEqual({ test: 'test' });
      },
    });

    router.route({
      method: 'POST',
      path: '/auth/sign',
      handler: (req, res) => {
        res({
          statusCode: 200,
          body: {
            test: 'test',
          },
        });
      },
    });

    router.done();
  });

  test('Should reject a route', () => {
    const router = new Router({
      event,
      callback: (err, res) => {
        const { statusCode } = res;

        expect(statusCode).toBe(404);
      },
    });

    router.route({
      method: 'POST',
      path: '/auth',
      handler: (req, res) => {
        res({ statusCode: 200 });
      },
    });

    router.done();
  });
});
