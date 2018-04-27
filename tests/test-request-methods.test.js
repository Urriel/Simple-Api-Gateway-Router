/* global describe test expect */

const event = require('./events/simple-routing');
const Router = require('../src');

describe('Simple Routing handling', () => {
  test('Should be able to handle a request and get it\'s raw information', () => {
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
      path: '/test',
      handler: (req, res) => {
        const rawRequest = req.getRaw();
        expect(rawRequest).toHaveProperty('resource', '/test');
        expect(rawRequest).toHaveProperty('body');

        expect(typeof rawRequest.body).toBe('string');

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

  test('Should be able to handle a request and get it\'s body parsed', () => {
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
      path: '/test',
      handler: (req, res) => {
        const body = req.getBody();
        expect(typeof body).toBe('object');
        expect(body).toHaveProperty('email', 'test@test.fr');
        expect(body).toHaveProperty('name', 'Test Test');

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

  test('Should be able to handle a request and get it\'s headers', () => {
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
      path: '/test',
      handler: (req, res) => {
        const headers = req.getHeaders();
        expect(typeof headers).toBe('object');

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

  test('Should be able to handle a request and get it\'s context', () => {
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
      path: '/test',
      handler: (req, res) => {
        const context = req.getContext();
        expect(typeof context).toBe('object');

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

  test('Should be able to handle a request and get it\'s stage variables', () => {
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
      path: '/test',
      handler: (req, res) => {
        const stage = req.getStage();
        expect(typeof stage).toBe('object');

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

  test('Should be able to handle a request and get it\'s query string variables', () => {
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
      path: '/test',
      handler: (req, res) => {
        const queryString = req.getQuery();
        expect(typeof queryString).toBe('object');

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

  test('Should be able to handle a request and get it\'s path variables', () => {
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
      path: '/test',
      handler: (req, res) => {
        const pathVariables = req.getPath();
        expect(typeof pathVariables).toBe('object');

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
