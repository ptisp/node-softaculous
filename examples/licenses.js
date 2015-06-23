var STACULOUS = require('../lib/softaculous');

var config = {
  user: process.env.STACULOUS_NAME,
  pass: process.env.STACULOUS_PASS
};

var clexample = new STACULOUS(config);

clexample.getlicenses('', '', function(err, data){
  if (err) {
    console.log('ERROR');
    console.log(err);
  } else {
    //console.log(data);
  }
});
