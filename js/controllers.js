var gumption = angular.module('gumption', ['ngRoute', 'ngTouch']);

///////////////////////////////////////

gumption.service('shareService', function() {
	this.num_tasks = function () {
		var num = 0;
		if (localStorage.hasOwnProperty("tasks")) {
			var tasks = JSON.parse(localStorage.tasks);
			for (var i = 0; i < tasks.length; i++) {
				if (!tasks[i].completed)
					num++;
			}
		}
		
		return num;
	};
});

///////////////////////////////////////

gumption.config(['$routeProvider', function($routeProvider) {	
	$routeProvider.
	when('/todo', {
		templateUrl: 'partials/todo.html',
		controller: 'TodoCtrl'
	});
}]);

////////////////////////////////////////

// Broken
gumption.directive('checkmark', function() {
	return {
		restrict: 'C',
		scope: {
			checked: '=value'
		},
		template: "<span class='glyphicon glyphicon-{{icon}}'></span>",
		link: function (scope, element, attrib) {
			if (parseInt(scope.checked) == 1 || scope.checked == "true")
				scope.icon = "check";
			else
				scope.icon = "unchecked";
			
		}
	}	
});

///////////////////////////////////////

gumption.controller('NavbarCtrl', ['$scope', 'shareService', function ($scope, shareService) {
	$scope.num_tasks = shareService.num_tasks();
}]);

gumption.controller('TodoCtrl', ['$scope', 'shareService', function ($scope, shareService) {
	var empty_task = function () { 
		return {
			name: '',
			details: '',
			due: '',
			reminders: [],
			completed: false
		};
	}
	
	$scope.get = function() {
		var tasks = [];
		
		if (localStorage.hasOwnProperty("tasks"))
			tasks = JSON.parse(localStorage.getItem("tasks"));
			
		return tasks;
	}
	
	$scope.tasks = $scope.get();
	
	$scope.save = function() {
		localStorage.setItem("tasks", JSON.stringify($scope.tasks));
	}
	

	
	$scope.add = function() {
		$scope.tasks.push(empty_task());
		$scope.save();
	}
	
	// Pass in task index
	$scope.remove = function(index) {
		if (typeof index == "undefined")
			return false;
		
		if (typeof index == "string")
			index = parseInt(index)
			
		if (index >= $scope.tasks.length)
			return false;
		
		$scope.tasks.splice(index, 1);
	}
	
	// Pass in task index
	$scope.toggle = function(index) {
		if (typeof index == "undefined")
			return false;
		
		if (typeof index == "string")
			index = parseInt(index)
			
		if (index >= $scope.tasks.length)
			return false;
		
		$scope.tasks[index].completed = !$scope.tasks[index].completed;
		console.log($scope.tasks[index].completed);
	}
	
	// Save when leaving controller or on page unload
	$scope.$on("$destroy", $scope.save);
	window.addEventListener('beforeunload', $scope.save);
}]);