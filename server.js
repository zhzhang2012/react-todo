/**
 * Created by Tony_Zhang on 8/22/15.
 */
'use strict';

var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    AV = require('leanengine');

var app = express();

var APP_ID = process.env.LC_APP_ID || 'A3E8biTrCIKurP1Qp6JlCdzK'; // your app id
var APP_KEY = process.env.LC_APP_KEY || 'HRxDHoF1raxXi9rmPepefB6I'; // your app key
var MASTER_KEY = process.env.LC_APP_MASTER_KEY || 'o8lUzW6w0yqNsM4Smeq9opQQ'; // your app master key

AV.initialize(APP_ID, APP_KEY, MASTER_KEY);

app.use('/', express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/todos', function (req, res) {
    var Todo = AV.Object.extend('Todos');
    var query = new AV.Query(Todo);

    query.find({
        success: function (todos) {
            res.status(200).json(todos);
        }, error: function (err) {
            res.status(err.code).send(err.message);
        }
    })
});

app.post('/todo', function (req, res) {
    var Todo = AV.Object.extend('Todos');
    var todo = new Todo();
    todo.set('content', req.body.content);

    todo.save(null, {
        success: function (todo) {
            res.status(200).json(todo);
        }, error: function (err) {
            req.status(err.code).send(err.message);
        }
    })
});

app.post('/finish', function (req, res) {
    var Todo = AV.Object.extend('Todos');
    var query = new AV.Query(Todo);

    query.get(req.body.id, {
        success: function (todo) {
            todo.set('hasFinished', true);
            todo.save();
            res.status(200).send({});
        }, error: function (err) {
            req.status(err.code).send(err.message);
        }
    })
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Node server listen on port: " + PORT);
});