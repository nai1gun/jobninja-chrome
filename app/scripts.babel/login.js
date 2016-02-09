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
    .controller('LoginController', ($scope, Auth) => {

        $scope.login = '';

        $scope.password = '';

        $scope.doLogin = function() {
            Auth.login({username: $scope.login, password: $scope.password});
            console.log('Login success with: ' + $scope.login + ': ' + $scope.password);
        };

    });
