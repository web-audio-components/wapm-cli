var
  log = require( '../helpers/log' ),
  renderPackage = require( '../helpers/renderPackage' ),
  request = require( 'request' ),
  _ = require( 'underscore' ),
  url = 'http://wapm-service.jit.su/packages/search/';
  url = 'http://localhost:8000/packages/search/';

module.exports = function ( query ) {
  var options = {
    uri: url + query,
    json: true
  }
  log.req( 'GET', options.uri );
  request( options, function ( err, res, body ) {
    log.res( err, res, body );
    if ( !err && res.statusCode === 200 ) {
      if ( !body.length ) {
        log.status( 'search', 'No audio modules found with query "' + query + '"' );
      } else {
        body.forEach(function ( pkg ) {
          renderPackage( pkg );
        });
      }
    }
  });
};
