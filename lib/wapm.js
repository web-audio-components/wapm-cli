
/**
 * Module dependencies.
 */

var
  log     = require( './helpers/log' ),
  fs      = require( 'fs' ),
  path    = require( 'path' ),
  request = require( 'request' ),
  Package = require( './package' ),
  utils   = require( './utils' ),
  config  = require( './config' ),
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
    : utils.readLocalManifest().dependencies || [];

  modules.forEach( function ( module ) {
    var pkg = new Package( module, { force: flags.force } );
    pkg.install();
  });
};

/**
 * wapm register
 * Register a module, referencing ./wapm.json
 */

exports.register = function () {
  request.post( {
    uri: config.remote,
    timeout: 10000,
    json: true,
    form: utils.readLocalManifest()
  }, function ( err, response, body ) {
    if ( err ) { return utils.error( err ); }
    if ( response.statusCode === 200 ) {
      utils.log( 'Module registered successfully.' );
    } else {
      utils.log( 'Unknown error!' );
    }
  });
};
