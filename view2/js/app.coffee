# Default view configuration
$.extend jsGameViewer.CONFIG,
  viewDir: "/jsgameviewer/view2/"
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

$.extend jsGameViewer.GameController.prototype,
  LABELS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"]
  BRANCHES = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

  initView: ->

  initGame: ->
    T('main', this).render(inside: '#' + this.config.container)

  setGameInfo: ->
    infoNode = @el.find(".info").empty()
    return  if not @game

    T('game-info', this).render inside: '.info'

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

  redrawBoard: ->
    T('stones-on-board', this).render inside: @el.find('.stones')

  setNextPlayer: (color) ->
    imgSrc = 
      if color is jsGameViewer.model.STONE_WHITE
        @config.viewDir + "/images/15/white.gif"
      else
        @config.viewDir + "/images/15/black.gif"

    @el.find(".next-player").attr "src", imgSrc

  setMoveNumber: (moveNumber) ->
    @el.find(".move-number").html moveNumber

  setPrisoners: (b, w) ->
    @el.find(".black_PRISONERS").html b
    @el.find(".white_PRISONERS").html w

  setMoveMark: (x, y) ->
    @el.find(".move-mark").css
      position: "absolute"
      left: x * @config.gridSize
      top: y * @config.gridSize
      width: @config.gridSize
      height: @config.gridSize

  removeMoveMark: ->
    @el.find(".move-marks").css(width: 0, height: 0)

  setMarks: (marks) ->
    @el.find(".board-marks").empty()
    return this  unless marks

    for mark in marks
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
          s = "<div style='position:absolute;left:" + left + "px;top:" + top + 
            "px;width:" + width + "px;height:" + height + 
            "px;text-align:center;vertical-align:middle;color:red;font-family:Nina;font-weight:bolder;font-size:15px;"
          s += "background-color:" + @config.boardColor + ";"  if color is jsGameViewer.model.STONE_NONE
          s += "'>" + mark[3] + "</div>"
          @el.find(".board-marks").append s

      s = "<div class='" + styleClass + "' style='position:absolute;left:" + left + "px;top:" + top + "px;"
      s += "background-color:" + @config.boardColor + ";"  if color is jsGameViewer.model.STONE_NONE
      s += "'></div>"
      @el.find(".board-marks").append s

  setComment: (comment) ->
    @el.find('.comment').empty()
    return  unless comment
    node = @gameState.currentNode
    comment = "<strong>"
    comment += t("branch_tag")  if node.depth > 1
    comment += t("comment_for").replace(/MOVE/, node.moveNumber) + ":</strong>"
    comment += "<br/>" + node.comment.replace(/\n/g, "<br/>\n")  if node.comment
    @el.find(".comment").html comment

  setBranches: ->
    @el.find(".branches").empty()

    node = @gameState.currentNode
    return  unless node.hasChildren() and node.children.length >= 2

    for child, i in node.children
      n = node.children.length
      title = ""
      if i is 0
        title = t("branch") + " A = " + t("trunk") + " [Alt Shift &#8594;][Alt Shift A]"
      else if i < BRANCHES.length
        branchName = BRANCHES[i]
        title = t("branch") + " " + branchName + " [Alt Shift " + branchName + "]"

      T('tb-branch', this, i, title).render append: '.toolbar .branches'
      @el.find(".toolbar .branches").css height: n * 23

      if child.type is jsGameViewer.model.NODE_MOVE
        x = child.x
        y = child.y
        area = @xyToArea(x, y)
        T('board-branch', i, left: area[0], top: area[1], width: area[2], height: area[3]).render append: '.board .branches'

  forward: ->
    return false  if @gameState?.isLast()

    @gameState.forward()

    node = @gameState.currentNode
    for point in node.points
      @removeStone(point.x, point.y)
      if not point.deleteFlag
        @addStone(point.x, point.y, point.color)

    @setGameState()

    true

  forwardAll: ->
    return  if not @gameState
    @removeAllStones()
    @gameState.forwardAll()
    @redrawBoard()
    @setGameState()

  back: ->
    return false  if @gameState?.isFirst()

    node = @gameState.currentNode
    for point in node.points
      @removeStone point.x, point.y
      @addStone point.x, point.y, point.color  if point.deleteFlag

    @gameState.back()
    @setGameState()

    true

  backAll: ->
    return  if not @gameState
    @removeAllStones()
    @gameState.backAll()

    node = @gameState.currentNode
    for point in node.points
      @addStone point.x, point.y, point.color

    @setGameState()

  goToBranch: (n) ->
    return this  unless @gameState?.goToBranch(n)

    node = @gameState.currentNode
    for point in node.points
      @removeStone point.x, point.y
      @addStone point.x, point.y, point.color  unless point.deleteFlag

    @setGameState()

  addStone: (x, y, color, move = 0) ->
    return  unless color is jsGameViewer.model.STONE_BLACK or color is jsGameViewer.model.STONE_WHITE

    T('stone', this, x, y, color, move).render append: @el.find('.board .stones')

  addRemoveStones: (points) ->
    for point in points
      if point.deleteFlag
        @removeStone point.x, point.y
      else
        @addStone point.x, point.y, point.color

  removeStone: (x, y) ->
    @el.find(".stone.x#{x}.y#{y}").remove()

  removeAllStones: ->
    @el.find(".stones").empty()

  xyToArea: (x, y) ->
    [x * @config.gridSize, y * @config.gridSize, @config.gridSize, @config.gridSize]

