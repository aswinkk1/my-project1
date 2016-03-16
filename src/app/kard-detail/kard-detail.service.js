// TODO: Remove this service. api alredy giving all features in first call of listing.
// make sure service is not using anywhere.
'use strict';
angular.module('kard')
	.service('KardDetailService', function($http, $q ,$rootScope, BASE_URL, $localStorage) {
    	function getCardDetail(param){
     		var deferred = $q.defer();
	        var url = BASE_URL + 'card-list/';
	        var data = {"card_id":param};
	        var headers = {'session-key':$localStorage.session_key};
	        $http({
	            method: 'POST',
	            url: url,
	            data:data,
	            headers: headers
	        }).success(function(response) {
	        	var res = response;
	        	//console.log(res.data[0].card_features);
	        	for(var obj in res.data){
	        		//console.log(res.data[obj].card_features);
	        		res.data[obj].card_features = JSON.parse(res.data[obj].card_features);
	        		//console.log(JSON.parse(res.data[0].card_features));
	        	}
	        	deferred.resolve(res);
	        	//deferred.resolve(response);
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
        	getCardDetail: getCardDetail
    	});
	});