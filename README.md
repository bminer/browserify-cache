browserify-cache - Strong and weak caching for Browserify bundles

##Background

"Last-Modified" and "If-Modified-Since" are "weak" caching. If the "If-Modified-Since" header is set, then Browserify can send 304 Not Modified, if appropriate, which saves bandwidth.

"Expires" or "Cache-Control: max-age" are "strong" caching. The browser can simply pull from its own cache in certain cases to save an entire HTTP request.

In the client HTML, your Browserify bundle URL should contain the UNIX timestamp that matches the last modified date of the bundle.

https://github.com/substack/node-browserify

http://code.google.com/speed/page-speed/docs/caching.html

##Usage

```javascript
//Create Express app and config...
var config = {
	'browserify': { /* Configure as you normally would... */ }
};

//Setup browserify
var browserify = require('browserify');
var browserifyCache = require('browserify-cache');
var browserifyMiddleware = browserify(config.browserify);
app.use(browserifyCache(config.browserify, browserifyMiddleware) );

//Now you can expose this URL to your views using Express
app.helpers({
	'browserifyMount': function() {
		/* Note: browserify-cache will add the `mount` property to the
			browserify config object, in case you don't specify it. */
		return config.browserify.mount + '.' + browserifyMiddleware.modified.getTime() + '.js';
	}
});
```
