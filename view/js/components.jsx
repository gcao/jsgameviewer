(function() {
  "use strict";

  function xyToArea(x,y) {
    return [x*this.config.gridSize, y*this.config.gridSize, this.config.gridSize, this.config.gridSize];
  }

  jsGameViewer.GameInfo = React.createClass({
    render: function() {
      var game = this.props.game;

      var playFirst = "&nbsp;&#8592; " + jsgvTranslations['play_first'];

      return (
        <div className="info">
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

  jsGameViewer.Stones = React.createClass({
    render: function() {
      var stones = [];
      jq4gv.each(this.props.points, function(point) {
        stones.push(
          <Stone x={point.x} y={point.y} color={point.color}/>
        );
      });
    }
  });

  var Stone = jsGameViewer.Stone = React.createClass({
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

