/* global describe test expect */

const event = require('./events/simple-routing');
const Router = require('../src');

event.resource = '/auth';

describe('Simple Routing handling', () => {
  test('Should be able to handle a POST request', () => {
    event.httpMethod = 'POST';

    const router = new Router({
      event,
      callback: (err, res) => {
        const { statusCode, body } = res;

        expect(statusCode).toBe(200);
        expect(JSON.parse(body)).toEqual({ test: 'test' });
      },
    });

    router.route({
      method: ['POST', 'GET'],
      path: '/auth',
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

  test('Should be able to handle a GET request', () => {
    event.httpMethod = 'GET';

    const router = new Router({
      event,
      callback: (err, res) => {
        const { statusCode, body } = res;

        expect(statusCode).toBe(200);
        expect(JSON.parse(body)).toEqual({ test: 'test' });
      },
    });

    router.route({
      method: ['POST', 'GET'],
      path: '/auth',
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

  test('Should not be able to handle a PUT request', () => {
    event.httpMethod = 'PUT';

    const router = new Router({
      event,
      callback: (err, res) => {
        const { statusCode } = res;

        expect(statusCode).toBe(404);
      },
    });

    router.route({
      method: ['POST', 'GET'],
      path: '/auth',
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
});
