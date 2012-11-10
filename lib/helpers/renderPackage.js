module.exports = function ( pkg ) {
  var s = '\n';
  s += pkg.name.bold.green + '\n';
  s += pkg.description + '\n';
  console.log( s );
};
