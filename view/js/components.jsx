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

  jsGameViewer.GameView = jsGameViewer.createClass();
  jq4gv.extend(jsGameViewer.GameView.prototype, {
    initialize: function(ctrl, config){
      this.ctrl = ctrl;
      this.config = config;
      this.id = this.ctrl.id;
      this.jqId = this.ctrl.jqId;
    },

    destroyView: function(){
      jq4gv(this.jqId).remove();
    },

    getTemplateLocation: function(){
      var templateName = this.config.gameType == jsGameViewer.DAOQI ? "daoqi" : "weiqi";
      return this.config.viewDir+"templates/"+templateName+"_"+this.config.locale+".html";
    },

    /* initialize view
     */
    initView: function(){
      if (this.ctrl.initialized())
        return this;
      React.render(React.createElement(Viewer, {ctrl: this}), document.getElementById(this.id));
    },

    initGame: function(){
    }
  });

  function xyToArea(x,y) {
    return [x*this.config.gridSize, y*this.config.gridSize, this.config.gridSize, this.config.gridSize];
  }

  /**
   * Top level widget
   */
  var Viewer = React.createClass({
    render: function() {
      return (
        <div className='gvreset gameviewer'>
          <Banner ctrl={this.props.ctrl}/>
          <Board/>
          <Toolbar ctrl={this.props.ctrl}/>
          <div align='center' className='gvreset gvpoint-label'></div>
          <div className='gvreset gvright-pane'>
            <Info game={this.props.ctrl.gameState && this.props.ctrl.gameState.game}/>
            <Comment/>
          </div>
        </div>
      );
    }
  });

  var Banner = React.createClass({
    changeLocaleToEnglish: function() {
      this.props.ctrl.ctrl.changeLocale('en_us');
    },
    changeLocaleToChinese: function() {
      this.props.ctrl.ctrl.changeLocale('zh_cn');
    },
    render: function() {
      return (
        <div className='gvreset gvbanner'>
          <div className='gvreset gvbanner-overlay'></div>
          <div className='gvreset gvbanner-left'>
            <a className='gvreset localization' href='#' onclick={this.changeLocaleToChinese}>中文</a>
            |
            <a className='gvreset localization' href='#' onclick={this.changeLocaleToEnglish}>EN</a>
            &nbsp;&nbsp;
            Next
            &nbsp;
            <img border='0px' className='gvreset nextPlayerImg' src='/jsgameviewer/view/images/default.png'/>
          </div>
          <div className='gvreset gvmove-outer gvbutton'>
            <a className='gvreset' href='#' onclick={"this.props.ctrl.goTo()"} title='Jump to XX [Alt Shift G]'>
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
                    <img border='0px' className='gvreset prisonersImg' src='/jsgameviewer/view/images/15/black_dead.png'/>
                    &nbsp;
                    <span className='gvreset gvcontrol-text'>0</span>
                  </a>
                </span>
              </div>
              <div className='gvreset gvwhite-prisoners-outer'>
                <span className='gvreset gvbutton'>
                  <a href='#' onclick='return false;'>
                    <img border='0px' className='gvreset prisonersImg' src='/jsgameviewer/view/images/15/white_dead.png'/>
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
            <div className='gvreset gvboard-overlay'>
            </div>
            <div className='gvreset gvboard-overlay'></div>
            <div className='gvreset gvboard-overlay'></div>
            <div className='gvreset gvsprite-21-markmove'></div>
            <div className='gvreset gvboard-overlay'></div>
            <div className='gvreset gvboard-overlay gvboard-fascade'>
              <img className='gvreset gvsprite-21-blankboard' src='/jsgameviewer/view/images/default.png'/>
            </div>
          </div>
        </div>
      );
    }
  });

  var Toolbar = React.createClass({
    render: function() {
      return (
        <div className='gvreset gvtoolbar'>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={"this.props.ctrl.refresh(true)"} title='Refresh game/board [Alt Shift R]'>
              <img border='0px' className='gvreset gvsprite-refresh' id='GV1_refreshImg' src='/jsgameviewer/view/images/default.png'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={"this.props.ctrl.toggleNumber()"} title='Show/hide move number [Alt Shift M]'>
              <img border='0px' className='gvreset gvsprite-shownumber' id='GV1_toggleNumberImg' src='/jsgameviewer/view/images/default.png'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={"this.props.ctrl.backAll()"} title='Back to beginning [Ctrl Alt &amp;#8592;]'>
              <img border='0px' className='gvreset gvsprite-backall' src='/jsgameviewer/view/images/default.png'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={"this.props.ctrl.backToComment()"} title='Previous comment or variation [Alt Shift &amp;#8592;]'>
              <img border='0px' className='gvreset gvsprite-backc' src='/jsgameviewer/view/images/default.png'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={"this.props.ctrl.backN()"} title='Fast back [Ctrl &amp;#8592;]'>
              <img border='0px' className='gvreset gvsprite-backn' src='/jsgameviewer/view/images/default.png'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={"this.props.ctrl.back()"} title='Back [&amp;#8592;]'>
              <img border='0px' className='gvreset gvsprite-back' src='/jsgameviewer/view/images/default.png'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={"this.props.ctrl.forward()"} title='Forward [&amp;#8594;]'>
              <img border='0px' className='gvreset gvsprite-forward' src='/jsgameviewer/view/images/default.png'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={"this.props.ctrl.forwardN()"} title='Fast forward [Ctrl &amp;#8594;]'>
              <img border='0px' className='gvreset gvsprite-forwardn' src='/jsgameviewer/view/images/default.png'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={"this.props.ctrl.forwardToComment()"} title='Next comment or variation [Alt Shift &amp;#8594;]'>
              <img border='0px' className='gvreset gvsprite-forwardc' src='/jsgameviewer/view/images/default.png'/>
            </a>
          </div>
          <div className='gvreset gvtb-item'>
            <a className='gvreset toggleopacity' href='#' onclick={"this.props.ctrl.forwardAll()"} title='Forward to end [Ctrl Alt &amp;#8594;]'>
              <img border='0px' className='gvreset gvsprite-forwardall' src='/jsgameviewer/view/images/default.png'/>
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

      if (!game) return <div/>;

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
      var stones = [];
      for(var i=0; i<this.props.board.length; i++) {
        for (var j=0; j<this.props.board.length; j++) {
          var color = this.props.board[i][j];
          if (color === STONE_BLACK || color === STONE_WHITE) {
            var moveNumber = this.props.gameState.getMoveNumber(i, j);
            stones.push(
              <Stone x={i} y={j} color={color} moveNumber={moveNumber}/>
            );
          }
        }
      }
      return stones;
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
          <div style={{display: 'table', width: area[2], height: area[3], position: 'relative', overflow: 'hidden'}}>
            <div style={{display: 'table-cell', verticalAlign: 'middle', position: 'absolute', top: '50%'}}>
              <div style={{position: 'relative', left: left, width: '100%', top: '-50%', textAlign: 'center', color: colorName, fontFamily: 'times', fontSize: fontSize}}>{moveNumber}</div>
            </div>
          </div>
        );
      } else {
        moveNumberChild = "&nbsp;";
      }

      return (
        <div className={className} style={{position: 'absolute', left: area[0], top: area[1]}}>
          { moveNumberChild }
        </div>
      );
    }
  });

})();

