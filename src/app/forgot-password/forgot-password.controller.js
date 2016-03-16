'use strict';
angular.module('kard')
	.controller('forgotPasswordController', function ($scope,forgotPasswordService,$state,ngDialog, $timeout) {
		$scope.apiWait = false;
	    $scope.forgotPwdFunc = function(forgotPwd){
		    forgotPasswordService.forgotPassword(forgotPwd).then(function(obj){
		     	console.log(obj);
		     	$scope.apiWait = false;
		     	if(obj.status == 0){
			     	$scope.errorMessage = obj.data.error_message;
			     	// $timeout(function(){
			     	// 	$scope.errorMessage = false;
			     	// }, 2000);
		     	}
			    else if(obj.status == 1){
	    	    ngDialog.open({
	    	    	template:'forgotPassword',
	    	    	plain: false,
	    	    	overlay:true
		    		});
			    	$state.go('login');
			    }
		    });
	    };
	});
