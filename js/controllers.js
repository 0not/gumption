var gumption = angular.module('gumption', ['ngRoute', 'ngTouch']);

///////////////////////////////////////

gumption.service('shareService', ['$rootScope', function($rootScope) {
    this.update_num_tasks = function () {
		var num = 0;
		if (localStorage.hasOwnProperty("tasks")) {
			var tasks = JSON.parse(localStorage.tasks);
			for (var i = 0; i < tasks.length; i++) {
				if (!tasks[i].completed)
					num++;
			}
		}
		
        $rootScope.$broadcast('num_tasks_updated', num);

        return num;
	};

	this.num_tasks = this.update_num_tasks();
}]);

///////////////////////////////////////

gumption.config(['$routeProvider', function($routeProvider) {	
	$routeProvider.
	when('/tasks', {
		templateUrl: 'partials/tasks.html',
		controller: 'TasksCtrl'
	}).
    when('/dash', {
        templateUrl: 'partials/dash.html',
        controller: 'DashCtrl'
    }).    
    when('/counters', {
        templateUrl: 'partials/counters.html',
        controller: 'CountersCtrl'
    }).
    otherwise({
        redirectTo: '/dash'
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
	$scope.num_tasks = shareService.num_tasks;

    $scope.$on('num_tasks_updated', function(event, num_tasks) {
        $scope.num_tasks = num_tasks;
    });
}]);

gumption.controller('DashCtrl', ['$scope', 'shareService', function ($scope, shareService) {
    
}]);

gumption.controller('TasksCtrl', ['$scope', 'shareService', function ($scope, shareService) {
    var empty_task = function () { 
		return {
			name: '',
			details: '',
			due: '',
			reminders: [],
			completed: false,
            editing: false
		};
	}
	
    $scope.active_task = -1;

	$scope.get = function() {
		var tasks = [];
		
		if (localStorage.hasOwnProperty("tasks"))
			tasks = JSON.parse(localStorage.getItem("tasks"));
			
		return tasks;
	}
	
	$scope.tasks = $scope.get();
	
	$scope.save = function() {
		localStorage.setItem("tasks", JSON.stringify($scope.tasks));
        shareService.update_num_tasks();
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

    // Toggle which task is active
    $scope.toggle = function(index) {
        console.log($scope.tasks[index]);
        // console.log($scope.active_task);
        // if ($scope.active_task >= 0 && $scope.active_task < $scope.tasks.length) {
        //     $scope.tasks[$scope.active_task].editing = false;
        // }

        if (index >= 0 && index < $scope.tasks.length) {
            $scope.tasks[index].editing = !$scope.tasks[index].editing;
            //$scope.active_task = index;
        }
    }
	
	// Pass in task index
	$scope.complete = function(index) {
		if (typeof index == "undefined")
			return false;
		
		if (typeof index == "string")
			index = parseInt(index)
			
		if (index >= $scope.tasks.length)
			return false;
		
		$scope.tasks[index].completed = !$scope.tasks[index].completed;
	}
	
	// Save when leaving controller or on page unload
	$scope.$on("$destroy", $scope.save);
	window.addEventListener('beforeunload', $scope.save);
}]);

gumption.controller('CountersCtrl', ['$scope', 'shareService', function ($scope, shareService) {
    var empty_counter = function () { 
		return {
			name: '',
			details: '',
			due: '',
			reminders: [],
			completed: false,
            editing: false
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
        shareService.update_num_tasks();
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

    // Toggle which task is active
    $scope.toggle = function(index) {
        console.log($scope.tasks[index]);
        // console.log($scope.active_task);
        // if ($scope.active_task >= 0 && $scope.active_task < $scope.tasks.length) {
        //     $scope.tasks[$scope.active_task].editing = false;
        // }

        if (index >= 0 && index < $scope.tasks.length) {
            $scope.tasks[index].editing = !$scope.tasks[index].editing;
            //$scope.active_task = index;
        }
    }
	
	// Pass in task index
	$scope.complete = function(index) {
		if (typeof index == "undefined")
			return false;
		
		if (typeof index == "string")
			index = parseInt(index)
			
		if (index >= $scope.tasks.length)
			return false;
		
		$scope.tasks[index].completed = !$scope.tasks[index].completed;
	}
	
	// Save when leaving controller or on page unload
	$scope.$on("$destroy", $scope.save);
	window.addEventListener('beforeunload', $scope.save);
}]);
