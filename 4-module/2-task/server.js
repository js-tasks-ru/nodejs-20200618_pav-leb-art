const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const stream = require('stream');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
	const pathname = url.parse(req.url).pathname.slice(1);

	const filepath = path.join(__dirname, 'files', pathname);

	if (path.dirname(pathname) !== '.') {
		res.statusCode = 400;
		res.end('Nested folders are not supported.');
	}

	switch (req.method) {
		case 'POST':

			const limitStream = new LimitSizeStream({
				limit: 10 ** 6,
			});

			const writeStream = fs.createWriteStream(filepath, {
				flags: 'ax',
			});

			let deleteFlag = false;

			limitStream.on('error', (err) => {
				res.statusCode = err.code === 'LIMIT_EXCEEDED' ? 413 : 500;
				deleteFlag = true;
				res.end('File is too big');
			})

			writeStream.on('error', (err) => {
				res.statusCode = err.code === 'EEXIST' ? 409 : 500;
				res.end('File already exist');
			})

			writeStream.on('close', () => {
				res.statusCode = 201;
				res.end('Success');
			})

			req.pipe(limitStream).pipe(writeStream);

			// // ERR_INVALID_ARG_TYPE
			// stream.pipeline(
			// 	req,
			// 	limitStream,
			// 	writeStream,
			// 	(err) => {
			// 		if (err) {
			// 			switch (err.code) {
			// 				case 'LIMIT_EXCEEDED':
			// 					res.statusCode = 413;
			// 					deleteFlag = true
			// 					break;

			// 				case 'EEXIST':
			// 					res.statusCode = 409;
			// 					break;

			// 				default:
			// 					res.statusCode = 500;
			// 					break;
			// 			}
			// 		} else {
			// 			res.statusCode = 201;
			// 		}
			// 		res.end('Server response');
			// 	}
			// )

			res.on('close', () => {
				if (deleteFlag || !res.finished) {
					limitStream.destroy();
					writeStream.destroy();
					fs.unlink(filepath, (err) => {
						if (err) console.log(err);
					})
				}
			})
			break;

		default:
			res.statusCode = 501;
			res.end('Not implemented');
	}
});

module.exports = server;