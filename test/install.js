var exec = require( 'child_process' ).exec
  , fs = require( 'fs' )
  , path = require( 'path' )
  , chai = require( 'chai' )
  , expect = chai.expect
  , should = chai.should();

describe( 'wapm install', function () {

  beforeEach( function ( done ) {
    fs.writeFile( 'wapm.json', JSON.stringify({
      dependencies: [
        'simple-gain'
      ]
    }), done);
  });

  afterEach( function ( done ) {
    exec( 'rm -rf modules wapm.json', done );
  });

  describe( '[module]', function () {

    it( 'can install from wapm-service', function ( done ) {
      exec( 'bin/wapm install simple-gain', function ( err, stdout ) {
        if ( err ) return done(err);
        stdout.should.include('GET');
        expect( fs.existsSync( 'modules/simple-gain.js' ) ).to.equal( true );
        done();
      });
    });

    it( 'can install from a local directory', function ( done ) {
      var cmd = 'bin/wapm install ' + __dirname + '/fixtures/simple-gain';
      exec( cmd, function ( err, stdout ) {
        if ( err ) return done(err);
        stdout.should.include('GET');
        expect( fs.existsSync( 'modules/simple-gain.js' ) ).to.equal( true );
        done();
      });
    });

    it( 'correctly grabs dependencies', function ( done ) {
      var cmd = 'bin/wapm install ' + __dirname + '/fixtures/simple-reverb';
      exec( cmd, function ( err, stdout ) {
        if ( err ) return done(err);
        stdout.should.include('GET');
        expect( fs.existsSync( 'modules/simple-gain.js' ) ).to.equal( true );
        expect( fs.existsSync( 'modules/simple-reverb.js' ) ).to.equal( true );
        done();
      });
    });

  });

  describe( 'install from wapm.json', function () {

    it ( 'should install the full dependency list', function ( done ) {
      exec( 'bin/wapm install', function ( err, stdout ) {
        if ( err ) return done(err);
        expect( fs.existsSync( 'modules/simple-gain.js' ) ).to.equal( true );
        done();
      });
    });

  });

});
