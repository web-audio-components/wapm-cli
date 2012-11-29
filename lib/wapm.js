
/**
 * Module dependencies.
 */

var
  log     = require( './helpers/log' ),
  fs      = require( 'fs' ),
  path    = require( 'path' ),
  Package = require( './package' ),
  exists  = fs.existsSync,
  resolve = path.resolve;

/**
 * wapm install [options] [module ...]
 * Install modules and their dependencies.
 */

exports.install = function () {
  var args = Array.prototype.slice.call( arguments );
  var modules = args.slice( 0, -1 );
  var flags = args[args.length - 1];

  modules = ( modules.length > 0 )
    ? modules
    : getLocalDependencies(); // utils.getLocalDependencies();

  modules.forEach( function ( module ) {
    var pkg = new Package( module, { force: flags.force } );
    pkg.install();
  });
};

/**
 * Read local dependencies from ./wapm.json
 */

var getLocalDependencies = function () {
  var file = path.join( process.cwd(), 'wapm.json' );
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
