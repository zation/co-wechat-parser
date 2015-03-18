# co-wechat-parser

解析微信推送的XML消息，可用于koa中间件，也可以直接调用，返回Promise。

## 安装

使用[npm](https://www.npmjs.com/package/co-wechat-parser)安装：

```bash
npm install --save co-wechat-parser
```

## 用法示例

### 作为中间件使用

```javascript

var koa = require('koa');
var parser = require('co-wechat-parser');

var app = koa();
app.use(parser.middleware());
```

### 直接调用

```javascript

var koa = require('koa');
var parser = require('co-wechat-parser');

var app = koa();
app.use(function() {
	parser.parse(this.req)
		.then(function(message) {
			console.log(message);
		})
		.catch(function(error) {
			console.log(error);
		});
});
```

## API

### camelcase

默认为`true`，将结果Object的key转为驼峰形式。可设置为`false`，保持微信的原始形式。

```javascript

var koa = require('koa');
var parser = require('co-wechat-parser');

var app = koa();
app.use(parser.middleware({
    camelcase: false
}));
```

### key

默认为`body`，将结果Object挂载到`this.request.body`上。可设置为其他的`String`，改变挂载属性。

```javascript

var koa = require('koa');
var parser = require('co-wechat-parser');

var app = koa();
app.use(parser.middleware({
    key: 'wexin'
}));
```