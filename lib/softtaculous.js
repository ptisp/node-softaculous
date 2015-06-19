var request = require('request');

var API = function(opts) {
  var self = this;
  this.auth = {
    user: opts.user,
    pass: opts.pass
  };
};

var modem = function(auth, options, callback) {
  var serverOptions = {
    uri: 'https://www.softaculous.com/noc?' + options.uri + '&json=1',
    method: 'POST',
    body: require('querystring').stringify({
      nocname: auth.user,
      nocpass: auth.pass
    }),
    headers: {}
  };

  serverOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  serverOptions.headers['Content-Length'] = serverOptions.body.length;
  console.log(serverOptions);

  request(serverOptions, function(err, res, body) {
    if (err) {
      return callback(err);
    }
    var data;
    try {
      data = JSON.parse(body);
    } catch (e) {
      return callback(new Error('JSON failed to parse: ' + e + ' -> "' + body + '"'));
    }
    return callback(undefined, data);

  });
};

/**
 * getlicenses -
 * gets a list of licenses
 * @param key - String - The License KEY to get the details of that
				  particular License
 * @param ip - String - The Primary IP of a License to get the details of
				  that particular License
 * @param callback
 */
API.prototype.getlicenses = function(key, ip, callback) {
  var createOptions = {
    uri: 'ca=softaculous'
  };

  createOptions.uri += '&lickey='+(key || '');
  createOptions.uri += '&ips='+(ip || '');

  modem(this.auth, createOptions, callback);
};

/**
 * buylicenses -
 * To Buy or Renew a License
 * @param ip - String - The Primary IP of a License to get the details of
				  that particular License
 * @param toadd - String - Time to extend. Valid extension e.g.
					- '1M' will extend by one months
					- '8M' will extend by eight months
					- '1Y' will extend by One year
 * @param servertype - String - 1 for Dedicated and 2 for VPS
 * @param authmail - String - When a new license is purchased an Authorisation email
						is required to verify the owner of the License or for
						reminders when the license is expiring. This is not
						required in case of renewals
 * @param autorenew - String - To be renewed Automatically before expiry.
						Values - 1 for true
								 0 (i.e. any empty value) or 2 for false
						Emails will be sent when renewed.
 * @param callback
 */
API.prototype.buylicenses = function(ip, toadd, servertype, authmail, autorenew, callback) {
  var createOptions = {
    uri: 'ca=softaculous_buy&purchase=1&ips='+ip+'&toadd='+toadd+'&servertype='+servertype+'&authemail='+authmail+'&autorenew='+autorenew
  };
  modem(this.auth, createOptions, callback);
};

/**
 * cancellicenses -
 * remove license and its auto renewal
 * @param key - String - The License KEY
 * @param ip - String - The Primary IP of the License
 * @param callback
 *
 * NOTE: A cancel will not be allowed if you have a license expiring
			  	after MORE than a MONTH.
 */
API.prototype.cancellicenses = function(key, ip, callback) {
  var createOptions = {
    uri: 'ca=softaculous_cancel'
  };

  createOptions.uri += '&lickey='+(key || '');
  createOptions.uri += '&licip='+(ip || '');

  createOptions.uri += '&cancel_license=1';
  modem(this.auth, createOptions, callback);
};

/**
 * addautorenewal -
 * Add Auto Renewals
 * @param key - String - The License KEY to get the details of that
				  particular License
 * @param callback
 */
API.prototype.addautorenewal = function(key, callback) {
  var createOptions = {
    uri: 'ca=softaculous_renewals&addrenewal=1&lickey='+key
  };
  modem(this.auth, createOptions, callback);
};

/**
 * removeautorenewal -
 * Remove Auto Renewals
 * @param key - String - The License KEY to get the details of that
				  particular License
 * @param callback
 */
API.prototype.removeautorenewal = function(key, callback) {
  var createOptions = {
    uri: 'ca=softaculous_renewals&cancelrenewal=1&lickey='+key
  };
  modem(this.auth, createOptions, callback);
};

/**
 * editips -
 * Edit the IPs of a License
 * @param lid - String - The License ID (NOT the license key) e.g. lid could be 1000
 * @param ip - String - The list of IPs of the same VPS / Server. The first IP you
				  enter will be the primary IP Address of the License. You can
				  enter upto a maximum of 8 IP Address per license.
 * @param callback
 */
API.prototype.editips = function(lid, ips, callback) {
  var createOptions = {
    uri: 'ca=softaculous_showlicense&lid='+lid+'&ip[]='+ips+'&editlicense=1'
  };
  modem(this.auth, createOptions, callback);
};

module.exports = API;
