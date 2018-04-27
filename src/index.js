class Request {
  /**
   * Request constructor
   * @constructor
   * @param params {{ event: *, context: * }}
   */
  constructor(params) {
    const { event, context } = params;
    const {
      body, queryStringParameters, pathParameters, headers, stageVariables, resource
    } = event;

    this.context = context || {};
    this.stage = stageVariables || {};
    this.raw = event;

    this.headers = headers || {};
    this.body = body || {};
    this.query = queryStringParameters || {};
    this.path = pathParameters || {};
    this.resource = resource || '/';
  }

  /**
   * Return the event information as received.
   * @returns {*}
   */
  getRaw() {
    return this.raw;
  }

  /**
   * Return the context.
   * @returns {*}
   */
  getContext() {
    return this.context;
  }

  /**
   * Return the stage variables.
   * @returns {*}
   */
  getStage() {
    return this.stage;
  }

  /**
   * Return the headers parameters received.
   * @returns {*}
   */
  getHeaders() {
    return this.headers;
  }

  /**
   * Parse the header json string and return the result object.
   * @returns {*}
   */
  getBody() {
    return JSON.parse(this.body);
  }

  /**
   * Return the query parameters received.
   * @returns {*}
   */
  getQuery() {
    return this.query;
  }

  /**
   * Return the path parameters received.
   * @returns {*}
   */
  getPath() {
    return this.path;
  }
}

class Router {
  /**
   * Router constructor
   * @constructor
   * @param options {{ event: *, context: *, callback: function }}
   */
  constructor(options) {
    this.routeMatched = false;
    this.event = options.event || {};
    this.context = options.context || {};

    if (typeof options.callback === 'function') {
      this.callback = options.callback;
    } else {
      throw new Error('Callback Missing');
    }
  }

  /**
   * Search for a value in an array, if not an array check the value against the collection.
   * @param value {String}
   * @param collection {Array | String}
   * @returns {boolean}
   * @private
   */
  static _find(value, collection) {
    if (Array.isArray(collection)) {
      return collection.includes(value);
    }
    return value === collection;
  }

  /**
   * Format a response to fit the API-Gateway format.
   * @param params {{ statusCode: Number, headers: *, body: *, isBase64Encoded: Boolean }}
   * @return {*}
   */
  static responseFormatter(params) {
    const result = {};
    const {
      statusCode, headers, body, isBase64Encoded,
    } = params;

    result.statusCode = Number.isInteger(statusCode) ? statusCode : 200;
    result.headers = typeof headers === 'object' ? headers : {};

    if (isBase64Encoded) {
      result.body = body || '';
      result.isBase64Encoded = true;
    } else {
      result.body = JSON.stringify(body || params);
    }

    return result;
  }

  /**
   * Look if the route registered matches the request received.
   * @param options {{ method: Array | String, path: Array | String }}
   * @returns {boolean}
   * @private
   */
  _routeMatcher(options) {
    let resourceMatched = false;
    let methodMatched = false;

    const { httpMethod, resource } = this.event;
    const { method, path } = options;

    if (httpMethod) {
      methodMatched = Router._find(httpMethod, method);
      resourceMatched = Router._find(resource, path);
    } else {
      throw new Error('The Event provided is supported');
    }

    return methodMatched && resourceMatched;
  }

  /**
   * Response wrapper
   * @returns {Function}
   */
  response() {
    const self = this;

    return (params) => {
      const result = Router.responseFormatter(params);

      self.callback(null, result);
    };
  }

  /**
   * Register a new route into the router.
   * @param options {{ method: Array | String, path: Array | String, handler: function }}
   */
  route(options) {
    const self = this;
    const { handler } = options;

    if (!handler) {
      throw new Error('Route Handler Missing');
    }

    if (self.routeMatched || !self._routeMatcher(options)) {
      return;
    }

    self.routeMatched = true;

    const req = new Request({ event: self.event, context: self.context });

    const res = this.response();

    handler(req, res);
  }

  done(params) {
    if (this.routeMatched) {
      return true;
    }

    const result = Router.responseFormatter(params || {});

    if (!params) {
      result.statusCode = 404;
      result.body = JSON.stringify({ message: 'No route matching your request' });
    }

    this.callback(null, result);
    return false;
  }
}

module.exports = Router;
