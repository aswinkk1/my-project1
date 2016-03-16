'use strict';
angular.module('kard')
	.controller('resetPasswordController', function ($scope,resetPasswordService,$state,ngDialog,$stateParams) {
		var token = $stateParams.token;
		$scope.apiWait = false;
	    $scope.resetPwdFunc = function(resetPwd){
		    resetPasswordService.resetPassword(resetPwd, token).then(function(obj){
		     	console.log(obj);
		     	$scope.apiWait = false;
		     	$scope.ngDialogMessage = obj.data.message;
		     	console.log($scope.ngDialogMessage);
		     	if(obj.status == 1){
		     	  ngDialog.open({
		     	    template:'app/components/templates/ng-dialog-template.html',
		     	    scope: $scope,
		     	    appendTo: '#main',
		     	    overlay:true,
		     	    preCloseCallback: function(){
		     	    	$state.go('login');
		     	    }
		     	  });
		     	}
		     	else if(obj.status == 0){
			     	$scope.errorMessage = obj.data.error_message;
		     	}
		    });
	    };
	});
