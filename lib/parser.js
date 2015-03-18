var parseString = require('xml2js').parseString;
var camelCase = require('camelcase');

var camelcase = true;
var key = 'body';

module.exports = middleware;
module.exports.parse = parse;
module.exports.middleware = middleware;

function middleware(options) {
  var opts = options || {};
  if (opts.camelcase === false) {
    camelcase = false;
  }
  if (typeof opts.key === 'string') {
    key = opts.key;
  }

  return function* (next) {
    var request = this.request;
    if (request._body) yield next;
    var method = request.method.toLowerCase();
    if (method !== 'post') yield next;
    var message = yield parse(this.req);
    request._body = true;
    request[key] = message || {};
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
          } catch (error) {
            return reject(error);
          }
          stream._parsedWechat = data;
          resolve(data);
        });
      });
    });
}

function normalize(data) {
  var result = {};
  Object.keys(data.xml).forEach(function(xmlKey) {
    var value = data.xml[xmlKey][0].trim();
    if (camelcase) xmlKey = camelCase(xmlKey);
    result[xmlKey] = isEmpty(value) ? '' : value;
  });
  return result;
}

function isEmpty(value) {
  if (!value) return true;
  return typeof value === 'object' && !Object.keys(value).length;
}