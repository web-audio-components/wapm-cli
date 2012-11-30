
var
  fs      = require( 'fs' ),
  path    = require( 'path' ),
  exists  = fs.existsSync;

require( 'colors' );

/**
 * Read local dependencies from ./wapm.json
 * Synchronous, because the process has nothing to proceed to
 * until this list is resolved.
 */

exports.readLocalManifest = function () {
  var file = path.join( path.resolve( './' ), 'wapm.json' );
  if ( exists( file ) ) {
    try {
      return JSON.parse( fs.readFileSync( file ) ) || {};
    } catch (e) {
      throw e;
    }
  } else {
    throw new Error("no wapm.json file!");
  }
};

/**
 * Logging utilities
 */

exports.error = function ( err ) {
  console.log( 'error'.bold.red + ' (' + err.name + ') ' + err.message );
};

exports.fatal = function ( err ) {
  exports.error( err );
  process.exit();
};

exports.log = function ( msg ) {
  console.log( 'log '.bold.green + msg );
};

// Display a package's information nicely
exports.display = function ( info ) {
  console.log( info.name + ' http://www.github.com/' + info.repo );
  console.log( info.description );
};

