// Default view configuration
jq4gv.extend(jsGameViewer.CONFIG, {
  //showCalibrate: true,
  showStoneShadow: true,
  fastMode: 5
});

jq4gv.extend(jsGameViewer.GameController.prototype, function(){
  'use strict';

  var LABELS = ['A','B','C','D','E','F','G','H','J','K','L','M','N','O','P','Q','R','S','T'];
  var BRANCHES = ['A','B','C','D','E','F','G','H','I','J'];
  var BRANCHES_NAME = [jsgvTranslations['trunk'],
    jsgvTranslations['branch_1'], jsgvTranslations['branch_2'], jsgvTranslations['branch_3'],
    jsgvTranslations['branch_4'], jsgvTranslations['branch_5'], jsgvTranslations['branch_6'],
    jsgvTranslations['branch_7'], jsgvTranslations['branch_8'], jsgvTranslations['branch_9']
  ];

  var VIEW = "\
    <div class='gameviewer'>\
      <div class='toolbar'>\
        <div class='tb-item angledView'><a class='toggle-opacity' href='javascript: void(0)'><img class='sprite-angledView' src='http://gcao.github.io/jsgameviewer/view4/images/default.gif'></a></div>\
        <div class='tb-item topView'><a class='toggle-opacity' href='javascript: void(0)'><img class='sprite-topView' src='http://gcao.github.io/jsgameviewer/view4/images/default.gif'></a></div>\
        <div class='tb-item backAll'><a class='toggle-opacity' href='javascript: void(0)'><img class='sprite-backall' src='http://gcao.github.io/jsgameviewer/view4/images/default.gif'></a></div>\
        <div class='tb-item backToComment'><a class='toggle-opacity' href='javascript: void(0)'><img class='sprite-backc' src='http://gcao.github.io/jsgameviewer/view4/images/default.gif'></a></div>\
        <div class='tb-item backN'><a class='toggle-opacity' href='javascript: void(0)'><img class='sprite-backn' src='http://gcao.github.io/jsgameviewer/view4/images/default.gif'></a></div>\
        <div class='tb-item back'><a class='toggle-opacity' href='javascript: void(0)'><img class='sprite-back' src='http://gcao.github.io/jsgameviewer/view4/images/default.gif'></a></div>\
        <div class='tb-item goTo'><div class='move-number'>0</div></div>\
        <div class='tb-item forward'><a class='toggle-opacity' href='javascript: void(0)'><img class='sprite-forward' src='http://gcao.github.io/jsgameviewer/view4/images/default.gif'></a></div>\
        <div class='tb-item forwardN'><a class='toggle-opacity' href='javascript: void(0)'><img class='sprite-forwardn' src='http://gcao.github.io/jsgameviewer/view4/images/default.gif'></a></div>\
        <div class='tb-item forwardToComment'><a class='toggle-opacity' href='javascript: void(0)'><img class='sprite-forwardc' src='http://gcao.github.io/jsgameviewer/view4/images/default.gif'></a></div>\
        <div class='tb-item forwardAll'><a class='toggle-opacity' href='javascript: void(0)'><img class='sprite-forwardall' src='http://gcao.github.io/jsgameviewer/view4/images/default.gif'></a></div>\
      </div>\
      <div class='info'>\
        <div class='time'></div>\
        <div class='name'></div>\
        <div class='white-player'></div>\
        <div class='player-images'>\
          <div class='white'><img src='http://gcao.github.io/jsgameviewer/view4/images/15/white.gif'/></div>\
          <div class='vs'>-</div>\
          <div class='black'><img src='http://gcao.github.io/jsgameviewer/view4/images/15/black.gif'/></div>\
        </div>\
        <div class='black-player'></div>\
        <div class='moves'></div>\
        <div class='result'></div>\
      </div>\
      <div class='comment-container' align='center'>\
        <div class='sub-container'>\
          <span class='branches'></span>\
          <span class='comment'></span>\
        </div>\
      </div>\
      <div class='board'></div>\
    </div>\
  "

  var BOARD = {
    width: 84,
    height: 84,
    thickness: 4,
    grid: 4,
    border: 3.5, // Border thickness
    x: -2,
    y: 0,
    z: -2 + 5,
    markY: 0.01
  };

  BOARD.centerX = BOARD.x + BOARD.width / 2;
  BOARD.centerY = 0;
  BOARD.centerZ = BOARD.z + BOARD.height / 2;

  var LABEL = {
    color: 0x444444,
    fontSize: 2
  };

  var STONE = {
    scale: 6.25,
    shadowSize: 4.55,
    y: 0.5
  };

  var MOVE_MARK = {
    color: 0xcc0000,
    size: 0.6,
    y: 1.09
  }

  // http://learningthreejs.com/data/THREEx/docs/THREEx.GeometryUtils.html
  /**
   * Change the scale of a geometry
   *
   * To make the geometry twice larger in y
   * var v = new THREE.Vector3(1,2,1);
   * scale(geometry, v);
   *
   * @params {THREE.Geometry} geometry the geometry to compute on
   * @params {THREE.Vector3} scale the middlepoint of the geometry
   */
  function scale(geometry, scale) {
    for (var i = 0; i < geometry.vertices.length; i++) {
      var vertex = geometry.vertices[i];
      vertex.multiply(scale);
    }

    return geometry;
  }

  /**
   * Converts the board position to 3D world position.
   * @param {Array} pos The board position.
   * @returns {THREE.Vector3}
   */
  function boardToWorld(i, j) {
    var x = (i + 1) * BOARD.grid;
    var z = (19 - j) * BOARD.grid;

    return new THREE.Vector3(x, 0, z);
  }

  return {
    initView: function(){
      var self = this;
      this.container = jq4gv(this.jqId);
      this.container.css('width', '100%').css('height', '100%');
      this.container.get(0).innerHTML = VIEW;
      this.container.show();
      this.boardContainer = this.container.find('.board').get(0);

      jq4gv('.toolbar .angledView').click(this.angledView.bind(this));
      jq4gv('.toolbar .topView').click(this.topView.bind(this));
      jq4gv('.toolbar .backAll').click(this.backAll.bind(this));
      jq4gv('.toolbar .backToComment').click(this.backToComment.bind(this));
      jq4gv('.toolbar .backN').click(this.backN.bind(this));
      jq4gv('.toolbar .back').click(this.back.bind(this));
      jq4gv('.toolbar .goTo').click(this.goTo.bind(this));
      jq4gv('.toolbar .forward').click(this.forward.bind(this));
      jq4gv('.toolbar .forwardN').click(this.forwardN.bind(this));
      jq4gv('.toolbar .forwardToComment').click(this.forwardToComment.bind(this));
      jq4gv('.toolbar .forwardAll').click(this.forwardAll.bind(this));
      this.registerKeyListener();

      /** @type THREE.WebGLRenderer */
      this.renderer = null;

      /** @type THREE.Scene */
      this.scene = null;

      /** @type THREE.PerspectiveCamera */
      this.camera = null;

      /** @type THREE.OrbitControls */
      this.cameraController = null;

      /** @type Object */
      this.lights = {};

      /** @type Object */
      this.materials = {};

      /** @type THREE.Geometry */
      this.pieceGeometry = null;

      /** @type THREE.Mesh */
      this.boardModel = null;

      /** @type THREE.Mesh */
      this.groundModel = null;

      /** @type THREE.Mesh */
      this.moveMark = null;

      /** @type [THREE.Mesh] */
      this.branchModels = [];

      /** @type [THREE.Mesh] */
      this.markModels = [];

      /**
       * The stones cache
       * @type Array
       */
      this.stonesCache = [];
      for (var i = 0; i < 19; i++) {
        this.stonesCache[i] = [];
        for (var j = 0; j < 19; j++) {
          this.stonesCache[i][j] = 0;
        }
      }

      this.drawBoard();
    },

    registerKeyListener: function(){
      var _this = this;
      //for(var i=1; i<=jsGameViewer.length; i++){
      //  jsGameViewer[jsGameViewer.getGameId(i)].removeKeyListener();
      //}
      //jq4gv(this.jqId+"_bannerbg").css("background-color",this.config.activeBackground);
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
          case 38: // up
            _this.back();
            return;
          case 39: // right
          case 40: // down
            _this.forward();
            return;
          case 36: // home
            _this.backAll();
            return;
          case 35: // end
            _this.forwardAll();
            return;
          case 219:
            if (e.shiftKey) { // {
              _this.backToComment();
            } else { // [
              _this.backN();
            }
            return;
          case 221:
            if (e.shiftKey) { // }
              _this.forwardToComment();
            } else { // ]
              _this.forwardN();
            }
            return;
          case 71: // g
            _this.goTo();
            return;
          case 46: // delete
            _this.remove();
            return;
          default: // 0: 48, 9: 57
            if (keyCode >= 48 && keyCode <= 57){
              _this.goToBranch(keyCode - 48);
            }
        }

        //if (e.altKey && e.shiftKey){
        //  switch (keyCode) {
        //    case 71: // g
        //      _this.goTo();
        //      setTimeout("jsGameViewer."+_this.id+".goToPopup()",100);
        //      break;
        //    case 77: // m
        //      _this.toggleNumber();
        //      break;
        //    case 82: // r
        //      _this.refresh();
        //      break;
        //    default: // a: 65, z: 90
        //      if (keyCode >= 65 && keyCode <= 90){
        //        _this.goToBranch(keyCode - 65);
        //      }
        //  }
        //}
      };
      return this;
    },

    /* reset view to beginning of a game
     */
    initGame: function(){
      this.removeAllStones();
      this.setGameInfo();
      this.setGameState();
      this.addRemoveStones(this.gameState.currentNode.points);
    },

    setGameState: function(){
      var node = this.gameState.currentNode;
      //this.setNextPlayer(this.gameState.getNextPlayer());
      this.setMoveNumber(node.moveNumber);
      //this.setPrisoners(this.gameState.blackPrisoners, this.gameState.whitePrisoners);
      if (node.type == jsGameViewer.model.NODE_MOVE)
        this.setMoveMark(node.x, node.y);
      else
        this.removeMoveMark();
      this.setMarks(node.marks);
      this.setBranches();
      this.setComment();
      //return this;
    },

    setGameInfo: function(){
      //// show/hide resign button
      //if (this.isMyTurn() && !this.game.isFinished()){
      //  jq4gv(this.jqId + "_resign").show();
      //} else {
      //  jq4gv(this.jqId + "_resign").hide();
      //}
      //var infoNode = jq4gv(this.jqId + "_info").empty();
      var game = this.game;
      if (game == undefined || game == null)
        return this;
      if (jsGameViewer.notNull(game.name)){
        this.container.find('.name').empty().append(jq4gv.trim(game.name));
      //  infoNode.append("<div align='center' style='font-weight:bold'>"+jq4gv.trim(game.name)+"</div>");
      }
      if (jsGameViewer.notNull(game.date)){
        this.container.find('.time').empty().append(jq4gv.trim(game.date));
      //  infoNode.append("<div>"+jsgvTranslations['time']+": "+jq4gv.trim(game.date)+"</div>");
      }
      //if (jsGameViewer.notNull(game.place)){
      //  infoNode.append("<div>"+jsgvTranslations['place']+": "+jq4gv.trim(game.place)+"</div>");
      //}
      //var playFirst = "&nbsp;&#8592; "+jsgvTranslations['play_first'];
      //// black player name + rank
      //var blackRank = "";
      //if (jsGameViewer.notNull(game.blackRank))
      //  blackRank = "&nbsp;("+game.blackRank+")";
      //var blackPlayer = "<div>"+jsgvTranslations['black']+": <strong>"+jq4gv.trim(game.blackName)+"</strong>"+blackRank;
      //if (game.getFirstPlayer() == jsGameViewer.model.STONE_BLACK)
      //  blackPlayer += playFirst;
      //blackPlayer += "</div>";
      //infoNode.append(blackPlayer);
      //// white player name + rank
      //var whiteRank = "";
      //if (jsGameViewer.notNull(game.whiteRank))
      //  whiteRank = "&nbsp;("+game.whiteRank+")";
      //var whitePlayer = "<div>"+jsgvTranslations['white']+": <strong>"+jq4gv.trim(game.whiteName)+"</strong>"+whiteRank;
      //if (game.getFirstPlayer() == jsGameViewer.model.STONE_WHITE)
      //  whitePlayer += playFirst;
      //whitePlayer += "</div>";
      //infoNode.append(whitePlayer);
      var blackRank = "";
      if (jsGameViewer.notNull(game.blackRank))
        blackRank = "&nbsp;("+game.blackRank+")";
      var blackPlayer = "<strong>"+jq4gv.trim(game.blackName)+"</strong>"+blackRank;
      this.container.find('.black-player').empty().append(blackPlayer);
      var whiteRank = "";
      if (jsGameViewer.notNull(game.whiteRank))
        whiteRank = "&nbsp;("+game.whiteRank+")";
      var whitePlayer = "<strong>"+jq4gv.trim(game.whiteName)+"</strong>"+whiteRank;
      this.container.find('.white-player').empty().append(whitePlayer);
      //if (game.handicap > 0){
      //  infoNode.append("<div>"+jsgvTranslations['handicap']+": "+game.handicap+"</div>");
      //} else {
      //  infoNode.append("<div>"+jsgvTranslations['rule']+": "+jq4gv.trim(game.rule)+"</div>");
      //  infoNode.append("<div>"+jsgvTranslations['komi']+": "+game.komi+"</div>");
      //}
      //infoNode.append("<div>"+jsgvTranslations['moves']+": "+game.getMoves()+"</div>");
      //infoNode.append("<div>"+jsgvTranslations['result']+": "+jq4gv.trim(game.result)+"</div>");
      this.container.find('.result').empty().append(jq4gv.trim(game.result));
      this.container.find('.moves').empty().append(game.getMoves());
      return this;
    },

    setMoveNumber: function(moveNumber){
      if (moveNumber == 0)
        moveNumber = "0";
      this.container.find(".move-number").empty().append(moveNumber);
      //return this;
    },

    setMoveMark: function(i, j){
      this.removeMoveMark();

      var p = boardToWorld(i, j);
      this.moveMark.position.set(p.x, MOVE_MARK.y, p.z);
      this.scene.add(this.moveMark);

      //var _this = this;
      //if (this.config.gameType == jsGameViewer.DAOQI){
      //  jq4gv(this.jqId+"_moveMarks").empty();
      //  this.mapToPoints(x,y,function(x,y){
      //    var area = _this.xyToArea(x,y);
      //    jq4gv(_this.jqId+"_moveMarks").append("<div class='gvsprite-19-markmove' style='position:absolute;left:"+
      //      area[0]+"px;top:"+area[1]+"px;width:"+area[2]+"px;height:"+area[3]+"px'>&nbsp;</div>");
      //  });
      //} else {
      //  jq4gv(this.jqId+"_moveMark").css({position: "absolute", left:x*this.config.gridSize, top:y*this.config.gridSize, width:this.config.gridSize, height:this.config.gridSize});
      //}
      //return this;
    },

    removeMoveMark: function(){
      this.scene.remove(this.moveMark);
      //if (this.config.gameType == jsGameViewer.DAOQI){
      //  jq4gv(this.jqId+"_moveMarks").empty();
      //} else {
      //  jq4gv(this.jqId+"_moveMark").css({width:0, height:0});
      //}
      //return this;
    },

    setMarks: function(marks){
      if (this.markModels.length > 0) {
        for (var i = 0; i < this.markModels.length; i++) {
          this.scene.remove(this.markModels[i]);
        }
        this.markModels = [];
      }
      if (!marks)
        return;

      for (var i=0; i<marks.length; i++){
        var model = this.drawMark(marks[i]);
        if (model)
          this.markModels.push(model);
      }
      //var _this = this;
      //jq4gv(this.jqId+"_boardMarks").empty();
      //if (marks == undefined || marks == null)
      //  return this;
      //if (this.config.gameType == jsGameViewer.DAOQI){
      //  for (var i=0; i<marks.length; i++){
      //    var mark = marks[i];
      //    var x = mark[0], y = mark[1];
      //    var color = this.gameState.board[x][y];
      //    var styleClass = "";
      //    switch(mark[2]){
      //      case jsGameViewer.model.MARK_CROSS:
      //        styleClass = "gvsprite-19-markcross";
      //        break;
      //      case jsGameViewer.model.MARK_TRIANGLE:
      //        styleClass = "gvsprite-19-marktriangle";
      //        break;
      //      case jsGameViewer.model.MARK_SQUARE:
      //        styleClass = "gvsprite-19-marksquare";
      //        break;
      //      case jsGameViewer.model.MARK_CIRCLE:
      //        styleClass = "gvsprite-19-markcircle";
      //        break;
      //      case jsGameViewer.model.MARK_TERR_BLACK:
      //        styleClass = "gvsprite-19-markblack";
      //        break;
      //      case jsGameViewer.model.MARK_TERR_WHITE:
      //        styleClass = "gvsprite-19-markwhite";
      //        break;
      //      case jsGameViewer.model.MARK_TEXT:
      //        this.mapToPoints(x,y,function(x,y){
      //          var area = _this.xyToArea(x,y);
      //          var left = area[0], top = area[1], width = area[2], height = area[3];
      //          var s = "<div style='position:absolute;left:"+left+"px;top:"+top+"px;width:"+width+"px;height:"+height+"px;text-align:center;vertical-align:middle;color:red;font-family:Nina;font-weight:bolder;font-size:14px;";
      //          if (color == jsGameViewer.model.STONE_NONE){
      //            if (_this.isInCentralArea(x,y)){
      //              s += "background-color:"+_this.config.boardColorDQ+";";
      //            } else {
      //              s += "background-color:"+_this.config.boardColor+";";
      //            }
      //          }
      //          s += "'>"+mark[3]+"</div>";
      //          jq4gv(_this.jqId+"_boardMarks").append(s);
      //        });
      //        continue;
      //    }
      //    this.mapToPoints(x,y,function(x,y){
      //      var area = _this.xyToArea(x,y);
      //      var left = area[0], top = area[1], width = area[2], height = area[3];
      //      var s = "<div class='"+styleClass+"' style='position:absolute;left:"+left+"px;top:"+top+"px;";
      //      if (color == jsGameViewer.model.STONE_NONE){
      //        if (_this.isInCentralArea(x,y)){
      //          s += "background-color:"+_this.config.boardColorDQ+";";
      //        } else {
      //          s += "background-color:"+_this.config.boardColor+";";
      //        }
      //      }
      //      s += "'></div>";
      //      jq4gv(_this.jqId+"_boardMarks").append(s);
      //    });
      //  }
      //} else {
      //  for (var i=0; i<marks.length; i++){
      //    var color = this.gameState.board[x][y];
      //    var area = this.xyToArea(x,y);
      //    var left = area[0], top = area[1], width = area[2], height = area[3];
      //    var styleClass = "";
      //    switch(mark[2]){
      //      case jsGameViewer.model.MARK_CROSS:
      //        styleClass = "gvsprite-21-markcross";
      //        break;
      //      case jsGameViewer.model.MARK_TRIANGLE:
      //        styleClass = "gvsprite-21-marktriangle";
      //        break;
      //      case jsGameViewer.model.MARK_SQUARE:
      //        styleClass = "gvsprite-21-marksquare";
      //        break;
      //      case jsGameViewer.model.MARK_CIRCLE:
      //        styleClass = "gvsprite-21-markcircle";
      //        break;
      //      case jsGameViewer.model.MARK_TERR_BLACK:
      //        styleClass = "gvsprite-21-markblack";
      //        break;
      //      case jsGameViewer.model.MARK_TERR_WHITE:
      //        styleClass = "gvsprite-21-markwhite";
      //        break;
      //      case jsGameViewer.model.MARK_TEXT:
      //        var s = "<div style='position:absolute;left:"+left+"px;top:"+top+"px;width:"+width+"px;height:"+height+"px;text-align:center;vertical-align:middle;color:red;font-family:Nina;font-weight:bolder;font-size:15px;";
      //        if (color == jsGameViewer.model.STONE_NONE){
      //          s += "background-color:"+this.config.boardColor+";";
      //        }
      //        s += "'>"+mark[3]+"</div>";
      //        jq4gv(this.jqId+"_boardMarks").append(s);
      //        continue;
      //    }
      //    var s = "<div class='"+styleClass+"' style='position:absolute;left:"+left+"px;top:"+top+"px;";
      //    if (color == jsGameViewer.model.STONE_NONE){
      //      s += "background-color:"+this.config.boardColor+";";
      //    }
      //    s += "'></div>";
      //    jq4gv(this.jqId+"_boardMarks").append(s);
      //  }
      //}
      //return this;
    },

    setBranches: function(){
      this.container.find('.branches').empty();
      for (var i = 0; i < this.branchModels.length; i++) {
        this.scene.remove(this.branchModels[i]);
      }
      this.branchModels = [];
      //var _this = this;
      //jq4gv(this.jqId+"_boardBranches").empty();
      //jq4gv(this.jqId+"_branches").empty();
      //jq4gv(this.jqId+"_branches").css({height:0});
      var node = this.gameState.currentNode;
      if (node.hasChildren() && node.children.length >= 2){
        var branchesContainer = this.container.find('.branches');
        var n = node.children.length;
        var s = "";
        for(var i=0; i<node.children.length; i++){
          //var title = "";
          //if (i == 0){
          //  title = jsgvTranslations['branch']+" A = "+jsgvTranslations['trunk']+" [Alt Shift &#8594;][Alt Shift A]";
          //} else {
          //  if (i < BRANCHES.length){
          //    var branchName = BRANCHES[i];
          //    title = jsgvTranslations['branch']+" "+branchName + " [Alt Shift " + branchName + "]";
          //  }
          //}
          //var s = "<div class='gvtb-branch gvbutton'><a href='#' title='" + title + "' onclick='jsGameViewer."+this.id+".goToBranch("+i+");return false;'>"+BRANCHES[i]+"</a></div>";
          //jq4gv(this.jqId+"_branches").append(s);
          //jq4gv(this.jqId+"_branches").css({height:n*23});
          var child = node.children[i];
          if (child.type == jsGameViewer.model.NODE_MOVE){
            var x = child.x, y = child.y;
            var branchLabel = BRANCHES[i];
            for (var j=0; j<i; j++) {
              var c1 = node.children[j];
              if (x == c1.x && y == c1.y) {
                branchLabel = BRANCHES[j];
                break;
              }
            }
            var branchName = BRANCHES_NAME[i] + ':' + branchLabel;
            s += "<a class='branch' href='#' onclick='jsGameViewer."+this.id+".goToBranch("+i+");return false;'>"+branchName+"</a>&nbsp;&nbsp;&nbsp; ";
            var pos = boardToWorld(x, y);
            pos.y = BOARD.markY + 0.01;

            var textObj = this.drawText(branchLabel, {
              color: 0xffffff,
              x: pos.x - 0.6,
              y: pos.y,
              z: pos.z + 0.6
            });
            this.branchModels.push(textObj);
          //  if (this.config.gameType == jsGameViewer.DAOQI){
          //    this.mapToPoints(x,y,function(x,y){
          //      var styleClass = "gvbranch";
          //      if (_this.isInCentralArea(x,y))
          //        styleClass = "gvbranch-real";
          //      var area = _this.xyToArea(x,y);
          //      jq4gv(_this.jqId+"_boardBranches").append("<div class='"+styleClass+"' style='left:"+area[0]+"px;top:"+area[1]
          //        +"px;width:"+area[2]+"px;height:"+area[3]+"px;'>"+BRANCHES[i]+"</div>");
          //    });
          //  } else {
          //    var area = _this.xyToArea(x,y);
          //    jq4gv(_this.jqId+"_boardBranches").append("<div class='gvbranch' style='left:"+area[0]+"px;top:"+area[1]
          //      +"px;width:"+area[2]+"px;height:"+area[3]+"px;'>"+BRANCHES[i]+"</div>");
          //  }
          }
        }
        branchesContainer.append(s);
      }
      //return this;
    },

    setComment: function(comment){
      var node = this.gameState.currentNode;
      if (!comment && node.comment){
        comment = "<strong>";
        //if (node.depth > 1)
        //  comment += jsgvTranslations['branch_tag'];
        comment += jsgvTranslations['comment_for'].replace(/MOVE/,node.moveNumber)+": </strong> ";
        comment += node.comment.replace(/\n/g, "<br/>\n");
      }
      var commentContainer = this.container.find('.comment-container');
      commentContainer.css('left', 0);
      if (comment) {
        var s = "<span class='comment'>" + comment + "</span>";
        if (commentContainer.find('.comment').length > 0)
          commentContainer.find('.comment').replaceWith(s);
        else
          commentContainer.find('.sub-container').append(s);
      } else {
        commentContainer.find('.comment').replaceWith('');
      }

      var left = (this.container.get(0).offsetWidth - commentContainer.get(0).offsetWidth)/2;
      commentContainer.css('left', left);
      //jq4gv(this.jqId+"_comment").empty().append(comment);
      //jq4gv(this.jqId+"_comment").height(this.rightPaneHeight - jq4gv(this.jqId+"_info").height()-12);
      //return this;
    },

    removeAllStones: function(){
      var board = this.gameState.board;
      for(var i=0; i<board.size; i++){
        for(var j=0; j<board.size; j++){
          this.removeStone(i, j);
        }
      }
      //return this;
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
      //return this;
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

    forward: function() {
      if (!this.gameState || !this.gameState.forward())
        return false;
      var _this = this;
      var node = this.gameState.currentNode;
      jq4gv.each(node.points, function(i,point){
        _this.removeStone(point.x,point.y);
        if (!point.deleteFlag){
          _this.addStone(point.x, point.y, point.color);
        }
      });
      this.setGameState();
      return true;
    },

    forwardN: function(n) {
      var _this = this;
      if (n == undefined || typeof(n) !== 'number')
        n = this.config.fastMode;
      var points = new Array();
      var changed = false;
      for(var i=0; i<n; i++){
        if (!this.forward_(points))
          break;
        changed = true;
      }
      if (changed){
        jq4gv.each(points, function(i,point){
          _this.removeStone(point.x,point.y);
          if (!point.deleteFlag){
            _this.addStone(point.x, point.y, point.color);
          }
        });
        this.setGameState();
      }
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
        jq4gv.each(points, function(i,point){
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
      this.removeAllStones();
      this.gameState.forwardAll();
      this.redrawBoard();
      this.setGameState();
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
      if (!this.gameState || this.gameState.isFirst())
        return false;
      var _this = this;
      var node = this.gameState.currentNode;
      jq4gv.each(node.points, function(i,point){
        _this.removeStone(point.x,point.y);
        if (point.deleteFlag){
          _this.addStone(point.x, point.y, point.color);
        }
      });
      this.gameState.back();
      this.setGameState();
      return true;
    },

    backN: function(n) {
      if (this.gameState == null)
        return this;
      var _this = this;
      if (n == undefined || typeof(n) !== 'number')
        n = this.config.fastMode;
      var points = new Array();
      var changed = false;
      for(var i=0; i<n; i++){
        if (!this.back_(points))
          break;
        changed = true;
      }
      if (changed){
        jq4gv.each(points, function(i,point){
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
        jq4gv.each(points, function(i,point){
          _this.removeStone(point.x,point.y);
          if (point.deleteFlag){
            _this.addStone(point.x, point.y, point.color);
          }
        });
        this.setGameState();
      }
      return this;
    },

    backAll: function() {
      //if (this.gameState == null)
      //  return this;
      this.removeAllStones();
      this.gameState.backAll();
      this.redrawBoard();
      this.setGameState();
      //return this;
    },

    goToBranch: function(n){
      if (!this.gameState || !this.gameState.goToBranch(n))
        return this;
      var _this = this;
      var node = this.gameState.currentNode;
      jq4gv.each(node.points, function(i,point){
        _this.removeStone(point.x,point.y);
        if (!point.deleteFlag){
          _this.addStone(point.x, point.y, point.color);
        }
      });
      this.setGameState();
      return this;
    },

    goTo: function() {
      var s = prompt("Please enter the move number: ");
      var n = parseInt(s);
      if (n === NaN || n < 0) {
        alert("Not a valid move number.");
        return;
      }

      if (n == 0) {
        this.backAll();
      } else if (n < this.gameState.currentNode.moveNumber) {
        while (this.gameState.currentNode.moveNumber > n) {
          if (!this.back()) {
            break;
          }
        }
      } else if (n > this.gameState.currentNode.moveNumber) {
        while (this.gameState.currentNode.moveNumber < n) {
          if (!this.forward()) {
            break;
          }
        }
      } else {
        alert("You are already at move " + n + ".");
      }
    },

    angledView: function() {
      var defaultWidth = 750;
      var defaultHeight = 750;
      var ratio1 = defaultWidth / this.boardContainer.offsetWidth;
      var ratio2 = defaultHeight / this.boardContainer.offsetHeight;
      var ratio = ratio1 > ratio2 ? ratio1 : ratio2;

      var defaultY = 120;
      var defaultZ = 120;
      var offsetY = 20;
      var offsetZ = 0;

      var pos = {
        x: BOARD.centerX,
        y: defaultY * ratio + offsetY,
        z: defaultZ * ratio + offsetZ
      };
      this.setCameraPos(pos);
    },

    topView: function() {
      var defaultWidth = 750;
      var defaultHeight = 750;
      var ratio1 = defaultWidth / this.boardContainer.offsetWidth;
      var ratio2 = defaultHeight / this.boardContainer.offsetHeight;
      var ratio = ratio1 > ratio2 ? ratio1 : ratio2;

      var defaultY = 120;
      var offsetY = 50;

      var pos = {
        x: BOARD.centerX,
        y: defaultY * ratio + offsetY,
        z: BOARD.centerZ,
      };
      this.setCameraPos(pos);
    },

    setCameraPos: function(pos) {
      this.camera.position.set(pos.x, pos.y, pos.z);
    },

    redrawBoard: function(){
      //var _this = this;
      var board = this.gameState.board;
      //var s = "";
      //if (this.config.gameType == jsGameViewer.DAOQI){
      //  for(var i=0; i<board.size; i++){
      //    for(var j=0; j<board.size; j++){
      //      var color = board[i][j];
      //      var moveNumber = 0;
      //      if (this.config.showMoveNumber){
      //        moveNumber = this.gameState.getMoveNumber(i,j);
      //      }
      //      if (color == jsGameViewer.model.STONE_BLACK || color == jsGameViewer.model.STONE_WHITE){
      //        this.mapToPoints(i,j,function(x,y){
      //          s += _this.createStone(x,y,color,moveNumber);
      //        });
      //      }
      //    }
      //  }
      //} else {
        for(var i=0; i<board.size; i++){
          for(var j=0; j<board.size; j++){
            var color = board[i][j];
            this.addStone(i, j, color);
            //var moveNumber = 0;
            //if (this.config.showMoveNumber){
            //  moveNumber = this.gameState.getMoveNumber(i,j);
            //}
            //if (color == jsGameViewer.model.STONE_BLACK || color == jsGameViewer.model.STONE_WHITE){
            //  s += this.createStone(i,j,color,moveNumber);
            //}
          }
        }
      //}
      //jq4gv(this.jqId+"_boardPoints").empty();
      //if (s.length > 0)
      //  jq4gv(this.jqId+"_boardPoints").append(s);
      //return this;
    },

    addStone: function (row, col, color) {
      if (color !== jsGameViewer.model.STONE_BLACK && color !== jsGameViewer.model.STONE_WHITE) {
        return;
      }

      var material = color === jsGameViewer.model.STONE_BLACK ? this.materials.blackPieceMaterial : this.materials.whitePieceMaterial;
      var stone = new THREE.Mesh(this.pieceGeometry, material);
      stone.castShadow = true;
      stone.position = boardToWorld(row, col);
      stone.position.y = STONE.y;
      this.scene.add(stone);
      this.stonesCache[row][col] = stone;

      //var pieceObjGroup = new THREE.Object3D();
      //pieceObjGroup.add(pieceMesh);

      //if (this.config.showStoneShadow) {
      //  // create shadow plane
      //  var shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(STONE.shadowSize, STONE.shadowSize, 1, 1), this.materials.pieceShadowPlane);
      //  shadowPlane.rotation.x = -90 * Math.PI / 180;
      //  pieceObjGroup.add(shadowPlane);
      //}

      //pieceObjGroup.position = boardToWorld(row, col);
      //pieceObjGroup.position.y = STONE.y;

      //this.stonesCache[row][col] = pieceObjGroup;

      //this.scene.add(pieceObjGroup);
    },

    removeStone: function(row, col) {
      var pieceObjGroup = this.stonesCache[row][col];
      this.scene.remove(pieceObjGroup);
      this.stonesCache[row][col] = null;
    },

    /**
     * Draws the board.
     */
    drawBoard: function () {
      this.initEngine();
      this.initLights();
      this.initMaterials();
      this.initObjects();

      //// TODO: comment this when uncommenting initObjects()
      //this.moveMark = new THREE.Mesh(new THREE.CircleGeometry(MOVE_MARK.size, 32, 0, Math.PI * 2), this.materials.moveMarkMaterial);
      //this.moveMark.rotation.x = -90 * Math.PI / 180;
      //this.scene.add(this.moveMark);

      if (this.config.showCalibrate) this.calibrate();
      this.onAnimationFrame();
    },

    /**
     * Initialize some basic 3D engine elements.
     */
    initEngine: function() {
      var viewWidth = this.boardContainer.offsetWidth;
      var viewHeight = this.boardContainer.offsetHeight;

      // instantiate the WebGL Renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setSize(viewWidth, viewHeight);
      this.renderer.shadowMapEnabled = true;
      this.renderer.shadowMapType = THREE.PCFSoftShadowMap;

      // create the scene
      this.scene = new THREE.Scene();

      // create camera
      this.camera = new THREE.PerspectiveCamera(35, viewWidth / viewHeight, 1, 1000);
      this.angledView();
      this.cameraController = new THREE.OrbitControls(this.camera, this.boardContainer);
      this.cameraController.minPolarAngle = 0;
      this.cameraController.maxPolarAngle = 89 * Math.PI/180;
      this.cameraController.center = new THREE.Vector3(BOARD.centerX, BOARD.centerY, BOARD.centerZ);
      //
      this.scene.add(this.camera);

      this.boardContainer.appendChild(this.renderer.domElement);
    },

    /**
     * Initialize the lights.
     */
    initLights: function() {
      //// top light
      //this.lights.topLight = new THREE.PointLight();
      //this.lights.topLight.position.set(BOARD.centerX, 150, BOARD.centerZ);
      //this.lights.topLight.intensity = 0.4;
      //this.scene.add(this.lights.topLight);

      this.lights.shadowLight = new THREE.DirectionalLight();
      this.lights.shadowLight.shadowCameraNear	= 0.01;
      this.lights.shadowLight.castShadow = true;
      //this.lights.shadowLight.onlyShadow = true;
      this.lights.shadowLight.shadowDarkness = 0.4;
      this.lights.shadowLight.shadowCameraLeft = -40;
      this.lights.shadowLight.shadowCameraRight = 40;
      this.lights.shadowLight.shadowCameraTop = -40;
      this.lights.shadowLight.shadowCameraBottom = 40;
      //this.lights.shadowLight.shadowCameraVisible = true;
      this.lights.shadowLight.position.set(40, 100, 40);
      this.lights.shadowLight.target.position.set(40, 0, 40);
      this.lights.shadowLight.intensity = 1;
      this.scene.add(this.lights.shadowLight);

      //// white's side light
      //this.lights.whiteSideLight = new THREE.SpotLight();
      //this.lights.whiteSideLight.target.position.set(BOARD.centerZ, BOARD.centerY, BOARD.centerZ);
      //this.lights.whiteSideLight.position.set(BOARD.centerX, 100, BOARD.centerZ + 200);
      //this.lights.whiteSideLight.intensity = 0.8;
      //this.lights.whiteSideLight.shadowCameraFov = 55;
      //this.scene.add(this.lights.whiteSideLight);

      //// black's side light
      //this.lights.blackSideLight = new THREE.SpotLight();
      //this.lights.blackSideLight.target.position.set(BOARD.centerZ, BOARD.centerY, BOARD.centerZ);
      //this.lights.blackSideLight.position.set(BOARD.centerX, 100, BOARD.centerZ - 200);
      //this.lights.blackSideLight.intensity = 0.8;
      //this.lights.blackSideLight.shadowCameraFov = 55;
      //this.scene.add(this.lights.blackSideLight);

      //// light that will follow the camera position
      //this.lights.movingLight = new THREE.PointLight(0xf9edc9);
      //this.lights.movingLight.position.set(0, 15, 0);
      //this.lights.movingLight.intensity = 0.2;
      //this.lights.movingLight.distance = 500;
      //this.scene.add(this.lights.movingLight);
    },

    /**
     * Initialize the materials.
     */
    initMaterials: function() {
      // http://stackoverflow.com/a/24103129/120151
      // http://stackoverflow.com/a/18972267/120151
      // For some reason 'crossOrigin' does not have to be set when
      // images are hosted on a website that suports CORS (e.g. imgur.com)
      //THREE.ImageUtils.crossOrigin = '';

      var boardImage;
      //boardImage = 'http://gcao.github.io/jsgameviewer/view4/3d_assets/board_texture1.jpg';
      //boardImage = 'http://gcao.github.io/jsgameviewer/view4/3d_assets/board_texture2.jpg';
      //boardImage = 'http://gcao.github.io/jsgameviewer/view4/3d_assets/board_texture3.jpg';
      boardImage = 'http://i.imgur.com/SyQd2RT.jpg';
      //boardImage = 'http://gcao.github.io/jsgameviewer/view4/3d_assets/square_light_texture.jpg';
      var boardTexture = THREE.ImageUtils.loadTexture(boardImage);
      boardTexture.wrapS = boardTexture.wrapT = THREE.RepeatWrapping;
      boardTexture.repeat.set(3, 3);
      // board material
      this.materials.boardMaterial = new THREE.MeshLambertMaterial({
        map: boardTexture
      });

      // ground material
      this.materials.groundMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        //map: THREE.ImageUtils.loadTexture('http://gcao.github.io/jsgameviewer/view4/3d_assets/ground.png')
        map: THREE.ImageUtils.loadTexture('http://i.imgur.com/hqYtii8.png')
      });

      // white piece material
      this.materials.whitePieceMaterial = new THREE.MeshPhongMaterial({
        color: 0xe9e4bd,
        shininess: 20
      });

      // black piece material
      this.materials.blackPieceMaterial = new THREE.MeshPhongMaterial({
        color: 0x444455,
        shininess: 90
      });

      // pieces shadow plane material
      this.materials.pieceShadowPlane = new THREE.MeshBasicMaterial({
        transparent: true,
        //map: THREE.ImageUtils.loadTexture('http://gcao.github.io/jsgameviewer/view4/3d_assets/piece_shadow.png')
        map: THREE.ImageUtils.loadTexture('http://i.imgur.com/uMLfEQU.png')
      });

      this.materials.moveMarkMaterial = new THREE.MeshBasicMaterial({
        color: MOVE_MARK.color
      });
    },

    /**
     * Initialize the objects.
     */
    initObjects: function() {
      var self = this;

      // load board
      var loader = new THREE.JSONLoader();
      var boardGeometry = loader.parse(BOARD_MODEL).geometry;
      this.boardModel = new THREE.Mesh(boardGeometry, this.materials.boardMaterial);
      this.scene.add(this.boardModel);
      this.boardModel.castShadow = false;
      this.boardModel.receiveShadow = true;

      // load piece
      var stoneGeometry = loader.parse(STONE_MODEL).geometry;
      this.pieceGeometry = scale(stoneGeometry, new THREE.Vector3(STONE.scale, STONE.scale, STONE.scale));

      // add ground
      this.groundModel = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 1, 1), this.materials.groundMaterial);
      this.groundModel.position.set(40, -1.52, 40);
      this.groundModel.rotation.x = -90 * Math.PI / 180;
      //
      this.scene.add(this.groundModel);

      function drawGrids() {
        var offset = 1.25;

        // https://github.com/mrdoob/three.js/wiki/Drawing-lines
        var material1 = new THREE.LineBasicMaterial({
          color: 0x000000,
          linewidth: 1
        });
        var material2 = new THREE.LineBasicMaterial({
          color: 0x000000,
          linewidth: BOARD.border
        });

        for (var i = 0; i < 19; i++) {
          var material = i == 0 || i == 18 ? material2 : material1;
          var geometry1 = new THREE.Geometry();
          var p11 = boardToWorld(i, 0);
          var p12 = boardToWorld(i, 18);
          geometry1.vertices.push(new THREE.Vector3(p11.x, BOARD.markY, p11.z));
          geometry1.vertices.push(new THREE.Vector3(p12.x, BOARD.markY, p12.z));
          var line1 = new THREE.Line(geometry1, material);
          self.scene.add(line1);

          var geometry2 = new THREE.Geometry();
          var p21 = boardToWorld(0, i);
          var p22 = boardToWorld(18, i);
          geometry2.vertices.push(new THREE.Vector3(p21.x, BOARD.markY, p21.z));
          geometry2.vertices.push(new THREE.Vector3(p22.x, BOARD.markY, p22.z));
          var line2 = new THREE.Line(geometry2, material);
          self.scene.add(line2);
        }
      }

      drawGrids();

      function drawStars() {
        var starRadius = 0.5;
        var offset = 1.25;
        var material = new THREE.MeshBasicMaterial({
          color: 0x000000
        });

        for (var i = 0; i < 3; i++) {
          for (var j = 0; j < 3; j++) {
            var ii = i * 6 + 3;
            var jj = j * 6 + 3;

            var p = boardToWorld(ii, jj)
            var object = new THREE.Mesh(new THREE.CircleGeometry(starRadius, 32, 0, Math.PI * 2), material);
            object.position.set(p.x, BOARD.markY, p.z);
            object.rotation.x = -90 * Math.PI / 180;
            self.scene.add(object);
          }
        }
      }

      drawStars();

      function drawLabels() {
        // horizontal labels: A - T
        var offsetX1 = -0.5;
        var offsetZ1 = 0;

        for (var i=0; i<19; i++) {
          var p = boardToWorld(i, -1);
          self.drawText(LABELS[i], {
            color: LABEL.color,
            x: p.x + offsetX1,
            y: BOARD.markY,
            z: p.z + offsetZ1
          });

          p = boardToWorld(i, 19);
          self.drawText(LABELS[i], {
            color: LABEL.color,
            x: p.x + offsetX1,
            y: BOARD.markY,
            z: p.z + offsetZ1 + 1.3
          });
        }

        // vertical labels: 1 - 19
        var offsetX2 = -1;
        var offsetZ2 = 0.6;

        for (var i=0; i<19; i++) {
          var p = boardToWorld(-1, i);
          var text = i + 1;
          if (text < 10) text = "  " + text;

          self.drawText(text, {
            color: LABEL.color,
            x: p.x + offsetX2,
            y: BOARD.markY,
            z: p.z + offsetZ2
          });

          p = boardToWorld(19, i);
          self.drawText(text, {
            color: LABEL.color,
            x: p.x + offsetX2 - 1,
            y: BOARD.markY,
            z: p.z + offsetZ2
          });
        }
      }

      drawLabels();

      this.moveMark = new THREE.Mesh(new THREE.CircleGeometry(MOVE_MARK.size, 32, 0, Math.PI * 2), this.materials.moveMarkMaterial);
      this.moveMark.position.set(0, -1, 0); // Hide it at the beginning
      this.moveMark.rotation.x = -90 * Math.PI / 180;
      this.scene.add(this.moveMark);
    },

    drawText: function(text, options) {
      var size = options.size || 1.5;
      var color = options.color || 0x444444;
      var x = options.x;
      var y = options.y || 0;
      var z = options.z;

      var shapes, geom, mat, mesh;

      shapes = THREE.FontUtils.generateShapes(text, {
        font: "helvetiker",
        //weight: "bold",
        size: size
      });
      geom = new THREE.ShapeGeometry(shapes);
      mat = new THREE.MeshBasicMaterial({
        color: color
      });
      mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.x = -90 * Math.PI / 180;
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
      return mesh;
    },

    drawMark: function(mark) {
      // TODO: incomplete
      var x = mark[0], y = mark[1];
      var pos = boardToWorld(mark[0], mark[1])
      var model;
      pos.y = this.stonesCache[x][y] ? MOVE_MARK.y : BOARD.markY + 0.01;
      switch(mark[2]){
        case jsGameViewer.model.MARK_TEXT:
          model = this.drawText(mark[3], {
            color: MOVE_MARK.color,
            x: pos.x - 0.6,
            y: pos.y,
            z: pos.z + 0.5
          });
      }
      return model;
      //  for (var i=0; i<marks.length; i++){
      //    var mark = marks[i];
      //    var x = mark[0], y = mark[1];
      //    var color = this.gameState.board[x][y];
      //    var area = this.xyToArea(x,y);
      //    var left = area[0], top = area[1], width = area[2], height = area[3];
      //    var styleClass = "";
      //    switch(mark[2]){
      //      case jsGameViewer.model.MARK_CROSS:
      //        styleClass = "gvsprite-21-markcross";
      //        break;
      //      case jsGameViewer.model.MARK_TRIANGLE:
      //        styleClass = "gvsprite-21-marktriangle";
      //        break;
      //      case jsGameViewer.model.MARK_SQUARE:
      //        styleClass = "gvsprite-21-marksquare";
      //        break;
      //      case jsGameViewer.model.MARK_CIRCLE:
      //        styleClass = "gvsprite-21-markcircle";
      //        break;
      //      case jsGameViewer.model.MARK_TERR_BLACK:
      //        styleClass = "gvsprite-21-markblack";
      //        break;
      //      case jsGameViewer.model.MARK_TERR_WHITE:
      //        styleClass = "gvsprite-21-markwhite";
      //        break;
      //      case jsGameViewer.model.MARK_TEXT:
      //        var s = "<div style='position:absolute;left:"+left+"px;top:"+top+"px;width:"+width+"px;height:"+height+"px;text-align:center;vertical-align:middle;color:red;font-family:Nina;font-weight:bolder;font-size:15px;";
      //        if (color == jsGameViewer.model.STONE_NONE){
      //          s += "background-color:"+this.config.boardColor+";";
      //        }
      //        s += "'>"+mark[3]+"</div>";
      //        jq4gv(this.jqId+"_boardMarks").append(s);
      //        continue;
      //    }
      //    var s = "<div class='"+styleClass+"' style='position:absolute;left:"+left+"px;top:"+top+"px;";
      //    if (color == jsGameViewer.model.STONE_NONE){
      //      s += "background-color:"+this.config.boardColor+";";
      //    }
      //    s += "'></div>";
      //    jq4gv(this.jqId+"_boardMarks").append(s);
      //  }
    },

    /**
     * The render loop.
     */
    onAnimationFrame: function() {
      requestAnimationFrame(this.onAnimationFrame.bind(this));

      this.cameraController.update();

      //// update moving light position
      //this.lights.movingLight.position.x = this.camera.position.x;
      //this.lights.movingLight.position.z = this.camera.position.z;

      this.renderer.render(this.scene, this.camera);
    },

    calibrate: function(){
      var self = this;
      var lineMaterial = new THREE.LineBasicMaterial({
        color: 0xcc0000,
        linewidth: 1
      });
      function drawPoint(x, y, z) {
        var object = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32, 0, Math.PI * 2), this.materials.moveMarkMaterial);
        if (arguments.length === 1) {
          y = x.y;
          z = x.z;
          x = x.x;
        }
        console.log("Point(" + x + ", " + y + ", " + z + ")");
        object.position.set(x, y, z);
        object.rotation.x = -90 * Math.PI / 180;
        object.material.side = THREE.DoubleSide;
        self.scene.add(object);
      }
      function drawLine(x1, y1, z1, x2, y2, z2) {
        if (arguments.length === 1) { // only one arg is passed
          y1 = x1.y;
          z1 = x1.z;
          x1 = x1.x;
        }
        if (arguments.length <= 3) { // only first point's position is passed in
          x2 = x1;
          y2 = 0;
          z2 = z1;
        }
        console.log("Line: (" + x1 + ", " + y1 + ", " + z1 + ") - (" + x2 + ", " + y2 + ", " + z2 + ")");
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(x1, y1, z1));
        geometry.vertices.push(new THREE.Vector3(x2, y2, z2));
        var line = new THREE.Line(geometry, lineMaterial);
        self.scene.add(line);
      }
      var boardX = -2;
      var boardY = 0.02;
      var boardZ = -2;
      var boardSize = 84;
      drawPoint(boardX, boardY, boardZ);
      drawPoint(boardX + boardSize, boardY, boardZ);
      drawPoint(boardX, boardY, boardZ + boardSize);
      drawPoint(boardX + boardSize, boardY, boardZ + boardSize);
    }

  };
}());

