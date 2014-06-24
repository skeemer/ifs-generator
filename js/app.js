var fractals = angular.module('fractals', []);

var Color = function (red, green, blue) {
  this.red = red;
  this.green = green;
  this.blue = blue;
  this.getRGB = function () {
    return "rgb(" + red + ',' + blue + ',' + green + ')';
  };
  return this;
};
