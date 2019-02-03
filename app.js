var express = require('express');
var app = express();
var path = require('path');
var childProcess = require('child_process');

//Static resources
app.use(express.static(path.join(__dirname, '/public')));

//GET method route
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/score', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end(childProcess.execSync('python3 test.py ' + req.query.lat + ' ' + req.query.lon));
});

//Launch server
var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Server listening on port ' + port);
});
