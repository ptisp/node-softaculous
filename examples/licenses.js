var STACULOUS = require('../lib/softtaculous');

var config = {
  user: process.env.STACULOUS_NAME,
  pass: process.env.STACULOUS_PASS
};

var clexample = new STACULOUS(config);

clexample.licenses('', '', function(err, data){
  if (err) {
    console.log('ERROR');
    console.log(err);
  } else {
    console.log(data);
  }
});
