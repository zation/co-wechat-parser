var parser = require('..');
var parse = parser.parse;
var fs = require('fs');
var path = require('path');
require('should');

describe('parse()', function() {
  it('parse text message should ok', function(done) {
    var text = path.join(__dirname, 'xmls/text.xml');
    var stream = fs.createReadStream(text);
    parse(stream).then(function(message) {
      message.should.be.Object;
      message.should.have.property('MsgId');
      message.should.have.property('ToUserName');
      message.should.have.property('FromUserName');
      message.should.have.property('CreateTime');
      message.should.have.property('MsgType', 'text');
      message.should.have.property('Content');
      done();
    });
  });

  it('parse image message should ok', function(done) {
    var image = path.join(__dirname, 'xmls/image.xml');
    var stream = fs.createReadStream(image);
    parse(stream).then(function(message) {
      message.should.be.Object;
      message.should.have.property('MsgId');
      message.should.have.property('ToUserName');
      message.should.have.property('FromUserName');
      message.should.have.property('CreateTime');
      message.should.have.property('MsgType', 'image');
      message.should.have.property('PicUrl');
      message.should.have.property('MediaId');
      done();
    });
  });

  it('parse voice message should ok', function(done) {
    var voice = path.join(__dirname, 'xmls/voice.xml');
    var stream = fs.createReadStream(voice);
    parse(stream).then(function(message) {
      message.should.be.Object;
      message.should.have.property('MsgId');
      message.should.have.property('ToUserName');
      message.should.have.property('FromUserName');
      message.should.have.property('CreateTime');
      message.should.have.property('MsgType', 'voice');
      message.should.have.property('MediaId');
      message.should.have.property('Format');
      done();
    });
  });

  it('parse mass result event should ok', function(done) {
    var result = path.join(__dirname, 'xmls/mass_send_job_finish.xml');
    var stream = fs.createReadStream(result);
    parse(stream).then(function(message) {
      message.should.be.Object;
      message.should.have.property('ToUserName');
      message.should.have.property('FromUserName');
      message.should.have.property('CreateTime');
      message.should.have.property('MsgType', 'event');
      message.should.have.property('Event', 'MASSSENDJOBFINISH');
      message.should.have.property('Status');
      message.should.have.property('TotalCount');
      message.should.have.property('FilterCount');
      message.should.have.property('SentCount');
      message.should.have.property('ErrorCount');
      message.should.have.property('MsgID'); // 注意：这里的MsgID有所区别
      done();
    });
  });

  it('parse bad message should not ok', function(done) {
    var badxml = path.join(__dirname, 'xml.js');
    var stream = fs.createReadStream(badxml);
    parse(stream).catch(function(error) {
      error.should.be.ok;
      done();
    });
  });

  it('parse bad xml should not ok', function(done) {
    var badxml = path.join(__dirname, 'xmls/bad.xml');
    var stream = fs.createReadStream(badxml);
    parse(stream).catch(function(error) {
      error.should.be.ok;
      done();
    });
  });
});