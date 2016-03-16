'use strict';

angular.module('kard')
.controller('KardDetailController', function ($scope,$state,$rootScope,ngDialog,KardDetailService, $stateParams,KardListService,$window) {
        $scope.data = $rootScope.currentData;
       
     //    ngDialog.open({
     //    	template:'templateId',
     //    	plain: false,
     //    	overlay:true
    	// });
		$scope.goBack = function(){
			$window.history.back();
		};
		$scope.addToWallet = function(card_id){
		  KardListService.addToWallet(card_id).then(function(response){
		    console.log(response.data.message);
		    $scope.message = response.data.message;
		    if(response.status == 1){
		      ngDialog.open({
		        template:'successTemplate',
		        scope: $scope,
		        appendTo: '.card-detail',
		        overlay:true,
		        preCloseCallback: function(value) {
		        	$state.go('kard-wallet');
	        	}
		      });
		      
		    }
		    else if(response.status == 1){
		    	$state.go("home");
		    }
		  });
		};
        KardDetailService.getCardDetail($stateParams.id).then(function(data){
        	$scope.data = data.data[0];

        	// console.log($scope.data);
        });
});