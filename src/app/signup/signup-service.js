'use strict';
angular.module('kard')
	.service('signupService', function($http, $q ,$rootScope,BASE_URL,$localStorage,$window) {
		var userInfo;
    	function signup(signupModel){
    		// console.log(BASE_URL);
    		// var baseUrl = dataProviderSer.data.baseUrl;
    		var deferred = $q.defer();
	        var url = BASE_URL + 'signup/';
	        
	       var dataToSend = {"email": signupModel.email,"password":signupModel.password,'fname': signupModel.fname,'lname': signupModel.lname,'gender':signupModel.gender,'age':signupModel.age};
	       console.log(dataToSend);
	        $http({
	            method: 'POST',
	            url: url,
	            data: dataToSend
	           // headers:headers,
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
    	function validateMail(email){
    		var deferred = $q.defer();
	        var url = BASE_URL + 'validate-mail/';
	        console.log(email);
	        var dataToSend = {'email':email};
	        $http({
	            method: 'POST',
	            url:  url,
	            data: dataToSend
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
    	function signupFB(access_token, user_id, email, fname, lname, gender){
    		var deferred = $q.defer();
	        var url = BASE_URL + 'signup/';
	        var dataToSend = {"input_token": access_token, "user_id": user_id, 'email': email,'fname': fname, 'lname': lname, 'gender': gender};
	        $http({
	            method: 'POST',
	            url: url,
	            data:dataToSend
	        }).success(function(response) {
	        	if(response.status == 1) {
	        		userInfo = response.data.session_key;
	        		$localStorage.userInfo = userInfo;
	        		$window.sessionStorage["userInfo"] = response.data.session_key;
	        		console.log(userInfo);
	        	}
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
    	function signupGPlus(profile,token){
    		var deferred = $q.defer();
	        var url = BASE_URL + 'signup/';
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
		return({
        	signup: signup,
        	validateMail: validateMail,
        	signupFB: signupFB,
        	signupGPlus: signupGPlus
    	});
	});