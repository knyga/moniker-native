var Moniker = require('moniker-native');

var names = Moniker.generator([Moniker.adjective, Moniker.noun]);

console.log(names.choose());
