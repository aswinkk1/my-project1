'use strict';
angular.module('kard')
	.controller('LoginController', function ($scope, $rootScope, ezfb, loginService, $state, $localStorage, ngDialog, $timeout, $http) {
		$scope.loginError = false;
		$localStorage.$reset();
		$scope.rememberMe = false;
		
		$scope.inputType = 'password';
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
	    $scope.loginFunc = function(login){
		    loginService.login(login).then(function(response){
		     	if (response.status == 0) {
		     		$scope.loginError = true;
		     		$scope.message = 'The email or password is incorrect.';
		     	}
		     	else if(response.status == 1){
		     		$localStorage.session_key = response.data.session_key;
		     		document.getElementsByClassName('ngdialog-close')[0].click();
		     		$state.go('onboard.add-retailer');
		     	}
		    });
	    };
	    $scope.loginFB = function(){
	    	$scope.loginForm.$setPristine();
		    ezfb.login(function (res) {
            if(res.status == 'connected') {
      	      if (res.authResponse) {
                var accessToken = res.authResponse.accessToken;
                var userID = res.authResponse.userID;
                ezfb.api('/me', function (res) {
                  loginService.loginFB(accessToken,userID,res.email,res.first_name,res.last_name,res.gender).then(function(response){
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
		 	                          $scope.loginForm.$setPristine();
	 	                          }
	 	                    });
	 	                    $timeout(function(){
	 	                      dialog.close();
	 	                    },4000);
				     	}
				     	else if(response.status == 1){
				     		$localStorage.session_key = response.data.session_key;
				     		$state.go('home');
				     	};
	                });
	      	      });
	            }
	          }
  	    }, {scope: 'public_profile,email,user_likes'});
	    };
	    $scope.loginGPlus = function(){
	    	console.log('ascasfc');
	    }

	    $scope.smallDevice = false;
	    if(window.matchMedia('(max-width: 1024px)').matches){
	    	$scope.smallDevice = true;
	    }

	    $scope.$on('event:google-plus-signin-success', function (event,authResult) {
    	// Send login to server or save into cookie
    		console.log(authResult);
    		$http.get('https://www.googleapis.com/plus/v1/people/me?access_token='+authResult.access_token)
    		.then(function(result){
    			console.log(result);
    			loginService.loginGPlus(result.data,authResult.access_token);
    		});
  		});
  		$scope.$on('event:google-plus-signin-failure', function (event,authResult) {
   		 // Auth failure or signout detected
  		});

	});
