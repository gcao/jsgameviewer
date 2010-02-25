jQuery.extend(jsGameViewer.GameController.prototype, {
  setPlayer: function(player){
    this.player = player;
    return this;
  },

  // This is required to keep the forum session alive when integrating with a forum like Discuz!
  saveSession: function(url, interval){
    if (!this.sessionSaver){
      this.sessionSaver = setInterval(function(){
        jQuery.ajax({url: url});
      }, interval*1000);
    }
    return this;
  },

  setUsernameElemId: function(elemId){
    this.usernameElemId = elemId;
    return this;
  },

  setUsername: function(username){
    this.username = username;
    return this;
  },

  getUsername: function(){
    if (this.username){
      return this.username;
    } else if (this.usernameElemId){
      return jQuery.trim(jQuery('#' + this.usernameElemId).text());
    } else {
      return null;
    }
  },

  isPlayer: function(){
    if (this.player && this.player.isPlayer){
      return this.player.isPlayer();
    } else {
      return false;
    }
  },

  isMyTurn: function(){
    if (this.player && this.player.isMyTurn){
      return this.player.isMyTurn();
    } else {
      return false;
    }
  },

  sendMove: function(){
    if (this.player && this.player.sendMove){
      return this.player.sendMove();
    } else {
      //alert("This is not a DGS game. \nCurrently the program only supports to play on DGS.");
      alert("Õâ²»ÊÇDGS¶Ô¾Ö¡£±¾³ÌÐòÄ¿Ç°Ö»Ö§³ÖÔÚDGSÉÏÏÂÆå¡£");
      return false;
    }
  },

  resign: function(){
    if (this.player && this.player.resign){
      // var answer = confirm("Are you sure that you would like to resign?");
      var answer = confirm("ÄãÈ·ÊµÒªÈÏÊäÂð£¿");
      if (answer)
        this.player.resign();
    } else {
      //alert("This is not a DGS game. Currently the program only supports to play on DGS.");
      alert("Õâ²»ÊÇDGS¶Ô¾Ö¡£±¾³ÌÐòÄ¿Ç°Ö»Ö§³ÖÔÚDGSÉÏÏÂÆå¡£");
      return false;
    }
  },

  origPlay: jsGameViewer.GameController.prototype.play,

  play: function(x, y){
    if (this.origPlay(x, y) && this.player && this.player.sendMove){
      return this.player.sendMove();
    }
  }
});
