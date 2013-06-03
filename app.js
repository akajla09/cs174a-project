
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
var NUM_ASTEROIDS = 150;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app)
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var id = 9
var asteroids = [];
// generate random asteroid field
for(var i = 0; i < NUM_ASTEROIDS; i++) {
  // random scale vector:
  var scalex = 4.5 * Math.random() + 1.5;
  var scaley = 4.5 * Math.random() + 1.5;
  var scalez = 4.5 * Math.random() + 1.5;

  // random translation vector:
  var randx = Math.random() * 200.0 * (Math.random() < 0.5 ? -1 : 1);
  var randy = Math.random() * 200.0 * (Math.random() < 0.5 ? -1 : 1);
  //var randz = Math.random() * -140.0 - 20.0;
  var randz = Math.random() * 200.0 * (Math.random() < 0.5 ? -1 : 1);
  asteroids.push({scale: [scalex, scaley, scalez], coord: [randx, randy, randz]});
}

io.sockets.on('connection', function(socket) {
  socket.emit('init', {asteroids: asteroids, id: id});
  id++;

  socket.on('update', function(data) {
    io.sockets.emit('update', data);
  });

  socket.on('shoot', function(data) {
    io.sockets.emit('shoot', data);
  });

  socket.on('update_asteroids', function(data) {
    asteroids = data;
  });
});

