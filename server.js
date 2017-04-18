let http = require('http'),
	fs   = require('fs'),
	path = require('path'),
	mime = require('mime');
let cache = {};

function send404(res) {
	res.writeHead(404, {'Content-Type': 'text/plain'});
	res.write('Error 404: Resource not found');
	res.end();
}

function sendFile(res, filePath, fileContents) {
	res.writeHead(200, {'Content-Type': mime.lookup(path.basename(filePath))});
	res.end(fileContents);
}

function serverStatic(res, cache, absPath){
	if (cache[absPath]) {
		sendFile(res, absPath, cache[absPath]);
	}
	else {
		fs.readFile(absPath,function(err, data){
			if (err) {
				send404(res);
			}
			else {
				cache[absPath] = data;
				sendFile(res, absPath, data);
			}
		});
	}
}

let server = http.createServer(function(req,res){
	let filePath = '';
	if (req.url == '/') {
		filePath = 'public/index.html';
		console.log(req.url);
	}
	else {
		filePath = "public" + req.url;
		console.log(req.url);
	}
	let absPath = "./" + filePath;
	serverStatic(res, cache, absPath);
});

server.listen(8080,function(){
	console.log("server lintening on port 8080.");
});

let charServer = require("./lib/chat_server");
chat_server.listen(server);






















