console.log('test.js')

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
      jq4gv(".jsgv").each(function(){
        var _this = jq4gv(this);
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

    processAndLoad: function(){
      if (document.getElementsByClassName == undefined) {
        // Borrowed from http://muffinresearch.co.uk/archives/2006/04/29/getelementsbyclassname-deluxe-edition/
        document.getElementsByClassName = function(strClass, strTag, objContElm) {
          strTag = strTag || "*";
          objContElm = objContElm || document;
          var objColl = objContElm.getElementsByTagName(strTag);
          if (!objColl.length &&  strTag == "*" &&  objContElm.all) objColl = objContElm.all;
          var arr = new Array();
          var delim = strClass.indexOf('|') != -1  ? '|' : ' ';
          var arrClass = strClass.split(delim);
          for (var i = 0, j = objColl.length; i < j; i++) {
            var arrObjClass = objColl[i].className.split(' ');
            if (delim == ' ' && arrClass.length > arrObjClass.length) continue;
            var c = 0;
            comparisonLoop:
            for (var k = 0, l = arrObjClass.length; k < l; k++) {
              for (var m = 0, n = arrClass.length; m < n; m++) {
                if (arrClass[m] == arrObjClass[k]) c++;
                if (( delim == '|' && c == 1) || (delim == ' ' && c == arrClass.length)) {
                  arr.push(objColl[i]);
                  break comparisonLoop;
                }
              }
            }
          }
          return arr;
        }
      }

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
  this.siteHandlers[this.siteHandlers.length] = handler;
}

/******************************************************************************/
/* Site handlers */

jsgvLoader.addSiteHandler(function(){ // localhost handler
  if (location.host != 'localhost') return;

  if (location.pathname == '/jsgameviewer/examples/load_sgf.html') {
    jsgvLoader.loadSgf();
    return true;
  }
});

jsgvLoader.addSiteHandler(function(){ // dgs handler
  if (!location.host.match(/dragongoserver\.net$/)) return;

  if (location.path.match(/^\/show_games/)) {

    var gameElems = document.querySelectorAll("a.Button");
    for (var i=0; i<gameElems.length; i++) {
      var elem = gameElems[i];
      var sgf = "http://www.dragongoserver.net/sgf.php?gid=" + elem.text;

      (function(elem, sgf){
        elem.style.display = "inline";
        var newLink = document.createElement('span');
        newLink.style.marginLeft = "5px";
        newLink.style.marginRight = "3px";
        newLink.style.color = "#ff3355";
        newLink.appendChild(document.createTextNode("View"));
        newLink.onclick = function(e) {
          var win = window.open();
          if (win) {
            win.document.write(getWindowContent(sgf));
            win.focus();
            return false;
          } else {
            alert("Please disable popup blocker for this website to allow opening game in a new window.");
            return true;
          }
        }
        elem.parentElement.appendChild(newLink);
      })(elem, sgf);
    }

  }

  return true;
}

function getWindowContent(game) {
  return "<!DOCTYPE html>" +
    "<link rel='stylesheet' type='text/css' href='http://localhost:8000/jsgameviewer/view4/css/style.css' />" +
    "<script type='text/javascript' src='http://localhost:8000/jsgameviewer/js/jquery-1.3.2.min.js'></script>" +
    "<script type='text/javascript' src='http://localhost:8000/jsgameviewer/js/en_us.js'></script>" +
    //"<script type='text/javascript' src='http://localhost:8000/jsgameviewer/js/zh_cn.js' charset='utf-8'></script>" +
    "<script type='text/javascript' src='http://localhost:8000/jsgameviewer/js/base.js'></script>" +
    "<script type='text/javascript' src='http://localhost:8000/jsgameviewer/js/model.js'></script>" +
    "<script type='text/javascript' src='http://localhost:8000/jsgameviewer/js/parser.js'></script>" +
    "<script type='text/javascript' src='http://localhost:8000/jsgameviewer/js/controller.js'></script>" +
    "<script type='text/javascript' src='http://localhost:8000/jsgameviewer/view4/js/three/three.js'></script>" +
    "<script type='text/javascript' src='http://localhost:8000/jsgameviewer/view4/js/three/OrbitControls.js'></script>" +
    "<script type='text/javascript' src='http://localhost:8000/jsgameviewer/view4/fonts/helvetiker_regular.typeface.js'></script>" +
    "<script type='text/javascript' src='http://localhost:8000/jsgameviewer/view4/3d_assets/board.js'></script>" +
    "<script type='text/javascript' src='http://localhost:8000/jsgameviewer/view4/3d_assets/stone.js'></script>" +
    "<script type='text/javascript' src='http://localhost:8000/jsgameviewer/view4/js/view.js' charset='utf-8'></script>" +
    "<script type='text/javascript'>" +
    "var controller = new jsGameViewer.GameController();" +
    "controller.load('" + game + "')" +
    "</script>";
}

jsgvLoader.addSiteHandler(function(){ // mitbbs handler
  if (location.host != 'www.mitbbs.com') return;

  if (location.path.match(/^\/article_t\/Go/)) {
    var games = [];

    var dependencyLoaded = false;
    var postElems = document.querySelectorAll("td.jiawenzhang-type");
    for (var i=0; i<postElems.length; i++) {
      var elem = postElems[i];
      var html = elem.innerHTML;
      var i1 = html.indexOf('(;');
      var i2 = html.lastIndexOf(')') + 1;
      if (i1 >= 0 && i2 > i1) {
        var part1 = html.substring(0, i1);
        var part2 = html.substring(i1, i2);
        var part3 = html.substring(i2, html.length);

        if (games.indexOf(part2) != 0) {
          elem.innerHTML = part1 + "<div class='jsgv jsgv-inline'>" + part2 + "</div>" + part3;
        }
      }
    }

    if (games.length > 0) {
      this.processAndLoad();
    }
  }

  return true;
});

/* End of site handlers */
/******************************************************************************/

//jsgvLoader.addSiteHandler(function(){ // default handler
//  jsgvLoader.processAndLoad();
//});

jsgvLoader.addOnloadHandler(function(){
  for (var i = 0; i < jsgvLoader.siteHandlers.length; i++){
    if (jsgvLoader.siteHandlers[i]()) {
      break;
    }
  }
});

