// Default view configuration
jQuery.extend(jsGameViewer.CONFIG, {
  gridSize:21,
  fastMode:10,
  showMoveNumber:false,
  activeBackground: "#EECD7A",
  inactiveBackground: "#CCAB69",
  boardColor:"#EECD7A",
  gridSizeWQ:21,
  gridSizeDQ:19,
  boardColorDQ:"#CCAB69",
  vbw:3,
  boardSizeDQ:25,
  rightPaneHeight:446,
  rightPaneHeightDQ:522
});

jQuery.extend(jsGameViewer.GameController.prototype, function(){
  var LABELS = ['A','B','C','D','E','F','G','H','J','K','L','M','N','O','P','Q','R','S','T'];
  var BRANCHES = ['A','B','C','D','E','F','G','H','I','J'];
  
  return {
    destroyView: function(){
      jQuery("#"+this.id).remove();
    },

    /* initialize view
     */
    initView: function(){
      if (this.initialized())
        return this;
      this.config.x0 = this.config.vbw;
      this.config.y0 = this.config.vbw;
      var s = "";
      if (this.config.gameType == jsGameViewer.DAOQI){
        this.config.gridSize = this.config.gridSizeDQ;
        if (jsGameViewer.DAOQI_TEMPLATE == null){
          jQuery.ajax({
            async: false,
            dataType: "application/xml",
            url: CONFIG.viewDir+"templates/daoqi.html",
            success: function(response){
              jsGameViewer.DAOQI_TEMPLATE = response;
            }
          });
        }
        s = jsGameViewer.DAOQI_TEMPLATE;
        this.rightPaneHeight = this.config.rightPaneHeightDQ;
      } else {
        this.config.gridSize = this.config.gridSizeWQ;
        if (jsGameViewer.WEIQI_TEMPLATE == null){
          jQuery.ajax({
            async: false,
            dataType: "application/xml",
            url: jsGameViewer.CONFIG.viewDir+"templates/weiqi.html",
            success: function(response){
              jsGameViewer.WEIQI_TEMPLATE = response;
            }
          });
        }
        s = jsGameViewer.WEIQI_TEMPLATE;
        this.rightPaneHeight = this.config.rightPaneHeight;
      }
      if (this.id != 'GV1')
        s = s.replace(/GV1/g, this.id);
      if (this.config.container == null) {
        jQuery("#"+this.id).replaceWith(s);
      } else {
        jQuery("#"+this.config.container).empty().append(s);
      }
      // fdSliderController.construct();
      var _this = this;
      jQuery("#"+this.id+"_boardFascade").mousemove(function(e){
        _this.registerKeyListener();
        var arr = _this.eventToXY(e);
        jQuery("#"+_this.id+"_pointLabel").empty().append(_this.xyToLabel(arr[0],arr[1]));
      }).mouseout(function(e){
        jQuery("#"+_this.id+"_pointLabel").empty();
      }).mousedown(function(e){
        var arr = _this.eventToXY(e);
        _this.fromX = arr[0];
        _this.fromY = arr[1];
        // console.log("fromX: " + this.fromX + ", fromY: " + this.fromY);
        if (e.ctrlKey && e.shiftKey){
          _this.sendMove_(arr[0], arr[1]);
        } else if (e.ctrlKey || _this.config.gameType == jsGameViewer.WEIQI){
          _this.play(arr[0],arr[1]);
        } else if (_this.config.gameType == jsGameViewer.DAOQI){
          this.style.cursor = 'move';
        }
      }).mouseup(function(e){
        this.style.cursor = 'auto';
        var arr = _this.eventToXY(e);
        var toX = arr[0], toY = arr[1];
        // console.log("toX: " + toX + ", toY: " + toY);
        if (_this.fromX == undefined || _this.fromX == NaN || _this.fromY == undefined || _this.fromY == NaN)
          return;
        if (_this.fromX != toX || _this.fromY != toY) {
          _this.moveBoard(toX-_this.fromX, toY-_this.fromY);
        }
      });
      this.setToggleNumberImg();
      jQuery("#"+this.id+"_goToInput").keydown(function(){
        if(e.keyCode==13){
          gvGoTo(id);
        }
      });
      this.addPrisonerHandlers();
      this.registerKeyListener();
      jQuery(document).ready(function(){tb_init("a.thickbox")});
      return this;
    },
  
    addPrisonerHandlers: function(){
      var _this = this;
      jQuery("#" + this.id + "_moveOuter, #" + this.id + "_blackPrisonersOuter, #" + this.id + "_whitePrisonersOuter")
        .mouseout(function(){
          jQuery("#"+_this.id+"_prisoners").empty();        
        });
      jQuery("#" + this.id + "_blackPrisonersOuter").mouseover(function(){
        jQuery("#"+_this.id+"_prisoners").empty();
        if (_this.gameState.blackPrisoners > 0){
          jQuery.each(_this.gameState.blackPrisonerPoints, function(i,item){
            _this.showPrisoner(item);
          });
        }
      });
      jQuery("#" + this.id + "_whitePrisonersOuter").mouseover(function(){
        jQuery("#"+this.id+"_prisoners").empty();
        if (_this.gameState.whitePrisoners > 0){
          jQuery.each(_this.gameState.whitePrisonerPoints, function(i,item){
            _this.showPrisoner(item);
          });
        }
      });
      jQuery("#" + this.id + "_moveOuter").mouseover(function(){
        jQuery("#"+_this.id+"_prisoners").empty();
        if (_this.gameState.currentNode.blackPrisoners > 0){
          jQuery.each(_this.gameState.currentNode.blackPrisonerPoints, function(i,item){
            _this.showPrisoner(item);
          });
        }
        if (_this.gameState.currentNode.whitePrisoners > 0){
          jQuery.each(_this.gameState.currentNode.whitePrisonerPoints, function(i,item){
            _this.showPrisoner(item);
          });
        }
      });
    },
  
    showPrisoner: function(item){
      var _this = this;
      var x = item[0], y = item[1], color = item[2];
      var area = this.xyToArea(x,y);
      var left = area[0], top = area[1], width = area[2], height = area[3];
      if (this.config.gameType == jsGameViewer.DAOQI) {
        var cssClass = color == jsGameViewer.model.STONE_BLACK? "gvsprite-19-markblack" : "gvsprite-19-markwhite";
        this.mapToPoints(x,y,function(x1,y1){
          var area = _this.xyToArea(x1,y1);
          var left = area[0], top = area[1], width = area[2], height = area[3];
          var s = "<div class='"+cssClass+"' style='position:absolute;left:"+left+"px;top:"+top+"px;";
          if (_this.gameState.board[x][y] == jsGameViewer.model.STONE_NONE){
            if (_this.isInCentralArea(x1,y1)){
              s += "background-color:"+_this.config.boardColorDQ+";";
            } else {
              s += "background-color:"+_this.config.boardColor+";";
            }
          }
          s += "'></div>";
          jQuery("#"+this.id+"_prisoners").append(s);
        });
      } else {
        var cssClass = color == jsGameViewer.model.STONE_BLACK? "gvsprite-21-markblack" : "gvsprite-21-markwhite";
        var s = "<div class='"+cssClass+"' style='position:absolute;left:"+left+"px;top:"+top+"px;";
        if (this.gameState.board[x][y] == jsGameViewer.model.STONE_NONE){
          s += "background-color:"+this.config.boardColor+";";
        }
        s += "'></div>";
        jQuery("#"+this.id+"_prisoners").append(s);
      }
    },

    removeKeyListener: function(){
      jQuery("#"+this.id+"_bannerbg").css("background-color",this.config.inactiveBackground);
    },
  
    registerKeyListener: function(){
      var _this = this;
      for(var i=1; i<=jsGameViewer.length; i++){
        jsGameViewer[jsGameViewer.getGameId(i)].removeKeyListener();
      }
      jQuery("#"+this.id+"_bannerbg").css("background-color",this.config.activeBackground);
      document.onkeydown = function(e){
        var keyCode;
        if (window.event)
          keyCode = window.event.keyCode;
        else if (e)
          keyCode = e.which;
        else 
          return;
        
        e = e || window.event;
        switch(keyCode){
          case 37: // left
            if (e.ctrlKey){
              if (e.altKey)
                _this.backAll();
              else
                _this.backN(_this.config.fastMode)
            } else {
              if (e.altKey && e.shiftKey)
                _this.backToComment();
              else
                _this.back();
            }
            return;
          case 39: // right
            if (e.ctrlKey){
              if (e.altKey)
                _this.forwardAll();
              else
                _this.forwardN(_this.config.fastMode);
            } else {
              if (e.altKey && e.shiftKey)
                _this.forwardToComment();
              else
                _this.forward();
            }
            return;
          case 46: // delete
            _this.remove();
            return;
        }
      
        if (e.altKey && e.shiftKey){
          switch (keyCode) {
            case 71: // g
              setTimeout("jsGameViewer."+_this.id+".goToPopup()",100);
              break;
            case 77: // m
              _this.toggleNumber();
              break;
            case 82: // r
              _this.refresh();
              break;
            default: // a: 65, z: 90
              if (keyCode >= 65 && keyCode <= 90){
                _this.goToBranch(keyCode - 65);
              }
          }
        }
      };
      return this;
    },

    /* reset view to beginning of a game
     */
    initGame: function(){
      return this.removeAllStones()
        .setGameInfo()
        .setGameState()
        .addRemoveStones(this.gameState.currentNode.points);
    },
  
    setGameInfo: function(){
      // show/hide resign button
      if (this.isMyTurn()){
        jQuery("#" + this.id + "_resign").show();
      } else {
        jQuery("#" + this.id + "_resign").hide();
      }
      var infoNode = jQuery("#" + this.id + "_info").empty();
      var game = this.game;
      if (game == undefined || game == null)
        return this;
      if (jsGameViewer.notNull(game.name)){
        infoNode.append("<div align='center' style='font-weight:bold'>"+jQuery.trim(game.name)+"</div>");
      }
      if (jsGameViewer.notNull(game.date)){
        infoNode.append("<div>&#26102;&#38388;&#65306;"+jQuery.trim(game.date)+"</div>");
      }
      if (jsGameViewer.notNull(game.place)){
        infoNode.append("<div>&#22320;&#28857;&#65306;"+jQuery.trim(game.place)+"</div>");
      }
      var playFirst = "&nbsp;&lt;-&nbsp;&#20808;&#34892;";
      // black player name + rank
      var blackRank = "";
      if (jsGameViewer.notNull(game.blackRank))
        blackRank = "&nbsp;("+game.blackRank+")";
      var blackPlayer = "<div>&#40657;&#26041;&#65306;<strong>"+jQuery.trim(game.blackName)+"</strong>"+blackRank;
      if (game.getFirstPlayer() == jsGameViewer.model.STONE_BLACK)
        blackPlayer += playFirst;
      blackPlayer += "</div>";
      infoNode.append(blackPlayer);   
      // white player name + rank
      var whiteRank = "";
      if (jsGameViewer.notNull(game.whiteRank))
        whiteRank = "&nbsp;("+game.whiteRank+")";
      var whitePlayer = "<div>&#30333;&#26041;&#65306;<strong>"+jQuery.trim(game.whiteName)+"</strong>"+whiteRank;
      if (game.getFirstPlayer() == jsGameViewer.model.STONE_WHITE)
        whitePlayer += playFirst;
      whitePlayer += "</div>";
      infoNode.append(whitePlayer);
      if (game.handicap > 0){
        infoNode.append("<div>&#35753;&#23376;&#65306;"+game.handicap+"</div>");
      } else {
        infoNode.append("<div>&#35268;&#21017;&#65306;"+jQuery.trim(game.rule)+"</div>");
        if (game.rule == "Chinese")
          infoNode.append("<div>&#36148;&#23376;&#65306;"+game.komi+"</div>");
        else
          infoNode.append("<div>&#36148;&#30446;&#65306;"+game.komi+"</div>");
      }
      infoNode.append("<div>&#25163;&#25968;&#65306;"+game.getMoves()+"</div>");
      infoNode.append("<div>&#32467;&#26524;&#65306;"+jQuery.trim(game.result)+"</div>");
      return this;
    },
  
    removeGameInfo: function(){
      jQuery("#" + this.id + "_info").empty();
      return this;
    },
  
    setGameState: function(){
      var node = this.gameState.currentNode;
      this.setNextPlayer(this.gameState.getNextPlayer());
      this.setMoveNumber(node.moveNumber);
      this.setPrisoners(this.gameState.blackPrisoners, this.gameState.whitePrisoners);
      if (node.type == jsGameViewer.model.NODE_MOVE)
        this.setMoveMark(node.x, node.y);
      else
        this.removeMoveMark();
      this.setMarks(node.marks);
      this.setBranches();
      this.setComment();
      return this;
    },
  
    moveBoard: function(xDiff,yDiff){
      var _this = this;
      if (this.config.gameType != jsGameViewer.DAOQI)
        return;
      var board = this.gameState.board;
      this.config.x0 = board.normalize(this.config.x0+xDiff);
      this.config.y0 = board.normalize(this.config.y0+yDiff);
      // remove stones
      this.removeAllStones();
      // remove branches
      this.removeBranches();
      // hide move mark
      this.removeMoveMark();
      // add stones
      var s = "";
      for(var i=0; i<board.size; i++){
        for(var j=0; j<board.size; j++){
          var color = board[i][j];
          if (color == jsGameViewer.model.STONE_BLACK || color == jsGameViewer.model.STONE_WHITE){
            var moveNumber = 0;
            if (this.config.showMoveNumber)
              moveNumber = this.gameState.getMoveNumber(i,j);
            this.mapToPoints(i,j,function(x,y){
              s += _this.createStone(x,y,color,moveNumber);
            });
          }
        }
      }
      if (s.length > 0)
        jQuery("#"+this.id+"_boardPoints").append(s);
      // add branches
      this.setBranches();
      // show move mark
      var node = this.gameState.currentNode;
      if (node.type == jsGameViewer.model.NODE_MOVE)
        this.setMoveMark(node.x, node.y);
      else
        this.removeMoveMark();
      // move labels
      var vlabelStart = (this.config.y0-this.config.vbw)*this.config.gridSize;
      jQuery("#"+this.id+"_vlabel").css("backgroundPosition", "0px "+vlabelStart+"px");
      var hlabelStart = (this.config.x0-this.config.vbw)*this.config.gridSize;
      jQuery("#"+this.id+"_hlabel").css("backgroundPosition", hlabelStart+"px 0px");
      // move marks
      this.setMarks(node.marks);
      return this;
    },

    mapToPoints_: function(x,y){
      //console.log("GameView.mapToPoints(): "+x+","+y);
      var stones = new Array();
      var x1 = x+this.config.x0, y1 = y+this.config.y0;
      var xarr = [];
      if (x1>=0 && x1<this.config.boardSizeDQ)
        xarr.push(x1);
      if (x1>=this.config.boardSize)
        xarr.push(x1-this.config.boardSize);
      if (x1<this.config.boardSizeDQ-this.config.boardSize)
        xarr.push(x1+this.config.boardSize);

      var yarr = [];
      if (y1>=0 && y1<this.config.boardSizeDQ)
        yarr.push(y1);
      if (y1>=this.config.boardSize)
        yarr.push(y1-this.config.boardSize);
      if (y1<this.config.boardSizeDQ-this.config.boardSize)
        yarr.push(y1+this.config.boardSize);

      for(var i=0; i<xarr.length; i++)
        for(var j=0; j<yarr.length; j++){
          //console.log(xarr[i]+","+yarr[j]);
          stones.push([xarr[i],yarr[j]]);
        }
      return stones;
    },
  
    mapToPoints: function(x,y,func){
      var stones = this.mapToPoints_(x,y);
      for(var i=0; i<stones.length; i++){
        var stone = stones[i];
        func(stone[0],stone[1]);
      }
      return this;
    },
  
    getStoneId: function(x,y){
      return this.id+"_point_"+x+"-"+y;
    },
  
    createStone: function(x,y,color,moveNumber){
      var styleClass = "";
      if (this.config.gameType == jsGameViewer.DAOQI){
        if (color == jsGameViewer.model.STONE_BLACK)
          styleClass = "gvsprite-19-black";
        else if (color == jsGameViewer.model.STONE_WHITE)
          styleClass = "gvsprite-19-white";
        else
          return null;
      } else {
        if (color == jsGameViewer.model.STONE_BLACK)
          styleClass = "gvsprite-21-black";
        else if (color == jsGameViewer.model.STONE_WHITE)
          styleClass = "gvsprite-21-white";
        else
          return null;
      }
      var s = "<div id='" + this.getStoneId(x,y) + "' class='" + styleClass + "' style='position:absolute;left:";
      a = this.xyToArea(x,y);
      s += a[0] + "px;top:" + a[1] + "px;'>";
      if (this.config.showMoveNumber && moveNumber > 0){     
        // http://www.jakpsatweb.cz/css/css-vertical-center-solution.html
        var colorS = "white";
        if (color == jsGameViewer.model.STONE_WHITE)
          colorS = "black";
        var fontSize = "medium";
        var left = 0;
        if (moveNumber >= 10 && moveNumber < 100){
          fontSize = "small";
        }else if (moveNumber >= 100){
          fontSize = "x-small";
          left = 1;
        }
        s += "<div style='display:table;width:"+a[2]+"px;height:"+a[3]+"px;#position:relative;overflow:hidden;'><div style='display:table-cell;vertical-align:middle;#position:absolute;#top:50%;'>"
          +"<div style='#position:relative;left:"+left+"px;width:100%;#top:-50%;text-align:center;color:"+colorS+";font-family:times;font-size:"+fontSize+";'>"+moveNumber+"</div></div></div>";
      } else {
        s += "&nbsp;";
      }
      s += "</div>";
      return s;
    },
  
    addStone: function(x,y,color){
      var _this = this;
      var moveNumber = 0;
      if (this.config.showMoveNumber){
        moveNumber = this.gameState.getMoveNumber(x,y);
      }
      if (this.config.gameType == jsGameViewer.DAOQI){
        this.mapToPoints(x,y,function(x,y){
          var s = _this.createStone(x,y,color,moveNumber);
          if (s != null){
            jQuery("#"+_this.id+"_boardPoints").append(s);
          }
        });
      } else {
        var s = this.createStone(x,y,color,moveNumber);
        if (s != null){
          jQuery("#"+this.id+"_boardPoints").append(s);
        }
      }
      return this;
    },
  
    /*
     * iterate through points
     * remove all
     * add those whose deleteFlag is not set
     */
    addRemoveStones: function(points){
      for(var i=0; i<points.length; i++){
        var point = points[i];
        this.removeStone(point.x,point.y);
        if (!point.deleteFlag){
          this.addStone(point.x, point.y, point.color);
        }
      }
      return this;
    },
  
    removeStone: function(x,y){
      var _this = this;
      if (this.config.gameType == jsGameViewer.DAOQI){
        this.mapToPoints(x,y,function(x,y){
          var stone = jQuery("#"+_this.getStoneId(x,y));
          stone.remove();
        });
      } else {
        var stone = jQuery("#"+this.getStoneId(x,y));
        stone.remove();
      }
      return this;
    },
  
    /*
     * remove all stones on the board
     */
    removeAllStones: function(){
      jQuery("#"+this.id+"_boardPoints").children().remove();
      return this;
    },
  
    setNextPlayer: function(color){
      var s = "";
      if (color == jsGameViewer.model.STONE_BLACK)
        s += "&#40657;";
      else if (color == jsGameViewer.model.STONE_WHITE)
        s += "&#30333;";
      jQuery("#"+this.id+"_nextPlayer").empty().append(s);
      return this;
    },
  
    setMoveNumber: function(moveNumber){
      if (moveNumber == 0)
        moveNumber = "0";
      jQuery("#"+this.id+"_curMove").empty().append(moveNumber);
      return this;
    },
  
    setMoveMark: function(x,y){
      var _this = this;
      if (this.config.gameType == jsGameViewer.DAOQI){
        jQuery("#"+this.id+"_moveMarks").empty();
        this.mapToPoints(x,y,function(x,y){
          var area = _this.xyToArea(x,y);
          jQuery("#"+_this.id+"_moveMarks").append("<div class='gvsprite-19-markmove' style='position:absolute;left:"+
            area[0]+"px;top:"+area[1]+"px;width:"+area[2]+"px;height:"+area[3]+"px'>&nbsp;</div>");
        });
      } else {
        jQuery("#"+this.id+"_moveMark").css({position: "absolute", left:x*this.config.gridSize, top:y*this.config.gridSize, width:this.config.gridSize, height:this.config.gridSize});
      }
      return this;
    },
  
    removeMoveMark: function(){
      if (this.config.gameType == jsGameViewer.DAOQI){
        jQuery("#"+this.id+"_moveMarks").empty();
      } else {
        jQuery("#"+this.id+"_moveMark").css({width:0, height:0});
      }
      return this;
    },
  
    setMarks: function(marks){
      var _this = this;
      jQuery("#"+this.id+"_boardMarks").empty();
      if (marks == undefined || marks == null)
        return this;
      if (this.config.gameType == jsGameViewer.DAOQI){
        for (var i=0; i<marks.length; i++){
          var mark = marks[i];
          var x = mark[0], y = mark[1];
          var color = this.gameState.board[x][y];
          var styleClass = "";
          switch(mark[2]){
            case MARK_CROSS:
              styleClass = "gvsprite-19-markcross";
              break;
            case MARK_TRIANGLE:
              styleClass = "gvsprite-19-marktriangle";
              break;
            case MARK_SQUARE:
              styleClass = "gvsprite-19-marksquare";
              break;
            case MARK_CIRCLE:
              styleClass = "gvsprite-19-markcircle";
              break;
            case MARK_TERR_BLACK:
              styleClass = "gvsprite-19-markblack";
              break;
            case MARK_TERR_WHITE:
              styleClass = "gvsprite-19-markwhite";
              break;
            case MARK_TEXT:
              this.mapToPoints(x,y,function(x,y){
                var area = _this.xyToArea(x,y);
                var left = area[0], top = area[1], width = area[2], height = area[3];
                var s = "<div style='position:absolute;left:"+left+"px;top:"+top+"px;width:"+width+"px;height:"+height+"px;text-align:center;vertical-align:middle;color:red;font-family:Nina;font-weight:bolder;font-size:14px;";
                if (color == STONE_NONE){
                  if (_this.isInCentralArea(x,y)){
                    s += "background-color:"+_this.config.boardColorDQ+";";
                  } else {
                    s += "background-color:"+_this.config.boardColor+";";
                  }
                }
                s += "'>"+mark[3]+"</div>";
                jQuery("#"+_this.id+"_boardMarks").append(s);
              });
              continue;
          }
          this.mapToPoints(x,y,function(x,y){
            var area = _this.xyToArea(x,y);
            var left = area[0], top = area[1], width = area[2], height = area[3];
            var s = "<div class='"+styleClass+"' style='position:absolute;left:"+left+"px;top:"+top+"px;";
            if (color == STONE_NONE){
              if (_this.isInCentralArea(x,y)){
                s += "background-color:"+_this.config.boardColorDQ+";";
              } else {
                s += "background-color:"+_this.config.boardColor+";";
              }
            }
            s += "'></div>";
            jQuery("#"+_this.id+"_boardMarks").append(s);
          });
        }
      } else {
        for (var i=0; i<marks.length; i++){
          var mark = marks[i];
          var x = mark[0], y = mark[1];
          var color = this.gameState.board[x][y];
          var area = this.xyToArea(x,y);
          var left = area[0], top = area[1], width = area[2], height = area[3];
          var styleClass = "";
          switch(mark[2]){
            case MARK_CROSS:
              styleClass = "gvsprite-21-markcross";
              break;
            case MARK_TRIANGLE:
              styleClass = "gvsprite-21-marktriangle";
              break;
            case MARK_SQUARE:
              styleClass = "gvsprite-21-marksquare";
              break;
            case MARK_CIRCLE:
              styleClass = "gvsprite-21-markcircle";
              break;
            case MARK_TERR_BLACK:
              styleClass = "gvsprite-21-markblack";
              break;
            case MARK_TERR_WHITE:
              styleClass = "gvsprite-21-markwhite";
              break;
            case MARK_TEXT:
              var s = "<div style='position:absolute;left:"+left+"px;top:"+top+"px;width:"+width+"px;height:"+height+"px;text-align:center;vertical-align:middle;color:red;font-family:Nina;font-weight:bolder;font-size:15px;";
              if (color == STONE_NONE){
                s += "background-color:"+this.config.boardColor+";";
              }
              s += "'>"+mark[3]+"</div>";
              jQuery("#"+this.id+"_boardMarks").append(s);
              continue;
          }
          var s = "<div class='"+styleClass+"' style='position:absolute;left:"+left+"px;top:"+top+"px;";
          if (color == STONE_NONE){
            s += "background-color:"+this.config.boardColor+";";
          }
          s += "'></div>";
          jQuery("#"+this.id+"_boardMarks").append(s);
        }
      }
      return this;
    },

    setPrisoners: function(b, w){
      if (b == 0)
        b = "0";
      if (w == 0)
        w = "0";
      jQuery("#"+this.id+"_blackPrisoners").empty().append(b);
      jQuery("#"+this.id+"_whitePrisoners").empty().append(w);
      return this;
    },
  
    setBranches: function(){
      var _this = this;
      jQuery("#"+this.id+"_boardBranches").empty();
      jQuery("#"+this.id+"_branches").empty();
      jQuery("#"+this.id+"_branches").css({height:0});
      var node = this.gameState.currentNode;
      if (node.hasChildren() && node.children.length >= 2){
        var n = node.children.length;
        for(var i=0; i<node.children.length; i++){
          var title = "";
          if (i == 0){
            title = "&#20998;&#25903;A = &#23454;&#25112; [Alt Shift &#8594;][Alt Shift A]";
          } else {
            if (i < BRANCHES.length){
              var branchName = BRANCHES[i];
              title = "&#20998;&#25903;" + branchName + "[Alt Shift " + branchName + "]";
            }
          }
          var s = "<div class='gvtb-branch gvbutton'><a href='#' title='" + title + "' onclick='jsGameViewer."+this.id+".goToBranch("+i+");return false;'>"+BRANCHES[i]+"</a></div>";
          jQuery("#"+this.id+"_branches").append(s);
          jQuery("#"+this.id+"_branches").css({height:n*23});
          var child = node.children[i];
          if (child.type == jsGameViewer.model.NODE_MOVE){
            var x = child.x, y = child.y;
            if (this.config.gameType == jsGameViewer.DAOQI){
              this.mapToPoints(x,y,function(x,y){
                var styleClass = "gvbranch";
                if (_this.isInCentralArea(x,y))
                  styleClass = "gvbranch-real";
                var area = _this.xyToArea(x,y);
                jQuery("#"+_this.id+"_boardBranches").append("<div class='"+styleClass+"' style='left:"+area[0]+"px;top:"+area[1]
                  +"px;width:"+area[2]+"px;height:"+area[3]+"px;'>"+BRANCHES[i]+"</div>");              
              });
            } else {
              var area = _this.xyToArea(x,y);
              jQuery("#"+_this.id+"_boardBranches").append("<div class='gvbranch' style='left:"+area[0]+"px;top:"+area[1]
                +"px;width:"+area[2]+"px;height:"+area[3]+"px;'>"+BRANCHES[i]+"</div>");
            }
          }
        }
      }
      return this;
    },
  
    removeBranches: function(){
      jQuery("#"+this.id+"_boardBranches").empty();
      jQuery("#"+this.id+"_branches").empty();
      jQuery("#"+this.id+"_branches").css({height: 0});
      return this;
    },
  
    setComment: function(comment){
      var node = this.gameState.currentNode;
      if (!comment){
        comment = "<strong>";
        if (node.depth > 1)
          comment += "&#20998;&#25903;";
        comment += "&#31532;"+node.moveNumber+"&#25163;&#35780;&#35770;</strong>";
        if (node.comment != undefined && node.comment != null)
          comment += "<br/>"+node.comment.replace(/\n/g, "<br/>\n");
      }
      jQuery("#"+this.id+"_comment").empty().append(comment);
      jQuery("#"+this.id+"_comment").height(this.rightPaneHeight - jQuery("#"+this.id+"_info").height()-12);
      return this;
    },
  
    removeComment: function(){
      jQuery("#"+this.id+"_comment").empty();
      return this;
    },
  
    redrawBoard: function(){
      var _this = this;
      var board = this.gameState.board;
      var s = "";
      if (this.config.gameType == jsGameViewer.DAOQI){
        for(var i=0; i<board.size; i++){
          for(var j=0; j<board.size; j++){
            var color = board[i][j];
            var moveNumber = 0;
            if (this.config.showMoveNumber){
              moveNumber = this.gameState.getMoveNumber(i,j);
            }
            if (color == jsGameViewer.model.STONE_BLACK || color == jsGameViewer.model.STONE_WHITE){
              this.mapToPoints(i,j,function(x,y){
                s += _this.createStone(x,y,color,moveNumber);
              });
            }
          }
        }
      } else {
        for(var i=0; i<board.size; i++){
          for(var j=0; j<board.size; j++){
            var color = board[i][j];
            var moveNumber = 0;
            if (this.config.showMoveNumber){
              moveNumber = this.gameState.getMoveNumber(i,j);
            }
            if (color == jsGameViewer.model.STONE_BLACK || color == jsGameViewer.model.STONE_WHITE){
              s += this.createStone(i,j,color,moveNumber);
            }
          }
        }
      }
      jQuery("#"+this.id+"_boardPoints").empty();
      if (s.length > 0)
        jQuery("#"+this.id+"_boardPoints").append(s);
      return this;
    },
  
    sendMove_: function(x,y){
      this.play(x,y);
      return this.sendMove();
    },
  
    play: function(x,y){
      if (this.gameState == null)
        return this;

      var _this = this;
      // check whether the position is occupied
      if (this.gameState.board[x][y] != 0){
        if (this.gameState.isFirst())
          return false;
        var points = new Array();
        var changed = false;
        for(;;){
          var node = this.gameState.currentNode;
          if (node.type == jsGameViewer.model.NODE_MOVE && node.x == x && node.y == y)
            break;
          if (!this.back_(points))
            break;
          changed = true;
        }
        if (changed){
          jQuery.each(points, function(i,point){
            _this.removeStone(point.x,point.y);
            if (point.deleteFlag){
              _this.addStone(point.x, point.y, point.color);
            }
          });
          this.setGameState();
          return true;
        }
        return false;
      }
    
      // check whether (x,y) is the same as next move/branches
      if (!this.gameState.isLast()){
        var children = this.gameState.currentNode.children;
        for(var i=0; i<children.length; i++){
          var node = children[i];
          if (node.type == jsGameViewer.model.NODE_MOVE && node.x == x && node.y == y){
            return this.goToBranch(i);
          }
        }
      }

      if (this.gameState.play(x,y)){
        var node = this.gameState.currentNode;
        jQuery.each(node.points, function(i,point){
          _this.removeStone(point.x,point.y);
          if (!point.deleteFlag){
            _this.addStone(point.x, point.y, point.color);
          }
        });
        this.setGameState();
        return true;
      } else {
        return false;
      }
    },
  
    remove: function(){
      var _this = this;
      if (this.gameState != null && this.gameState.canRemove()){
        var node = this.gameState.currentNode;
        jQuery.each(node.points, function(i,point){
          _this.removeStone(point.x,point.y);
          if (point.deleteFlag){
            _this.addStone(point.x, point.y, point.color);
          }
        });
        this.gameState.remove();
        this.setGameState();
      }
      return this;
    },

    back_: function(points){
      if (this.gameState.isFirst())
        return false;
      var node = this.gameState.currentNode;
      // before
      for (var i=0; i<node.points.length; i++){
        var point = node.points[i];
        var found = false;
        for(var j=0; j<points.length; j++){
          var p = points[j];
          if (point.x == p.x && point.y == p.y){
            found = true;
            points[j] = point;
            break;
          }
        }
        if (!found){
          points.push(point);
        }
      }
      this.gameState.back();
      // after
      return true;
    },
  
    back: function(){
      if (this.gameState == null)
        return this;
      if (this.gameState.isFirst())
        return false;
      var _this = this;
      var node = this.gameState.currentNode;
      jQuery.each(node.points, function(i,point){
        _this.removeStone(point.x,point.y);
        if (point.deleteFlag){
          _this.addStone(point.x, point.y, point.color);
        }
      });
      this.gameState.back();
      this.setGameState();
      return true;
    },
  
    backN: function(n){
      if (this.gameState == null)
        return this;
      var _this = this;
      if (n == undefined)
        n = this.config.fastMode;
      var points = new Array();
      var changed = false;
      for(var i=0; i<n; i++){
        if (!this.back_(points))
          break;
        changed = true;
      }
      if (changed){
        jQuery.each(points, function(i,point){
          _this.removeStone(point.x,point.y);
          if (point.deleteFlag){
            _this.addStone(point.x, point.y, point.color);
          }
        });
        this.setGameState();
      }
      return this;
    },
  
    backToComment: function(){
      if (this.gameState == null)
        return this;
      var _this = this;
      var points = new Array();
      var changed = false;
      for(;;){
        if (!this.back_(points))
          break;
        changed = true;
        // stop at move that has comments or branches
        var node = this.gameState.currentNode;
        if (node.hasComment() || node.hasBranches())
          break;
      }
      if (changed){
        jQuery.each(points, function(i,point){
          _this.removeStone(point.x,point.y);
          if (point.deleteFlag){
            _this.addStone(point.x, point.y, point.color);
          }
        });
        this.setGameState();
      }
      return this;
    },
  
    backAll: function(){
      if (this.gameState == null)
        return this;
      var _this = this;
      this.removeAllStones();
      this.gameState.backAll();
      var node = this.gameState.currentNode;
      jQuery.each(node.points, function(i, point){
        if (point.color == jsGameViewer.model.STONE_BLACK || point.color == jsGameViewer.model.STONE_WHITE){
          _this.addStone(point.x,point.y,point.color);
        }
      });
      this.setGameState();
      return this;
    },

    forward_: function(points){
      if (this.gameState.isLast())
        return false;
      this.gameState.forward();
      var node = this.gameState.currentNode;
      for (var i=0; i<node.points.length; i++){
        var point = node.points[i];
        var found = false;
        for(var j=0; j<points.length; j++){
          var p = points[j];
          if (point.x == p.x && point.y == p.y){
            found = true;
            points[j] = point;
            break;
          }
        }
        if (!found){
          points.push(point);
        }
      }
      return true;
    },
  
    forward: function(){
      if (this.gameState == null)
        return this;
      if (!this.gameState.forward())
        return false;
      var _this = this;
      var node = this.gameState.currentNode;
      jQuery.each(node.points, function(i,point){
        _this.removeStone(point.x,point.y);
        if (!point.deleteFlag){
          _this.addStone(point.x, point.y, point.color);
        }
      });
      this.setGameState();
      return true;
    },
  
    forwardN: function(n){
      if (this.gameState == null)
        return this;
      var _this = this;
      if (n == undefined)
        n = this.config.fastMode;
      var points = new Array();
      var changed = false;
      for(var i=0; i<n; i++){
        if (!this.forward_(points))
          break;
        changed = true;
      }
      if (changed){
        jQuery.each(points, function(i,point){
          _this.removeStone(point.x,point.y);
          if (!point.deleteFlag){
            _this.addStone(point.x, point.y, point.color);
          }
        });
        this.setGameState();
      }
      return this;
    },
  
    forwardToComment: function(){
      if (this.gameState == null)
        return this;
      var _this = this;
      var points = new Array();
      var changed = false;
      for(;;){
        if (!this.forward_(points))
          break;
        changed = true;
        // stop at move that has comments or branches
        var node = this.gameState.currentNode;
        if (node.hasComment() || node.hasBranches())
          break;
      }
      if (changed){
        jQuery.each(points, function(i,point){
          _this.removeStone(point.x,point.y);
          if (!point.deleteFlag){
            _this.addStone(point.x, point.y, point.color);
          }
        });
        this.setGameState();
      }
      return this;
    },
  
    forwardAll: function(){
      if (this.gameState == null)
        return this;
      this.removeAllStones();
      this.gameState.forwardAll();
      this.redrawBoard();
      this.setGameState();
      return this;
    },
  
    goToBranch: function(n){
      if (this.gameState == null)
        return this;
      if (!this.gameState.goToBranch(n))
        return this;
      var _this = this;
      var node = this.gameState.currentNode;
      jQuery.each(node.points, function(i,point){
        _this.removeStone(point.x,point.y);
        if (!point.deleteFlag){
          _this.addStone(point.x, point.y, point.color);
        }
      });
      this.setGameState();
      return this;
    },
  
    goTo: function(n){
      if (this.gameState == null)
        return this;
      var _this = this;
      while (this.gameState.isOnBranch()){
        this.back();
      }
      if (n >= this.gameState.game.getMoves()){
        this.forwardAll();
      } else if (n <= 0) {
        this.backAll();
      } else if (n > this.gameState.currentNode.moveNumber) {
        var points = new Array();
        var changed = false;
        while(n > this.gameState.currentNode.moveNumber){
          if (!this.forward_(points))
            break;
          changed = true;
        }
        if (changed){
          jQuery.each(points, function(i,point){
            _this.removeStone(point.x,point.y);
            if (!point.deleteFlag){
              _this.addStone(point.x, point.y, point.color);
            }
          });
          this.setGameState();
        }
      } else if (n < this.gameState.currentNode.moveNumber) {
        var points = new Array();
        var changed = false;
        while(n < this.gameState.currentNode.moveNumber){
          if (!this.back_(points))
            break;
          changed = true;
        }
        if (changed){
          jQuery.each(points, function(i,point){
            _this.removeStone(point.x,point.y);
            if (point.deleteFlag){
              _this.addStone(point.x, point.y, point.color);
            }
          });
          this.setGameState();
        }
      }
      return this;
    },
  
    setToggleNumberImg: function(){
      if (this.config.showMoveNumber){
        jQuery("#"+this.id+"_toggleNumberImg").removeClass("gvsprite-hidenumber");
        jQuery("#"+this.id+"_toggleNumberImg").addClass("gvsprite-shownumber");
      } else {
        jQuery("#"+this.id+"_toggleNumberImg").removeClass("gvsprite-shownumber");
        jQuery("#"+this.id+"_toggleNumberImg").addClass("gvsprite-hidenumber");
      }
      return this;
    },
  
    toggleNumber: function(){
      if (this.config.showMoveNumber){
        this.config.showMoveNumber = false;
      } else {
        this.config.showMoveNumber = true;
      }
      this.setToggleNumberImg();
      if (this.gameState == null)
        return this;
      this.redrawBoard();
      return this;
    },
  
    showNumber: function(){
      if (this.config.hideMoveNumber){
        this.toggleNumber();
      }
      return this;
    },
  
    hideNumber: function(){
      if (this.config.showMoveNumber){
        this.toggleNumber();
      }
      return this;
    },
  
    eventToXY: function(e){
      e = e || window.event;
      if (e.layerX == undefined)
        e.layerX = e.offsetX;
      if (e.layerY == undefined)
        e.layerY = e.offsetY;
      var x = parseInt(e.layerX/this.config.gridSize);
      var y = parseInt(e.layerY/this.config.gridSize);
      if (this.config.gameType == jsGameViewer.DAOQI){
        x = (x+this.config.boardSize-this.config.x0)%this.config.boardSize;
        y = (y+this.config.boardSize-this.config.y0)%this.config.boardSize;
      }
      return [x,y];
    },
  
    isInCentralArea: function(x,y){
      return x >= this.config.vbw && x < this.config.boardSize+this.config.vbw && y >= this.config.vbw && y < this.config.boardSize+this.config.vbw;
    },
  
    xyToArea: function(x,y){
      return [x*this.config.gridSize, y*this.config.gridSize, this.config.gridSize, this.config.gridSize];
    },
  
    xyToLabel: function(x,y){
      var s = LABELS[x];
      s += this.config.boardSize - parseInt(y);
      return s;
    },
  
    postThickBoxFix: function(){
      this.registerKeyListener();
    },

    goToPopup: function(){
      var url = "#TB_inline?test=0&width=250&height=56&inlineId="+this.id+"_goTo&focus="+this.id+"_goToInput&modal=true&test1=0";
      tb_show("",url,null);
    },
  
    goToOkHandler: function(){
      try {
        var input = document.getElementsByName(this.id+"_goToForm")[1].goToInput.value;
        tb_remove();
        var moveNumber = parseInt(input);
        this.goTo(moveNumber);
      }
      catch(e){
        throw "GameController().goToOkHandler(): " + e;
      }
      this.postThickBoxFix();
    },
  
    goToKeyDown:function(input, e){
      var keyCode;
      if (window.event)
        keyCode = window.event.keyCode;
      else if (e)
        keyCode = e.which;
      else
        return;
  
      if (keyCode == 13){
        gvGoToInput = input.value;
        this.goToOkHandler();
      } else if (keyCode == 27){
        tb_remove();
        this.postThickBoxFix();
      } 
    }
  };
}());