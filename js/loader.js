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
    if (!elem) 
      elem = document.body;
    var parts = splitStrings(elem.innerHTML);
    if (parts.length > 0) {
      var newHTML = "";
      var sgf = false;
      for(var i = 0; i < parts.length; i++){
        if (parts[i] == GAME_START) {
          sgf = true;
          newHTML += "<div class='jsgv jsgv-inline'>";
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
      return true;
    }
  }
  
  return {
    addOnloadHandler: function(func) {  
      var oldonload = window.onload;  
      if (typeof window.onload != 'function') {  
        window.onload = func;
      } else { 
        window.onload = function() {  
          if (oldonload)
            oldonload();  
          func();  
        }  
      }
    },
  
    load: function(callback){
      var BASE_URL = 'http://localhost/jsgameviewer/';
      var STYLESHEET = BASE_URL + "build/compressed.css"
      var JAVASCRIPT = BASE_URL + "build/compressed.js"
      this.loadStylesheet(STYLESHEET);
      this.loadJavascript('http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js');
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
      script.src = url;
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
      document.documentElement.lastChild.appendChild(script);
    },
  
    loadGames: function(){
      jQuery(".jsgv").each(function(){
        var _this = jQuery(this);
        var id = _this.attr('id');
        if (!id) {
          id = 'gv' + Math.floor(Math.random()*100000);
          _this.attr('id', id);
        }

        if (this.nodeName == 'A') {
          var url = _this.attr('href');
          new jsGameViewer.GameController({'container':id}).load(url);
        } else {
          if (_this.hasClass('jsgv-inline')) {
            _this.removeClass('jsgv-inline');
            var sgf = _this.text();
            var gameController = new jsGameViewer.GameController({'container':id});
            gameController.loadSgf(sgf);
          } else {
            var gameController = new jsGameViewer.GameController({'container':id});
            var url = _this.attr('jsgv-url');
            if (url) {
              gameController.load(url);
            } else {
              gameController.show();
            }
          }
        }
      });
    },
  
    loadCss: function(){
      if (document.getElementsByClassName('jsgv').length > 0) {
        this.load(this.loadGames);
      }
    },
    
    loadSgf: function(elem){
      if (processElem(elem))
        this.load(this.loadGames);
    }
  };
}();

jsgvLoader.siteHandlers = [];
  
jsgvLoader.addSiteHandler = function(handler){
  this.siteHandlers[handler.length] = handler;
}

jsgvLoader.handleThis = function(){
  var handled = false;
  for (var i = 0; i < jsgvLoader.siteHandlers.length; i++){
    if (jsgvLoader.siteHandlers[i]()) {
      handled = true;
      break;
    }
  }
  if (!handled) {
    function defaultSiteHandler(){
      jsgvLoader.loadCss();
    }
    defaultSiteHandler();
  }
}

jsgvLoader.addOnloadHandler(jsgvLoader.handleThis);
