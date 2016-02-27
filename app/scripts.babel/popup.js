/* global angular */
'use strict';

angular.module('jobninja', ['ui.router', 'ngResource'])
.constant('config', {
  apiBaseUrl: 'http://localhost:8080/'
})
.config(($httpProvider) => {
    $httpProvider.interceptors.push('authInterceptor');
})
.run(($rootScope, $state, Auth) => {
	$rootScope.$on('$stateChangeError', console.log.bind(console));

    chrome.browserAction.setBadgeText({text: ''});

    Auth.hasValidToken().then(function(hasValidToken) {
        if (hasValidToken) {
            $state.go('grab');
        } else {
            $state.go('login');
        }
    });
});