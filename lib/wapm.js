
/**
 * Module dependencies.
 */

var
  log     = require( './helpers/log' ),
  fs      = require( 'fs' ),
  path    = require( 'path' ),
  Package = require( './package' ),
  utils   = require( './utils' ),
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
    : utils.getLocalDependencies(); // utils.getLocalDependencies();

  modules.forEach( function ( module ) {
    var pkg = new Package( module, { force: flags.force } );
    pkg.install();
  });
};

