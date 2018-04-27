# Simple-Api-Gateway-Router  
  
> An ES6 rewrite of the [Alpr](https://github.com/aceew/lambda-proxy-router) package.  
  
This package aims to make request routing in a lambda function simple and effective. Used in pair with the serverless framework you can create a resource API with a single handler.  
  
## Content  
  
- [Usage](#usage)  
- [Defining Routes](#routes) 
- [Handler](#handler)
  
## Usage  
  
Add this Simple-Api-Gateway-Router to your project.  
  
```shell  
$> npm install --save sagr  
  
or  
  
$> yarn add sagr  
```  
  
In your handler:  
  
```javascript  
const Router = require('sagr');

function Handler(event, context, callback) {
	const router = new Router({ event, context, callback });

	router.route({
		method: 'POST',
		path: '/api/test',
		handler: (req, res) => {
			res({
				statusCode: 200,
				body: {
					message: 'hello world !'
				},
				headers: {
					'x-header': 'hello',
				},
			}),
		}
	});
	
	router.route({
		// You can provide multiple methods
		method: ['POST', 'GET', 'PUT'],
		// And different paths
		path: ['/api/test', '/api/test/{variable}'],
		handler: (req, res) => {
			res({
				statusCode: 200,
				body: {
					message: 'hello world !'
				},
				headers: {
					'x-header': 'hello',
				},
			}),
		}
	});

	// If no route has been matched, the router will answer with a common 404 response.
	router.done();
}

module.exports = {
	handler
};
```

## Routes

| Key | Type | Value
|---|---|---
| method | string/Array | The http method the route should match for. More than one can be specified
| path | string/Array | This should match the value of the route specified in API gateway including path parameter names
| [handler](#handler) | Function | The handler function for the given route. Should take two parameters of [request](#request) and [response](#response).

## Handler

The handler is need to match the route specified and process the answer.
it takes a request parameter which help you reach the request information needed in your computing, and a response callback which answer back with a formatted response to the API-Gateway.

## Request
| Key | Type | Value
|---|---|---
| request.getContext | Function | Return the whole lambda context object.
| request.getStage | Function | Return the API Gateway stage variables.
| request.getQuery | Function | Return the query string parameters.
| request.getBody | Function | Return the JSON parsed body.
| request.getRaw | Function | Return the raw event object.
| request.getPath | Function | Return the request path parameters.
| request.getHeaders | Function | Return the request headers.

## Response
The response callback send back a formatted response to the API-Gateway.

| Key | Type | Value | Default
|---|---|---|---
| params | Object | Parameters object | {}
| params.statusCode | Integer | The HTTP status code | 200
| params.headers | Object | Any headers to be returned in the response. | {}
| params.body | Mixed | Your response body, whatever is specified will be `JSON.stringify`'d. If body is not set the body will be defined as the params object. | `JSON.stringify(params)`
| params.isBase64Encoded | Boolean | This is usually used for serving binary data from an API. | false

Here is the recommended way to call the response method.
```javascript
response({
    statusCode: 200,
    headers: { "x-your-header": "header value" },
    body: { "response-object-key": "data" },
});
```

And `response('hello world')` would work out as:
```javascript
{
    statusCode: 200,
    headers: {},
    body: "hello world"
}
```

Credits to [aceew](https://github.com/aceew) for it's router.