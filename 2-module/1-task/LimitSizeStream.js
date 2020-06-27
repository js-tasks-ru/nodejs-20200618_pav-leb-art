const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    options = options ?  {encoding: 'utf8', ...options} : {encoding: 'utf8'};
    
    super(options);

    this.isObjectMode = !!options.readableObjectMode;
    
    if (options.limit) {
      // this.setEncoding('utf8')
      if (typeof(options.limit) !== 'number') throw new TypeError('Limit option must be number');

      this.totalSize = 0;
      this.limit = options.limit;
      this.useLimit = true;
    } else {
      this.useLimit = false;
    }
  }

  _transform(chunk, encoding, callback) {
    if(this.isObjectMode) {
      this.totalSize += 1;
    } else {
      this.totalSize += chunk.length;
    }

    if(this.useLimit && this.totalSize > this.limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;