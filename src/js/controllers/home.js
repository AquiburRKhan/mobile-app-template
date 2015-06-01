app.controller('HomeController', [
	'$scope', '$localStorage', '$state', '$stateParams', '$http', '$window', '$timeout', function($scope, $localStorage, $state, $stateParams, $http, $window, $timeout)
	{
		phonegap.stats.pageView('Home');
	}
]);