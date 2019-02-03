var express = require('express');
var app = express();
var path = require('path');
var python = require('python-shell');

//Static resources
app.use(express.static(path.join(__dirname, '/public')));

//GET method route
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/score', function(req, res) {
    let options = {
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: 'python/',
        args: [req.query.lat, req.query.lon]
    };
    let pyshell = new python.PythonShell('main.py', options);

    pyshell.on('message', function (message) {
      res.end(message);
    });
});

//Launch server
var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Server listening on port ' + port);
});
