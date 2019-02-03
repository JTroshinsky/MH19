var express = require('express');
var app = express();
var path = require('path');

//Static resources
app.use(express.static(path.join(__dirname, '/public')));

//GET method route
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

//Launch server
var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Server listening on port ' + port);
});
