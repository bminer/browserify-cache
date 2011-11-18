var browserify = require('browserify');

module.exports = function(browserifyOpts, browserifyMiddleware) {
	var lastModified = browserifyMiddleware.modified.getTime();
	return function(req, res, next) {
		if(lastModified != browserifyMiddleware.modified.getTime() )
		{
			console.log("Browserify bundle has changed!");
			lastModified = browserifyMiddleware.modified.getTime();
		}
		//Check to see if client is requesting the client script
		if(req.url.substr(0, browserifyOpts.mount.length) == browserifyOpts.mount)
		{
			//Add expires header
			var d = new Date();
			d.setFullYear(d.getFullYear() + 1);
			res.setHeader('Expires', d.toUTCString() );
			res.setHeader('Cache-Control', 'public, max-age=31536000'); //31536000 = 365 days * 24 * 60 * 60
			//Add Last-Modified and Date headers
			res.setHeader('Date', new Date().toUTCString() );
			res.setHeader('Last-Modified', browserifyMiddleware.modified.toUTCString() );
			//Check If-Modified-Since request header
			if(new Date(req.headers["if-modified-since"]).getTime() == browserifyMiddleware.modified.getTime() )
				res.send(304);
			else
			{
				//Otherwise, let browserify serve up the actual script
				req.url = browserifyOpts.mount; //Trick browserify
				browserifyMiddleware(req, res, next);
			}
		}
		else next();
	};
}
