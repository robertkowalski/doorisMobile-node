var express = require('express')
  , routes = require('./routes')
  , http = require('http')

var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(express.static(__dirname + '/public'));
  app.use(app.router);

  app.use(function(req, res, next){
    // respond with html page
    if (req.accepts('html')) {
      res.status(404);
      res.render('error.jade', { layout: false });
      return;
    }
  });

});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: false, showStack: false }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});



// Routes
app.get('/', function(req, res){
  res.render('index.jade');
});


/*
 * CORS proxies
 */
app.get('/banana', function(req, res){

  var options = {
    host: 'bananentage.de',
    port: 80,
    path: '/rainerfoobarbatnarfkrams.txt'
  };

  var req = http.get(options, function(res2) {

    res2.setEncoding('utf8');
    res2.on('data', function (chunk) {
      res.contentType('text/html');
      res.send(chunk);
    }); // on
  }); // req

  req.on('error', function(e) {
    console.log("Got error: " + e.message + "... path: " + options.host + options.path);
  });

  // write data to request body
  req.write('data\n');

});

app.get('/door', function(req, res){

  var options = {
    host: 'dooris.koalo.de',
    port: 80,
    path: '/door.txt'
  };

  var req = http.get(options, function(res2) {

    res2.setEncoding('utf8');
    res2.on('data', function (chunk) {
      res.contentType('text/html');
      res.send(chunk);
    }); // on
  }); // req

  req.on('error', function(e) {
    console.log("Got error: " + e.message + "... path: " + options.host + options.path);
  });

  // write data to request body
  req.write('data\n');

});

app.get("/cache.manifest", function(req, res){

  res.contentType("text/cache-manifest");
  fs.readFile(__dirname + '/index.html',
    function (err, data) {
      if (err) {
        return ;
    }
    res.end(data);
  });

});

app.get("/error.manifest", function(req, res){
  res.contentType("text/cache-manifest");
  fs.readFile(__dirname + '/index.html',
    function (err, data) {
      if (err) {
        return ;
    }
    res.end(data);
  });
});

app.get('/404', function(req, res, next){
  next();
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
