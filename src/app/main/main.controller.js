'use strict';

angular.module('kard')
  .controller('MainController', function ($scope, $localStorage, $state, $timeout, $window, ngDialog) {
    $scope.waitingData = true;
    if ($localStorage.session_key) {
      $scope.loggedIn = true;
    }
    else
      $scope.loggedIn = false;
    $scope.extensionInstalled = false;
    $scope.isChrome = false;
    var isChromium = window.chrome,
        vendorName = window.navigator.vendor,
        isOpera = window.navigator.userAgent.indexOf("OPR") > -1;
    if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false) {
      $scope.isChrome = true;
    } else { 
      $scope.isChrome = false;
    }
    // console.log(isChromium + '' + vendorName + ' ' + isOpera + '' + $scope.isChrome );
    if($scope.isChrome) {
      if(chrome.app)
        if(chrome.app.isInstalled)
          $scope.extensionInstalled = true;
        $timeout(function(){
          if (document.getElementById('extensionIsInstalled')) {
            $scope.extensionInstalled = true;
          }
        },500);
    }
    $scope.installExtension = function(){
      // console.log("Installing extension...");
      if($scope.isChrome) {
        $scope.extensionInstalled = true;
        chrome.webstore.install("https://chrome.google.com/webstore/detail/jfmogobdbigfmanmkkkidnpcpdabgiag",
          function(response){
            console.log("Successfully installed" + response);
            $scope.extensionInstalled = true;
          },function(response){
            console.log("Error in installation" + response);
            $scope.extensionInstalled = false;
            // angular.element('#extensionLink').trigger('click');
            // window.open("https://chrome.google.com/webstore/detail/kard/jfmogobdbigfmanmkkkidnpcpdabgiag");
        });
      }
      else {
        window.open("https://chrome.google.com/webstore/detail/kard/jfmogobdbigfmanmkkkidnpcpdabgiag");
      }
    };

    $scope.signUp = function(){
        ngDialog.open({
          templateUrl: 'app/signup/signup.html',
          controller: 'SignupController'

        });
      };

      $scope.logIn = function(){
        ngDialog.open({
          templateUrl: 'app/login/login.html',
          controller: 'LoginController'
        });
      };
  });
