var jsGameViewer = function() {
	return {
    name: "jsgameviewer",
    version: "1.0a",
    length: 0,
    
    WEIQI: 0,
    DAOQI: 1,
    
    EN_US: "en_us",
    ZH_CN: "zh_cn",
    LOCALES: ["en_us", "zh_cn"],

    CONFIG: {
      baseDir: "/jsgameviewer/",
      viewDir: "/jsgameviewer/view/",
      locale: jsgvTranslations.locale,
      gameType: 0,
      boardSize: 19,
      playerInterval: 5,
      observerInterval: 15,
      container: null
    },

    getStackTrace: function(e) {
      var callstack = [];
      var isCallstackPopulated = false;

      if (e.stack) { //Firefox
        var lines = e.stack.split('\n');
        for (var i=0, len=lines.length; i<len; i++) {
          if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
            callstack.push(lines[i]);
          }
        }
        //Remove call to printStackTrace()
        //callstack.shift();
        isCallstackPopulated = true;
      }
      else if (window.opera && e.message) { //Opera
        var lines = e.message.split('\n');
        for (var i=0, len=lines.length; i<len; i++) {
          if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
            var entry = lines[i];
            //Append next line also since it has the file info
            if (lines[i+1]) {
              entry += ' at ' + lines[i+1];
              i++;
            }
            callstack.push(entry);
          }
        }
        //Remove call to printStackTrace()
        //callstack.shift();
        isCallstackPopulated = true;
      }

      if (!isCallstackPopulated) { //IE and Safari
        var currentFunction = arguments.callee.caller;
        while (currentFunction) {
          var fn = currentFunction.toString();
          var fname = fn + "\n";
          //var fname = fn.substring(fn.indexOf('function') + 8, fn.indexOf('(')) || 'anonymous';
          callstack.push(fname);
          currentFunction = currentFunction.caller;
        }
      }
      return callstack;
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
        myNewObj[i] = this.clone(myObj[i]);

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
var jsgv = jsGameViewer;
