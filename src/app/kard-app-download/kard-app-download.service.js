'use strict';
angular.module('kard')
	.service('notifyUserService', function($http, $q ,$rootScope,BASE_URL) {
    	function notifyUser(email){
    		console.log(email);
    		var deferred = $q.defer();
	        var url = BASE_URL + 'notify-user/';
	        var dataToSend = {"email": email};
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
        	notifyUser: notifyUser
    	});
	});