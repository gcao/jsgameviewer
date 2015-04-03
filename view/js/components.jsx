(function() {
  "use strict";

  var EMPTY_DIV = <div style={{display: "none"}}/>;

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
  var Viewer = React.createClass({
    render: function() {
      return (
        <div className='gvreset gameviewer'>
          <Banner ctx={this.props.ctx}/>
          <Board ctx={this.props.ctx}/>
          <Toolbar ctx={this.props.ctx}/>
          <div align='center' className='gvreset gvpoint-label'></div>
          { this.props.ctx.ctrl.gameState ?
            <div className='gvreset gvright-pane'>
              <Info game={this.props.ctx.ctrl.gameState.game}/>
              <Comment/>
            </div>
            :
            <div className='gvreset gvright-pane'></div>
          }
        </div>
      );
    }
  });

  var Banner = React.createClass({
    render: function() {
      return (
        <div className='gvreset gvbanner'>
          <div className='gvreset gvbanner-overlay'></div>
          <div className='gvreset gvbanner-left'>
            <a className='gvreset localization' href='#' onclick={this.props.ctx.changeLocaleToChinese}>中文</a>
            &nbsp;|&nbsp;
            <a className='gvreset localization' href='#' onclick={this.props.ctx.changeLocaleToEnglish}>EN</a>
            &nbsp;&nbsp;
            Next
            &nbsp;
            <div className='gvreset nextPlayerImg'/>
          </div>
          <div className='gvreset gvmove-outer gvbutton'>
            <a className='gvreset' href='#' onclick={this.props.ctx.goTo} title='Jump to XX [Alt Shift G]'>
              &nbsp;
              <span className='gvreset gvcontrol-text'>0</span>
              &nbsp;
            </a>
          </div>
          <div className='gvreset gvbanner-overlay'>
            <div className='gvreset gvprisoners-outer'>
              <div className='gvreset gvblack-prisoners-outer'>
                <span className='gvreset gvbutton'>
                  <a href='#' onclick='return false;'>
                    <div className='gvreset gvsprite-15-black_dead' style={{display: 'inline-block', margin: -2, marginRight: 2}}/>
                    &nbsp;
                    <span className='gvreset gvcontrol-text'>0</span>
                  </a>
                </span>
              </div>
              <div className='gvreset gvwhite-prisoners-outer'>
                <span className='gvreset gvbutton'>
                  <a href='#' onclick='return false;'>
                    <div className='gvreset gvsprite-15-white_dead' style={{display: 'inline-block', margin: -2, marginRight: 2}}/>
                    &nbsp;
                    <span className='gvreset gvcontrol-text'>0</span>
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  });

  var Board = React.createClass({
    render: function() {
      return (
        <div className='gvreset gvboard-outer gvsprite-21-board'>
          <div className='gvreset gvboard'>
            <Stones ctx={this.props.ctx}/>
            <div className='gvreset gvboard-overlay'></div>
            <div className='gvreset gvboard-overlay'></div>
            <MoveMark ctx={this.props.ctx}/>
            <div className='gvreset gvboard-overlay'></div>
            <div className='gvreset gvboard-overlay gvboard-fascade'>
              <div className='gvreset gvsprite-21-blankboard'/>
            </div>
          </div>
        </div>
      );
    }
  });

  var MoveMark = React.createClass({
    render: function() {
      var ctx = this.props.ctx;
      var gameState = ctx.ctrl.gameState;
      if (gameState) {
        var node = gameState.currentNode;
        if (node.type === jsGameViewer.model.NODE_MOVE) {
          return (
            <div className='gvreset gvsprite-21-markmove'
              style={{
                position: "absolute",
                left: node.x * ctx.config.gridSize,
                top: node.y * ctx.config.gridSize,
                width: ctx.config.gridSize,
                height: ctx.config.gridSize
              }}
            ></div>
          );
        }
      }

      return EMPTY_DIV;
    }
  });

  var Toolbar = React.createClass({
    render: function() {
      return (
        <div className='gvreset gvtoolbar'>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={this.props.ctx.refresh} title='Refresh game/board [Alt Shift R]'>
              <div className='gvreset gvsprite-refresh'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={this.props.ctx.toggleNumber} title='Show/hide move number [Alt Shift M]'>
              <div className='gvreset gvsprite-shownumber'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={this.props.ctx.backAll} title='Back to beginning [ctx Alt &amp;#8592;]'>
              <div className='gvreset gvsprite-backall'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={this.props.ctx.backToComment} title='Previous comment or variation [Alt Shift &amp;#8592;]'>
              <div className='gvreset gvsprite-backc'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={this.props.ctx.backN} title='Fast back [ctx &amp;#8592;]'>
              <div className='gvreset gvsprite-backn'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={this.props.ctx.back} title='Back [&amp;#8592;]'>
              <div className='gvreset gvsprite-back'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={this.props.ctx.forward} title='Forward [&amp;#8594;]'>
              <div className='gvreset gvsprite-forward'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={this.props.ctx.forwardN} title='Fast forward [ctx &amp;#8594;]'>
              <div className='gvreset gvsprite-forwardn'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={this.props.ctx.forwardToComment} title='Next comment or variation [Alt Shift &amp;#8594;]'>
              <div className='gvreset gvsprite-forwardc'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={this.props.ctx.forwardAll} title='Forward to end [ctx Alt &amp;#8594;]'>
              <div className='gvreset gvsprite-forwardall'/>
            </a>
          </div>
          <div className='gvreset gvtb-branches'></div>
        </div>
      );
    }
  });

  var Info = React.createClass({
    render: function() {
      var game = this.props.game;

      if (!game) return EMPTY_DIV;

      var playFirst = "&nbsp;&#8592; " + jsgvTranslations['play_first'];

      return (
        <div className='gvreset gvinfo'>
          { jsGameViewer.notNull(game.name)  && <div align="center" style={{fontWeight: "bold"}}>{game.name}</div> }
          { jsGameViewer.notNull(game.date)  && <div align="center" style={{fontWeight: "bold"}}>{game.date}</div> }
          { jsGameViewer.notNull(game.place) && <div align="center" style={{fontWeight: "bold"}}>{game.place}</div> }

          <div>
            { jsgvTranslations['white'] }:
            <strong> {game.whiteName} </strong>
            { jsGameViewer.notNull(game.whiteRank) && "&nbsp;(" + game.whiteRank + ")" }
            { game.getFirstPlayer() == jsGameViewer.model.STONE_WHITE && playFirst }
          </div>
          <div>
            { jsgvTranslations['black'] }:
            <strong> {game.blackName} </strong>
            { jsGameViewer.notNull(game.blackRank) && "&nbsp;(" + game.blackRank + ")" }
            { game.getFirstPlayer() == jsGameViewer.model.STONE_BLACK && playFirst }
          </div>
          { game.handicap > 0
            ? <div>{ jsgvTranslations['handicap'] }: { game.handicap } </div>
            : [ <div>{ jsgvTranslations['rule']   }: { game.rule     } </div>
              , <div>{ jsgvTranslations['komi']   }: { game.komi     } </div>
              ]
          }
          <div>{ jsgvTranslations['moves']  }: { game.getMoves() } </div>
          <div>{ jsgvTranslations['result'] }: { game.result     } </div>
        </div>
      );
    }
  });

  var Comment = React.createClass({
    render: function() {
      return (
        <div className='gvreset gvcomment'>
          <strong>第 {this.props.move} 手评论:</strong><br/>
          {this.props.comment}
        </div>
      );
    }
  });

  var Stones = React.createClass({
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
              <Stone x={i} y={j} color={color} moveNumber={moveNumber} config={this.props.ctx.config}/>
            );
          }
        }
      }
      return (
        <div className='gvreset gvboard-overlay'>{stones}</div>
      );
    }
  });

  var Stone = React.createClass({
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
          <div style={{display: 'table', width: area[2], height: area[3], overflow: 'hidden'}}>
            <div style={{display: 'table-cell', verticalAlign: 'middle', top: '50%'}}>
              <div style={{left: left, width: '100%', top: '-50%', textAlign: 'center', color: colorName, fontFamily: 'times', fontSize: fontSize}}>{moveNumber}</div>
            </div>
          </div>
        );
      } else {
        moveNumberChild = "\u00a0";
      }

      return (
        <div className={className} style={{position: 'absolute', left: area[0], top: area[1]}}>
          { moveNumberChild }
        </div>
      );
    }
  });

})();

