app.controller('AppController', [
	'$scope', '$localStorage', '$state', '$stateParams', '$http', '$window', '$timeout', function($scope, $localStorage, $state, $stateParams, $http, $window, $timeout)
	{
		// Application Variables
		$scope.updateAppReminder = (angular.isDefined($localStorage.updateAppReminder)) ? $localStorage.updateAppReminder : 0;
		$scope.settings = (angular.isDefined($localStorage.settings)) ? $localStorage.settings : {};
		$scope.package = (angular.isDefined($localStorage.package)) ? $localStorage.package : {};

		/**
		 * Initialize Application
		 */
		$scope.init = function()
		{
			$http.get('settings.json').success(function(data){
				$window.app_settings = data;
				$scope.settings = data;
				$localStorage.settings = data;
			});

			$http.get('package.json').success(function(data){
				$window.app_package = data;
				$scope.package = data;
				$localStorage.package = data;

				if(typeof data.version !== 'undefined')
				{
					$scope.checkForUpdate(data.version);
				}
			});
		};

		$scope.checkForUpdate = function(installed_version){

			if(angular.isDefined($localStorage.settings.app.update_check_url) && $localStorage.settings.app.update_check_url !== '')
			{
				// Check for New Version
				$http.get($localStorage.settings.app.update_check_url).success(function(mobile_app_info){

					var include_beta = ($localStorage.settings.app.environment == 'development');
					var app_difference = compare_app_versions(installed_version, mobile_app_info, include_beta);

					// New Version Available
					if(app_difference > 0 )
					{
						// User not notified of new version
						if($scope.updateAppReminder == 0)
						{
							phonegap.stats.event('App', 'Update Available', 'User on v' + $scope.package.version + '. Latest is v' + mobile_app_info.current_version );

							phonegap.notification.confirm(
								"You are currently using an outdated version of this app. The current version is " + mobile_app_info.current_version + ". Would you like to Update?",
								function(selection){
									if(selection == 2)
									{
										if(device.platform.toLowerCase() == 'ios' && include_beta)
										{
											phonegap.stats.event('App', 'Update Available Accepted', 'Updating to iOS Beta Version ' + mobile_app_info.current_version );

											$scope.openBrowser(mobile_app_info.link.beta.ios);
										}
										else if(device.platform.toLowerCase() == 'ios' && !include_beta)
										{
											phonegap.stats.event('App', 'Update Available Accepted', 'Updating to iOS Version ' + mobile_app_info.current_version );

											$scope.openBrowser(mobile_app_info.link.production.ios);
										}
										else if (device.platform.toLowerCase() == 'android' && include_beta)
										{
											phonegap.stats.event('App', 'Update Available Accepted', 'Updating to Android Beta Version ' + mobile_app_info.current_version );

											$scope.openBrowser(mobile_app_info.link.beta.android);
										}
										else if (device.platform.toLowerCase() == 'android' && !include_beta)
										{
											phonegap.stats.event('App', 'Update Available Accepted', 'Updating to Android Version ' + mobile_app_info.current_version );

											$scope.openBrowser(mobile_app_info.link.production.android);
										}
									}
									else
									{
										phonegap.stats.event('App', 'Update Available Declined', 'User declined Update to Version ' + mobile_app_info.current_version );
									}
								},
								"Update App ?",
								['Not Now', 'Get Update']
							);
						}
						// User opted not to update
						else
						{
							phonegap.stats.event('App', 'Update Available Skipped', 'Will ask user again after ' + ( 5 - $scope.updateAppReminder ) + ' notice(s).' );
						}

						$scope.updateAppReminder += 1;
					}
				});
			}
		};

		/**
		 * Use Cordova's InAppBrowser Plugin
		 *
		 * @param url Website to open
		 * @param target Options are _self, _blank & _system
		 * @param loadstart Callback for when browser load starts
		 * @param loadstop Callback for when browser load stops
		 * @param loaderror Callback for when browser has an error
		 * @param exit
		 */
		$scope.openBrowser = function(url, target, loadstart, loadstop, loaderror, exit)
		{
			if( !target)
			{
				target = '_blank';
			}

			if(typeof cordova !== 'undefined' && typeof cordova.InAppBrowser !== 'undefined')
			{
				var new_window = cordova.InAppBrowser.open(url, target, 'location=no');

				if(typeof loadstart == 'function')
				{
					new_window.addEventListener('loadstart', loadstart);
				}

				if(typeof loadstop == 'function')
				{
					new_window.addEventListener('loadstop', loadstop);
				}

				if(typeof loaderror == 'function')
				{
					new_window.addEventListener('loaderror', loaderror);
				}

				if(typeof exit == 'function')
				{
					new_window.addEventListener('exit', exit);
				}
			}
			else
			{
				window.open(url, '_system');
			}
		};

		// Watch for changes to App Reminder
		$scope.$watch('updateAppReminder', function(count, old_value){

			// Reset notification after 5 dismissals
			if(count >= 5)
			{
				count = 0;
			}

			$localStorage.updateAppReminder = count;

			$scope.$broadcast('updateAppReminderChanged', count);

			if(count > 0)
			{
				phonegap.stats.event('App', 'Scope Change', 'App Upgrade Reminder Changed to ' + count );
			}
		});
	}
]);