/* global angular */
'use strict';

angular.module('jobninja')
    .config(($stateProvider) => {
        $stateProvider
            .state('login', {
                templateUrl: 'login.html',
                controller: 'LoginController'
            });
    })
    .controller('LoginController', ($scope) => {

        $scope.login = '';

        $scope.password = '';

        $scope.doLogin = function() {
            console.log('Login success with: ' + $scope.login + ': ' + $scope.password);
        };

    });
