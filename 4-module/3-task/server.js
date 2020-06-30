const url = require('url');
const http = require('http');
const path = require('path');

const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
	const pathname = url.parse(req.url).pathname.slice(1);

	const filepath = path.join(__dirname, 'files', pathname);

	if (path.dirname(pathname) !== '.') {
		res.statusCode = 400;
		res.end('Nested folders are not supported.');
	}

	switch (req.method) {
		case 'DELETE':
			fs.unlink(filepath, (err) => {
				if (err) {
					switch (err.code) {
						case 'ENOENT':
							res.statusCode = 404;
							break;

						default:
							res.statusCode = 404;
							break;
					}
				} else {
					res.statusCode = 200;
				}
				res.end()
			})
			break;

		default:
			res.statusCode = 501;
			res.end('Not implemented');
	}
});

module.exports = server;