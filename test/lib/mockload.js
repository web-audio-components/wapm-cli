
var 
  vm = require( 'vm' ),
  fs = require( 'fs' ),
  path = require( 'path' );

/**
 * Helper for unit testing:
 * - load module with mocked dependencies
 * - allow accessing private state of the module
 *
 * @param {string}
 * @param {Object}
 */

module.exports = function ( filePath, mocks ) {
  mocks = mocks || {};

  // Our test files are one directory up...
  var root = path.resolve( __dirname, '../' );

  // Resolve require's appropriately
  filePath = path.resolve( root, filePath );

  // this is necessary to allow relative path modules within loaded file
  // i.e. requiring ./some inside file /a/b.js needs to be resolved to /a/some
  var resolveModule = function ( module ) {
    if ( module.charAt(0) !== '.' ) { return module; }
    return path.resolve( path.dirname( filePath ), module );
  };

  var exports = {};
  var context = {
    require: function ( name ) {
      return mocks[name] || require( resolveModule( name ) );
    },
    console: console,
    exports: exports,
    module: {
      exports: exports
    }
  };

  vm.runInNewContext( fs.readFileSync( filePath ), context );
  return context;
};
