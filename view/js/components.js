(function() {
  "use strict";

  function xyToArea(x,y) {
    return [x*this.config.gridSize, y*this.config.gridSize, this.config.gridSize, this.config.gridSize];
  }

  jsGameViewer.GameInfo = React.createClass({displayName: "GameInfo",
    render: function() {
      var game = this.props.game;

      var playFirst = "&nbsp;&#8592; " + jsgvTranslations['play_first'];

      return (
        React.createElement("div", {className: "info"}, 
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

  jsGameViewer.Stones = React.createClass({displayName: "Stones",
    render: function() {
      var stones = [];
      jq4gv.each(this.props.points, function(point) {
        stones.push(
          React.createElement(Stone, {x: point.x, y: point.y, color: point.color})
        );
      });
    }
  });

  var Stone = jsGameViewer.Stone = React.createClass({displayName: "Stone",
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

