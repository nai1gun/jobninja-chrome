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
    .controller('GrabController', ($scope) => {

        $scope.hasPosition = null;

        $scope.grabPosition = function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {method: 'grabPosition'}, function(response) {
                    console.log('got position: ' + angular.toJson(response));
                });
            });
        };

        function loadHasPosition() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {method: 'hasPosition'}, function(response) {
                    $scope.$apply(function () {
                        $scope.hasPosition = response;
                    });
                });
            });
        }

        loadHasPosition();

    })
    .service('GrabService', () => {

    });
