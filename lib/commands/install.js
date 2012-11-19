var
  log = require( '../helpers/log' ),
  request = require( 'request' ),
  url = require( '../config' ).urlRoot;

module.exports = function ( query ) {
  log.req( 'GET', url );
};
