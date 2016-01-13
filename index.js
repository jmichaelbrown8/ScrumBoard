var express = require('express');
var wagner = require('wagner-core');

require('./models')(wagner);

var app = express();

app.use('/api/v1', require('./api')(wagner));

app.use(express.static('./', { maxAge: 4 * 60 * 60 * 1000 /* 2hrs */ }));

app.listen(3000);
console.log('Listening on port 3000!');