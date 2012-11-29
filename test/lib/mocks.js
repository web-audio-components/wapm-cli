
var 
  path = require( 'path' ),
  fs = require( 'fs' );

/**
 * Mocking the request module
 * Note: mock is synchronous for ease of testing.
 */

exports.request = function ( url, callback ) {
  var stats;

  try {
    stats = fs.statSync( url );
  } catch ( err ) {
    return callback( err );
  }

  if ( stats.isDirectory() ) {
    url = path.resolve( url, 'wapm.json' );
  }

  return callback( null, { statusCode: 200 }, fs.readFileSync( url ) );
};

