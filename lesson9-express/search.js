var request = require('superagent');
module.exports = function(goodsId, fn){
	request.get('http://fa.163.com/interfaces/ngxcache/priceinfo/getRealTimePrice.do')
	.query({partnerId: 'sge'})
	.query({goodsId: goodsId})
	.end(function(err, res){
		if(res.body){
			return fn(null, res.body);	
		}
		fn(new Error('Bad twitter response'));
	})
}