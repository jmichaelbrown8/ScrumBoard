var app = angular.module("ScrumBoard", []);

app.controller("ProductBacklog", function($scope, $http, $window) {
	
	$scope.pbis = [];

  $scope.locked = $window.location.hash != '#/edit';

  $scope.lock = function(){
    if ($scope.locked) {
        $window.location.hash = 'edit';
        $scope.locked = false;
      }
    else {
      $window.location.hash = '';
      $scope.locked = true;
    }
  };

	$scope.loadPbis = function(){

		$http.get('/api/v1/pbis').success(function(data){
			$scope.pbis = data.pbis;
		});
	};

	$scope.createPbi = function(){
		$http.post('/api/v1/pbi', 
			{
        'who': 'who',
				'what': 'what',
        'why': 'why',
        'value': '',
        'size': '',
        'acceptanceCriteria': ['one', 'two', 'three']
			}).success(function(data){
				$scope.pbis.push(data);
			});
	};

	$scope.deletePbi = function(id){
    if (!$window.confirm('Are you sure you want to delete this PBI?\n\n*This can not be reversed.'))
      return;
		$http.delete('/api/v1/pbi/' + id).success($scope.loadPbis);
	};

	$scope.loadPbis();


});

app.controller("ProductBacklogItem", function($scope, $http){
	$scope.pbi = $scope.$parent.$parent.pbi;

	$scope.updatePbi = function(pbi){
		$http.post('/api/v1/pbi/' + pbi._id, pbi).success(function(data){

    });
	};

  $scope.flip = function() {
    $scope.pbi.flip = !$scope.pbi.flip;
  };

  $scope.removeAcceptanceCriteria = function(i) {
    $scope.pbi.acceptanceCriteria.splice(i, 1);
    $scope.updatePbi($scope.pbi);
  };

  $scope.addAcceptanceCriteria = function() {
    $scope.pbi.acceptanceCriteria.push('');
  };

});

app.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "?ngModel",
    link: function(scope, element, attrs, ngModel) {
      if (!ngModel)
        return;

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur", function() {
        scope.$apply(read);
        scope.updatePbi(scope.pbi);
      });
    }
  };
});