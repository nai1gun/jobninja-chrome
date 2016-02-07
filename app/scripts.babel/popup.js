/* global angular */
'use strict';

angular.module('jobninja', ['ui.router'])
.run(($rootScope, $state) => {
	$rootScope.$on('$stateChangeError', console.log.bind(console));
	$state.go('login');
});