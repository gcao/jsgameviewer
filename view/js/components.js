jsGameViewer.GameInfo = React.createClass({displayName: "GameInfo",
  render: function() {
    if (jsGameViewer.notNull(this.props.game.name)) {
      var name = React.createElement("div", {align: "center", style: "font-weight:bold"}, this.props.game.name);
    }
    if (jsGameViewer.notNull(this.props.game.date)) {
      var date = React.createElement("div", {align: "center", style: "font-weight:bold"}, this.props.game.date);
    }
    if (jsGameViewer.notNull(this.props.game.place)) {
      var place = React.createElement("div", {align: "center", style: "font-weight:bold"}, this.props.game.place);
    }
    return (
      React.createElement("div", {class: "info"}, 
        name, 
        date, 
        place, 
        " ← ", jsgvTranslations['play_first']
      )
    );
  }
});

