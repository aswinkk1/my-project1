'use strict';

angular.module('kard')
	.controller('NavbarController', function ($scope,$state, $localStorage, userService,$rootScope,$window, loginService, ngDialog) {
		$scope.currentState = $state.current.name;
		$scope.userName = $localStorage.user_name;
		if($localStorage.session_key){
			userService.getUser($localStorage.session_key).then(function(res){
				// console.log(res);
				if(res.status==0){
					$state.go("home");
				}
				else if(res.status==2){
					loginService.logout().then(function(res){
						$rootScope.ActiveSession = false;
						$state.go("home");
						$state.reload();
					});
				}
				else{
					$localStorage.user_name =  res.data.first_name ;
					$scope.userName = res.data.first_name ;
				}
				
			});
		}
		if ($localStorage.session_key) {
				$rootScope.loggedIn = true;
				$rootScope.ActiveSession = true;
		}
		else{
			$rootScope.loggedIn = false;
		}
		$scope.showMenu = false;
		if(window.matchMedia('(max-width: 1024px)').matches) {
			$scope.showMenu = true;
		}
		$scope.showMenuCheck = function() {
			if(document.activeElement)
				document.activeElement.blur();
			if(document.getElementById("calculateCard_value"))
				document.getElementById("calculateCard_value").blur();
			if(document.getElementById("email"))
				document.getElementById("email").blur();
			if(window.matchMedia('(max-width: 1024px)').matches) {
				if (document.getElementById("wrap").className.match(/(?:^|\s)show-off-can-menu(?!\S)/)) {
					document.getElementById("wrap").className = document.getElementById("wrap").className.replace(/(?:^|\s)show-off-can-menu(?!\S)/g ,'');
					document.getElementById("wrap").removeAttribute("style"); 
				}
				else {
					document.getElementById("wrap").className += " show-off-can-menu";
					document.getElementById("wrap").removeAttribute("style"); 
				}
				if (document.getElementById("kardMenuItems").className.match(/(?:^|\s)show-menu(?!\S)/))
					document.getElementById("kardMenuItems").className = document.getElementById("kardMenuItems").className.replace(/(?:^|\s)show-menu(?!\S)/g ,'');
				else
					document.getElementById("kardMenuItems").className += " show-menu";
			}
			else {
				if(!$scope.showMenu) {
					$scope.showMenu = true;
				}
				else {
					$scope.showMenu = false;
				}
			}
		};
		if(document.getElementById("overlayCloseNav")) {
	      document.getElementById("overlayCloseNav").addEventListener("wheel", stopPropagation);
	      document.getElementById("overlayCloseNav").addEventListener("touchstart", stopPropagation);
	    }
	    if(document.getElementById("kardMenuItems")) {
	      document.getElementById("kardMenuItems").addEventListener("wheel", stopPropagation);
	      document.getElementById("kardMenuItems").addEventListener("touchmove", stopPropagation);
	    }

	    function stopPropagation(event) {
	    	if(!window.matchMedia('(max-height: 380px)').matches){
	    		event.stopPropagation();
		    	event.preventDefault();
	    	}
	    }
	    // function preventDefault(event) {
	    // 	event.preventDefault();
	    // }
		$scope.$on("OUTSIDECLICKED", function(event, targetElement) {
			if(window.matchMedia('(max-width: 1024px)').matches){
				$scope.showMenu = true;
			}
			else
				$scope.showMenu = false;
	        $scope.$apply();
	    });

	    $scope.signUp = function(){
	    	ngDialog.open({
	    		templateUrl: 'app/signup/signup.html',
	    		controller: 'SignupController'

	    	});
	    };

	    $scope.logIn = function(){
	    	ngDialog.open({
	    		templateUrl: 'app/login/login.html',
	    		controller: 'LoginController'
	    	});
	    };
});
