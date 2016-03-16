'use strict';
angular.module('kard')
	.service('loginService', function($http, $q ,$rootScope,BASE_URL, $localStorage, $window) {
		var userInfo;
    	function login(loginModel){
    		var deferred = $q.defer();
	        var url = BASE_URL + 'login/';
	        var dataToSend = {"email": loginModel.email, "password": loginModel.password};
	        $http({
	            method: 'POST',
	            url: url,
	            data:dataToSend
	        }).success(function(response) {
	        	userInfo = response.data.session_key;
	        	$localStorage.userInfo = userInfo;
	        	$window.sessionStorage["userInfo"] = response.data.session_key;
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
    	function loginFB(access_token, user_id, email, fname, lname, gender){
    		var deferred = $q.defer();
	        var url = BASE_URL + 'login/';
	        var dataToSend = {"input_token": access_token, "user_id": user_id, 'email': email,'fname': fname, 'lname': lname, 'gender': gender};
	        $http({
	            method: 'POST',
	            url: url,
	            data:dataToSend
	        }).success(function(response) {
	        	userInfo = response.data.session_key;
	        	$localStorage.userInfo = userInfo;
	        	$window.sessionStorage["userInfo"] = response.data.session_key;
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
    	function loginGPlus(profile,token){
    		var deferred = $q.defer();
	        var url = BASE_URL + 'login/';
	        var dataToSend = {"gplus_token": token, "user_id": profile.id, 'email': profile.emails[0].value,'fname': profile.name.givenName, 'lname': profile.name.familyName};
	        $http({
	            method: 'POST',
	            url: url,
	            data:dataToSend
	        }).success(function(response) {
	        	userInfo = response.data.session_key;
	        	$localStorage.userInfo = userInfo;
	        	$window.sessionStorage["userInfo"] = response.data.session_key;
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
    	function logout(){
    		var deferred = $q.defer();
	        var url = BASE_URL + 'logout/';
	        var headers = {'session-key':$localStorage.session_key};
	        $http({
	            method: 'POST',
	            url: url,
	            headers: headers
	        }).success(function(response) {
	        	$window.sessionStorage["userInfo"] = null;
    			userInfo = null;
    			$localStorage.session_key = null;
    			//$rootScope.loggedIn = false;
    			$localStorage.$reset();
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
	        $localStorage.$reset();
	        return deferred.promise;
    	}

	    function getUserInfo (){
	    	return userInfo;
	    };


	    function init() {
		  if ($localStorage.session_key) {
		    userInfo = $localStorage.session_key;
		  }
		}
		 
		init();
		return({
        	login: login,
        	loginFB: loginFB,
        	loginGPlus: loginGPlus,
        	logout: logout,
        	getUserInfo: getUserInfo,
        	init: init
    	});
	});