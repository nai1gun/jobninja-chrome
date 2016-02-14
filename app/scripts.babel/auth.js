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
                        var expiredAt = new Date();
                        expiredAt.setSeconds(expiredAt.getSeconds() + token.expires_in);
                        token.expiredAt = expiredAt.getTime();
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
                    chrome.storage.local.get('token', function(token) {
                        resolve(token);
                    });
                });
            },
            hasValidToken: function () {
                return $q(function(resolve) {
                    this.getToken().then(function(token) {
                        resolve(token && token.expiredAt && token.expiredAt > new Date().getTime());
                    });
                });
            }
        };
    }]);