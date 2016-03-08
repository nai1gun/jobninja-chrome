/* global angular */
'use strict';

angular.module('jobninja', ['ui.router', 'ngResource'])
.constant('config', {
  apiBaseUrl: 'http://localhost:8080/'
})
.config(($httpProvider) => {
    $httpProvider.interceptors.push('authInterceptor');
})
.run(($rootScope, $state, Auth, PositionFind, ContentService) => {
	$rootScope.$on('$stateChangeError', console.log.bind(console));

    chrome.browserAction.setBadgeText({text: ''});

    ContentService.panelExists().then(function(panelExists) {
        if (panelExists) {
            ContentService.removePanel().then(function() {
                window.close();
            });
        } else {
            Auth.hasValidToken().then(function(hasValidToken) {
                if (hasValidToken) {
                    ContentService.getHref().then(function(href) {
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
        }
    });
})
.service('ContentService', ($q) => {

    var invokeContentMethod = function(method) {
        return function() {
            return $q(function(resolve) {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {method: method}, function(response) {
                        resolve(response);
                    });
                });
            });
        };
    };

    return {
        grabPosition: invokeContentMethod('grabPosition'),
        hasPosition: invokeContentMethod('hasPosition'),
        getHref: invokeContentMethod('getHref'),
        createSidePanel: invokeContentMethod('createSidePanel'),
        panelExists: invokeContentMethod('panelExists'),
        removePanel: invokeContentMethod('removePanel')
    };
})
.service('PositionFind', ($resource, config) => {
    return $resource(config.apiBaseUrl + 'api/positions/find', {link: '@link'});
});