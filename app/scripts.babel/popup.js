/* global angular */
'use strict';

angular.module('jobninja', ['ui.router'])
.constant('config', {
  apiBaseUrl: 'http://localhost:8080/'
})
.run(($rootScope, $state) => {
	$rootScope.$on('$stateChangeError', console.log.bind(console));
	$state.go('login');
});