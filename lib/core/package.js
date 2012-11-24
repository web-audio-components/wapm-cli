
/**
 * Module dependencies.
 */

var request = require( 'request' )
  , log     = require( '../helpers/log' )
  , fs      = require( 'fs' )
  , Batch   = require( 'batch' )
  , path    = require( 'path' )
  , urlRoot = require( '../config' ).urlRoot;

/**
 * Expose installer.
 */
 
module.exports = Package;

/**
 * Initialize and install a new Package with the name `pkg`
 *
 * @param {String} pkg : package name
 */

function Package ( pkg ) {
  this.dest = 'modules';

  // Assume that a module name containing a slash is a path to a
  // local module.
  if ( !!~pkg.indexOf( '/' ) ) {
    this.remote = pkg;
    this.local = true;
  } else {
    this.remote = urlRoot + '/packages/' + pkg;
    this.local = false;
  }

  var that = this;
  this.define( function () {
    that.install();
  });
}

/**
 * Fetch the remote spec file and adopt its properties
 *
 * @param {Function} callback
 */

Package.prototype.define = function ( callback ) {
  var that = this
    , remote = this.local
        ? path.join( this.remote, 'wapm.json' )
        : this.remote;

  log.req("GET", remote);
  this.fetch( remote, function ( data ) {
    data = JSON.parse(data);
    for ( var prop in data ) {
      that[prop] = data[prop];
    }
    callback();
  });
};

/**
 * Install package, resolve and install dependencies.
 */

Package.prototype.install = function () {
  var that = this
    , remote = this.local
        ? path.join( this.remote, this.script )
        : this.remote + '/script.js';

  fs.exists( this.dest, function ( exists ) {
    var fname = that.dest + '/' + that.script;
    if ( !exists ) {
      fs.mkdirSync( that.dest );
    }
    fs.exists( fname, function ( exists ) {
      if ( !exists ) {
        log.req( 'GET', remote );
        that.fetch( remote, function ( data ) {
          fs.writeFile( fname, data, function ( err ) {
            if ( err ) {
              console.log(err);
            }
          });
        });
      }
    });
  });

  this.dependencies = this.dependencies || [];
  this.dependencies.forEach( function ( pkg ) {
    new Package(pkg);
  });

};

/**
 * Delegates requests to the appropriate handler given
 * whether or not the file is local
 *
 * @param {Function} callback
 */

Package.prototype.fetch = function ( resource, callback ) {
  if ( this.local ) {
    fs.readFile( resource, function ( err, data ) {
      if ( err ) {
        log.error( 'fetch', err.message );
        return;
      }
      callback(data);
    });
  } else {
    request( resource, function ( err, response, body ) {
      if ( err ) {
        log.error( 'fetch', err.message );
        return;
      }
      callback(body);
    });
  }
};

