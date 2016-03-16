'use strict';
angular.module('kard')
  .controller('MyProfileController', function ($scope,MyProfileService, $rootScope, userService,$state,ngDialog,$localStorage, $timeout) {
    $scope.apiWait = true;
    $scope.isFocused = true;
    $rootScope.$on('$stateChangeStart', 
      function(event, toState, toParams, fromState, fromParams){
        $scope.currentState = toState.name;
    });
    $scope.currentState = $state.current.name;
    $scope.userName = $localStorage.user_name;
    if($localStorage.session_key)
      userService.getUser($localStorage.session_key).then(function(res){
        $localStorage.user_name =  res.data.first_name;
        $scope.userName = res.data.first_name;
        // console.log($localStorage.user_name + $localStorage.session_key);
      });
    if ($localStorage.session_key) {
      $scope.loggedIn = true;
      $rootScope.ActiveSession = true;
    }
    $scope.showChangePasswordApiWait = true;
    $scope.showChangePassword = false;
    MyProfileService.getProfileDetails().then(function(response){
        //for view profile page
        $scope.data = response.data;
        if(response.data.change_password){
          $scope.showChangePasswordApiWait = false;
          $scope.showChangePassword = true;          
        }
        // console.log($scope.showChangePassword);
        // for edit page
        $scope.profileData = response.data;
        $scope.profileData.genderVal = $scope.profileData.gender=="Male"?'1' :'0';

        if($scope.profileData.age === '< 20')
          $scope.profileData.ageVal = '0';
        else if($scope.profileData.age === '20-25')
          $scope.profileData.ageVal = '1';
        else if($scope.profileData.age === '25-30')
          $scope.profileData.ageVal = '2';
        else if($scope.profileData.age === '30-35')
          $scope.profileData.ageVal = '3';
        else if($scope.profileData.age === '35+')
          $scope.profileData.ageVal = '4';
        $timeout(function(){
          $scope.apiWait = false;
        },200);
    });
   
    $scope.updateProfile = function($event){
        // angular.element($event.target).addClass("disabled");
        $scope.apiWait = true;
        MyProfileService.updateProfileDetails($scope.profileData).then(function(response){
            //console.log("updated");
            //TODO: Error handling. Always showing success now.
            $scope.apiWait = false;
            $localStorage.user_name = $scope.profileData.first_name;
            $scope.ngDialogMessage = response.data.message;
            ngDialog.open({
              template:'app/components/templates/ng-dialog-template.html',
              scope: $scope,
              appendTo: '.mainContainer',
              overlay:true,
              preCloseCallback: function(){
                $scope.editProfileForm.$setPristine();
                $scope.apiWait = false;
              }
            });
            window.setTimeout(function(){ 
              ngDialog.closeAll();
            },4000);
        });
    };
    $scope.changePassword = function(){
      $scope.loginError = false;
      $scope.apiWait = true;
        MyProfileService.changePassword($scope.changePwdData).then(function(response){
            //console.log("updated");
            $scope.apiWait = false;
            if(response.status == 1) {
              $scope.ngDialogMessage = response.data.message;
              ngDialog.open({
                template:'app/components/templates/ng-dialog-template.html',
                scope: $scope,
                appendTo: '.mainContainer',
                overlay:true,
                preCloseCallback: function(){
                  $state.go("profile.my-profile");
                  $state.reload();
                }
              });
              window.setTimeout(function(){ 
                ngDialog.closeAll();
              },4000);
            }
            else {
              $scope.changePasswordForm.$setPristine();
              $scope.loginError = true;
              $scope.message = response.data.error_message; 
            }
        });
        
    };

  });