'use strict';
angular.module('kard')
	.service('resetPasswordService', function($http, $q ,$rootScope,BASE_URL) {
    	function resetPassword(resetPwd, token){
    		console.log(resetPwd);
    		var deferred = $q.defer();
	        var url = BASE_URL + 'reset-password/';
	        var dataToSend = {"token": token, "password": resetPwd.password};
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
        	resetPassword: resetPassword
    	});
	});