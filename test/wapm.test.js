
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
  wapm      = mockLoad( '../lib/wapm.js', { './package' : Package } );

describe( 'WAPM tests.', function () {

  describe( 'wapm install', function () {

    before( function () {
      fs.writeFileSync( 'wapm.json', JSON.stringify({
        dependencies: [ 'module-one', 'module-two' ]
      }));
    });

    after( function ( done ) {
      rimraf( 'wapm.json', function ( err ) {
        done( err );
      });
    });

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
      expect( wapm.Package.called ).to.equal( true );
      expect( wapm.Package.callCount ).to.equal( 2 );
      expect( wapm.Package.args[0][0] ).to.equal( 'module-one' );
      expect( wapm.Package.args[1][0] ).to.equal( 'module-two' );
    });

  });

  describe( 'wapm register', function () {

    var 
      request = require( './lib/mocks' ).request,
      utils = require( './lib/mocks' ).utils,
      wapm = mockLoad( '../lib/wapm.js', {
        request : request,
        './utils': utils
      });

    afterEach( function ( done ) {
      utils.log.args.length = 0;
      utils.log.callCount = 0;
      utils.error.args.length = 0;
      utils.error.callCount = 0;
      rimraf( 'wapm.json', function ( err ) {
        done( err );
      });
    });

    it( 'confirms registration on success', function () {
      fs.writeFileSync( 'wapm.json', JSON.stringify({
        name: 'my-cool-module',
        repo: 'nick/cool',
        description: 'too cool for school, son',
        keywords: [ 'obviously', 'this', 'is', 'cool' ],
        script: './path/to/cool.js'
      }));
      wapm.exports.register();

      expect( utils.log.callCount ).to.equal(1);
      chai.assert( /success/.test( utils.log.args[0][0] ) );
    });

    it( 'alerts on registration failure', function () {
      fs.writeFileSync( 'wapm.json', JSON.stringify({
        name: 'my-cool-module',
        repo: 'https://www.github.com/nick/cool',
        description: 'too cool for school, son',
        keywords: [ 'obviously', 'this', 'is', 'cool' ],
        script: './path/to/cool.js'
      }));
      wapm.exports.register();

      expect( utils.error.callCount ).to.equal(1);
      chai.assert( /Bad/.test( utils.error.args[0][0].message ) );
    });

  });

  describe( 'wapm search', function () {

    var 
      request = require( './lib/mocks' ).request,
      utils = require( './lib/mocks' ).utils,
      wapm = mockLoad( '../lib/wapm.js', {
        request : request,
        './utils': utils
      });

    afterEach( function () {
      utils.log.args.length = 0;
      utils.log.callCount = 0;
      utils.error.args.length = 0;
      utils.error.callCount = 0;
    });

    it( 'doesnt accept empty search queries', function () {
      wapm.exports.search();
      expect( utils.error.callCount ).to.equal( 1 );
      chai.assert( /Invalid/.test( utils.error.args[0][0] ) );
    });

    it( 'logs package info to console', function () {
      wapm.exports.search( 'hey', 'this', 'is', 'cool' );
      expect( utils.display.callCount ).to.equal( 2 );
    });

  });

  describe( 'wapm info', function () {

    var 
      request = require( './lib/mocks' ).request,
      utils = require( './lib/mocks' ).utils,
      wapm = mockLoad( '../lib/wapm.js', {
        request : request,
        './utils': utils
      });

    it( 'logs package info to console', function () {
      wapm.exports.info( 'module-one', {} );
      expect( utils.display.callCount ).to.equal( 2 );
    });

  });

});

