'use strict';
angular.module('kard')
  .controller('ListKardsController', function ($scope, $stateParams, $rootScope, $window, KardListService, ngDialog, $state, $localStorage, KardDetailService) {
    $scope.kardType = $rootScope.kardType;
    $scope.cards = [];
    $scope.apiWait = true;
    // var w = angular.element($window);
    // w.bind('resize', function() {
    //   $state.reload();
    // });
    //orientationchange not triggering very well
    // w.bind('orientationchange', function () {
    //   $route.reload();
    // });
    // Listen for resize changes
    // function doOnOrientationChange()
    //  {
    //    switch(window.orientation) 
    //    {  
    //      case -90:
    //      case 90:
    //        alert('landscape');
    //        break; 
    //      default:
    //        alert('portrait');
    //        break; 
    //    }
    //  }

    //  window.addEventListener('orientationchange', doOnOrientationChange);

    // Uncomment for test purpose
    // $localStorage.primary_card_check = true;
    $scope.primary_card_check = $localStorage.primary_card_check;
    // $scope.message = "Success!"
    $scope.confirmAddToWallet = function(card) {
      console.log(card);
      $scope.detailOnly = false;
      if(typeof(card.card_features) === 'string')
        card.card_features = JSON.parse(card.card_features);
      $scope.data = card;
      ngDialog.open({
          template:'app/components/templates/card-detail-template.html',
          scope: $scope,
          // showClose: false,
          appendTo: '.mainContainer',
          overlay:true,
          // closeByEscape: false,
          className: 'ngdialog-theme-default half-width'
      });
    }
    
    $scope.showDetails = function(card) {
      $scope.detailOnly = true;
      if(typeof(card.card_features) === 'string')
        card.card_features = JSON.parse(card.card_features);
      $scope.data = card;
      ngDialog.open({
          template:'app/components/templates/card-detail-template.html',
          scope: $scope,
          // showClose: false,
          appendTo: '.mainContainer',
          overlay:true,
          // closeByEscape: false,
          className: 'ngdialog-theme-default half-width'
      });
    }
    $scope.addToWallet = function(card_id,card_name){
      ngDialog.closeAll();
      console.log(card_id + card_name);
      KardListService.addToWallet(card_id).then(function(response){
        console.log(response.data.message);
        $scope.message = response.data.message;
        $scope.name_of_card_added = card_name;
        if(response.status == 1){
          ngDialog.open({
            template:'successTemplate',
            scope: $scope,
            appendTo: '.mainContainer',
            overlay:true,
            preCloseCallback: function(){
              $scope.apiWait = false;
              $state.go("kard-cat-select");
            }
          });
          if($localStorage.primary_card_check) {
            $localStorage.primary_card_check = false;
            $scope.primary_card_check = $localStorage.primary_card_check;
          }
           window.setTimeout(function(){ 
                        ngDialog.closeAll();
                      },4000);
        }
        else if(response.status == 2){
          $state.go("home");
        }
      });
    };
    $scope.removeFromWalletConfirm = function(id) {
      ngDialog.open({
            template:'app/components/templates/remove-from-wallet-confirm.html',
            scope: $scope,
            appendTo: '.mainContainer',
            overlay:true,
            data: String(id),
            preCloseCallback: function(value) {
                document.getElementsByTagName('body')[0].className.replace(/\bngdialog-open\b/,'');
            }
      });
    }
    $scope.removeCard = function(card_id){
      ngDialog.closeAll();
      KardListService.removeFromWallet(card_id).then(function(response){
        console.log(response.data.message);
        $scope.ngDialogMessage = response.data.message;
        if(response.status == 1){
          ngDialog.open({
            template:'app/components/templates/ng-dialog-template.html',
            scope: $scope,
            appendTo: '.mainContainer',
            overlay:true,
            preCloseCallback: function(){
              $scope.apiWait = false;
              $state.go("kard-cat-select");
            }
          });
          window.setTimeout(function(){ 
            ngDialog.closeAll();
          },4000);
        }
        else if(response.status == 2){
          $state.go("home");
        }
      });
    };
    // $scope.removeFromWallet = function(card_id,card_name){
    //   ngDialog.closeAll();
    //   console.log(card_id + card_name);
    //   KardListService.removeFromWallet(card_id).then(function(response){
    //     console.log(response.data.message);
    //     $scope.message = response.data.message;
    //     $scope.name_of_card_added = card_name;
    //     if(response.status == 1){
    //       ngDialog.open({
    //         template:'successTemplate',
    //         scope: $scope,
    //         appendTo: '.mainContainer',
    //         overlay:true,
    //         preCloseCallback: function(){
    //           $scope.apiWait = false;
    //           $state.go("kard-cat-select");
    //         }
    //       });
    //       if($localStorage.primary_card_check) {
    //         $localStorage.primary_card_check = false;
    //         $scope.primary_card_check = $localStorage.primary_card_check;
    //       }
    //        window.setTimeout(function(){ 
    //                     ngDialog.closeAll();
    //                   },4000);
    //     }
    //     else if(response.status == 2){
    //       $state.go("home");
    //     }
    //   });
    // };
    // $scope.LoadDetail = function(data){
    //   $rootScope.currentData = data;
    //   console.log('load detail called');
    // };
    
    KardListService.getAllCards($stateParams.kardType).then(function(response){
        $scope.cards = response.data.cards;
        // console.log(response);
        $scope.kardType = response.data.card_name;
        $scope.$broadcast('rebuild:me');
        $scope.apiWait = false;
    });
  });