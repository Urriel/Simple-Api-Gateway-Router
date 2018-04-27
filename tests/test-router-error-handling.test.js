/* global describe test expect */

const event = require('./events/simple-routing');
const Router = require('../src');

describe('Router Error Handling', () => {
  test('Should get an error for a callback missing', () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const router = new Router({
        event,
      });
    } catch (e) {
      expect(e).toHaveProperty('message', 'Callback Missing');
    }
  });

  test('Should get an error for event not supported', () => {
    try {
      const router = new Router({
        event: {},
        callback: () => {},
      });

      router.route({
        method: 'POST',
        path: '/auth',
        handler: () => {},
      });

      router.done();
    } catch (e) {
      expect(e).toHaveProperty('message', 'The Event provided is supported');
    }
  });

  test('Should get an error for route handler missing', () => {
    try {
      const router = new Router({
        event,
        callback: () => {},
      });

      router.route({
        method: 'POST',
        path: 'test',
      });
    } catch (e) {
      expect(e).toHaveProperty('message', 'Route Handler Missing');
    }
  });
});
