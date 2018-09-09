'use strict';

const app = require('express')();

const glenwoodHelper = require('./helpers/glenwood.js');

app.get('/mincha', (req, res) => glenwoodHelper.getMincha()
	.then(mincha => res.send(mincha))
	.catch(err => res.status(err.status).send(err.message))
);

app.get('/shabbat', (req, res) => glenwoodHelper.getShabbat()
	.then(shabbat => res.send(shabbat))
	.catch(err => res.status(err.status).send(err.message))
);

app.get('/tzeit', (req, res) => glenwoodHelper.getTzeit()
	.then(tzeit => res.send(tzeit))
	.catch(err => res.status(err.status).send(err.message))
);

app.listen(process.env.PORT || 3000, () => console.log('pebble-helper started!'));

