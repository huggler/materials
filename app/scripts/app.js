'use strict';

/**
 * @ngdoc overview
 * @name materialApp
 * @description
 * # materialApp
 *
 * Main module of the application.
 */
angular
  .module('materialApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
