/**
 * BasicAuth Component
 */
'use strict';

var Buffer = require('buffer').Buffer;
var ServerConfig = require('../../config/ServerConfig');

class BasicAuthUtil {

  generateBasicAuthHeader() {
    var user_colon_pass = ServerConfig.basic_auth.user + ":" + ServerConfig.basic_auth.password;
    var encodedRelm = new Buffer(user_colon_pass).toString("base64");
    return 'Basic ' + encodedRelm;
  }

}

module.exports = new BasicAuthUtil();
