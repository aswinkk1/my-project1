'use strict';
/**
 * @ngdoc function
 * @name kard.controller:signupController
 * @description
 * # signupController
 * Controller of the kard
 */
angular.module('kard')
	.config(function (ezfbProvider) {
	  ezfbProvider.setInitParams({
  	  appId: '372146679641645',
  	  xfbml : false
	  });
	})
  .controller('SignupController', function ($scope,ezfb, $window, $location, $state, signupService, $localStorage, loginService, ngDialog, $timeout, $http) {
    $scope.signup = {};
    $scope.apiWait = false;
    $scope.signup.gender = '1';
    $scope.signup.age = '0';
    $scope.emailFocused = false;
    $scope.pwdFocused = false;
    $scope.pwd2Focused = false;
    $scope.fnameFocused = false;
    $scope.lnameFocused = false;
    $scope.validMail = true;
    $scope.agreed = false;
    $localStorage.$reset();
    // Set the default value of inputType
    $scope.inputType = 'password';
    $scope.inputType2 = 'password';
    // Hide & show password function
    $scope.hideShowPassword = function(){
      if ($scope.inputType == 'password'){
          $scope.inputType = 'text';
        $scope.glyphClass = true;
      }
      else {
          $scope.inputType = 'password';
          $scope.glyphClass = false;
      }
    };
    $scope.hideShowPasswordConfirm = function(){
      if ($scope.inputType2 == 'password'){
          $scope.inputType2 = 'text';
        $scope.glyphClass2 = true;
      }
      else {
          $scope.inputType2 = 'password';
          $scope.glyphClass2 = false;
      }
    };
    $scope.validateMail = function () {
      console.log($scope.signup);
      signupService.validateMail($scope.signup.email).then(function(response){
        if (response.status == 0) {
          $scope.messageOne = response.data.error_message;
          $scope.completeOne = false;
          $scope.validMail = false;
        }
        else if(response.status == 1){
          $scope.completeOne = true;
          $scope.messageOne = '';
          $scope.validMail = true;
        }
      });
      // $scope.signupForm.$setPristine();
      // $scope.emailFocused = true;
      // $scope.pwdFocused = true;
      // $scope.pwd2Focused = true;
      // $scope.emailFocused = true;
      // $scope.pwdFocused = true;
      // $scope.pwd2Focused = true;
    }
    $scope.isChrome = false;
    var isChromium = window.chrome,
        vendorName = window.navigator.vendor,
        isOpera = window.navigator.userAgent.indexOf("OPR") > -1;
    if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false) {
      $scope.isChrome = true;
    } else { 
      $scope.isChrome = false;
    }
    $scope.installExtension = function(){
      // console.log("Installing extension...");
      if($scope.isChrome) {
        chrome.webstore.install("https://chrome.google.com/webstore/detail/jfmogobdbigfmanmkkkidnpcpdabgiag",
          function(response){
          console.log("Successfully installed" + response);
          $scope.extensionInstalled = true;
          $state.go('kard-cat-select');
        },function(response){
          console.log("Error in installation" + response);
          window.open("https://chrome.google.com/webstore/detail/kard/jfmogobdbigfmanmkkkidnpcpdabgiag");
          $state.go('kard-cat-select');
        });
      }
      else {
        window.open("https://chrome.google.com/webstore/detail/kard/jfmogobdbigfmanmkkkidnpcpdabgiag");
        $state.go('kard-cat-select');
      }
    };
  	$scope.signupUser = function () {
      console.log($scope.signup);
      signupService.signup($scope.signup).then(function(response){
        $scope.apiWait = false;
        if (response.status == 0) {
          $scope.signupError = true;
          $scope.message = response.data.error_message;
        }
        else if(response.status == 1){
          $localStorage.session_key = response.data.session_key;
          $localStorage.primary_card_check = true;
          $localStorage.alreadyShownTransn = false; 
          loginService.init();
          if($scope.isChrome) {
            //Install extension dialog
            ngDialog.open({
              template:'app/components/templates/install-extension-pop.html',
              scope: $scope,
              appendTo: '.kard-form-wrapper',
              overlay:true,
              preCloseCallback: function(value) {
                  document.getElementsByTagName('body')[0].className.replace(/\bngdialog-open\b/,'');
                $state.go('kard-cat-select');
              }
            });
          }
          else
            $state.go('kard-cat-select');
        }
      });
  	}
    $scope.signupFB = function(){
      ezfb.login(function (res) {
          if(res.status == 'connected') {
            if (res.authResponse) {
              var accessToken = res.authResponse.accessToken;
              var userID = res.authResponse.userID;
              ezfb.api('/me', function (res) {
                console.log(res);
                signupService.signupFB(accessToken,userID,res.email,res.first_name,res.last_name,res.gender).then(function(response){
                  console.log(response);
                  if (response.status == 0) {
                    $scope.ngDialogMessage = response.data.error_message;
                    var dialog = ngDialog.open({
                          template:'app/components/templates/ng-dialog-template.html',
                          scope: $scope,
                          appendTo: '.kard-form-wrapper',
                          overlay:true,
                          preCloseCallback: function(value) {
                              document.getElementsByTagName('body')[0].className.replace(/\bngdialog-open\b/,'');
                          $state.go('login');
                          }
                    });
                    $timeout(function(){
                      dialog.close();
                    },4000);
                  }
                  else if(response.status == 1){
                    $localStorage.session_key = response.data.session_key;
                    $localStorage.primary_card_check = true;
                    $localStorage.alreadyShownTransn = false; 
                    loginService.init();
                    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
                    if(isChrome) {
                      //Install extension dialog
                      ngDialog.open({
                        template:'app/components/templates/install-extension-pop.html',
                        scope: $scope,
                        appendTo: '.kard-form-wrapper',
                        overlay:true,
                        preCloseCallback: function(value) {
                            document.getElementsByTagName('body')[0].className.replace(/\bngdialog-open\b/,'');
                          $state.go('kard-cat-select');
                        }
                      });
                    }
                    else 
                      $state.go('kard-cat-select');
                  };
                });
              });
            }
          }
      }, {scope: 'public_profile,email,user_likes'});
    };
    $scope.$on('event:google-plus-signin-success', function (event,authResult) {
    // Send login to server or save into cookie
      console.log(authResult);
      $http.get('https://www.googleapis.com/plus/v1/people/me?access_token='+authResult.access_token)
      .then(function(result){
        console.log(result);
        signupService.signupGPlus(result.data,authResult.access_token);
      });
    });
    $scope.$on('event:google-plus-signin-failure', function (event,authResult) {
     // Auth failure or signout detected
    });
  	$scope.logout = function () {
	    ezfb.logout(function () {
	    	updateLoginStatus(updateApiMe);
	    });
  	};

    $scope.installAddOn = function(){
      $state.go('kard-cat-select');
    };
    $scope.smallDevice = false;
    if(window.matchMedia('(max-width: 1024px)').matches){
      $scope.smallDevice = true;
    }
  });
