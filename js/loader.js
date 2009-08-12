// http://drnicwilliams.com/2006/11/21/diy-widgets/
jsgvLoader = function(){
  var GAME_START = "SGF[[";
  var GAME_END = "]]SGF";
  
  function splitStrings(input) {
    var result = [];
  
    var i = input.indexOf(GAME_START);
    while(i >= 0){
      result[result.length] = input.substr(0, i);
      result[result.length] = input.substr(i, GAME_START.length);
      input = input.substr(i + GAME_START.length);
    
      var j = input.indexOf(GAME_END);
      if (j >= 0) {
        result[result.length] = input.substr(0, j);
        result[result.length] = input.substr(j, GAME_END.length);
        input = input.substr(j + GAME_END.length);
      } else {
        throw "No matching " + GAME_END + " is found.";
      }
    
      i = input.indexOf(GAME_START);
    }
    return result;
  }

  function processElem(elem){
    var parts = splitStrings(elem.innerHTML);
    if (parts.length > 0) {
      var newHTML = "";
      var sgf = false;
      for(var i = 0; i < parts.length; i++){
        if (parts[i] == GAME_START) {
          sgf = true;
          newHTML += "<div class='jsgv' style='display:none'>";
        } else if (parts[i] == GAME_END) {
          sgf = false;
          newHTML += "</div>";
        } else if (sgf) {
          newHTML += parts[i].replace(/<[^>]*>/g, "");
        } else {
          newHTML += parts[i];
        }
      }
      elem.innerHTML = newHTML;
    }
  }

  function addOnloadHandler(func) {  
    var oldonload = window.onload;  
    if (typeof window.onload != ‘function’) {  
      window.onload = func;
    } else { 
      window.onload = function() {  
        if (oldonload)
          oldonload();  
        func();  
      }  
    }
  }

  return {
    load: function(callback){
      var BASE_URL = 'http://localhost/jsgameviewer/';
      var STYLESHEET = BASE_URL + "build/compressed.css"
      var JAVASCRIPT = BASE_URL + "build/compressed_all.js"
      this.loadStylesheet(STYLESHEET);
      this.loadJavascript(JAVASCRIPT, callback);
    },
  
    loadStylesheet: function(url) {
      var stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.type = "text/css";
      stylesheet.href = url;
      stylesheet.media = "all";
      document.documentElement.lastChild.appendChild(stylesheet);
    },

    loadJavascript: function(url, callback){
      var script = document.createElement("script")
      script.type = "text/javascript";
      if (callback) {
        if (script.readyState){  
          // IE
          script.onreadystatechange = function(){
            if (script.readyState == "loaded" || script.readyState == "complete"){
              script.onreadystatechange = null;
              callback();
            }
          };
        } else {  
          // Others
          script.onload = function(){callback();};
        }
      }
      script.src = url;
      document.documentElement.lastChild.appendChild(script);
    },
  
    gameFinder: function(){
      jQuery(".jsgv").each(function(){
        var idFunc = function(elem) {
          var id = jQuery(elem).attr('id');
          if (!id) {
            id = 'gv' + Math.floor(Math.random()*100000);
            jQuery(elem).attr('id', id);
          }
          return id;
        };
    
        if (this.nodeName == 'A') {
          var url = jQuery(this).attr('href');
          new jsGameViewer.GameController({'container':idFunc(this)}).load(url);
        } else {
          var gameController = new jsGameViewer.GameController({'container':idFunc(this)});
          var url = jQuery(this).attr('jsgv-url');
          if (url) {
            gameController.load(url);
          } else {
            gameController.show();
          }
        }
      });
    },
  
    loadNowCss: function(){
      if (document.getElementsByClassName('jsgv').length > 0) {
        jsgvLoader.load(this.gameFinder);
      }
    },
    
    loadNowSgf: function(elem){
      processElem(elem);
    },
  
    loadOnloadCss: function(){
      addOnloadHandler(function(){
        if (document.getElementsByClassName('jsgv').length > 0) {
          jsgvLoader.load(this.gameFinder);
        }
      });
    },
    
    loadOnloadSgf: function(){
      addOnloadHandler(function(){
        jsgvLoader.processElem(document.body);
      });
    }
  };
}();
