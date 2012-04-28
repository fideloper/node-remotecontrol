
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer(),
    io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/remote', routes.remote)

io.sockets.on('connection', function (socket) {
  // socket.emit('news', { hello: 'world' });
  // socket.on('my other event', function (data) {
  //   console.log(data);
  // });
  
  socket.on('play', function(data) {
    io.sockets.emit('play', {play:'true'});
  });

  socket.on('pause', function(data) {
    io.sockets.emit('pause', {play:'false'});
  });

  socket.on('stop', function(data) {
    io.sockets.emit('stop', {play:'false'});
  });

});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
