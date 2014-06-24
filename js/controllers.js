fractals.controller('FractalsCtrl', function ($scope, $http) {
  $scope.fractals = [];

  $http.get('data/leo_lutz.json').success(function (data) {
    $scope.fractals = data;
  });

  var fractal = new FractalImage(500, 500);
  var colors = fractal.colors;

  $scope.selectFractal = function () {
    fractal.render($scope.transforms);
  };

  $scope.getColor = function (i) {
    var c = fractal.colors[i];
    return {
      "background-color": c.getRGB()
    }
  };

  $scope.setMonochrome = function ($event) {
    fractal.setMonochrome($event.target.checked);
    if($scope.transforms) $scope.selectFractal();
  };
});