exports.choose = choose;
exports.noun = noun;
exports.verb = verb;
exports.adjective = adjective;
exports.read = read;
exports.generator = generator;
exports.Dictionary = Dictionary;
exports.Generator = Generator;

var WordLists = {
  adjectives: require('../dict-json/adjectives'),
  nouns: require('../dict-json/nouns'),
  verbs: require('../dict-json/verbs')
};

// ## Shortcuts ##

function noun(opt) {
  return read('nouns', opt);
}

function verb(opt) {
  return read('verbs', opt);
}

function adjective(opt) {
  return read('adjectives', opt);
}

function read(name, opt) {
  return (new Dictionary()).read(name, opt);
}

function generator(dicts, opt) {
  var gen = new Generator(opt);

  dicts.forEach(function(dict) {
    gen.use(dict, opt);
  });

  return gen;
}

var _names;
function choose() {
  if (!_names)
    _names = generator([adjective, noun]);
  return _names.choose();
}


// ## Dictionary ##

function Dictionary() {
  this.words = [];
}

Dictionary.prototype.read = function(name, opt) {
  this.words = WordLists[name];
  
  return this;
};

Dictionary.prototype.choose = function() {
  return this.words[random(this.words.length)];
};


// ## Generator ##

function Generator(opt) {
  this.dicts = [];
  this.glue = (opt && opt.glue) || '-';
}

Generator.prototype.choose = function() {
  var dicts = this.dicts,
      size = dicts.length;

  if (size === 0)
    throw new Error('no available dictionaries.');

  if (size === 1)
    return dicts[0].choose();

  var probe, tries = 10, used = {};
  var seq = dicts.map(function(dict) {
    for (var i = 0; i < tries; i++) {
      if (!used.hasOwnProperty(probe = dict.choose()))
        break;
    }

    if (i === tries)
      throw new Error('too many tries to find a unique word');

    used[probe] = true;
    return probe;
  });

  return seq.join(this.glue);
};

Generator.prototype.use = function(dict, opt) {
  var dicts = this.dicts;

  if (dict instanceof Dictionary)
    dicts.push(dict);
  if (typeof dict == 'string')
    dicts.push((new Dictionary()).read(dict, opt));
  else if (typeof dict == 'function')
    dicts.push(dict(opt));
  else
    next(new Error('unrecognized dictionary type'));

  return this;
};


// ## Helpers ##

function builtin(name) {
  return Path.join(__dirname, '../dict', name + '.txt');
}

function random(limit) {
  return Math.floor(Math.random() * limit);
}