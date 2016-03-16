'use strict';
var KardApp = angular.module('kard', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router','ui.bootstrap','ngDialog','ezfb','ngStorage','angucomplete-alt','kard.tmpls','ngTinyScrollbar','focus-if','duScroll','directive.g+signin'])
  .constant('BASE_URL', 'http://52.4.105.247/kard/')
  // .constant('BASE_URL', 'http://kardqa.com/kard/')
  // .constant('BASE_URL', 'http://10.7.2.111/kard/')
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        views:{
          'content':{
            templateUrl: 'app/main/main.html',
            controller: 'MainController'
          }
        }
      })
      .state('home-ext', {
        url: '/home-ext?from&data',
        views:{
          'content':{
            controller: function($state, $stateParams, loginService, $localStorage, $rootScope){
              $localStorage.$reset();
              $localStorage.userInfo = $stateParams.data;
              $localStorage.session_key = $stateParams.data;
              $state.go('home');
            }
          }
        }
      })
      .state('signup', {
        url: '/signup',
        onEnter: ['ngDialog','$state', function(ngDialog,$state) {
          ngDialog.open({
                template: 'app/signup/signup.html'
          }).closePromise.then(function() {
              $state.go('home');  // do whatever you want
            });
        }]
      })
      .state('signup-ext', {
        url: '/signup-ext',
        views:{
          'content':{
            controller: function($state, loginService,  $rootScope) {
              loginService.logout();
              $rootScope.ActiveSession = false;
              $state.go('signup');
            }
          }
        }
      })
      .state('login', {
        url: '/login',
        views:{
          'content':{
            templateUrl: 'app/login/login.html',
            controller: 'LoginController',
            resolve:{
                auth: ["$q", "loginService",'$state', function($q, loginService,$state) {
                var userInfo = loginService.getUserInfo();
                console.log(userInfo);
                if (userInfo) {
                  $state.go('home');
                }
              }]
            }
          }
        }
      })
      .state('forgot-password', {
        url: '/forgot-password',
        views:{
          'content':{
            templateUrl: 'app/forgot-password/forgot-password.html',
            controller: 'forgotPasswordController',
            resolve:{
                auth: ["$q", "loginService",'$state', function($q, loginService,$state) {
                var userInfo = loginService.getUserInfo();
                console.log(userInfo);
                if (userInfo) {
                  $state.go('home');
                }
              }]
            }
          }
        }
      })
      .state('forgot-password-ext', {
        url: '/forgot-password-ext',
        views:{
          'content':{
            controller: function($state, loginService,  $rootScope) {
              loginService.logout().then(function(){
                $rootScope.ActiveSession = false;
                console.log('going to forgot-password state');
                $state.go('forgot-password');
              })
            }
          }
        }
      })
      .state('reset-password', {
        url: '/reset-password/:token',
        views:{
          'content':{
            templateUrl: 'app/reset-password/reset-password.html',
            controller: 'resetPasswordController'
          }
        }
      })
      .state('logout', {
        url: '/logout',
        views:{
          'content':{
              controller: function($state, loginService,  $rootScope) {
                loginService.logout();
                $rootScope.ActiveSession = false;
                $state.go('home');
              },
              data: {
                requireLogin: false,
              }
          }
        }
      })
      .state('onboard',{
        url: '/onboard',
        views:{
          'content':{
            templateUrl: 'app/kard-initial/initial.html'
          }
        }
      })
      .state('onboard.add-retailer', {
        url: '/retailer',
        templateUrl: 'app/kard-initial/add-retailer/add-retailer.html'
      })
      .state('onboard.add-card', {
        url: '/card',
        templateUrl: 'app/kard-initial/add-card/add-card.html'
      })
      .state('onboard.install', {
        url: '/install',
        templateUrl: 'app/kard-initial/install-kard/install-kard.html'
      })
      .state('onboard.confirm', {
        url: '/confirm',
        templateUrl: 'app/kard-initial/confirm/confirm.html'
      })
      .state('profile', {
        url: '/profile',
        views:{
          'content':{
            templateUrl: 'app/profile/profile.html',
            controller: 'MyProfileController',
            resolve: {
              auth: ["$q", "loginService","$state", function($q, loginService,$state) {
                var userInfo = loginService.getUserInfo();
                if (userInfo) {
                  return $q.when(userInfo);
                } else {
                  $state.go('home');
                  return $q.reject({ authenticated: false });
                }
              }]
            }
          }
        }
      })
      .state('profile.my-profile', {
        url: '/my-profile',
        templateUrl: 'app/profile/my-profile/my-profile.html',
        controller: 'MyProfileController'
      })
      .state('profile.edit-profile', {
        url: '/edit-profile',
        templateUrl: 'app/profile/my-profile/edit-profile.html',
        controller: 'MyProfileController'
      })
      .state('profile.change-password', {
        url: '/change-password',
        templateUrl: 'app/profile/change-password.html',
        controller: 'MyProfileController'
      })
      .state('kard-calculator', {
        url: '/kard-calculator',
        views:{
          'content':{
            templateUrl: 'app/kard-calculator/kard-calculator.html',
            controller: 'KardCalculatorController',
            resolve: {
              auth: ["$q", "loginService","$state", function($q, loginService,$state) {
                var userInfo = loginService.getUserInfo();
                // console.log(userInfo);
                if (userInfo) {
                  return $q.when(userInfo);
                } else {
                  $state.go('home');
                  return $q.reject({ authenticated: false });
                }
              }]
            }
          }
        }
      })
      .state('kard-wallet', {
        url: '/kard-wallet',
        views:{
          'content':{
            templateUrl: 'app/kard-wallet/kard-wallet.html',
            controller: 'KardWalletController',
            resolve: {
              auth: ["$q", "loginService","$state", function($q, loginService,$state) {
                var userInfo = loginService.getUserInfo();
                console.log(userInfo);
                if (userInfo) {
                  return $q.when(userInfo);
                } else {
                  $state.go('home');
                  return $q.reject({ authenticated: false });
                }
              }]
            }
          }
        }
      })
      .state('detail', {
        url: '/detail/:id',
        views:{
          'content':{
            templateUrl: 'app/kard-detail/kard-detail.html',
            controller: 'KardDetailController',
            resolve: {
              auth: ["$q", "loginService","$state", function($q, loginService,$state) {
                var userInfo = loginService.getUserInfo();
                if (userInfo) {
                  return $q.when(userInfo);
                } else {
                  $state.go('home');
                  return $q.reject({ authenticated: false });
                }
              }]
            }
          }
        }
      })
      .state('kard-cat-select', {
        url: '/kard-cat-select',
        views:{
          'content':{
            templateUrl: 'app/kard-cat-select/kard-cat-select.html',
            controller: 'KardCatSelectController',
            resolve: {
              auth: ["$q", "loginService","$state", function($q, loginService,$state) {
                var userInfo = loginService.getUserInfo();
                console.log(userInfo);
                if (userInfo) {
                  return $q.when(userInfo);
                } else {
                  $state.go('home');
                  return $q.reject({ authenticated: false });
                }
              }]
            }
          }
        }
      })
      .state('kards-list', {
          url: '/kards-list/:kardType',
          views:{
            'content':{
              templateUrl: 'app/kards-list/kards-list.html',
              controller: 'ListKardsController',
              resolve: {
                auth: ["$q", "loginService","$state", function($q, loginService,$state) {
                  var userInfo = loginService.getUserInfo();
                  if (userInfo) {
                    return $q.when(userInfo);
                  } else {
                    $state.go('home');
                    return $q.reject({ authenticated: false });
                  }
                }]
            }
            }
          }
      })
      .state('dashboard', {
          url: '/dashboard',
          views:{
            'content':{
              templateUrl: 'app/dashboard/dashboard.html',
              controller: 'DashboardController'
            }
          }
      })
      .state('dashboard.active',{
          url: '/',
          templateUrl: 'app/components/templates/active-dashboard.html'
      })
      .state('dashboard.trending',{
          url: '/trending',
            templateUrl: 'app/components/templates/trending-dashboard.html'
          
      })
      .state('kard-app-download', {
          url: '/kard-app-download',
          views:{
            'viewA':{
              templateUrl: 'app/kard-app-download/kard-app-download.html',
              controller: 'KardAppDownloadController'
            }
          }
      });
      
    $urlRouterProvider.otherwise('/home');
  })
  .controller("BaseController",function($window, $state){
      // console.log("base init");
      angular.element($window).bind('orientationchange', function () {
        // alert('orientationchange');
        // $window.location.reload();
      });
  })
  // .config(['$httpProvider', function($httpProvider) {
  //   $httpProvider.defaults.withCredentials = true;
  // }])
;
angular.module('kard.tmpls', []).run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('angular-hovercard.tmpl', '<div class=angular-hovercard ng-mouseenter="showCard = true; onHoverIn()" ng-mouseleave="showCard = false; onHoverOut()"><label class=angular-hovercard-label ng-class="{ \'angular-hovercard-active\': showCard }" ng-style=hoverLabelStyle ng-transclude=""></label><div class=angular-hovercard-detail ng-class="{ \'angular-hovercard-active\': showCard }" ng-include=hoverTmplUrl ng-style=hoverCardStyle></div></div>');
  }
]);


//attach session key
KardApp.run(['$http','$localStorage','$rootScope','$location','$state',function($http,$localStorage,$rootScope,$location,$state){
    $http.defaults.headers.common.Authorization = 'session-key='+$localStorage.session_key;
    
    $rootScope.$on("$stateChangeSuccess", function(eventObj) {
        if (eventObj.authenticated === false) {
          // console.log("hhh");
            $state.go("home");
            $state.reload();
          //$location.path("/login");
        }
        else{
          // console.log("ggg");
        }
    });
     // $rootScope.$on("$routeChangeStart", function(eventObj) {
     //    console.log("routeChangeStart");
     // });

     // $rootScope.$on('$stateChangeStart', 
     //      function(event, toState, toParams, fromState, fromParams){
            
     //         if(fromState.name==''){
     //            $location.path("/login");
     //         }
              
     //     });
    $rootScope.$on("$locationChangeStart", function(event, current, previous, eventObj) {
      //console.log(event.targetScope);
      //console.log(eventObj);
      // if(eventObj.authenticated === false) {
      //     $location.path("/login");
      // }
    });
}]);
