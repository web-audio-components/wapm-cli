
/**
 * Module dependencies.
 */

var
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

/**
 * wapm search [query]
 * Query the service for related packages
 */

exports.search = function () {
  var terms = Array.prototype.slice.call( arguments ).slice( 0, -1 );

  if ( terms.length === 0 ) {
    return utils.error( new Error( 'Invalid search query.' ) );
  }

  var query = terms.join( '+' );
  request( {
    uri: config.remote + '/search/' + query,
    json: true
  }, function ( err, response, body ) {
    if ( err ) { return utils.error( err ); }
    if ( response.statusCode === 200 ) {
      if ( body.length && body.length > 0 ) {
        body.forEach( function ( pkg ) {
          utils.display( pkg );
        });
      } else {
        utils.log( 'No packages matched your search query.' );
      }
    } else {
      utils.error( new Error( 'Unknown server error, sorry!' ) );
    }
  });
};

