var Fs = require('fs');
var Path = require('path');

var fromDir = '../dict';
var toDir = '../dict-json';

function getTextDictPath(name) {
	return Path.join(__dirname, fromDir, name + '.txt');
}

function getJsonDictPath(name) {
	return Path.join(__dirname, toDir, name + '.json');
}

function getDicts() {
	return Fs.readdirSync(Path.join(__dirname, fromDir)).map(function(fname) {
		return Path.basename(fname, '.txt')
	});
}

function read(path, opt) {
	var words = [];
	var maxSize = opt && opt.maxSize;
	var enc = (opt && opt.encoding) || 'utf-8';
	var data = Fs.readFileSync(path, enc);

	data.split(/\s+/).forEach(function(word) {
		if (word && (!maxSize || word.length <= maxSize)) {
			words.push(word);
		}
	});

	return words;
}

function write(path, data, opt) {
	var enc = (opt && opt.encoding) || 'utf-8';
	var dirPath = Path.join(__dirname, toDir);

	if (!Fs.existsSync(dirPath)) {
	    Fs.mkdirSync(dirPath);
	}

	Fs.writeFileSync(path, JSON.stringify(data, null, 2), enc);
}

(function run() {
	getDicts().forEach(function(dictName) {
		write(
			getJsonDictPath(dictName),
			read(getTextDictPath(dictName))
		);
	});
})();