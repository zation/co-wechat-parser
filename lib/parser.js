var parseString = require('xml2js').parseString;

var lowercase = false;
var dataProp = 'body';

module.exports = middleware;
module.exports.parse = parse;
module.exports.middleware = middleware;

function middleware(options) {
  var opts = options || {};
  lowercase = !!opts.lowercase;
  if (typeof opts.dataProp === 'string') {
    dataProp = opts.dataProp;
  }

  return function* (next) {
    var request = this.request;
    if (request._body) yield next;
    var method = request.method.toLowerCase();
    if (method !== 'post') yield next;
    var message = yield parse(this.req);
    request._body = true;
    request[dataProp] = message || {};
    yield next;
  }
}

function parse(stream) {
  return new Promise(function(resolve, reject) {
    if (stream._parsedWechat) {
      resolve(stream._parsedWechat);
    }
    var chunks = [];
    var size = 0;
    stream.on('data', function(chunk) {
      chunks.push(chunk);
      size += chunk.length;
    });
    stream.on('end', function() {
      var buf = Buffer.concat(chunks, size);
      resolve(buf.toString());
    });
    stream.once('error', reject);
  }).then(function(xml) {
      return new Promise(function(resolve, reject) {
        parseString(xml, function(error, data) {
          if (error) return reject(error);
          try {
            data = normalize(data);
          } catch (e) {
            return reject(e);
          }
          stream._parsedWechat = data;
          resolve(data);
        });
      });
    }).catch(function(error) {
      console.error(error.stack || error.toString());
    });
}

function normalize(data) {
  var result = {};
  Object.keys(data.xml).forEach(function(key) {
    var value = data.xml[key][0];
    if (lowercase) key = key.toLowerCase();
    result[key] = isEmpty(value) ? '' : value.trim();
  });
  return result;
}

function isEmpty(value) {
  if (!value) return true;
  return typeof value === 'object' && !Object.keys(value).length;
}
