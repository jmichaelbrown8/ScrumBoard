var app = angular.module("ScrumBoard", []);

app.controller("ProductBacklog", function($scope, $http) {
	
	$scope.pbis = [];

	$scope.loadPbis = function(){

		$http.get('/api/v1/pbis').success(function(data){
			$scope.pbis = data.pbis;
		});
	};

	$scope.createPbi = function(){
		$http.post('/api/v1/pbi', 
			{
				'what': 'new item'
			}).success(function(data){
				$scope.pbis.push(data);
			});
	};

	$scope.deletePbi = function(id){
		$http.delete('/api/v1/pbi/' + id).success($scope.loadPbis);
	};

	$scope.loadPbis();


});

app.controller("ProductBacklogItem", function($scope, $http){
	$scope.pbi = $scope.$parent.$parent.pbi;

	$scope.updatePbi = function(pbi){
		$http.post('/api/v1/pbi/' + pbi._id, pbi).success();
	};

	$scope.$watch('pbi.who', function(data){
		alert(data);
	});

});

app.directive('contenteditable', ['$sce', function($sce) {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    scope: {
    	ngBind: '@'
    },
    link: function(scope, element, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model

      // Specify how UI should be updated
      ngModel.$render = function() {
        element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
      };

      // Listen for change events to enable binding
      element.on('blur', function() {
        scope.$evalAsync(read);
      });
      read(); // initialize

      // Write data to the model
      function read(first) {
        var html = element.html();
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        if ( attrs.stripBr && html == '<br>' ) {
          html = '';
        }
        ngModel.$setViewValue(html);
      }
    }
  };
}]);