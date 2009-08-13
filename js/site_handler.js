jsgvLoader.siteHandlers = function(){
  var handlers = [];
  
  function defaultSiteHandler(){
    jsgvLoader.loadCss();
  }
    
  jsgvLoader.addSiteHandler = function(handler){
    handlers[handler.length] = handler;
  }
  
  jsgvLoader.handleThis = function(){
    var handled = false;
    for (var i = 0; i < handlers.length; i++){
      if (handlers[i]()) {
        handled = true;
        break;
      }
    }
    if (!handled)
      defaultSiteHandler();
  }

  jsgvLoader.addOnloadHandler(jsgvLoader.handleThis);

  // Directly access location.protocol, location.host, location.pathname
  function localhostHandler(){
    if (location.host == 'localhost') {
      if (location.pathname == '/jsgameviewer/examples/load_sgf.html') {
        jsgvLoader.loadSgf();
      }
      return true;
    }
  }
  
  jsgvLoader.addSiteHandler(localhostHandler);
  
  return handlers;
}();