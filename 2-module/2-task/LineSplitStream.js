const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
	constructor(options) {
		super(options);
		this.tempLine = '';
	}

	_transform(chunk, encoding, callback) {
		let chunkString = chunk.toString();

		while(chunkString) {
			// if(chunkString.indexOf(os.EOL) === 0) {
			// 	this.push(this.tempLine);
			// 	this.tempLine = '';
			// 	chunkString = chunkString.slice(os.EOL.length);
			// }
	
			if(chunkString.indexOf(os.EOL) === -1) {
				this.tempLine += chunkString;
				chunkString = '';
			} else {
				let pushPart = this.tempLine + chunkString.slice(0, chunkString.indexOf(os.EOL));
				chunkString = chunkString.slice(chunkString.indexOf(os.EOL) + os.EOL.length);
				this.tempLine = '';
				this.push(pushPart);
			}
		};

		callback();
	}

	_flush(callback) {
		callback(null, this.tempLine);
	}
}

module.exports = LineSplitStream;