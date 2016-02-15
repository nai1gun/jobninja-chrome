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
    .controller('GrabController', () => {



    });
