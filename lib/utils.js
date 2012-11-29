
var
  fs      = require( 'fs' ),
  path    = require( 'path' ),
  exists  = fs.existsSync;

/**
 * Read local dependencies from ./wapm.json
 * Synchronous, because the process has nothing to proceed to
 * until this list is resolved.
 */

exports.getLocalDependencies = function () {
  var file = path.join( path.resolve( './' ), 'wapm.json' );
  if ( exists( file ) ) {
    try {
      return JSON.parse( fs.readFileSync( file ) ).dependencies || [];
    } catch (e) {
      throw e;
    }
  } else {
    throw new Error("no wapm.json file!");
  }
};
