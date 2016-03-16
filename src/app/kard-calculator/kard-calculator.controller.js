'use strict';
angular.module('kard')
  .controller('KardCalculatorController', function ($scope,$window,KardCalculatorService,KardDetailService,$state,$rootScope, ngDialog, $timeout) {
    $scope.message = "";
    $scope.serverResponse = false;
    $scope.currentState = $state.current.name;
    // var w = angular.element($window);
    // w.bind('resize', function() {
    //   $state.reload();
    // });
    if(window.matchMedia('(max-width: 767px)').matches)
      $scope.calculatorPlaceholder = "Where are you shopping?";
    else 
      $scope.calculatorPlaceholder = "Where are you shopping? (Ex: JCrew, Starbucks, United Airlines etc)";
    // if(!(navigator.userAgent.match(/Android/i)
    //  || navigator.userAgent.match(/webOS/i)
    //  || navigator.userAgent.match(/iPhone/i)
    //  || navigator.userAgent.match(/iPad/i)
    //  || navigator.userAgent.match(/iPod/i)
    //  || navigator.userAgent.match(/BlackBerry/i)
    //  || navigator.userAgent.match(/Windows Phone/i)
    //  )){
    //   // $scope.scrollBarSupport == false;
    // }
    // else {
    //   // $scope.scrollBarSupport == false;          
    // }
    $scope.enterKeyPress = function(selectedSite,selectedSiteName){
      // console.log(selectedSiteName);
      $scope.cards = [];
      if(selectedSite)
      {
        $scope.apiWait = true;
        KardCalculatorService.getCards(selectedSite).then(function(res){
          $scope.apiWait = false;
          if(res.status==0){
              $state.go("home");
          }
          else{
              if(!res.data.error_message)
                $scope.serverResponse = true;
              else 
                $scope.message = "No results found for your query!";

              $scope.cards = res.data;
              // console.log($scope.cards.length);
              if($scope.cards.length == 0){

                $scope.serverResponse = false;
                $scope.message =  "You don't have any card having offer for " + selectedSiteName;
              }
            $scope.$broadcast('rebuild:me');
            //using this emit event in swiper page to update the swiper. (deprecated)
            // $scope.$emit('rebuildSwiper');
          }
        });
      }
      else {
        $scope.message = "No results found for your query!";
        $scope.serverResponse = false;
      }
    };
 
    $scope.$watch('selectedSite', function(val) {
      // console.log(val);
      if(val)
         $scope.enterKeyPress(val.originalObject.id,val.title);
    });

    $scope.AutoFillWebsite = function(userInputString, timeoutPromise){
        return KardCalculatorService.getAutoFillWebsite(userInputString);
    };

    $scope.inputChange = function(string){
      $scope.message = '';
      // console.log(string);
       $scope.cards = [];
        $scope.$broadcast('rebuild:me');
      //console.log(string);
     // // console.log(angular.element("body"));
     // var e = document.getElementById("calculateCard_value");
     //  var $e = angular.element(e);
     //  $e.triggerHandler('change');
    // var elm = document.getElementById('calculateCard_value');
      //angular.element(elm).triggerHandler("change");
      //angular.element( document.querySelector('calculateCard_value')).trigger('change');
      return string;
      //$scope.AutoFillWebsite(string);
      //$scope.selectedSite = string;
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
    $scope.showDetailsinMain = function(card) {
      $scope.detailOnly = true;
      if(typeof(card.card_features) === 'string')
        card.card_features = JSON.parse(card.card_features);
      $scope.data = card;
      var dialog = ngDialog.open({
          template:'app/components/templates/card-detail-template.html',
          scope: $scope,
          // showClose: false,
          appendTo: '#vSwiper',
          overlay:true,
          // closeByEscape: false,
          className: 'ngdialog-theme-default half-width ng-dialog-main-page'
      });
    }
    if(document.getElementById("homeCalculatorSlide")) {
      // var startingY = 0;
      // var currentY = 0;
      // var delta = 0;
      document.getElementById("homeCalculatorSlide").addEventListener("wheel", stopPropagation);
      document.getElementById("homeCalculatorSlide").addEventListener("mousewheel", stopPropagation);
      document.getElementById("homeCalculatorSlide").addEventListener("DOMMouseScroll", stopPropagation);
      document.getElementById("homeCalculatorSlide").getElementsByClassName("angucomplete-dropdown-calculator")[0].addEventListener("wheel", function(e){e.stopPropagation();});
      document.getElementById("homeCalculatorSlide").getElementsByClassName("angucomplete-dropdown-calculator")[0].addEventListener("mousewheel", function(e){e.stopPropagation();});
      document.getElementById("homeCalculatorSlide").getElementsByClassName("angucomplete-dropdown-calculator")[0].addEventListener("DOMMouseScroll", function(e){e.stopPropagation();});
    }
    function stopPropagation(event) {
      var delta = 0;
      // console.log(event);
      if(!event) 
      event = window.event;
      if(event.deltaY) {
        delta = -(event.deltaY);
      }
      else if(event.wheelDelta) {
        delta = event.wheelDelta /  60;
      }
      else if(event.detail) {
        delta = -event.detail / 2;
      }
      // console.log(delta);
      var topValue = document.getElementById("homeCalculatorSlide").getElementsByClassName("scroll-overview")[0].style.cssText;
      // console.log(topValue);
      if(topValue.lastIndexOf(":")){
        topValue = parseInt(topValue.substring(topValue.lastIndexOf(":")+1,topValue.lastIndexOf(";")));
        // console.log(topValue);
        if(delta>0 && topValue !== 0) {
          event.stopPropagation();
        }
      }
    }  
});

  