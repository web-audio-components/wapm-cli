
var path = require( 'path' );

module.exports = {

  dest: 'audio_modules',
  remote: (process.env.NODE_ENV === 'test' )
    ? path.resolve( __dirname, '../test/fixtures' )
    : 'http://wapm-service.jit.su/packages'

}
