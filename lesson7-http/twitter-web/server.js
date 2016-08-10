var qs = require('querystring');
require('http').createServer(function(req, res){
	var body = '';
	req.on('data', function(chunk){
		body += chunk;
	})
	req.on('end', function(){
		res.writeHead(200); //向服务器发送内容，依然要写响应头 why
		res.end('done');
		console.log('Server got name: ' + qs.parse(body).name);
	})
}).listen(3000)