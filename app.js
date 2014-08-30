var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var _ = require('underscore');
var io = require('socket.io')(http);


var messages = [];
var idGen = 0;
var client = {};

app.use(bodyParser.json());
app.use('/js', express.static(__dirname + '/public/js'));

app.get("/", function(req, res) {
    res.sendFile('index.html', { root: __dirname + '/public'});
});

app.get('/messages', function(req,res) {
    res.send(messages);
});

app.post('/messages', function(req, res) {
    var data = _.defaults(req.body, { user: 'anonymous'});

    if(!!data.message) {
        data.timestamp = Date.now();
        data.id = idGen++;

        messages.push(data);

        io.emit('chat_message', data);

        return res.send(data);
    }



    res.send(400).end();
});

io.on('connection', function(socket) {
    console.log('user connected:'+socket.id);

    socket.emit('greet', messages);

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

http.listen(8080, function() {
    console.log('server is up');
});
