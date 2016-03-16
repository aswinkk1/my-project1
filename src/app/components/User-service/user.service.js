'use strict';
angular.module('kard')
	.service('userService', function($http, $q ,$rootScope,BASE_URL, $localStorage) {
    	function getUser(session_key){
    		var deferred = $q.defer();
	        var url = BASE_URL + 'profile-info/';
	        var headers = {'session-key':session_key};
	        $http({
	            method: 'POST',
	            url: url,
	            headers: headers
	        }).success(function(response) {
	        	deferred.resolve(response);
	        }
	        .bind(this))
	        .error(function(response) {
	        	if(response) {
		            if (! angular.isObject( response.data ) ||! response.data.message) {
		            	return( $q.reject('An unknown error occurred.'));
		    		}
		    	}
	        });
	        return deferred.promise;
    	}
		return({
        	getUser: getUser
    	});
	});