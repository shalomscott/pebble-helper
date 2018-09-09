'use strict';

const pdfParser = require('pdf-parser');

const HOPS_TO_MINCHA = 2;
const HOPS_TO_SHABBAT = 4;
const HOPS_TO_TZEIT = 6;

module.exports = {
	getMincha: getEntry(HOPS_TO_MINCHA),
	getShabbat: getEntry(HOPS_TO_SHABBAT),
	getTzeit: getEntry(HOPS_TO_TZEIT)
};

function getEntry(offset) {
	return () => new Promise((resolve, reject) => {
		pdfParser.pdf2json('glenwood_5779.pdf', (err, pdf) => {
			if (err) {
				console.error(err.message);
				reject(new StatusError('Error Parsing PDF', 500));
			} else {
				const texts = pdf.pages[0].texts;
				const saturdayKey = getNearestSaturday();
				const index = texts.findIndex(e => e.text == saturdayKey);
				if (index === -1)
					reject(new StatusError('No entry found for current date', 400));
				const entry = texts[index + offset].text;
				resolve(entry);
			}
		});
	});
}

function getNearestSaturday() {
	const today = new Date();
	const saturdayDate = today.getDate() + (6 - today.getDay());
	const saturday = new Date(today.setDate(saturdayDate));
	return formatDate(saturday);
}

function formatDate(date) {
	const dateString = (date.getDate() < 10 ? '0' : '') + date.getDate();
	const monthString = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
	return dateString + '/' + monthString;
}

class StatusError extends Error {
	constructor(message, status) {
		super(message);
		this.status = status;
	}
}
