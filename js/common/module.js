// RequireJS && SeaJS
//兼容 requirejs  seajs   nodejs

if (typeof define === 'function') {
  define(function() {
    return template;
  });

// NodeJS
} else if (typeof exports !== 'undefined') {
  module.exports = template;
} else {
  this.template = template;
}
