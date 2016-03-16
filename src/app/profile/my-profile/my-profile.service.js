'use strict';
angular.module('kard')
	.service('MyProfileService', function($http, $q ,$rootScope,BASE_URL, $localStorage) {
    	function getProfileDetails(){
    		var deferred = $q.defer();
	        var url = BASE_URL+'profile-info/';
	        var headers = {'session-key':$localStorage.session_key};
	        $http({
	            method: 'GET',
	            url: url,
 	            headers:headers
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
    	
    	function updateProfileDetails(param){
    		var deferred = $q.defer();
	        var url = BASE_URL+'edit-profile/';
	        var data = {
	        	"first_name":param.first_name,
	        	"last_name":param.last_name, 
	        	"gender":param.genderVal, 
	        	"age":param.ageVal
	        };

	        var headers = {'session-key':$localStorage.session_key};
	        $http({
	            method: 'POST',
	            url: url,
	            data:data,
 	            headers:headers
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
		function changePassword(param){
			var deferred = $q.defer();
	        var url = BASE_URL+'change-password/';
	        var data = {
	        	"old_password":param.current_pwd,
	        	"new_password":param.password1
	        };
	        console.log(param.password1.length);
	        console.log(data);
	        var headers = {'session-key':$localStorage.session_key};
	        $http({
	            method: 'POST',
	            url: url,
	            data:data,
		        headers:headers
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
        	getProfileDetails: getProfileDetails,
        	updateProfileDetails: updateProfileDetails,
        	changePassword: changePassword
    	});
	});