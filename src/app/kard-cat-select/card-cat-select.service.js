'use strict';
angular.module('kard')
	.service('KardCategoryListService', function($http, $q ,$rootScope,BASE_URL, $localStorage) {
    	function getAllCardCategory(){
    		var deferred = $q.defer();
	        var url = BASE_URL+'card-category-list/';
	        var headers = {'session-key':$localStorage.session_key};
	        //console.log(param);
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

    	function searchCard(param){
    		var deferred = $q.defer();
	        var url = BASE_URL+'search-card/';
	        var headers = {'session-key':$localStorage.session_key};
	        var data = {'value':param};
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
        	getAllCardCategory: getAllCardCategory,
        	searchCard : searchCard
    	});
	});