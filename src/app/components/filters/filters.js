'use strict';
angular.module('kard').filter('startsWithLetter', function () {
  return function (items, cardName) {
    // console.log(items);
    // console.log(cardName);
    if(cardName){
      var wordArray = cardName.split(" ");
      var nameMatch = '^.*?\\b' + wordArray[0];
      // console.log(wordArray);
      // console.log(nameMatch);
      for (var i = 1; i < wordArray.length; i++) {
        nameMatch = nameMatch + '.*?\\b' + wordArray[i];
        // console.log(nameMatch);
      }
      nameMatch = nameMatch + '.*?$';
      nameMatch = new RegExp(nameMatch, 'gi');
      // console.log(nameMatch);
      var filtered = [];
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if(nameMatch.test(item.card_name)) {
          filtered.push(item);
          
        }

      }
      return filtered;
    }
    return items;
    
  };
});