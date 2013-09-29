# Default view configuration
$.extend jsGameViewer.CONFIG,
  gridSize: 21
  fastMode: 10
  showMoveNumber: false
  activeBackground: "#EECD7A"
  inactiveBackground: "#CCAB69"
  boardColor: "#EECD7A"
  gridSizeWQ: 21
  gridSizeDQ: 19
  boardColorDQ: "#CCAB69"
  vbw: 4
  boardSizeDQ: 27
  rightPaneHeight: 446
  rightPaneHeightDQ: 560

$.extend jsGameViewer.GameController::, ->
  LABELS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"]
  BRANCHES = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
  destroyView: ->
    $(@jqId).remove()

  getTemplateLocation: ->
    templateName = (if @config.gameType is jsGameViewer.DAOQI then "daoqi" else "weiqi")
    @config.viewDir + "templates/" + templateName + "_" + @config.locale + ".html"

  
  # initialize view
  #     
  initView: ->
    return this  if @initialized()
    @config.x0 = @config.vbw
    @config.y0 = @config.vbw
    s = ""
    if @config.gameType is jsGameViewer.DAOQI
      @config.gridSize = @config.gridSizeDQ
      unless jsGameViewer.DAOQI_TEMPLATE?
        $.ajax
          async: false
          dataType: "application/xml"
          url: @getTemplateLocation()
          success: (response) ->
            jsGameViewer.DAOQI_TEMPLATE = response

      s = jsGameViewer.DAOQI_TEMPLATE
      @rightPaneHeight = @config.rightPaneHeightDQ
    else
      @config.gridSize = @config.gridSizeWQ
      unless jsGameViewer.WEIQI_TEMPLATE?
        $.ajax
          async: false
          dataType: "application/xml"
          url: @getTemplateLocation()
          success: (response) ->
            jsGameViewer.WEIQI_TEMPLATE = response

      s = jsGameViewer.WEIQI_TEMPLATE
      @rightPaneHeight = @config.rightPaneHeight
    s = s.replace(/GV1/g, @id)  unless @id is "GV1"
    $(@jqId).replaceWith s
    
    # if (this.config.container == null) {
    #   $(this.jqId).replaceWith(s);
    # } else {
    #   $("#"+this.config.container).empty().append(s);
    # }
    _this = this
    mouseMove = (e) ->
      _this.registerKeyListener()
      arr = _this.eventToXY(e)
      _this.toX = arr[0]
      _this.toY = arr[1]
      $(_this.jqId + "_pointLabel").empty().append _this.xyToLabel(arr[0], arr[1])
      false

    mouseOut = (e) ->
      $(_this.jqId + "_pointLabel").empty()
      false

    mouseDown = (e) ->
      arr = _this.eventToXY(e)
      if _this.config.gameType is jsGameViewer.DAOQI
        _this.fromX = _this.toX = arr[0]
        _this.fromY = _this.toY = arr[1]
        $(this).css "cursor", "move"
        jsgv.debug "fromX: " + _this.fromX + ", fromY: " + _this.fromY
      else
        _this.play arr[0], arr[1]
      $(this).one "mouseup", mouseUp
      false

    mouseUp = (e) ->
      
      # See http://stackoverflow.com/questions/1909760/how-to-get-mouseup-to-fire-once-mousemove-complete-javascript-jquery
      # Then see http://jsbin.com/ajidi source code on how IE can be supported
      $(this).unbind "mouseup"
      return false  unless _this.config.gameType is jsGameViewer.DAOQI
      $(this).css "cursor", "auto"
      return  if _this.fromX is `undefined` or _this.fromX is NaN or _this.fromY is `undefined` or _this.fromY is NaN
      if _this.fromX isnt _this.toX or _this.fromY isnt _this.toY
        _this.moveBoard _this.toX - _this.fromX, _this.toY - _this.fromY
      else
        _this.play _this.toX, _this.toY
      false

    $(@jqId + "_boardFascade").mousemove(mouseMove).mouseout(mouseOut).mousedown mouseDown
    @setToggleNumberImg()
    $(@jqId + "_goToInput").keydown ->
      gvGoTo id  if e.keyCode is 13

    @addPrisonerHandlers()
    @registerKeyListener()
    $(document).ready ->
      tb_init "a.thickbox"

    this

  addPrisonerHandlers: ->
    _this = this
    $(@jqId + "_moveOuter, " + @jqId + "_blackPrisonersOuter, " + @jqId + "_whitePrisonersOuter").mouseout ->
      $(_this.jqId + "_prisoners").empty()

    $(@jqId + "_blackPrisonersOuter").mouseover ->
      $(_this.jqId + "_prisoners").empty()
      if _this.gameState.blackPrisoners > 0
        $.each _this.gameState.blackPrisonerPoints, (i, item) ->
          _this.showPrisoner item


    $(@jqId + "_whitePrisonersOuter").mouseover ->
      $(@jqId + "_prisoners").empty()
      if _this.gameState.whitePrisoners > 0
        $.each _this.gameState.whitePrisonerPoints, (i, item) ->
          _this.showPrisoner item


    $(@jqId + "_moveOuter").mouseover ->
      $(_this.jqId + "_prisoners").empty()
      if _this.gameState.currentNode.blackPrisoners > 0
        $.each _this.gameState.currentNode.blackPrisonerPoints, (i, item) ->
          _this.showPrisoner item

      if _this.gameState.currentNode.whitePrisoners > 0
        $.each _this.gameState.currentNode.whitePrisonerPoints, (i, item) ->
          _this.showPrisoner item



  showPrisoner: (item) ->
    _this = this
    x = item[0]
    y = item[1]
    color = item[2]
    area = @xyToArea(x, y)
    left = area[0]
    top = area[1]
    width = area[2]
    height = area[3]
    if @config.gameType is jsGameViewer.DAOQI
      cssClass = (if color is jsGameViewer.model.STONE_BLACK then "gvsprite-19-markblack" else "gvsprite-19-markwhite")
      @mapToPoints x, y, (x1, y1) ->
        area = _this.xyToArea(x1, y1)
        left = area[0]
        top = area[1]
        width = area[2]
        height = area[3]
        s = "<div class='" + cssClass + "' style='position:absolute;left:" + left + "px;top:" + top + "px;"
        if _this.gameState.board[x][y] is jsGameViewer.model.STONE_NONE
          if _this.isInCentralArea(x1, y1)
            s += "background-color:" + _this.config.boardColorDQ + ";"
          else
            s += "background-color:" + _this.config.boardColor + ";"
        s += "'></div>"
        $(@jqId + "_prisoners").append s

    else
      cssClass = (if color is jsGameViewer.model.STONE_BLACK then "gvsprite-21-markblack" else "gvsprite-21-markwhite")
      s = "<div class='" + cssClass + "' style='position:absolute;left:" + left + "px;top:" + top + "px;"
      s += "background-color:" + @config.boardColor + ";"  if @gameState.board[x][y] is jsGameViewer.model.STONE_NONE
      s += "'></div>"
      $(@jqId + "_prisoners").append s

  removeKeyListener: ->
    $(@jqId + "_bannerbg").css "background-color", @config.inactiveBackground

  registerKeyListener: ->
    _this = this
    i = 1

    while i <= jsGameViewer.length
      jsGameViewer[jsGameViewer.getGameId(i)].removeKeyListener()
      i++
    $(@jqId + "_bannerbg").css "background-color", @config.activeBackground
    document.onkeydown = (e) ->
      keyCode = undefined
      if window.event
        keyCode = window.event.keyCode
      else if e
        keyCode = e.which
      else
        return
      e = e or window.event
      switch keyCode
        when 37 # left
          if e.ctrlKey
            if e.altKey
              _this.backAll()
            else
              _this.backN _this.config.fastMode
          else
            if e.altKey and e.shiftKey
              _this.backToComment()
            else
              _this.back()
          return
        when 39 # right
          if e.ctrlKey
            if e.altKey
              _this.forwardAll()
            else
              _this.forwardN _this.config.fastMode
          else
            if e.altKey and e.shiftKey
              _this.forwardToComment()
            else
              _this.forward()
          return
        when 46 # delete
          _this.remove()
          return
      if e.altKey and e.shiftKey
        switch keyCode
          when 71 # g
            setTimeout "jsGameViewer." + _this.id + ".goToPopup()", 100
          when 77 # m
            _this.toggleNumber()
          when 82 # r
            _this.refresh()
          else # a: 65, z: 90
            _this.goToBranch keyCode - 65  if keyCode >= 65 and keyCode <= 90

    this

  
  # reset view to beginning of a game
  #     
  initGame: ->
    @removeAllStones().setGameInfo().setGameState().addRemoveStones @gameState.currentNode.points

  setGameInfo: ->
    
    # show/hide resign button
    if @isMyTurn() and not @game.isFinished()
      $(@jqId + "_resign").show()
    else
      $(@jqId + "_resign").hide()
    infoNode = $(@jqId + "_info").empty()
    game = @game
    return this  if game is `undefined` or not game?
    infoNode.append "<div align='center' style='font-weight:bold'>" + $.trim(game.name) + "</div>"  if jsGameViewer.notNull(game.name)
    infoNode.append "<div>" + jsgvTranslations["time"] + ": " + $.trim(game.date) + "</div>"  if jsGameViewer.notNull(game.date)
    infoNode.append "<div>" + jsgvTranslations["place"] + ": " + $.trim(game.place) + "</div>"  if jsGameViewer.notNull(game.place)
    playFirst = "&nbsp;&#8592; " + jsgvTranslations["play_first"]
    
    # black player name + rank
    blackRank = ""
    blackRank = "&nbsp;(" + game.blackRank + ")"  if jsGameViewer.notNull(game.blackRank)
    blackPlayer = "<div>" + jsgvTranslations["black"] + ": <strong>" + $.trim(game.blackName) + "</strong>" + blackRank
    blackPlayer += playFirst  if game.getFirstPlayer() is jsGameViewer.model.STONE_BLACK
    blackPlayer += "</div>"
    infoNode.append blackPlayer
    
    # white player name + rank
    whiteRank = ""
    whiteRank = "&nbsp;(" + game.whiteRank + ")"  if jsGameViewer.notNull(game.whiteRank)
    whitePlayer = "<div>" + jsgvTranslations["white"] + ": <strong>" + $.trim(game.whiteName) + "</strong>" + whiteRank
    whitePlayer += playFirst  if game.getFirstPlayer() is jsGameViewer.model.STONE_WHITE
    whitePlayer += "</div>"
    infoNode.append whitePlayer
    if game.handicap > 0
      infoNode.append "<div>" + jsgvTranslations["handicap"] + ": " + game.handicap + "</div>"
    else
      infoNode.append "<div>" + jsgvTranslations["rule"] + ": " + $.trim(game.rule) + "</div>"
      infoNode.append "<div>" + jsgvTranslations["komi"] + ": " + game.komi + "</div>"
    infoNode.append "<div>" + jsgvTranslations["moves"] + ": " + game.getMoves() + "</div>"
    infoNode.append "<div>" + jsgvTranslations["result"] + ": " + $.trim(game.result) + "</div>"
    this

  removeGameInfo: ->
    $(@jqId + "_info").empty()
    this

  setGameState: ->
    node = @gameState.currentNode
    @setNextPlayer @gameState.getNextPlayer()
    @setMoveNumber node.moveNumber
    @setPrisoners @gameState.blackPrisoners, @gameState.whitePrisoners
    if node.type is jsGameViewer.model.NODE_MOVE
      @setMoveMark node.x, node.y
    else
      @removeMoveMark()
    @setMarks node.marks
    @setBranches()
    @setComment()
    this

  moveBoard: (xDiff, yDiff) ->
    _this = this
    return  unless @config.gameType is jsGameViewer.DAOQI
    board = @gameState.board
    @config.x0 = board.normalize(@config.x0 + xDiff)
    @config.y0 = board.normalize(@config.y0 + yDiff)
    
    # remove stones
    @removeAllStones()
    
    # remove branches
    @removeBranches()
    
    # hide move mark
    @removeMoveMark()
    
    # add stones
    s = ""
    i = 0

    while i < board.size
      j = 0

      while j < board.size
        color = board[i][j]
        if color is jsGameViewer.model.STONE_BLACK or color is jsGameViewer.model.STONE_WHITE
          moveNumber = 0
          moveNumber = @gameState.getMoveNumber(i, j)  if @config.showMoveNumber
          @mapToPoints i, j, (x, y) ->
            s += _this.createStone(x, y, color, moveNumber)

        j++
      i++
    $(@jqId + "_boardPoints").append s  if s.length > 0
    
    # add branches
    @setBranches()
    
    # show move mark
    node = @gameState.currentNode
    if node.type is jsGameViewer.model.NODE_MOVE
      @setMoveMark node.x, node.y
    else
      @removeMoveMark()
    
    # move labels
    vlabelStart = (@config.y0 - @config.vbw) * @config.gridSize
    $(@jqId + "_vlabel").css "backgroundPosition", "0px " + vlabelStart + "px"
    hlabelStart = (@config.x0 - @config.vbw) * @config.gridSize
    $(@jqId + "_hlabel").css "backgroundPosition", hlabelStart + "px 0px"
    
    # move marks
    @setMarks node.marks
    this

  mapToPoints_: (x, y) ->
    
    #console.log("GameView.mapToPoints(): "+x+","+y);
    stones = new Array()
    x1 = x + @config.x0
    y1 = y + @config.y0
    xarr = []
    xarr.push x1  if x1 >= 0 and x1 < @config.boardSizeDQ
    xarr.push x1 - @config.boardSize  if x1 >= @config.boardSize
    xarr.push x1 + @config.boardSize  if x1 < @config.boardSizeDQ - @config.boardSize
    yarr = []
    yarr.push y1  if y1 >= 0 and y1 < @config.boardSizeDQ
    yarr.push y1 - @config.boardSize  if y1 >= @config.boardSize
    yarr.push y1 + @config.boardSize  if y1 < @config.boardSizeDQ - @config.boardSize
    i = 0

    while i < xarr.length
      j = 0

      while j < yarr.length
        
        #console.log(xarr[i]+","+yarr[j]);
        stones.push [xarr[i], yarr[j]]
        j++
      i++
    stones

  mapToPoints: (x, y, func) ->
    stones = @mapToPoints_(x, y)
    i = 0

    while i < stones.length
      stone = stones[i]
      func stone[0], stone[1]
      i++
    this

  getStoneId: (x, y) ->
    @id + "_point_" + x + "-" + y

  createStone: (x, y, color, moveNumber) ->
    styleClass = ""
    if @config.gameType is jsGameViewer.DAOQI
      if color is jsGameViewer.model.STONE_BLACK
        styleClass = "gvsprite-19-black"
      else if color is jsGameViewer.model.STONE_WHITE
        styleClass = "gvsprite-19-white"
      else
        return null
    else
      if color is jsGameViewer.model.STONE_BLACK
        styleClass = "gvsprite-21-black"
      else if color is jsGameViewer.model.STONE_WHITE
        styleClass = "gvsprite-21-white"
      else
        return null
    s = "<div id='" + @getStoneId(x, y) + "' class='" + styleClass + "' style='position:absolute;left:"
    a = @xyToArea(x, y)
    s += a[0] + "px;top:" + a[1] + "px;'>"
    if @config.showMoveNumber and moveNumber > 0
      
      # http://www.jakpsatweb.cz/css/css-vertical-center-solution.html
      colorS = "white"
      colorS = "black"  if color is jsGameViewer.model.STONE_WHITE
      fontSize = "medium"
      left = 0
      if moveNumber >= 10 and moveNumber < 100
        fontSize = "small"
      else if moveNumber >= 100
        fontSize = "x-small"
        left = 1
      s += "<div style='display:table;width:" + a[2] + "px;height:" + a[3] + "px;#position:relative;overflow:hidden;'><div style='display:table-cell;vertical-align:middle;#position:absolute;#top:50%;'>" + "<div style='#position:relative;left:" + left + "px;width:100%;#top:-50%;text-align:center;color:" + colorS + ";font-family:times;font-size:" + fontSize + ";'>" + moveNumber + "</div></div></div>"
    else
      s += "&nbsp;"
    s += "</div>"
    s

  addStone: (x, y, color) ->
    _this = this
    moveNumber = 0
    moveNumber = @gameState.getMoveNumber(x, y)  if @config.showMoveNumber
    if @config.gameType is jsGameViewer.DAOQI
      @mapToPoints x, y, (x, y) ->
        s = _this.createStone(x, y, color, moveNumber)
        $(_this.jqId + "_boardPoints").append s  if s?

    else
      s = @createStone(x, y, color, moveNumber)
      $(@jqId + "_boardPoints").append s  if s?
    this

  
  #
  #     * iterate through points
  #     * remove all
  #     * add those whose deleteFlag is not set
  #     
  addRemoveStones: (points) ->
    i = 0

    while i < points.length
      point = points[i]
      @removeStone point.x, point.y
      @addStone point.x, point.y, point.color  unless point.deleteFlag
      i++
    this

  removeStone: (x, y) ->
    _this = this
    if @config.gameType is jsGameViewer.DAOQI
      @mapToPoints x, y, (x, y) ->
        stone = $("#" + _this.getStoneId(x, y))
        stone.remove()

    else
      stone = $("#" + @getStoneId(x, y))
      stone.remove()
    this

  
  #
  #     * remove all stones on the board
  #     
  removeAllStones: ->
    $(@jqId + "_boardPoints").children().remove()
    this

  setNextPlayer: (color) ->
    imgSrc = ""
    if color is jsGameViewer.model.STONE_WHITE
      imgSrc = @config.viewDir + "/images/15/white.gif"
    else
      imgSrc = @config.viewDir + "/images/15/black.gif"
    $(@jqId + "_nextPlayer").attr "src", imgSrc
    this

  setMoveNumber: (moveNumber) ->
    moveNumber = "0"  if moveNumber is 0
    $(@jqId + "_curMove").empty().append moveNumber
    this

  setMoveMark: (x, y) ->
    _this = this
    if @config.gameType is jsGameViewer.DAOQI
      $(@jqId + "_moveMarks").empty()
      @mapToPoints x, y, (x, y) ->
        area = _this.xyToArea(x, y)
        $(_this.jqId + "_moveMarks").append "<div class='gvsprite-19-markmove' style='position:absolute;left:" + area[0] + "px;top:" + area[1] + "px;width:" + area[2] + "px;height:" + area[3] + "px'>&nbsp;</div>"

    else
      $(@jqId + "_moveMark").css
        position: "absolute"
        left: x * @config.gridSize
        top: y * @config.gridSize
        width: @config.gridSize
        height: @config.gridSize

    this

  removeMoveMark: ->
    if @config.gameType is jsGameViewer.DAOQI
      $(@jqId + "_moveMarks").empty()
    else
      $(@jqId + "_moveMark").css
        width: 0
        height: 0

    this

  setMarks: (marks) ->
    _this = this
    $(@jqId + "_boardMarks").empty()
    return this  if marks is `undefined` or not marks?
    if @config.gameType is jsGameViewer.DAOQI
      i = 0

      while i < marks.length
        mark = marks[i]
        x = mark[0]
        y = mark[1]
        color = @gameState.board[x][y]
        styleClass = ""
        switch mark[2]
          when jsGameViewer.model.MARK_CROSS
            styleClass = "gvsprite-19-markcross"
          when jsGameViewer.model.MARK_TRIANGLE
            styleClass = "gvsprite-19-marktriangle"
          when jsGameViewer.model.MARK_SQUARE
            styleClass = "gvsprite-19-marksquare"
          when jsGameViewer.model.MARK_CIRCLE
            styleClass = "gvsprite-19-markcircle"
          when jsGameViewer.model.MARK_TERR_BLACK
            styleClass = "gvsprite-19-markblack"
          when jsGameViewer.model.MARK_TERR_WHITE
            styleClass = "gvsprite-19-markwhite"
          when jsGameViewer.model.MARK_TEXT
            @mapToPoints x, y, (x, y) ->
              area = _this.xyToArea(x, y)
              left = area[0]
              top = area[1]
              width = area[2]
              height = area[3]
              s = "<div style='position:absolute;left:" + left + "px;top:" + top + "px;width:" + width + "px;height:" + height + "px;text-align:center;vertical-align:middle;color:red;font-family:Nina;font-weight:bolder;font-size:14px;"
              if color is jsGameViewer.model.STONE_NONE
                if _this.isInCentralArea(x, y)
                  s += "background-color:" + _this.config.boardColorDQ + ";"
                else
                  s += "background-color:" + _this.config.boardColor + ";"
              s += "'>" + mark[3] + "</div>"
              $(_this.jqId + "_boardMarks").append s

        @mapToPoints x, y, (x, y) ->
          area = _this.xyToArea(x, y)
          left = area[0]
          top = area[1]
          width = area[2]
          height = area[3]
          s = "<div class='" + styleClass + "' style='position:absolute;left:" + left + "px;top:" + top + "px;"
          if color is jsGameViewer.model.STONE_NONE
            if _this.isInCentralArea(x, y)
              s += "background-color:" + _this.config.boardColorDQ + ";"
            else
              s += "background-color:" + _this.config.boardColor + ";"
          s += "'></div>"
          $(_this.jqId + "_boardMarks").append s

        i++
    else
      i = 0

      while i < marks.length
        mark = marks[i]
        x = mark[0]
        y = mark[1]
        color = @gameState.board[x][y]
        area = @xyToArea(x, y)
        left = area[0]
        top = area[1]
        width = area[2]
        height = area[3]
        styleClass = ""
        switch mark[2]
          when jsGameViewer.model.MARK_CROSS
            styleClass = "gvsprite-21-markcross"
          when jsGameViewer.model.MARK_TRIANGLE
            styleClass = "gvsprite-21-marktriangle"
          when jsGameViewer.model.MARK_SQUARE
            styleClass = "gvsprite-21-marksquare"
          when jsGameViewer.model.MARK_CIRCLE
            styleClass = "gvsprite-21-markcircle"
          when jsGameViewer.model.MARK_TERR_BLACK
            styleClass = "gvsprite-21-markblack"
          when jsGameViewer.model.MARK_TERR_WHITE
            styleClass = "gvsprite-21-markwhite"
          when jsGameViewer.model.MARK_TEXT
            s = "<div style='position:absolute;left:" + left + "px;top:" + top + "px;width:" + width + "px;height:" + height + "px;text-align:center;vertical-align:middle;color:red;font-family:Nina;font-weight:bolder;font-size:15px;"
            s += "background-color:" + @config.boardColor + ";"  if color is jsGameViewer.model.STONE_NONE
            s += "'>" + mark[3] + "</div>"
            $(@jqId + "_boardMarks").append s
        s = "<div class='" + styleClass + "' style='position:absolute;left:" + left + "px;top:" + top + "px;"
        s += "background-color:" + @config.boardColor + ";"  if color is jsGameViewer.model.STONE_NONE
        s += "'></div>"
        $(@jqId + "_boardMarks").append s
        i++
    this

  setPrisoners: (b, w) ->
    b = "0"  if b is 0
    w = "0"  if w is 0
    $(@jqId + "_blackPrisoners").empty().append b
    $(@jqId + "_whitePrisoners").empty().append w
    this

  setBranches: ->
    _this = this
    $(@jqId + "_boardBranches").empty()
    $(@jqId + "_branches").empty()
    $(@jqId + "_branches").css height: 0
    node = @gameState.currentNode
    if node.hasChildren() and node.children.length >= 2
      n = node.children.length
      i = 0

      while i < node.children.length
        title = ""
        if i is 0
          title = jsgvTranslations["branch"] + " A = " + jsgvTranslations["trunk"] + " [Alt Shift &#8594;][Alt Shift A]"
        else
          if i < BRANCHES.length
            branchName = BRANCHES[i]
            title = jsgvTranslations["branch"] + " " + branchName + " [Alt Shift " + branchName + "]"
        s = "<div class='gvtb-branch gvbutton'><a href='#' title='" + title + "' onclick='jsGameViewer." + @id + ".goToBranch(" + i + ");return false;'>" + BRANCHES[i] + "</a></div>"
        $(@jqId + "_branches").append s
        $(@jqId + "_branches").css height: n * 23
        child = node.children[i]
        if child.type is jsGameViewer.model.NODE_MOVE
          x = child.x
          y = child.y
          if @config.gameType is jsGameViewer.DAOQI
            @mapToPoints x, y, (x, y) ->
              styleClass = "gvbranch"
              styleClass = "gvbranch-real"  if _this.isInCentralArea(x, y)
              area = _this.xyToArea(x, y)
              $(_this.jqId + "_boardBranches").append "<div class='" + styleClass + "' style='left:" + area[0] + "px;top:" + area[1] + "px;width:" + area[2] + "px;height:" + area[3] + "px;'>" + BRANCHES[i] + "</div>"

          else
            area = _this.xyToArea(x, y)
            $(_this.jqId + "_boardBranches").append "<div class='gvbranch' style='left:" + area[0] + "px;top:" + area[1] + "px;width:" + area[2] + "px;height:" + area[3] + "px;'>" + BRANCHES[i] + "</div>"
        i++
    this

  removeBranches: ->
    $(@jqId + "_boardBranches").empty()
    $(@jqId + "_branches").empty()
    $(@jqId + "_branches").css height: 0
    this

  setComment: (comment) ->
    node = @gameState.currentNode
    unless comment
      comment = "<strong>"
      comment += jsgvTranslations["branch_tag"]  if node.depth > 1
      comment += jsgvTranslations["comment_for"].replace(/MOVE/, node.moveNumber) + ":</strong>"
      comment += "<br/>" + node.comment.replace(/\n/g, "<br/>\n")  if node.comment isnt `undefined` and node.comment?
    $(@jqId + "_comment").empty().append comment
    $(@jqId + "_comment").height @rightPaneHeight - $(@jqId + "_info").height() - 12
    this

  removeComment: ->
    $(@jqId + "_comment").empty()
    this

  redrawBoard: ->
    _this = this
    board = @gameState.board
    s = ""
    if @config.gameType is jsGameViewer.DAOQI
      i = 0

      while i < board.size
        j = 0

        while j < board.size
          color = board[i][j]
          moveNumber = 0
          moveNumber = @gameState.getMoveNumber(i, j)  if @config.showMoveNumber
          if color is jsGameViewer.model.STONE_BLACK or color is jsGameViewer.model.STONE_WHITE
            @mapToPoints i, j, (x, y) ->
              s += _this.createStone(x, y, color, moveNumber)

          j++
        i++
    else
      i = 0

      while i < board.size
        j = 0

        while j < board.size
          color = board[i][j]
          moveNumber = 0
          moveNumber = @gameState.getMoveNumber(i, j)  if @config.showMoveNumber
          s += @createStone(i, j, color, moveNumber)  if color is jsGameViewer.model.STONE_BLACK or color is jsGameViewer.model.STONE_WHITE
          j++
        i++
    $(@jqId + "_boardPoints").empty()
    $(@jqId + "_boardPoints").append s  if s.length > 0
    this

  play: (x, y) ->
    return this  unless @gameState?
    _this = this
    
    # check whether the position is occupied
    unless @gameState.board[x][y] is 0
      return false  if @gameState.isFirst()
      points = new Array()
      changed = false
      loop
        node = @gameState.currentNode
        break  if node.type is jsGameViewer.model.NODE_MOVE and node.x is x and node.y is y
        break  unless @back_(points)
        changed = true
      if changed
        $.each points, (i, point) ->
          _this.removeStone point.x, point.y
          _this.addStone point.x, point.y, point.color  if point.deleteFlag

        @setGameState()
        return true
      return false
    
    # check whether (x,y) is the same as next move/branches
    unless @gameState.isLast()
      children = @gameState.currentNode.children
      i = 0

      while i < children.length
        node = children[i]
        return @goToBranch(i)  if node.type is jsGameViewer.model.NODE_MOVE and node.x is x and node.y is y
        i++
    if @gameState.play(x, y)
      node = @gameState.currentNode
      $.each node.points, (i, point) ->
        _this.removeStone point.x, point.y
        _this.addStone point.x, point.y, point.color  unless point.deleteFlag

      @setGameState()
      true
    else
      false

  remove: ->
    _this = this
    if @gameState? and @gameState.canRemove()
      node = @gameState.currentNode
      $.each node.points, (i, point) ->
        _this.removeStone point.x, point.y
        _this.addStone point.x, point.y, point.color  if point.deleteFlag

      @gameState.remove()
      @setGameState()
    this

  back_: (points) ->
    return false  if @gameState.isFirst()
    node = @gameState.currentNode
    
    # before
    i = 0

    while i < node.points.length
      point = node.points[i]
      found = false
      j = 0

      while j < points.length
        p = points[j]
        if point.x is p.x and point.y is p.y
          found = true
          points[j] = point
          break
        j++
      points.push point  unless found
      i++
    @gameState.back()
    
    # after
    true

  back: ->
    return this  unless @gameState?
    return false  if @gameState.isFirst()
    _this = this
    node = @gameState.currentNode
    $.each node.points, (i, point) ->
      _this.removeStone point.x, point.y
      _this.addStone point.x, point.y, point.color  if point.deleteFlag

    @gameState.back()
    @setGameState()
    true

  backN: (n) ->
    return this  unless @gameState?
    _this = this
    n = @config.fastMode  if n is `undefined`
    points = new Array()
    changed = false
    i = 0

    while i < n
      break  unless @back_(points)
      changed = true
      i++
    if changed
      $.each points, (i, point) ->
        _this.removeStone point.x, point.y
        _this.addStone point.x, point.y, point.color  if point.deleteFlag

      @setGameState()
    this

  backToComment: ->
    return this  unless @gameState?
    _this = this
    points = new Array()
    changed = false
    loop
      break  unless @back_(points)
      changed = true
      
      # stop at move that has comments or branches
      node = @gameState.currentNode
      break  if node.hasComment() or node.hasBranches()
    if changed
      $.each points, (i, point) ->
        _this.removeStone point.x, point.y
        _this.addStone point.x, point.y, point.color  if point.deleteFlag

      @setGameState()
    this

  backAll: ->
    return this  unless @gameState?
    _this = this
    @removeAllStones()
    @gameState.backAll()
    node = @gameState.currentNode
    $.each node.points, (i, point) ->
      _this.addStone point.x, point.y, point.color  if point.color is jsGameViewer.model.STONE_BLACK or point.color is jsGameViewer.model.STONE_WHITE

    @setGameState()
    this

  forward_: (points) ->
    return false  if @gameState.isLast()
    @gameState.forward()
    node = @gameState.currentNode
    i = 0

    while i < node.points.length
      point = node.points[i]
      found = false
      j = 0

      while j < points.length
        p = points[j]
        if point.x is p.x and point.y is p.y
          found = true
          points[j] = point
          break
        j++
      points.push point  unless found
      i++
    true

  forward: ->
    return this  unless @gameState?
    return false  unless @gameState.forward()
    _this = this
    node = @gameState.currentNode
    $.each node.points, (i, point) ->
      _this.removeStone point.x, point.y
      _this.addStone point.x, point.y, point.color  unless point.deleteFlag

    @setGameState()
    true

  forwardN: (n) ->
    return this  unless @gameState?
    _this = this
    n = @config.fastMode  if n is `undefined`
    points = new Array()
    changed = false
    i = 0

    while i < n
      break  unless @forward_(points)
      changed = true
      i++
    if changed
      $.each points, (i, point) ->
        _this.removeStone point.x, point.y
        _this.addStone point.x, point.y, point.color  unless point.deleteFlag

      @setGameState()
    this

  forwardToComment: ->
    return this  unless @gameState?
    _this = this
    points = new Array()
    changed = false
    loop
      break  unless @forward_(points)
      changed = true
      
      # stop at move that has comments or branches
      node = @gameState.currentNode
      break  if node.hasComment() or node.hasBranches()
    if changed
      $.each points, (i, point) ->
        _this.removeStone point.x, point.y
        _this.addStone point.x, point.y, point.color  unless point.deleteFlag

      @setGameState()
    this

  forwardAll: ->
    return this  unless @gameState?
    @removeAllStones()
    @gameState.forwardAll()
    @redrawBoard()
    @setGameState()
    this

  goToBranch: (n) ->
    return this  unless @gameState?
    return this  unless @gameState.goToBranch(n)
    _this = this
    node = @gameState.currentNode
    $.each node.points, (i, point) ->
      _this.removeStone point.x, point.y
      _this.addStone point.x, point.y, point.color  unless point.deleteFlag

    @setGameState()
    this

  goTo: (n) ->
    return this  unless @gameState?
    _this = this
    @back()  while @gameState.isOnBranch()
    if n >= @gameState.game.getMoves()
      @forwardAll()
    else if n <= 0
      @backAll()
    else if n > @gameState.currentNode.moveNumber
      points = new Array()
      changed = false
      while n > @gameState.currentNode.moveNumber
        break  unless @forward_(points)
        changed = true
      if changed
        $.each points, (i, point) ->
          _this.removeStone point.x, point.y
          _this.addStone point.x, point.y, point.color  unless point.deleteFlag

        @setGameState()
    else if n < @gameState.currentNode.moveNumber
      points = new Array()
      changed = false
      while n < @gameState.currentNode.moveNumber
        break  unless @back_(points)
        changed = true
      if changed
        $.each points, (i, point) ->
          _this.removeStone point.x, point.y
          _this.addStone point.x, point.y, point.color  if point.deleteFlag

        @setGameState()
    this

  goToXYs: (xyArr) ->
    @backAll()
    i = 0

    while i < xyArr.length
      x = xyArr[i][0]
      y = xyArr[i][1]
      branch = @gameState.currentNode.childThatMatches(x, y)
      if branch?
        @goToBranch branch
      else
        break
      i++
    this

  setToggleNumberImg: ->
    if @config.showMoveNumber
      $(@jqId + "_toggleNumberImg").removeClass "gvsprite-hidenumber"
      $(@jqId + "_toggleNumberImg").addClass "gvsprite-shownumber"
    else
      $(@jqId + "_toggleNumberImg").removeClass "gvsprite-shownumber"
      $(@jqId + "_toggleNumberImg").addClass "gvsprite-hidenumber"
    this

  toggleNumber: ->
    if @config.showMoveNumber
      @config.showMoveNumber = false
    else
      @config.showMoveNumber = true
    @setToggleNumberImg()
    return this  unless @gameState?
    @redrawBoard()
    this

  showNumber: ->
    @toggleNumber()  if @config.hideMoveNumber
    this

  hideNumber: ->
    @toggleNumber()  if @config.showMoveNumber
    this

  eventToXY: (e) ->
    e = e.originalEvent or window.event
    layerX = e.layerX or e.offsetX or e.clientX
    layerY = e.layerY or e.offsetY or e.clientY
    x = parseInt(layerX / @config.gridSize)
    y = parseInt(layerY / @config.gridSize)
    if @config.gameType is jsGameViewer.DAOQI
      x = (x + @config.boardSize - @config.x0) % @config.boardSize
      y = (y + @config.boardSize - @config.y0) % @config.boardSize
    [x, y]

  isInCentralArea: (x, y) ->
    x >= @config.vbw and x < @config.boardSize + @config.vbw and y >= @config.vbw and y < @config.boardSize + @config.vbw

  xyToArea: (x, y) ->
    [x * @config.gridSize, y * @config.gridSize, @config.gridSize, @config.gridSize]

  xyToLabel: (x, y) ->
    s = LABELS[x]
    s += @config.boardSize - parseInt(y)
    s

  postThickBoxFix: ->
    @registerKeyListener()

  goToPopup: ->
    url = "#TB_inline?test=0&width=250&height=56&inlineId=" + @id + "_goTo&focus=" + @id + "_goToInput&modal=true&test1=0"
    tb_show "", url, null

  goToOkHandler: ->
    try
      input = document.getElementsByName(@id + "_goToForm")[1].goToInput.value
      tb_remove()
      moveNumber = parseInt(input)
      @goTo moveNumber
    catch e
      throw "GameController().goToOkHandler(): " + e
    @postThickBoxFix()

  goToKeyDown: (input, e) ->
    keyCode = undefined
    if window.event
      keyCode = window.event.keyCode
    else if e
      keyCode = e.which
    else
      return
    if keyCode is 13
      gvGoToInput = input.value
      @goToOkHandler()
    else if keyCode is 27
      tb_remove()
      @postThickBoxFix()

