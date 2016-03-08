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
    .controller('GrabController', ($scope, $state, ContentService, Position) => {

        $scope.hasPosition = null;

        $scope.grabPosition = function() {
            ContentService.grabPosition().then(function(position) {
                Position.save(position, function(result) {
                    $state.go('saved', {position: result});
                });
            });
        };

        function loadHasPosition() {
            ContentService.hasPosition().then(function(hasPosition) {
                $scope.hasPosition = hasPosition;
                if (!hasPosition) {
                    ContentService.createSidePanel();
                    window.close();
                }

            });
        }

        loadHasPosition();

    })
    .service('Position', ($resource, config) => {
        return $resource(config.apiBaseUrl + 'api/positions/:id', {});
    });
