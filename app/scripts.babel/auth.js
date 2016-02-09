/* global angular */
'use strict';

angular.module('jobninja')
    .factory('Auth', ['config', '$http', function loginService(config, $http) {
        return {
            login: function(credentials) {
                var data = 'username=' + credentials.username + '&password='
                    + credentials.password + '&grant_type=password&scope=read%20write&' +
                    'client_secret=mySecretOAuthSecret&client_id=jhtestapp';
                return $http.post(config.apiBaseUrl + 'oauth/token', data, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json',
                        'Authorization': 'Basic ' + btoa('jhtestapp' + ':' + 'mySecretOAuthSecret')
                    }
                }).success(function (response) {
                    var expiredAt = new Date();
                    expiredAt.setSeconds(expiredAt.getSeconds() + response.expires_in);
                    response.expiredAt = expiredAt.getTime();
                    //localStorageService.set('token', response);
                    console.log('Authenticated with token: ' + angular.toJson(response));
                    return response;
                });
            },
            logout: function() {
                // logout from the server
                $http.post(config.apiBaseUrl + 'api/logout').then(function() {
                    //localStorageService.clearAll();
                });
            },
            getToken: function () {
                //return localStorageService.get('token');
            },
            hasValidToken: function () {
                var token = this.getToken();
                return token && token.expiredAt && token.expiredAt > new Date().getTime();
            }
        };
    }]);