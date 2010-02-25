Object.extend(CONFIG, {
  gocoolUrlPrefix: "/app/"
});

Object.extend(GameController.prototype, {
  loadGocoolGame: function(id, n){
    this.gocoolId = id;
    var conf = this.config;
    return this.load(conf.gocoolUrlPrefix + "games/" + id + ".sgf", n);
  },

  createGocoolPlayer: function(){
    this.setPlayer(new GocoolPlayer(this));
    return this;
  }
});

var GocoolPlayer = Class.create();
Object.extend(GocoolPlayer.prototype, {
  initialize: function(gameController){
    this.gameController = gameController;
  },

  isPlayer: function(){
    return true;
  },

  isMyTurn: function(){
    return true;
  },

  sendMove: function(moveNumber, x, y){
    var c = this.gameController;
    var node = c.gameState.currentNode;
    var parentNode = node.parent;
    if (node.temp && (!parentNode || !parentNode.temp)){
      // node contains the first try move.
    } else {
      //alert("This is not the first TRY move.");
      alert(jsgvTranslations["not_first_move"]);
      return false;
    }
    var moveNumber = node.moveNumber;
    var x = node.x, y = node.y;
    var url = c.config.gocoolUrlPrefix + "games/" + c.gocoolId + "/play";
    url += "&move=" + moveNumber;
    url += "&x=" + x;
    url += "&y=" + y;
    jq.ajax({url: url,
      success:function(response){
        if (response.charAt(0) == '0'){ // success
          // TODO: move to next game
          c.refresh();
        } else { // failure
          alert(response);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){
        alert(jsgvTranslations["error_thrown"] + "\n" + textStatus + " " + errorThrown);
      }
    });
    return true;
  },

  resign: function(){
    var c = this.gameController;
    var node = c.gameState.rootNode;
    while(node.hasChildren()){
      var n = node.children[0];
      if (n.temp)
        break;
      else
        node = n;
    }
    var moveNumber = node.moveNumber;
    var url = c.config.gocoolUrlPrefix + "games/" + gocoolId + "/resign";
    jq.ajax({url: url,
      success:function(response){
        if (response.charAt(0) == '0'){ // success
          // TODO: move to next game
          c.refresh();
        } else { // failure
          c.setComment(response);
          //alert("Operation failed!");
          alert("操作失败！请参见棋盘右边的原始错误信息。");
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){
        c.setComment(textStatus + " " + errorThrown);
        //alert("Operation failed!");
        alert("操作失败！请参见棋盘右边的原始错误信息。");
      }
    });
    return true;
  }
});
