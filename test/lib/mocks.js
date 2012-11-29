
var 
  fs = require( 'fs' ),
  path = require( 'path' ),
  utils = require( path.resolve( __dirname, '../../lib/utils' ) ),
  sinon = require( 'sinon' );

/**
 * Mocking GET requests
 * Note: mock is synchronous for ease of testing.
 */

exports.request = function ( url, callback ) {
  var stats;

  try {
    stats = fs.statSync( url );
  } catch ( err ) {
    return callback( err );
  }

  if ( stats.isDirectory() ) {
    url = path.resolve( url, 'wapm.json' );
  }

  return callback( null, { statusCode: 200 }, fs.readFileSync( url ) );
};

/**
 * Mock the post request for module registration
 */

exports.request.post = function ( options, callback ) {
  var valid = true
    && options.form.name && typeof options.form.name === 'string'
    && options.form.repo && options.form.repo.split( '/' ).length === 2
    && options.form.description && typeof options.form.description === 'string'
    && options.form.keywords && typeof options.form.keywords === 'object'
    && options.form.script && typeof options.form.script === 'string';

  if ( valid ) {
    return callback( null, { statusCode: 200 }, null );
  } else {
    return callback( new Error("Bad spec!"), {}, null );
  }
};

/**
 * Mocking the Package object
 * for testing the interface between lib/wapm
 * and lib/package
 */

exports.Package = sinon.spy();
exports.Package.prototype.install = sinon.spy();

/**
 * Mock the utils object to check console output
 */

exports.utils = {
  error: sinon.spy(),
  log: sinon.spy(),
  fatal: sinon.spy(),
  readLocalManifest: utils.readLocalManifest
};
