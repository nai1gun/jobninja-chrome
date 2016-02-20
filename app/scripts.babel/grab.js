/* global angular */
'use strict';

angular.module('jobninja')
    .config(($stateProvider) => {
        $stateProvider
            .state('grab', {
                templateUrl: 'grab.html',
                controller: 'GrabController'
            });
    })
    .controller('GrabController', ($scope, GrabService, Position) => {

        $scope.hasPosition = null;

        $scope.grabPosition = function() {
            GrabService.grabPosition().then(function(position) {
                console.log('got position: ' + angular.toJson(position));
                Position.save(position, function() {
                    console.log('saved position: ' + angular.toJson(position));
                });
            });
        };

        function loadHasPosition() {
            GrabService.hasPosition().then(function(hasPosition) {
                $scope.hasPosition = hasPosition;
            });
        }

        loadHasPosition();

    })
    .service('GrabService', ($q) => {

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
            hasPosition: invokeContentMethod('hasPosition')
        };
    })
    .service('Position', ($resource, config) => {
        return $resource(config.apiBaseUrl + 'api/positions/:id', {});
    });
