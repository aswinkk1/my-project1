'use strict';
angular.module('kard')
.controller('KardAppDownloadController', function ($scope,ngDialog, notifyUserService) {
	$scope.notifyUser = function(notifyUser) {
		$scope.apiWait = false;
		var email = notifyUser.email;
		console.log(email);
		notifyUserService.notifyUser(email).then(function(response){
		  console.log(response.status);
		  $scope.apiWait = false;
		  $scope.ngDialogMessage = response.data.message;
		  if(response.status == 1){
		    ngDialog.open({
		      template:'app/components/templates/ng-dialog-template.html',
		      scope: $scope,
		      appendTo: '#main',
		      overlay:true
		    });
		  }
		});
	}
});