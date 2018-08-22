'use strict';

const app = require('express')();
const pdfParser = require('pdf-parser');

const HOPS_TO_MINCHA = 6;
const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];

app.get('/mincha', (req, res) => {
	pdfParser.pdf2json('glenwood.pdf', (err, pdf) => {
		if (err != null) {
			console.error(err);
			res.sendStatus(500);
		} else {
			const texts = pdf.pages[0].texts;
			const sundayKey = getMondayString();
			let i;
			for (i = 0; i < texts.length; ++i) {
				if (texts[i].text === sundayKey) {
					const mincha = texts[i - HOPS_TO_MINCHA].text;
					res.send(mincha);
				}
			}
			if (i === texts.length)
				res.sendStatus(400);
		}
	});
});

function getMondayString() {
	const today = new Date();
	const diff = today.getDate() - today.getDay() + 1;
	const sunday = new Date(today.setDate(diff));
	return sunday.getDate() + '/' + months[sunday.getMonth()];
}

app.listen(process.env.PORT || 3000, () => console.log('pebble-helper started!'));

