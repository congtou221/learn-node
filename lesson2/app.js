var express = require('express');
var utility = require('utility');

// 建立express实例
var app = express();

app.get('/', function(req, res){
	// 从req.query中取出q参数
	var q = req.query.q;

	// 使用utility生成md5
	var md5Value = utility.md5(q);

	res.send(md5Value);
})

app.listen(3000);