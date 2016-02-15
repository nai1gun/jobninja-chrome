/* global angular */
'use strict';

angular.module('jobninja', ['ui.router'])
.constant('config', {
  apiBaseUrl: 'http://localhost:8080/'
})
.run(($rootScope, $state, Auth) => {
	$rootScope.$on('$stateChangeError', console.log.bind(console));
    Auth.hasValidToken().then(function(hasValidToken) {
        if (hasValidToken) {
            $state.go('grab');
        } else {
            $state.go('login');
        }
    });
});