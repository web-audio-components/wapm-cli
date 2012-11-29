// SimpleGain

(function ( root, factory ) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.SimpleGain = factory();
  }
})(this, function () {

  function SimpleGain ( context, options ) {
    options = options || {};

    var _this = this;
    this.context = context;
    var gainNodeDirty = this.context.createGainNode();
    var gainNodeLevel = this.context.createGainNode();

    this.input = gainNodeDirty;
    this.output = gainNodeLevel;

    // Params

    var gain = {
      name: 'gain',
      defaultValue: options.gain || 10,
      minValue: 1,
      maxValue: 50
    };

    this.params = {
      gain: gain
    };

    setupParams.call( this.params.gain );
    // Get to set up
    this.params.gain.value;
  }
  
  SimpleGain.prototype.connect = function ( node ) {
    this.output.connect( node && node.input ? node.input : node );
  };

  SimpleGain.prototype.disconnect = function () {
    this.output.disconnect();
  };

  function setupParams () {
    var _this = this;
    this.__value = this.defaultValue;
    this.__defineGetter__( 'value', function () { return _this.__value; });
    this.__defineSetter__( 'value', function ( val ) {
      _this.__value = val;
      controlGain.call( _this );
    });
  }

  function controlGain () {
    var value = this.params.gain.value;
    this.input.gain.value = value;
    this.output.gain.value  = (1 - (value*0.01)) / 1;
  }

  return SimpleGain;

});
