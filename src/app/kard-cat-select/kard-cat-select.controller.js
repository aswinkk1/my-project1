'use strict';
angular.module('kard')
  .controller('KardCatSelectController', function ($scope,KardCategoryListService, $rootScope, $state,ngDialog,KardDetailService,KardListService,$localStorage ) {
    //card cat list service
    KardCategoryListService.getAllCardCategory().then(function(data){
        if(data.status==0){
           $state.go("home");
        }
        else{
          $scope.cardCategory = data.data;
        }
    });
    $scope.searchAutoComplete = function(userInputString, timeoutPromise) {
      return KardCategoryListService.searchCard(userInputString);
    };
    // Uncomment for test purpose
    // $localStorage.primary_card_check = true;

    //TODO: Remove $localStorage.primary_card_check since it has no role in new 
    //primary card addition flow [from cat-select,signup, wallet and list pages] 
    // $scope.primary_card_check = $localStorage.primary_card_check;
    // if($localStorage.primary_card_check && !$localStorage.primary_card_popup_shown) {
    //   ngDialog.open({
    //         template:'app/components/templates/ng-primary-card-pop.html',
    //         scope: $scope,
    //         showClose: false,
    //         appendTo: '.mainContainer',
    //         overlay:true,
    //         preCloseCallback: function(value) {
    //             document.getElementsByTagName('body')[0].className.replace(/\bngdialog-open\b/,'');
    //             //change primary card check after adding a card.
    //             // $localStorage.primary_card_check = false;
    //             $localStorage.primary_card_popup_shown = true;
    //         }
    //   });
    // }
    $scope.enterKeyPress = function(card){
      console.log(card);
      if(card)
      {
        card.originalObject.card_features = JSON.parse(card.originalObject.card_features);
        $scope.data = card.originalObject;
        ngDialog.open({
            template:'app/components/templates/card-detail-template.html',
            scope: $scope,
            // showClose: false,
            appendTo: '.mainContainer',
            overlay:true,
            // closeByEscape: false,
            className: 'ngdialog-theme-default half-width'
        });
        $scope.selectedCard = '';
      }
    };
    $scope.$watch('selectedCard', function(val) {
         $scope.enterKeyPress(val);
    });

    
    $scope.saveCardType =  function(name){
        $rootScope.kardType = name;
    };


    $scope.addToWallet =  function(id, name_of_card_added){
      ngDialog.closeAll();
      document.getElementsByTagName('body')[0].className.replace(/\bngdialog-open\b/,'');
          KardListService.addToWallet(id).then(function(response){
              console.log(response.data.message);
              $scope.message = response.data.message;
              $scope.name_of_card_added = name_of_card_added;
              if(response.status == 1){
                  var addtToWalletResponseDialog = ngDialog.open({
                    template:'successTemplate',
                    scope: $scope,
                    appendTo: '.mainContainer',
                    overlay:true,
                    preCloseCallback: function(value) {
                      document.getElementsByTagName('body')[0].className.replace(/\bngdialog-open\b/,'');
                      $state.reload();
                    }
                  });
                  window.setTimeout(function(){ addtToWalletResponseDialog.close();},4000);
              }
              else if(response.status == 2){
                   $state.go("home");
              }
          });
    };
    $scope.removeFromWallet = function(card_id, name_of_card_added){
      ngDialog.closeAll();
      KardListService.removeFromWallet(card_id).then(function(response){
        console.log(response.data.message);
        $scope.message = response.data.message;
        $scope.name_of_card_added = name_of_card_added;
        if(response.status == 1){
          var addtToWalletResponseDialog = ngDialog.open({
            template:'successTemplate',
            scope: $scope,
            appendTo: '.mainContainer',
            overlay:true,
            preCloseCallback: function(value) {
              document.getElementsByTagName('body')[0].className.replace(/\bngdialog-open\b/,'');
              $state.reload();
            }
          });
          window.setTimeout(function(){ addtToWalletResponseDialog.close();},4000);
        }
        else if(response.status == 2){
          $state.go("home");
        }
      });
    };
  });