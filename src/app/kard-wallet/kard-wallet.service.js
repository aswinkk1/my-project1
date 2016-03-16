'use strict';
angular.module('kard')
	.service('KardWalletService', function($http, $q ,$rootScope, BASE_URL, $localStorage) {
    	function getWallet(){
    		var deferred = $q.defer();
	        var url = BASE_URL + 'wallet/';
	        var headers = {'session-key':$localStorage.session_key};
	        $http({
	            method: 'GET',
	            url: url,
	            headers: headers
	        }).success(function(response) {
	        	var res = response;
	        	// console.log(res.data.card[0].card_features);
	        	for(var obj in res.data.card){
	        		//console.log(res.data[obj].card_features);
	        		res.data.card[obj].card_features = JSON.parse(res.data.card[obj].card_features);
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
    	function setAsPrimaryCard(id) {
    		var deferred = $q.defer();
	        var url = BASE_URL + 'set-primary-card/';
	        var headers = {'session-key':$localStorage.session_key};
	        var dataToSend = {"card_id": id};
	        $http({
	            method: 'POST',
	            url: url,
	            headers: headers,
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
		return({
        	getWallet: getWallet,
        	setAsPrimaryCard: setAsPrimaryCard
    	});
	});