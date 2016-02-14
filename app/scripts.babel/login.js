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
            Auth.login({username: $scope.login, password: $scope.password}).then(function(token) {
                console.log('Login success with: ' + $scope.login + ': ' + $scope.password);
                console.log('Token: ' + angular.toJson(token));
            },
            function(err) {
                if (err && err.error === 'invalid_grant') {
                    console.log('Wrong credentials');
                } else {
                    var errMsg = 'Unexpected error';
                    if (err && err.err.error_description) {
                        errMsg += ' ' + err.error_description;
                    }
                    console.log(errMsg);
                }
            });
        };

    });
