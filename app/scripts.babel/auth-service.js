/* global angular */
'use strict';

angular.module('jobninja')
    .factory('Auth', ['config', '$http', '$q', function loginService(config, $http, $q) {
        return {
            login: function(credentials) {
                return $q(function(resolve, reject) {
                    var data = 'username=' + credentials.username + '&password='
                        + credentials.password + '&grant_type=password&scope=read%20write&' +
                        'client_secret=mySecretOAuthSecret&client_id=jhtestapp';
                    $http.post(config.apiBaseUrl + 'oauth/token', data, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Accept': 'application/json',
                            'Authorization': 'Basic ' + btoa('jhtestapp' + ':' + 'mySecretOAuthSecret')
                        }
                    }).then(function(response) {
                        var token = response.data;
                        var expiresAt = new Date();
                        expiresAt.setSeconds(expiresAt.getSeconds() + token.expires_in);
                        token.expires_at = expiresAt.getTime();
                        chrome.storage.local.set({'token': token}, function() {
                            resolve(token);
                        });
                    }, function(errorResponse) {
                        reject(errorResponse.data);
                    });
                });
            },
            logout: function() {
                return $q(function(resolve, reject) {
                    $http.post(config.apiBaseUrl + 'api/logout').then(function() {
                        chrome.storage.local.remove('token', function() {
                            resolve();
                        });
                    }, function(errorResponse) {
                        reject(errorResponse.data);
                    });
                });
            },
            getToken: function () {
                return $q(function(resolve) {
                    chrome.storage.local.get('token', function(result) {
                        resolve((result && result.token) ? result.token : null);
                    });
                });
            },
            hasValidToken: function () {
                var self = this;
                return $q(function(resolve) {
                    self.getToken().then(function(token) {
                        var isValid = token && token.expires_at && token.expires_at > new Date().getTime();
                        resolve(isValid);
                    });
                });
            }
        };
    }])
    .factory('authInterceptor', ['$q', function ($q) {
        return {
            // Add authorization token to headers
            request: function (config) {
                return $q(function(resolve) {
                    chrome.storage.local.get('token', function(result) {
                        config.headers = config.headers || {};
                        var token = (result && result.token) ? result.token : null;
                        if (token && token.expires_at && token.expires_at > new Date().getTime()) {
                            config.headers.Authorization = 'Bearer ' + token.access_token;
                        }
                        resolve(config);
                    });
                });
            }
        };
    }]);