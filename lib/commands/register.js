var
  log = require( '../helpers/log' ),
  request = require( 'request' ),
  fs = require( 'fs' ),
  url = 'http://wapm-service.jit.su/packages';

module.exports = function () {
  var options = {
    uri: url,
    timeout: 10000,
    form: null,
    json: true
  };

  try {
    options.form = require( process.cwd() + '/wapm.json' );
  } catch ( err ) {
    log.error( 'register', 'Cannot find wapm.json in current directory' );
  }
  if ( options.form ) {
    log.req( 'POST', url );
    request.post( options, function ( err, res, body ) {
      log.res( err, res );
      if ( !err && res.statusCode === 200 ) {
        log.status( 'register', 'Module successfully registered!' );
      } else {
        log.error( 'register', 'Check that your wapm.json follows the spec' );
      }
    });
  }
};
