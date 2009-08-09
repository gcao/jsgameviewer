// http://drnicwilliams.com/2006/11/21/diy-widgets/
jsgvLoader = {
  load: function(callback){
    var BASE_URL = 'http://localhost/jsgameviewer/';
    var STYLESHEET = BASE_URL + "build/compressed.css"
    var JAVASCRIPT = BASE_URL + "build/compressed_all.js"
    this.loadStylesheet(STYLESHEET);
    this.loadJavascript(JAVASCRIPT, this.gameFinder);
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
  }
};

window.onload = function(){
  if (document.getElementsByClassName('jsgv').length > 0) {
    jsgvLoader.load();
  }
};