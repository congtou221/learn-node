var express = require('express');
var search = require('./search');
var app = express.createServer();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('view options', {layout: false});

app.get('/', function(req, res, next){
	res.render('index')
});

app.get('/search', function(req, res, next){
	search(req.query.goodsId, function(err, content){
		if(err){
			return next(err);
		}
		res.render('search', {result: content, search: req.query.goodsId});
	})
})

app.listen(3000);