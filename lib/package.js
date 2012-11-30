
/**
 * Module dependencies.
 */

var 
  request = require( 'request' ),
  config  = require( './config' ),
  utils   = require( './utils' ),
  fs      = require( 'fs' ),
  path    = require( 'path' );

/**
 * Expose constructor.
 */
 
module.exports = Package;

/**
 * Initialize a new Package
 *
 * @param {String} pkg : package name
 * @param {Object} options
 */

function Package ( name, options ) {
  this.name = name;
  this.remote = options.remote || config.remote;
  this.dest = options.dest || config.dest;
  this.force = !!options.force;
}

/**
 * Fetch the wapm.json spec from the service
 *
 * @param {Function} callback
 */

Package.prototype.info = function ( callback ) {
  var url = this.remote + '/' + this.name;
  var that = this;
  utils.log( 'Requesting package info.' );
  request( url, function ( err, response, body ) {
    if ( err ) { return callback.call( that, err ); }
    try {
      var data = JSON.parse( body );
      return callback.call( that, null, data );
    } catch ( err ) {
      return callback.call( that, err );
    }
  });
};

/**
 * Install a package and all of its dependencies
 */

Package.prototype.install = function () {
  this.info( function ( err, data ) {
    if ( err ) { return utils.error( err ); }
    this.writeFiles();
    var that = this;
    var dependencies = data.dependencies || [];
    dependencies.forEach(function ( dep ) {
      var pkg = new Package( dep, {
        remote: that.remote,
        dest: that.dest,
        force: that.force
      });
      pkg.install();
    });
  }.bind(this));
};

/**
 * Fetch script.js and write it to config.dest
 */

Package.prototype.writeFiles = function () {
  var url = this.remote + '/' + this.name + '/script.js';
  var that = this;
  request( url, function ( err, response, body ) {
    if ( err ) { return utils.error( err ); }
    if ( response.statusCode === 200 ) {
      utils.log( 'Writing ' + that.name + '.js' );
      var fname = path.join( that.checkDest(), that.name + '.js' );
      fs.writeFile( fname, body, function ( err ) {
        if ( err ) { return utils.error( err ); }
      });
    } else {
      return utils.error( new Error( 'Module not found.' ) );
    }
  });
};

/**
 * Ensure that the destination folder is available
 */

Package.prototype.checkDest = function () {
  var dest = path.resolve( this.dest );
  if ( fs.existsSync( dest ) ) {
    return dest;
  } else {
    fs.mkdirSync( dest );
    return dest;
  }
};

