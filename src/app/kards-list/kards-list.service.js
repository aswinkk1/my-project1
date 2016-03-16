'use strict';
angular.module('kard')
	.service('KardListService', function($http, $q ,$rootScope,BASE_URL, $localStorage) {
    	function getAllCards(param){
    		var deferred = $q.defer();
	        var url = BASE_URL+'card-list/';
	        var data = {"card_category_id":param};
	        var headers = {'session-key':$localStorage.session_key};
	        $http({
	            method: 'POST',
	            url: url,
	            data:data,
	            headers: headers
	        }).success(function(response) {
	        	var res = response;
	        	// console.log(res.data.cards[0].card_features);
	        	for(var obj in res.data.cards){
	        		//console.log(res.data.cards[obj].card_features);
	        		res.data.cards[obj].card_features = JSON.parse(res.data.cards[obj].card_features);
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
    	function addToWallet(param){
    		var deferred = $q.defer();
	        var url = BASE_URL+'add-to-wallet/';
	        var data = {"card_id":param};
	        // console.log(data);
	        var headers = {'session-key':$localStorage.session_key};
	        $http({
	            method: 'POST',
	            url: url,
	            data:data,
	            headers: headers
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
		function removeFromWallet(param){
			var deferred = $q.defer();
	        var url = BASE_URL+'remove-from-wallet/';
	        var data = {"card_id":param};
	        // console.log(data);
	        var headers = {'session-key':$localStorage.session_key};
	        $http({
	            method: 'POST',
	            url: url,
	            data:data,
	            headers: headers
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
        	getAllCards: getAllCards,
        	addToWallet: addToWallet,
        	removeFromWallet: removeFromWallet
    	});
	});