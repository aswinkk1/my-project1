'use strict';
angular.module('kard')
	.service('KardCalculatorService', function($http, $q ,$rootScope, BASE_URL, $localStorage) {
    	function getCards(param){
    		var deferred = $q.defer();
	        var url = BASE_URL + 'kard-calculator/';
	        // var data = {"site_id":param};
	        var data = {'id': param};
	        var headers = {'session-key':$localStorage.session_key};
	        $http({
	            method: 'POST',
	            url: url,
	            data: data,
	            headers: headers
	        }).success(function(response) {
	        	var res = response;
	        	// console.log(res.data[0].card_features);
	        	for(var obj in res.data){
	        		//console.log(res.data[obj].card_features);
	        		res.data[obj].card_features = JSON.parse(res.data[obj].card_features);
	        		//console.log(JSON.parse(res.data[0].card_features));
	        	}
	        	deferred.resolve(res);
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

    	function getAutoFillWebsite(searchString){
    		var deferred = $q.defer();
	        var url = BASE_URL+'auto-complete-shopping-site/';
	        var headers = {'session-key':$localStorage.session_key};
	        var data = {'value':searchString};
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
        	getCards: getCards,
        	getAutoFillWebsite:getAutoFillWebsite
    	});
	});