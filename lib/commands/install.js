var
  log = require( '../helpers/log' ),
  fs = require( 'fs' ),
  Package = require( '../core/package' );

/**
 * Core install method
 */

module.exports = function ( pkgs, flags ) {

  if ( pkgs.length === 0 ) {
    log.status( 'install', 'Reading package list from wapm.json' );
    if ( fs.existsSync( './wapm.json' ) ) {
      var data = JSON.parse( fs.readFileSync( './wapm.json' ) );
      pkgs = data.dependencies;
    } else {
      log.error( 'install', 'No wapm.json file found.' );
      return;
    }
  }

  pkgs.forEach( function ( pkg ) {
    new Package(pkg);
  });

};
