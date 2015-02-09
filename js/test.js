console.log('test.js')

if (location.toString().match(/dragongoserver.net\/show_games/)) {
  dgs();
} else if (location.toString().match(/www\.mitbbs\.com\/article_t\/Go/)) {
  mitbbs();
}

function dgs() {
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
function mitbbs() {
  var dependencyLoaded = false;
  var postElems = document.querySelectorAll("td.jiawenxhang-type");
  for (var i=0; i<postElems.length; i++) {
    var elem = postElems[i];
    var html = elem.innerHTML;
    if (html.indexOf('<<<') >= 0 && html.indexOf('>>>') >= 0) {

    }
  }
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
