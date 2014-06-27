fractals.controller('FractalsCtrl', function ($scope, $http) {
  $scope.margin = 5;
  $scope.fractals = [];

  $http.get('data/leo_lutz.json').success(function (data) {
    $scope.fractals = data;
  });

  var fractal = new FractalImage(500, 500);
  var colors = fractal.colors;

  function renderFractal(transforms) {
    if(transforms) fractal.render(transforms);
  }

  $scope.getColor = function (i) {
    var c = fractal.colors[i];
    return {
      "background-color": c.getRGB()
    }
  };

  $scope.setMonochrome = function ($event) {
    fractal.setMonochrome($event.target.checked);
    renderFractal($scope.transforms)
  };

  $scope.updateMargin = function ($event) {
    fractal.margin = Number($scope.margin);
    if($scope.transforms) $scope.selectFractal();
  };

  $scope.$watch('transforms', renderFractal, true);

  $scope.addRow = function () {
    if($scope.transforms) $scope.transforms.push({a:0,b:0,c:0,d:0,e:0,f:0});
  };

  $scope.removeRow = function () {
    if($scope.transforms && $scope.transforms.length > 0) $scope.transforms.pop();
  };

  $scope.gridOptions = {
    data: 'transforms',
    enableCellSelection: true,
    enableRowSelection: false,
    enableCellEditOnFocus: true,
    plugins: [new ngGridFlexibleHeightPlugin()],
    columnDefs: [
      {
        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()" ng-style="getColor(row.rowIndex)"><span ng-cell-text>&nbsp;</span></div>',
        enableCellEdit: false,
        maxWidth: 20
      },
      {
        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text>T{{row.rowIndex+1}}</span></div>',
        enableCellEdit: false
      },
      {
        field: 'a',
        displayName: 'A',
        enableCellEdit: true,
        cellFilter: 'number'
      },
      {
        field: 'b',
        displayName: 'B',
        enableCellEdit: true,
        cellFilter: 'number'
      },
      {
        field: 'c',
        displayName: 'C',
        enableCellEdit: true,
        cellFilter: 'number'
      },
      {
        field: 'd',
        displayName: 'D',
        enableCellEdit: true,
        cellFilter: 'number'
      },
      {
        field: 'e',
        displayName: 'E',
        enableCellEdit: true,
        cellFilter: 'number'
      },
      {
        field: 'f',
        displayName: 'F',
        enableCellEdit: true,
        cellFilter: 'number'
      }
    ]
  };
});