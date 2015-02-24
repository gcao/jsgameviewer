jsGameViewer.GameInfo = React.createClass({
  render: function() {
    var game = this.props.game;

    if (jsGameViewer.notNull(game.name)) {
      var name = <div align="center" style="font-weight:bold">{game.name}</div>;
    }
    if (jsGameViewer.notNull(game.date)) {
      var date = <div align="center" style="font-weight:bold">{game.date}</div>;
    }
    if (jsGameViewer.notNull(game.place)) {
      var place = <div align="center" style="font-weight:bold">{game.place}</div>;
    }

    var playFirst = "&nbsp;&#8592; " + jsgvTranslations['play_first'];

    return (
      <div class="info">
        { name  }
        { date  }
        { place }

        <div>
          { jsgvTranslations['white'] }:
          <strong> {game.whiteName} </strong>
          { if (jsGameViewer.notNull(game.whiteRank)) "&nbsp;(" + game.whiteRank + ")" }
          { if (game.getFirstPlayer() == jsGameViewer.model.STONE_WHITE) playFirst }
        </div>
        <div>
          { jsgvTranslations['black'] }:
          <strong> {game.blackName} </strong>
          { if (jsGameViewer.notNull(game.blackRank)) "&nbsp;(" + game.blackRank + ")" }
          { if (game.getFirstPlayer() == jsGameViewer.model.STONE_BLACK) playFirst }
        </div>
        <div>{ jsgvTranslations['rule']   } : { game.rule       } </div>
        <div>{ jsgvTranslations['komi']   } : { game.komi       } </div>
        <div>{ jsgvTranslations['moves']  } : { game.getMoves() } </div>
        <div>{ jsgvTranslations['result'] } : { game.result     } </div>
      </div>
    );
  }
});

