var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function(req,res){
	res.send('hello homepage');
});

app.get('/login',function(req,res){
	res.send('Login');
});

app.listen(3000,function(){
	console.log('connected 3000 port');
});
