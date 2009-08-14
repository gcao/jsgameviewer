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

// Directly access location.protocol, location.host, location.pathname
function localhostHandler(){
  if (location.host == 'localhost') {
    if (location.pathname == '/jsgameviewer/examples/load_sgf.html') {
      jsgvLoader.loadSgf();
      return true;
    }
  }
}

jsgvLoader.addSiteHandler(localhostHandler);