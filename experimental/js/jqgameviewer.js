//You need an anonymous function to wrap around your function to avoid conflict
(function($){

  //Attach this new method to jQuery
  $.fn.extend({

    gameViewer: function(options) {
      var WEIQI = 0;
      var DAOQI = 1;
      
      var defaults = {
        baseDir: "/jsgameviewer/",
        viewDir: "/jsgameviewer/view/",
        gameType: WEIQI,
        boardSize: 19,
        playerInterval: 5,
        observerInterval: 15,
        container: null
      };
      
      var options = $.extend(defaults, options);
      
      return {
        WEIQI: WEIQI,
        DAOQI: DAOQI,        
        name: "jsgameviewer",
        version: "1.0a",
        length: 0,
        getId: function(i){
          if (i == undefined){
            gv.length ++;
            for(i=1;gv["GV"+i]!=null;i++)
              ;
          }
          return "GV"+i;
        }
      };

    }
  });
})(jQuery); //pass jQuery to the function