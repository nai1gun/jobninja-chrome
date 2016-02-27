/* global angular */
'use strict';

angular.module('jobninja')
    .config(($stateProvider) => {
        $stateProvider
            .state('saved', {
                templateUrl: 'saved.html',
                controller: 'SavedController',
                params: {
                    position: null
                }
            });
    })
    .controller('SavedController', ($scope, $stateParams, config) => {
        $scope.position = $stateParams.position;

        $scope.openPosition = function() {
            chrome.browserAction.setBadgeText({text: ''});
            chrome.tabs.create({url: config.apiBaseUrl + '#/position/' + $scope.position.id});
        };

        $scope.closePopup = function() {
            window.close();
        };

        var setBadgeSuccess = function() {
            chrome.browserAction.setBadgeText({text: 'saved'});

            chrome.browserAction.setBadgeBackgroundColor({color: '#006600'});
        };

        setBadgeSuccess();
    });