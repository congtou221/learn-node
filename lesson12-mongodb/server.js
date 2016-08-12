var express = require('express');
var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectID;
// 构建应用程序
app = express.createServer();

// 中间件
app.use(express.bodyParser());
app.use(express.cookieParser());
// 出于安全性考虑，初始化session中间件的时候需要提供secret选项
app.use(express.session({secret: 'my secret'}));

// 指定模板引擎
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

// 匹配express3中的默认值，如果使用的是express3，则不需要这行代码
app.set('view options', {layout: false});
app.use(function(req, res, next){

	if(req.session.loggedIn){
		res.local('authenticated', true);
		app.users.findOne({ _id : ObjectId(req.session.loggedIn) }, function(err, doc){

			if(err) return next(err);
			
			res.local('me', doc);
			next();
		})
	}else{
		res.local('authenticated', false);
		next();
	}
})	
// 定义路由
// 默认路由
app.get('/', function(req, res){
	res.render('index');
})
// 登录路由
app.get('/login/:signupEmail?', function(req, res, next){
	res.render('login', {signupEmail: req.params.signupEmail});
})
// 注册路由
app.get('/signup', function(req, res, next){
	res.render('signup');
})
app.post('/login', function(req, res, next) {
	app.users.findOne({email: req.body.user.email, password: req.body.user.password}, function(err, doc) {
		if(err) return next(err);
		if(!doc) return res.send('<p>User not found. Go back and try again!</p>');
		req.session.loggedIn = doc._id.toString();
		res.redirect('/');
	})
})
app.post('/signup', function(req, res, next){
	app.users.insert(req.body.user, function(err, doc){
		if(err) return next(err);
		res.redirect('/login/' + doc[0].email);
	})
})
app.get('/logout', function(req, res, next){
	req.session.loggedIn = null;
	res.redirect('/');
})
// 连接数据库
var server = new mongodb.Server('127.0.0.1', 27017);
// 新建一个名叫my-website的数据库
new mongodb.Db('my-website', server).open(function(err, client){
	if(err){
		throw err;
	}
	// 连接成功，则打印成功消息
	console.log('\033[96m + \033[39m connected to mongodb');
	// 建立集合
	app.users = new mongodb.Collection(client, 'users');
	client.ensureIndex('users', 'email', function(err){
		if(err) throw err;
		client.ensureIndex('users', 'password', function(err){
			if(err) throw err;

			console.log('\033[96m + \033[39m ensured indexes')

			// 监听端口，准备操作集合
			app.listen(3000, function(){
				console.log('\033[096m + \033[39m app listening on *:3000');
			})			
		})
	})


})