'use strict';
angular.module('kard')
  .controller('KardWalletController', function ($scope, KardWalletService,KardDetailService,KardListService,$localStorage,ngDialog,$timeout, $state) {
    $scope.cards = [];
    $scope.apiWait = true;
    // $scope.setPrimaryCard = $localStorage.setPrimaryCard;
    // $localStorage.setPrimaryCard = false; //Uncomment this for dev purpose
    $scope.setPrimaryCardcheck = function() {
      if(!$localStorage.setPrimaryCard && !$scope.noCards) {
        ngDialog.open({
              template:'app/components/templates/ng-primary-card-pop.html',
              scope: $scope,
              showClose: false,
              appendTo: '.mainContainer',
              overlay:true,
              preCloseCallback: function(value) {
                // $scope.setPrimaryCard = true;
              }
        });
      }
      else {
        $scope.goHome();
      }
    }
    $scope.goHome = function(){
      if($localStorage.alreadyShownTransn == false && !$scope.noCards){
        $localStorage.alreadyShownTransn = true;
        var dialog = ngDialog.open({
          template:'showTrnsnTemplate',
          appendTo: '.mainContainer',
          overlay:true,
          showClose: false,
          closeByEscape: false,
          closeByDocument: false
        });
        $timeout(function(){
          dialog.close();
          $state.go('home');
        },5000);
      }
      else {
        $state.go('home');
      }
    };
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
    $scope.confirmSetAsPrimaryCard = function(id) {
      ngDialog.open({
            template:'app/components/templates/confirm-set-as-primaryCard.html',
            scope: $scope,
            appendTo: '.mainContainer',
            overlay:true,
            data: String(id),
            preCloseCallback: function(value) {
                document.getElementsByTagName('body')[0].className.replace(/\bngdialog-open\b/,'');
            }
      });
    }
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
              $state.reload();
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
    $scope.setAsPrimaryCard = function(id) {
      KardWalletService.setAsPrimaryCard(id).then(function(response){
        $scope.apiWait = false;
        if(response.status == 1) {
          $localStorage.setPrimaryCard = true;
          $scope.ngDialogMessage = response.data.message;
          // $scope.ngDialogMessage = "Primary card changed successfully!"
          ngDialog.open({
                template:'app/components/templates/ng-dialog-template.html',
                scope: $scope,
                appendTo: '.mainContainer',
                overlay:true,
                preCloseCallback: function(value) {
                    document.getElementsByTagName('body')[0].className.replace(/\bngdialog-open\b/,'');
                    $state.reload();
                }
          });
          ngDialog.closeAll();
        }
        else if(response.status == 2){
          $state.go("home");
        }
      });
    }
    KardWalletService.getWallet().then(function(response){
      $scope.apiWait = false;
      if (response.status == 0) {
          $scope.message = response.message;
      }
      else if(response.status == 1){
        if(!response.data.primary_card) {
          $localStorage.setPrimaryCard = false;
          $localStorage.alreadyShownTransn = false;
        }
        else {
          $localStorage.setPrimaryCard = true;
        }
        $scope.setPrimaryCard = $localStorage.setPrimaryCard;
        if(response.data.card.length == 0){
          $scope.noCards = true; //No cards! start adding primary card
          // $localStorage.primary_card_check = true; 
        }
        else {
          angular.forEach(response.data.card, function(value, key) {
            if(key == 0)
              value.isOpen = true;
            else
              value.isOpen = false;
            $scope.cards.push(value);
          });
          console.log($scope.cards);
          $scope.primary_card_id = response.data.primary_card;
          //$localStorage.primary_card_check = false; //Make sure user have alredy cards
          $scope.$broadcast('rebuild:me');
        }
      }
      else if(response.status == 2){
          $state.go("home");
      }
    });
    
    $scope.$on('scrollbar.show', function(){
      console.log('Scrollbar show');
    });
    $scope.$on('scrollbar.hide', function(){
      console.log('Scrollbar hide');
    });
});
  