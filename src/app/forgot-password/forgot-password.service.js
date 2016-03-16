'use strict';
angular.module('kard')
	.service('forgotPasswordService', function($http, $q ,$rootScope,BASE_URL) {
    	function forgotPassword(forgotPwd){
    		console.log(forgotPwd);
    		var deferred = $q.defer();
	        var url = BASE_URL + 'forgot-password/';
	        var dataToSend = {"email": forgotPwd.email};
	        // dataToSend = JSON.stringify(dataToSend);
	        $http({
	            method: 'POST',
	            url: url,
	            data:dataToSend
	        }).success(function(response) {
	        	deferred.resolve(response);
	        }
	        .bind(this))
	        .error(function(response) {
	            if (
	            ! angular.isObject( response.data ) ||
	            ! response.data.message
	            ) {
	            	return( $q.reject('An unknown error occurred.'));
	    		}
	        });
	        return deferred.promise;
    	}
		return({
        	forgotPassword: forgotPassword
    	});
	});