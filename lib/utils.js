
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
      exports.fatal( e );
    }
  } else {
    exports.fatal( new Error( 'No manifest file found.' ) );
  }
};

/**
 * Logging utilities
 */

exports.error = function ( err ) {
  console.log( '  error'.bold.red + ' (' + err.name + ') ' + err.message );
};

exports.fatal = function ( err ) {
  exports.error( err );
  process.exit();
};

exports.log = function ( msg ) {
  console.log( '  status '.bold.green + msg );
};

// Display a package's information nicely
exports.display = function ( info ) {
  var address = (' http://www.github.com/' + info.repo ).grey;
  var name = '  ' + info.name.bold.cyan;

  console.log( name + address );
  console.log( '  ' + info.description );
  console.log( '    ' + info.keywords.join( ', ' ) );
  console.log();
};

