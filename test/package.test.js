
// Testing environment
process.env.NODE_ENV = 'test';

// Dependencies
var 
  chai      = require( 'chai' ),
  expect    = chai.expect,
  should    = chai.should(),
  fs        = require( 'fs' ),
  path      = require( 'path' ),
  rimraf    = require( 'rimraf' ),
  config    = require( '../lib/config' ),
  mockLoad  = require( './lib/mockload' ),
  request   = require( './lib/mocks' ).request,
  Package   = mockLoad( '../lib/package.js', { request: request } ).Package;

describe( 'Package tests.', function () {
  var dest = path.resolve( path.resolve( __dirname, '../' ), config.dest );

  afterEach( function ( done ) {
    if ( fs.existsSync ( dest ) ) {
      rimraf( dest, function ( err ) {
        done( err );
      });
    } else {
      done();
    }
  });

  it( 'Fetch info', function () {
    var pkg = new Package( 'module-one', {} );
    pkg.info( function ( err, data ) {
      if ( err ) { throw err; }
      expect( data ).to.be.a( 'object' );
      expect( data ).to.have.property( 'name' );
    });
  });


  it( 'Install single', function () {
    var pkg = new Package( 'module-one', {} );
    pkg.install();
    expect( fs.existsSync( dest + '/module-one.js' ) ).to.equal(true);
  });

  it( 'Install with dependency chain', function () {
    var pkg = new Package( 'module-three', {} );
    pkg.install();
    expect( fs.existsSync( dest + '/module-one.js' ) ).to.equal(true);
    expect( fs.existsSync( dest + '/module-two.js' ) ).to.equal(true);
    expect( fs.existsSync( dest + '/module-three.js' ) ).to.equal(true);
  });

});
