var
  log = require( '../helpers/log' ),
  request = require( 'request' ),
  url = 'http://wapm-service.jit.su/packages/search/';

module.exports = function ( query ) {
  log.req( 'GET', url );
  request( url + query, function ( err, res, body ) {
    log.res( err, res );
    if ( !err && res.statusCode === 200 ) {
      console.log( res );
    } else {
      console.log( 'No audio modules found with query "' + query + '"' );
    }
  });
};
