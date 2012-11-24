
/**
 * Module dependencies.
 */

var request = require( 'request' )
  , log     = require( '../helpers/log' )
  , fs      = require( 'fs' )
  , Batch   = require( 'batch' )
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
  this.name = pkg;
  this.remote = urlRoot + '/packages/' + pkg;
  this.dest = 'modules';

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
  var that = this;
  log.req("GET", this.remote);
  request( this.remote, function ( error, response, body ) {
    var data = JSON.parse(body);
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
    , remote = this.remote + '/script.js';

  fs.exists( this.dest, function ( exists ) {
    var fname = that.dest + '/' + that.script;
    if ( !exists ) {
      fs.mkdirSync( that.dest );
    }
    fs.exists( fname, function ( exists ) {
      if ( !exists ) {
        log.req( 'GET', remote );
        request( remote, function ( error, response, body ) {
          fs.writeFile( fname, body, function ( err ) {
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

