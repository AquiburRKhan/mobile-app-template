angular.module('app').run([
	'$rootScope', '$state', '$stateParams', '$anchorScroll', '$localStorage', '$location', '$window', '$timeout',
	function($rootScope, $state, $stateParams, $anchorScroll, $localStorage, $location, $window, $timeout)
	{
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		$rootScope.isMobile = false;
		$rootScope.currentPage = 'app.home';

		$window.device = $window.device || {
			model: 'x86_64',
			cordova: '3.8.0',
			platform: 'iOS',
			uuid: '31ECFBA3-994E-2884-CDDD-6B2E96084315',
			version: '8.1',
			name: 'Developer Phone'
		};

		$localStorage.device = $window.device;

		$rootScope.getWidth = function() {
			return $(window).width();
		};

		$rootScope.scrollToTop = function()
		{
			scroll_to_top();
		};

		$rootScope.$watch($rootScope.getWidth, function(newValue, oldValue) {
			$rootScope.isMobile = ( newValue < 768 );
		});

		$window.onresize = function(){
			$rootScope.$apply();
		};

		// Check for certain State Changes
		$rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
			$rootScope.currentPage = toState.name;
			$timeout(load_jquery, 10);
		});

		// Check for certain State Changes
		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
			$rootScope.currentPage = toState.name;
		});
	}
])
.config(
[
	'$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider)
	{
		$urlRouterProvider.otherwise('/app/home');
		
		$stateProvider
		.state('app', {
			abstract: true,
			url: '/app',
			templateUrl: 'templates/app.html',
			controller: 'AppController'
		})
		.state('app.home', {
			url: '/home',
			templateUrl: 'templates/page/home.html',
			controller: 'HomeController'
		})
	}
]);