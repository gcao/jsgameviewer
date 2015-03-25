(function() {
  "use strict";

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

    this.forward = function(){
    }.bind(this);

    this.forwardN = function(n){
    }.bind(this);

    this.forwardToComment = function(){
    }.bind(this);

    this.forwardAll = function(){
      this.ctrl.gameState.forwardAll();
      this.render();
    }.bind(this);

    this.back = function(){
    }.bind(this);

    this.backN = function(n){
    }.bind(this);

    this.backToComment = function(){
    }.bind(this);

    this.backAll = function(){
    }.bind(this);

    this.goTo = function(n){
    }.bind(this);

    this.render = function(){
      React.render(React.createElement(Viewer, {ctrl: this}), document.getElementById(this.id));
    }
  }

  function xyToArea(x,y) {
    return [x*this.config.gridSize, y*this.config.gridSize, this.config.gridSize, this.config.gridSize];
  }

  /**
   * Top level widget
   */
  var Viewer = React.createClass({displayName: "Viewer",
    render: function() {
      return (
        React.createElement("div", {className: "gvreset gameviewer"}, 
          React.createElement(Banner, {ctrl: this.props.ctrl}), 
          React.createElement(Board, null), 
          React.createElement(Toolbar, {ctrl: this.props.ctrl}), 
          React.createElement("div", {align: "center", className: "gvreset gvpoint-label"}), 
           this.props.ctrl.gameState ?
            React.createElement("div", {className: "gvreset gvright-pane"}, 
              React.createElement(Info, {game: this.props.ctrl.gameState && this.props.ctrl.gameState.game}), 
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
            React.createElement("a", {className: "gvreset localization", href: "#", onclick: this.props.ctrl.changeLocaleToChinese}, "中文"), 
            "|", 
            React.createElement("a", {className: "gvreset localization", href: "#", onclick: this.props.ctrl.changeLocaleToEnglish}, "EN"), 
            "  " + ' ' +
            "Next" + ' ' +
            " ", 
            React.createElement("img", {border: "0px", className: "gvreset nextPlayerImg", src: "/jsgameviewer/view/images/default.png"})
            ), 
          React.createElement("div", {className: "gvreset gvmove-outer gvbutton"}, 
            React.createElement("a", {className: "gvreset", href: "#", onclick: this.props.ctrl.goTo, title: "Jump to XX [Alt Shift G]"}, 
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
                    React.createElement("img", {border: "0px", className: "gvreset prisonersImg", src: "/jsgameviewer/view/images/15/black_dead.png"}), 
                    " ", 
                    React.createElement("span", {className: "gvreset gvcontrol-text"}, "0")
                  )
                )
              ), 
              React.createElement("div", {className: "gvreset gvwhite-prisoners-outer"}, 
                React.createElement("span", {className: "gvreset gvbutton"}, 
                  React.createElement("a", {href: "#", onclick: "return false;"}, 
                    React.createElement("img", {border: "0px", className: "gvreset prisonersImg", src: "/jsgameviewer/view/images/15/white_dead.png"}), 
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
            React.createElement("div", {className: "gvreset gvboard-overlay"}), 
            React.createElement("div", {className: "gvreset gvboard-overlay"}), 
            React.createElement("div", {className: "gvreset gvboard-overlay"}), 
            React.createElement("div", {className: "gvreset gvsprite-21-markmove"}), 
            React.createElement("div", {className: "gvreset gvboard-overlay"}), 
            React.createElement("div", {className: "gvreset gvboard-overlay gvboard-fascade"}, 
              React.createElement("img", {className: "gvreset gvsprite-21-blankboard", src: "/jsgameviewer/view/images/default.png"})
            )
          )
        )
      );
    }
  });

  var Toolbar = React.createClass({displayName: "Toolbar",
    render: function() {
      return (
        React.createElement("div", {className: "gvreset gvtoolbar"}, 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctrl.refresh, title: "Refresh game/board [Alt Shift R]"}, 
              React.createElement("img", {border: "0px", className: "gvreset gvsprite-refresh", id: "GV1_refreshImg", src: "/jsgameviewer/view/images/default.png"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctrl.toggleNumber, title: "Show/hide move number [Alt Shift M]"}, 
              React.createElement("img", {border: "0px", className: "gvreset gvsprite-shownumber", id: "GV1_toggleNumberImg", src: "/jsgameviewer/view/images/default.png"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctrl.backAll, title: "Back to beginning [Ctrl Alt &#8592;]"}, 
              React.createElement("img", {border: "0px", className: "gvreset gvsprite-backall", src: "/jsgameviewer/view/images/default.png"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctrl.backToComment, title: "Previous comment or variation [Alt Shift &#8592;]"}, 
              React.createElement("img", {border: "0px", className: "gvreset gvsprite-backc", src: "/jsgameviewer/view/images/default.png"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctrl.backN, title: "Fast back [Ctrl &#8592;]"}, 
              React.createElement("img", {border: "0px", className: "gvreset gvsprite-backn", src: "/jsgameviewer/view/images/default.png"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctrl.back, title: "Back [&#8592;]"}, 
              React.createElement("img", {border: "0px", className: "gvreset gvsprite-back", src: "/jsgameviewer/view/images/default.png"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctrl.forward, title: "Forward [&#8594;]"}, 
              React.createElement("img", {border: "0px", className: "gvreset gvsprite-forward", src: "/jsgameviewer/view/images/default.png"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctrl.forwardN, title: "Fast forward [Ctrl &#8594;]"}, 
              React.createElement("img", {border: "0px", className: "gvreset gvsprite-forwardn", src: "/jsgameviewer/view/images/default.png"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctrl.forwardToComment, title: "Next comment or variation [Alt Shift &#8594;]"}, 
              React.createElement("img", {border: "0px", className: "gvreset gvsprite-forwardc", src: "/jsgameviewer/view/images/default.png"})
            )
          ), 
          React.createElement("div", {className: "gvreset gvtb-item"}, 
            React.createElement("a", {className: "gvreset toggleopacity", href: "#", onclick: this.props.ctrl.forwardAll, title: "Forward to end [Ctrl Alt &#8594;]"}, 
              React.createElement("img", {border: "0px", className: "gvreset gvsprite-forwardall", src: "/jsgameviewer/view/images/default.png"})
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

      if (!game) return React.createElement("div", null);

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
      var stones = [];
      for(var i=0; i<this.props.board.length; i++) {
        for (var j=0; j<this.props.board.length; j++) {
          var color = this.props.board[i][j];
          if (color === STONE_BLACK || color === STONE_WHITE) {
            var moveNumber = this.props.gameState.getMoveNumber(i, j);
            stones.push(
              React.createElement(Stone, {x: i, y: j, color: color, moveNumber: moveNumber})
            );
          }
        }
      }
      return stones;
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

      var area = xyToArea(x,y);

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
          React.createElement("div", {style: {display: 'table', width: area[2], height: area[3], position: 'relative', overflow: 'hidden'}}, 
            React.createElement("div", {style: {display: 'table-cell', verticalAlign: 'middle', position: 'absolute', top: '50%'}}, 
              React.createElement("div", {style: {position: 'relative', left: left, width: '100%', top: '-50%', textAlign: 'center', color: colorName, fontFamily: 'times', fontSize: fontSize}}, moveNumber)
            )
          )
        );
      } else {
        moveNumberChild = "&nbsp;";
      }

      return (
        React.createElement("div", {className: className, style: {position: 'absolute', left: area[0], top: area[1]}}, 
          moveNumberChild 
        )
      );
    }
  });

})();

