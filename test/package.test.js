
// Testing environment
process.env.NODE_ENV = 'test';

// Dependencies
var 
  chai = require( 'chai' ),
  expect = chai.expect,
  should = chai.should(),
  mockLoad = require( './lib/mockload' ),
  request = require( './lib/mocks' ).request,
  Package = mockLoad( '../lib/package.js', { request: request } ).Package;

describe( 'Package tests.', function () {

  it( 'Fetch info', function () {
    var pkg = new Package( 'simple-gain', {} );
    pkg.info( function ( err, data ) {
      if ( err ) { throw err; }
      expect( data ).to.be.a( 'object' );
      expect( data ).to.have.property( 'name' );
    });
  });

});
