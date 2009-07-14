var jsGameViewer = function() {
  var WEIQI = 0;
  var DAOQI = 1;

	return {
    name: "jsgameviewer",
    version: "1.0a",
    length: 0,
    
    WEIQI: WEIQI,
    DAOQI: DAOQI,

    CONFIG: {
      baseDir: "/jsgameviewer/",
      viewDir: "/jsgameviewer/view/",
      gameType: WEIQI,
      boardSize: 19,
      playerInterval: 5,
      observerInterval: 15,
      container: null
    },
    
    getGameId: function(i){
      if (i == undefined){
        this.length ++;
        for(i=1; this["GV"+i]!=null; i++)
          ;
      }
      return "GV"+i;
    },
    
    createClass: function() {
      return function() {
        this.initialize.apply(this, arguments);
      }
    },

    clone: function(myObj){
      if(typeof(myObj) != 'object') return myObj;
      if(myObj == null) return myObj;

      var myNewObj = new Object();

      for(var i in myObj)
        myNewObj[i] = clone(myObj[i]);

      return myNewObj;
    },

    // return true if obj is String and not empty
    notNull: function(obj){
      return obj != undefined && obj != null && jQuery.trim(obj).length > 0;
    },

    getId: function(x, y){
      return x+"-"+y;
    }
	};
}();