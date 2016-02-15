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
    .controller('LoginController', ($scope, $state, Auth) => {

        $scope.login = '';

        $scope.password = '';

        $scope.error = null;

        $scope.doLogin = function() {
            Auth.login({username: $scope.login, password: $scope.password}).then(function() {
                $state.go('grab');
            },
            function(err) {
                if (err && err.error === 'invalid_grant') {
                    $scope.error = 'Incorrect Username or passord';
                } else {
                    var errMsg = 'Unexpected error';
                    if (err && err.err.error_description) {
                        errMsg += ' ' + err.error_description;
                    }
                    console.log(errMsg);
                    $scope.error = errMsg;
                }
            });
        };

        $scope.clearError = function() {
            $scope.error = null;
        };

    });
