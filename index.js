var dumb = function() {};
const secondsInYear =  365 * 24 * 60 * 60; //const is the new, cool thing
module.exports = function(browserifyOpts, browserifyMiddleware) {
	return function(req, res, next) {
		//Pass a fake request through browserify so that we can update the bundle if it has changed
		//Yeah... we have to do this for each request... runs pretty quick, though
		if(browserifyOpts.watch)
			browserifyMiddleware({'url': browserifyOpts.mount}, {'setHeader': dumb, 'end': dumb});
		//Check to see if client is requesting the client script
		if(req.url.substr(0, browserifyOpts.mount.length) == browserifyOpts.mount)
		{
			//Add expires header - maximum recommended expiration is one year
			var d = new Date();
			d.setFullYear(d.getFullYear() + 1);
			res.setHeader('Expires', d.toUTCString() );
			res.setHeader('Cache-Control', 'public, max-age=' + secondsInYear);
			//Add Last-Modified and Date headers
			res.setHeader('Date', new Date().toUTCString() );
			res.setHeader('Last-Modified', browserifyMiddleware.modified.toUTCString() );
			//Check If-Modified-Since request header
			if(Math.floor(new Date(req.headers["if-modified-since"]).getTime() / 1000) ==
				Math.floor(browserifyMiddleware.modified.getTime() / 1000) )
				res.send(304); //304 - Not Modified
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
