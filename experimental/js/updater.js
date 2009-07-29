jQuery.extend(jsGameViewer.GameController.prototype, {
  setPlayerInterval: function(interval){
    this.config.playerInterval = interval;
    return this;
  },

  setObserverInterval: function(interval){
    this.config.observerInterval = interval;
    return this;
  },

  startUpdater: function(){
    this.stopUpdater();
    if (this.game && !this.game.isFinished())
      return this;
    var _this = this;
    var updaterFunc = function(){
      if (!_this.game)
        return;
      if (_this.game.isFinished()){
        _this.stopUpdater();
        return;
      }
      if (_this.isMyTurn())
        return;
      _this.refresh();
    };
    if (this.player){
      this.playerUpdater = setInterval(updaterFunc, this.config.playerInterval*1000);
    }
    this.observerUpdater = setInterval(updaterFunc, this.config.observerInterval*1000);
    return this;
  },

  stopUpdater: function(){
    if (this.playerUpdater){
      clearInterval(this.playerUpdater);
      delete this.playerUpdater;
    }
    if (this.observerUpdater){
      clearInterval(this.observerUpdater);
      delete this.observerUpdater;
    }
    return this;
  }
});