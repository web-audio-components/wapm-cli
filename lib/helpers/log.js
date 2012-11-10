module.exports = {
  status: function ( loc, s ) {
    log( 'status'.green, loc, s );
  },
  req: function ( method, url ) {
    log( 'http'.green, method, url );
  },
  res: function ( err, response, body ) {
    response = response || { statusCode: 0, body: { message: null }};
    var code = response.statusCode;
    if ( err || code !== 200 ) {
      log( 'ERR!'.red, code+'', err || response.body.message );
    } else {
      log( 'http'.green, code+'', 'success' );
    }
  },
  error: function ( loc, message ) {
    log( 'ERR!'.red, loc, message );
  }
};

function log ( type, cmd, message ) {
  console.log(
    'wapm '.white +
    type + ' ' +
    cmd.green + ' ' +
    message
  );
}
