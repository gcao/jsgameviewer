(function() {
  "use strict";

  var EMPTY_DIV = React.createElement("div", {style: {display: "none"}});

  // Default view configuration
  jq4gv.extend(jsGameViewer.CONFIG, {
    gridSize:21,
    fastMode:10,
    showMoveNumber:false,
    activeBackground: "#EECD7A",
    inactiveBackground: "#CCAB69",
    boardColor:"#EECD7A",
    gridSizeWQ:21,
    gridSizeDQ:19,
    boardColorDQ:"#CCAB69",
    vbw:4,
    boardSizeDQ:27,
    rightPaneHeight:446,
    rightPaneHeightDQ:560
  });

  jsGameViewer.GameView = function(ctrl, config) {
    this.ctrl = ctrl;
    this.config = config;
    this.id = this.ctrl.id;
    this.jqId = this.ctrl.jqId;

    this.destroyView = function(){
      jq4gv(this.jqId).remove();
    }

    this.initView = function(){
      if (this.ctrl.initialized())
        return this;
      this.render();
    }

    this.initGame = function(){
    }

    this.changeLocaleToEnglish = function() {
      this.ctrl.changeLocale('en_us');
    }.bind(this);

    this.changeLocaleToChinese = function() {
      this.ctrl.changeLocale('zh_cn');
    }.bind(this);

    this.toggleNumber = function(){
      this.config.showNumber = !this.config.showNumber;
      this.render();
    }.bind(this);

    this.forward = function(){
      this.ctrl.gameState.forward();
      this.render();
    }.bind(this);

    this.forwardN = function(n){
      this.ctrl.gameState.forwardN(n);
      this.render();
    }.bind(this);

    this.forwardToComment = function(){
      this.ctrl.gameState.forwardToComment();
      this.render();
    }.bind(this);

    this.forwardAll = function(){
      this.ctrl.gameState.forwardAll();
      this.render();
    }.bind(this);

    this.back = function(){
      this.ctrl.gameState.back();
      this.render();
    }.bind(this);

    this.backN = function(n){
      this.ctrl.gameState.backN(n);
      this.render();
    }.bind(this);

    this.backToComment = function(){
      this.ctrl.gameState.backToComment();
      this.render();
    }.bind(this);

    this.backAll = function(){
      this.ctrl.gameState.backAll();
      this.render();
    }.bind(this);

    this.goTo = function(n){
      this.ctrl.gameState.goTo(n);
      this.render();
    }.bind(this);

    this.render = function(){
      React.render(React.createElement(Viewer, {ctx: this}), document.getElementById(this.id));
    }
  }

  function xyToArea(x,y,gridSize) {
    return [x*gridSize, y*gridSize, gridSize, gridSize];
  }

  /**
   * Top level widget
   */
  var Viewer = React.createClass({displayName: "Viewer",
    render: function() {
      return (
        React.createElement("div", {className: "gvreset gameviewer"}, 
          React.createElement(Banner, {ctx: this.props.ctx}), 
          React.createElement(Board, {ctx: this.props.ctx}), 
          React.createElement(Toolbar, {ctx: this.props.ctx}), 
          React.createElement("div", {align: "center", className: "gvreset gvpoint-label"}), 
           this.props.ctx.ctrl.gameState ?
            React.createElement("div", {className: "gvreset gvright-pane"}, 
              React.createElement(Info, {game: this.props.ctx.ctrl.gameState.game}), 
              React.createElement(Comment, null)
            )
            :
            React.createElement("div", {className: "gvreset gvright-pane"})
          
        )
      );
    }
  });

  var Banner = React.createClass({displayName: "Banner",
    render: function() {
      return (
        React.createElement("div", {className: "gvreset gvbanner"}, 
          React.createElement("div", {className: "gvreset gvbanner-overlay"}), 
          React.createElement("div", {className: "gvreset gvbanner-left"}, 
            React.createElement("a", {className: "gvreset localization", href: "#", onclick: this.props.ctx.changeLocaleToChinese}, "中文"), 
            " | ", 
            React.createElement("a", {className: "gvreset localization", href: "#", onclick: this.props.ctx.changeLocaleToEnglish}, "EN"), 
            "  " + ' ' +
            "Next" + ' ' +
            " ", 
            React.createElement("div", {className: "gvreset nextPlayerImg"})
          ), 
          React.createElement("div", {className: "gvreset gvmove-outer gvbutton"}, 
            React.createElement("a", {className: "gvreset", href: "#", onclick: this.props.ctx.goTo, title: "Jump to XX [Alt Shift G]"}, 
              " ", 
              React.createElement("span", {className: "gvreset gvcontrol-text"}, "0"), 
              " "
            )
          ), 
          React.createElement("div", {className: "gvreset gvbanner-overlay"}, 
            React.createElement("div", {className: "gvreset gvprisoners-outer"}, 
              React.createElement("div", {className: "gvreset gvblack-prisoners-outer"}, 
                React.createElement("span", {className: "gvreset gvbutton"}, 
                  React.createElement("a", {href: "#", onclick: "return false;"}, 
                    React.createElement("div", {className: "gvreset gvsprite-15-black_dead", style: {display: 'inline-block', margin: -2, marginRight: 2}}), 
                    " ", 
                    React.createElement("span", {className: "gvreset gvcontrol-text"}, "0")
                  )
                )
              ), 
              React.createElement("div", {className: "gvreset gvwhite-prisoners-outer"}, 
                React.createElement("span", {className: "gvreset gvbutton"}, 
                  React.createElement("a", {href: "#", onclick: "return false;"}, 
                    React.createElement("div", {className: "gvreset gvsprite-15-white_dead", style: {display: 'inline-block', margin: -2, marginRight: 2}}), 
                    " ", 
                    React.createElement("span", {className: "gvreset gvcontrol-text"}, "0")
                  )
                )
              )
            )
          )
        )
      );
    }
  });

  var Board = React.createClass({displayName: "Board",
    render: function() {
      return (
        React.createElement("div", {className: "gvreset gvboard-outer gvsprite-21-board"}, 
          React.createElement("div", {className: "gvreset gvboard"}, 
            React.createElement(Stones, {ctx: this.props.ctx}), 
            React.createElement("div", {className: "gvreset gvboard-overlay"}), 
            React.createElement("div", {className: "gvreset gvboard-overlay"}), 
            React.createElement(MoveMark, {ctx: this.props.ctx}), 
            React.createElement("div", {className: "gvreset gvboard-overlay"}), 
            React.createElement("div", {className: "gvreset gvboard-overlay gvboard-fascade"}, 
              React.createElement("div", {className: "gvreset gvsprite-21-blankboard"})
            )
          )
        )
      );
    }
  });

  var MoveMark = React.createClass({displayName: "MoveMark",
    render: function() {
      var ctx = this.props.ctx;
      var gameState = ctx.ctrl.gameState;
      if (gameState) {
        var node = gameState.currentNode;
        if (node.type === jsGameViewer.model.NODE_MOVE) {
          return (
            React.createElement("div", {className: "gvreset gvsprite-21-markmove", 
              style: {
                position: "absolute",
                left: node.x * ctx.config.gridSize,
                top: node.y * ctx.config.gridSize,
                width: ctx.config.gridSize,
                height: ctx.config.gridSize
              }
            })
          );
        }
      }

      return EMPTY_DIV;
    }
  });

  var Toolbar = React.createClass({displayName: "Toolbar",
    render: function() {
      return (
        React.createElement("div", {className: "gvreset gvtoolbar"}, 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctx.refresh, title: "Refresh game/board [Alt Shift R]"}, 
              React.createElement("div", {className: "gvreset gvsprite-refresh"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctx.toggleNumber, title: "Show/hide move number [Alt Shift M]"}, 
              React.createElement("div", {className: "gvreset gvsprite-shownumber"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctx.backAll, title: "Back to beginning [ctx Alt &#8592;]"}, 
              React.createElement("div", {className: "gvreset gvsprite-backall"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctx.backToComment, title: "Previous comment or variation [Alt Shift &#8592;]"}, 
              React.createElement("div", {className: "gvreset gvsprite-backc"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctx.backN, title: "Fast back [ctx &#8592;]"}, 
              React.createElement("div", {className: "gvreset gvsprite-backn"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctx.back, title: "Back [&#8592;]"}, 
              React.createElement("div", {className: "gvreset gvsprite-back"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctx.forward, title: "Forward [&#8594;]"}, 
              React.createElement("div", {className: "gvreset gvsprite-forward"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctx.forwardN, title: "Fast forward [ctx &#8594;]"}, 
              React.createElement("div", {className: "gvreset gvsprite-forwardn"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctx.forwardToComment, title: "Next comment or variation [Alt Shift &#8594;]"}, 
              React.createElement("div", {className: "gvreset gvsprite-forwardc"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctx.forwardAll, title: "Forward to end [ctx Alt &#8594;]"}, 
              React.createElement("div", {className: "gvreset gvsprite-forwardall"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-branches"})
        )
      );
    }
  });

  var Info = React.createClass({displayName: "Info",
    render: function() {
      var game = this.props.game;

      if (!game) return EMPTY_DIV;

      var playFirst = "&nbsp;&#8592; " + jsgvTranslations['play_first'];

      return (
        React.createElement("div", {className: "gvreset gvinfo"}, 
           jsGameViewer.notNull(game.name)  && React.createElement("div", {align: "center", style: {fontWeight: "bold"}}, game.name), 
           jsGameViewer.notNull(game.date)  && React.createElement("div", {align: "center", style: {fontWeight: "bold"}}, game.date), 
           jsGameViewer.notNull(game.place) && React.createElement("div", {align: "center", style: {fontWeight: "bold"}}, game.place), 

          React.createElement("div", null, 
             jsgvTranslations['white'], ":", 
            React.createElement("strong", null, " ", game.whiteName, " "), 
             jsGameViewer.notNull(game.whiteRank) && "&nbsp;(" + game.whiteRank + ")", 
             game.getFirstPlayer() == jsGameViewer.model.STONE_WHITE && playFirst
          ), 
          React.createElement("div", null, 
             jsgvTranslations['black'], ":", 
            React.createElement("strong", null, " ", game.blackName, " "), 
             jsGameViewer.notNull(game.blackRank) && "&nbsp;(" + game.blackRank + ")", 
             game.getFirstPlayer() == jsGameViewer.model.STONE_BLACK && playFirst
          ), 
           game.handicap > 0
            ? React.createElement("div", null,  jsgvTranslations['handicap'], ": ",  game.handicap, " ")
            : [ React.createElement("div", null,  jsgvTranslations['rule'], ": ",  game.rule, " ")
              , React.createElement("div", null,  jsgvTranslations['komi'], ": ",  game.komi, " ")
              ], 
          
          React.createElement("div", null,  jsgvTranslations['moves'], ": ",  game.getMoves(), " "), 
          React.createElement("div", null,  jsgvTranslations['result'], ": ",  game.result, " ")
        )
      );
    }
  });

  var Comment = React.createClass({displayName: "Comment",
    render: function() {
      return (
        React.createElement("div", {className: "gvreset gvcomment"}, 
          React.createElement("strong", null, "第 ", this.props.move, " 手评论:"), React.createElement("br", null), 
          this.props.comment
        )
      );
    }
  });

  var Stones = React.createClass({displayName: "Stones",
    render: function() {
      var gameState = this.props.ctx.ctrl.gameState;
      if (!gameState) return EMPTY_DIV;

      var board = gameState.board;
      var stones = [];
      for(var i=0; i<board.size; i++) {
        for (var j=0; j<board.size; j++) {
          var color = board[i][j];
          if (color === jsGameViewer.model.STONE_BLACK || color === jsGameViewer.model.STONE_WHITE) {
            var moveNumber = gameState.getMoveNumber(i, j);
            stones.push(
              React.createElement(Stone, {x: i, y: j, color: color, moveNumber: moveNumber, config: this.props.ctx.config})
            );
          }
        }
      }
      return (
        React.createElement("div", {className: "gvreset gvboard-overlay"}, stones)
      );
    }
  });

  var Stone = React.createClass({displayName: "Stone",
    render: function() {
      var config = this.props.config;

      var x = this.props.x;
      var y = this.props.y;
      var color = this.props.color;
      var moveNumber = this.props.moveNumber;

      var className = color === jsGameViewer.model.STONE_BLACK ? 'gvsprite-21-black' : 'gvsprite-21-white';

      var area = xyToArea(x,y,config.gridSize);

      var moveNumberChild;
      if (config.showMoveNumber && moveNumber > 0) {
        var colorName = color == jsGameViewer.model.STONE_BLACK ? "white" : "black";
        var fontSize = "medium";
        var left = 0;
        if (moveNumber >= 10 && moveNumber < 100){
          fontSize = "small";
        }else if (moveNumber >= 100){
          fontSize = "x-small";
          left = 1;
        }
        moveNumberChild = (
          React.createElement("div", {style: {display: 'table', width: area[2], height: area[3], overflow: 'hidden'}}, 
            React.createElement("div", {style: {display: 'table-cell', verticalAlign: 'middle', top: '50%'}}, 
              React.createElement("div", {style: {left: left, width: '100%', top: '-50%', textAlign: 'center', color: colorName, fontFamily: 'times', fontSize: fontSize}}, moveNumber)
            )
          )
        );
      } else {
        moveNumberChild = "\u00a0";
      }

      return (
        React.createElement("div", {className: className, style: {position: 'absolute', left: area[0], top: area[1]}}, 
          moveNumberChild 
        )
      );
    }
  });

})();

