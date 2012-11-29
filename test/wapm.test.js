
// Testing environment
process.env.NODE_ENV = 'test';

// Dependencies
var 
  chai      = require( 'chai' ),
  sinon     = require( 'sinon' ),
  expect    = chai.expect,
  should    = chai.should(),
  fs        = require( 'fs' ),
  path      = require( 'path' ),
  rimraf    = require( 'rimraf' ),
  config    = require( '../lib/config' ),
  mockLoad  = require( './lib/mockload' ),
  Package   = require( './lib/mocks' ).Package,
  wapm      = mockLoad( '../lib/wapm.js', { "./package" : Package } );

describe( 'wapm module tests.', function () {
  
  describe( 'wapm install', function () {

    afterEach( function () {
      wapm.Package.callCount = 0;
      wapm.Package.args.length = 0;
    });

    it( 'can install a single module', function () {
      wapm.exports.install( 'module-one', {} );
      expect( wapm.Package.called ).to.equal( true );
      expect( wapm.Package.calledOnce ).to.equal( true );
      expect( wapm.Package.args[0][0] ).to.equal( 'module-one' );
    });

    it( 'can install several modules', function () {
      wapm.exports.install( 'module-one', 'module-two', {} );
      expect( wapm.Package.called ).to.equal( true );
      expect( wapm.Package.callCount ).to.equal( 2 );
      expect( wapm.Package.args[0][0] ).to.equal( 'module-one' );
      expect( wapm.Package.args[1][0] ).to.equal( 'module-two' );
    });

    it( 'can install from ./wapm.json', function () {
      wapm.exports.install( {} );
    });

  });

});
      




