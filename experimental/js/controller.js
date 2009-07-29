jsGameViewer.GameController = jsGameViewer.createClass();
jQuery.extend(jsGameViewer.GameController.prototype, {
  initialize: function(config){
    this.id = jsGameViewer.getGameId();
    jsGameViewer[this.id] = this;
  
    this.config = jsGameViewer.clone(jsGameViewer.CONFIG);
    if (config != null)
      jQuery.extend(this.config, config);
  
    this.reset();
  },

  init: function(){
    this.initView();
    this._initialized = true;
    return this;
  },

  initialized: function(){
    return this._inialized == true;
  },

  destroy: function(){
    this.destroyView();
    delete jsGameViewer[this.id];
    jsGameViewer.length--;
  },

  reset: function(){
    this._initialized = false;
    if (this.config.container != null) 
      jQuery("#" + this.config.container).empty().append(this.getPlaceHolder());
    else {
      if (document.getElementById(this.id) != null)
        jQuery("#"+this.id).replaceWith(this.getPlaceHolder());
      else
        document.write(this.getPlaceHolder());
    }
    return this;
  },

  show: function(){
    if (!this.initialized())
      this.init();
    jQuery("#" + this.id).show();
    return this;
  },

  hide: function(){
    jQuery("#" + this.id).hide();
    return this;
  },

  setGameType: function(gameType){
    if (this.config.gameType != gameType){
      this.config.gameType = gameType;
      this.reset();
    }
    return this;
  },

  // set game type if DAOQI
  setGameTypeIf: function(gameType){
    if (this.config.gameType != jsGameViewer.DAOQI && this.game.type == jsGameViewer.DAOQI){
      this.setGameType(jsGameViewer.DAOQI);
    }
    return this;
  },

  load: function(url, n){
    var h = jsGameViewer.model.GameHistory[url];
    if (h != undefined && h != null){
      jsGameViewer.model.GameHistory.save(h);
      this.game = h.game;
      this.setGameTypeIf(this.game.type).show();
      this.gameState = h;
      this.gameState.backAll();
      this.initGame();
      if (n == undefined)
        this.forwardAll();
      else
        this.forwardN(n);
      return this;
    }
    var _this = this;
    jQuery.ajax({
      url:url,
      success:function(response){
        try {
          // if game data haven't changed, don't reload the game
          if (_this.game && _this.game.dataSize && _this.game.dataSize == response.length){
            return;
          }
          _this.game = new jsGameViewer.SGFParser(_this.config.gameType).parse(response);
          _this.game.dataSize = response.length;
          _this.setGameTypeIf(_this.game.type).show();
          _this.game.url = url;
          _this.gameState = new jsGameViewer.model.GameState(_this.game);
          jsGameViewer.model.GameHistory.save(_this.gameState);
          _this.initGame();
          if (n == undefined)
            _this.forwardAll();
          else
            _this.forwardN(n);
        } catch(e) {
          throw "GameController.load('" + url + "')->success: " + e;
        }
      },
      failure:function(){
        throw "GameController.load('" + url + "')->failure:";
      }
    });
    return this;
  },

  loadInline: function(divId, n){
    try {
      if (jQuery("#"+divId).length == 0){
        return this;
      }
      var s = jQuery.trim(jQuery("#"+divId).text());
      // if game data haven't changed, don't reload the game
      if (this.game && this.game.dataSize && this.game.dataSize == s.length){
        return this;
      }
      this.game = new jsGameViewer.SGFParser(this.config.gameType).parse();
      this.game.dataSize = s.length;
      this.setGameTypeIf(this.game.type);
      this.gameState = new jsGameViewer.model.GameState(this.game);
      this.initGame();
      if (n == undefined)
        this.forwardAll();
      else
        this.forwardN(n);
      return this;
    } catch(e) {
      throw "GameController.loadInline('" + divId + "'): " + e;
    }
  },

  refresh: function(force){
    var url = this.game.url;
    var _this = this;
    jQuery.ajax({
      url:url,
      ifModified: true,
      success:function(response){
        try {
          // if game data haven't changed, don't reload the game
          if (!force && _this.game && _thi.game.dataSize && _this.game.dataSize == response.length){
            return;
          }
          _this.game = new jsGameViewer.SGFParser(_this.config.gameType).parse(response);
          _this.game.dataSize = response.length;
          _this.setGameTypeIf(_this.game.type).show();
          _this.game.url = url;
          _this.gameState = new jsGameViewer.model.GameState(_this.game);
          jsGameViewer.model.GameHistory.save(_this.gameState);
          _this.initGame();
          _this.forwardAll();
        } catch(e) {
          throw "GameController.refresh('" + url + "')->success: " + e;
        }
      },
      failure:function(){
        throw "GameController.refresh('" + url + "')->failure:";
      }
    });
  },

  openInWindow: function(){
    var url = this.config.baseDir + "gamewindow.php?";
    var title = "jsgameviewer", width = 722, height = 452;
    if (this.config.gameType == jsGameViewer.DAOQI) {
      url += "type=DAOQI&";
      width = 798;
      height = 528;
    }
    if (this.game && this.game.url)
      url += "url=" + encodeURIComponent(this.game.url);
    var win = window.open(url, title, "width=" + width + "px,height=" + height + "px,status=yes,location=no,resizable=yes");
  },

  getPlaceHolder: function(){
    return "<div id='" + this.id + "' style='display:none'>&nbsp;</div>";
  }
});
