var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    bodyParser = require('body-parser'),
    assert = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true })); 

MongoClient.connect('mongodb://localhost:27017/videos', function(err, db){

     assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");
    // Handler for internal server errors
    function errorHandler(err, req, res, next) {
        console.error(err.message);
        console.error(err.stack);
        res.status(500).render('error_template', { error: err });
    }

    // app.get('/', function(req, res, next) {
    //     
    // });

     app.get('/', function(req, res){
        db.collection('movies').find({}).toArray(function(err, docs) {
            res.render('moviePicker', {});
        });

    });

    app.post('/mymovies', function(req, res, next) {
        console.log(req.body);
        var title = req.body.title;
        var year = req.body.year;
        var IMDB = req.body.IMDB;
        if (!title || !year || !IMDB) {
            next('Please tell us your favorite movie!');
        }
        else {
            console.log("getting here");
            db.collection('movies').insert({"title": title, "year": year, "IMDB": IMDB});
            res.redirect('/');
        }
    });

    app.use(errorHandler);

    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });

})