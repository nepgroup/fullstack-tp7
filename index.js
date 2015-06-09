var http = require("http");
var url = require('url');
var fs = require('fs');

var minimist = require('minimist');
var argv = minimist(process.argv);

var server = http.createServer(function(req, res){
	var file = url.parse(req.url, true).pathname;
	var ext = file.split('.').pop();
	console.log(file);
	console.log(ext);

	if (ext.length !== 3) {
		console.log('no tengo ext');
		fs.readFile(__dirname + '/invalid.html', function (err, data) {
			if (err) throw err;
			res.writeHead(400, {"Content-Type": "text/html"});
			res.write(data, 'utf-8');
			res.end();
		});
	} else{
		console.log('tengo ext');   
		fs.readFile(__dirname + file, function (err, data) {
			if (err) {
				fs.readFile(__dirname + '/notFound.html', function (err, data) {
					if (err) throw err;
					res.writeHead(404, {'Content-Type': 'text/html'});
					res.write(data, 'utf-8');
					res.end();
				});
			} else{
				res.writeHead(200, {"Content-Type": "text/html"});
				res.write(data, 'utf-8');
				res.end();
			};
		});
	};

});

var port = argv.port || process.env.PORT || process.env.port || process.env.OPENSHIFT_NODEJS_PORT || 8000;

server.listen(port, argv.ip || process.env.OPENSHIFT_NODEJS_IP, function() {
	console.log('Server is now listening at port: ' + port);
});