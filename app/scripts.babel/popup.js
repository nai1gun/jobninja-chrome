/* global angular */
'use strict';

angular.module('jobninja', ['ui.router', 'ngResource'])
.constant('config', {
  apiBaseUrl: 'http://localhost:8080/'
})
.config(($httpProvider) => {
    $httpProvider.interceptors.push('authInterceptor');
})
.run(($rootScope, $state, Auth, PositionFind, GrabService) => {
	$rootScope.$on('$stateChangeError', console.log.bind(console));

    chrome.browserAction.setBadgeText({text: ''});

    Auth.hasValidToken().then(function(hasValidToken) {
        if (hasValidToken) {
            GrabService.getHref().then(function(href) {
                PositionFind.query({link: href}, function(positions) {
                    if (positions && positions.length) {
                        $state.go('saved', {position: positions[0]});
                    } else {
                        $state.go('grab');
                    }
                });
            });
        } else {
            $state.go('login');
        }
    });
})
.service('PositionFind', ($resource, config) => {
    return $resource(config.apiBaseUrl + 'api/positions/find', {link: '@link'});
});