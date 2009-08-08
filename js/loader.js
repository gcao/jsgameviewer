// http://drnicwilliams.com/2006/11/21/diy-widgets/
jsgvLoader = function() {
  var BASE_URL = 'http://localhost/jsgameviewer/';
  var STYLESHEET = BASE_URL + "build/compressed.css"
  var JAVASCRIPT = BASE_URL + "build/compressed_all.js"

  return {
    loadStylesheet: function(stylesheet_url) {
      stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.type = "text/css";
      stylesheet.href = stylesheet_url;
      stylesheet.media = "all";
      document.lastChild.firstChild.appendChild(stylesheet);
    },
  
    loadJavascript: function(url, callback){
      var script = document.createElement("script")
      script.type = "text/javascript";

      if (script.readyState){  //IE
        script.onreadystatechange = function(){
          if (script.readyState == "loaded" || script.readyState == "complete"){
            script.onreadystatechange = null;
            callback();
          }
        };
      } else {  //Others
        script.onload = function(){callback();};
      }

      script.src = url;
      document.lastChild.firstChild.appendChild(script);
      // document.documentElement.insertBefore(script, document.documentElement.firstChild);
    },
    
    load: function(){
      this.loadStylesheet();
      this.loadJavascript();
    }
  };
}();

window.onload(function(){
  if (document.getElementByClass('jsgv')) {
    jsgvLoader.load();
  }
});