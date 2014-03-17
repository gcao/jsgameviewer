this.LABELS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"]
this.BRANCHES = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

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
  initView: ->
    @pubsub = $(@)

  subscribe: ->
    @pubsub.on.apply @pubsub, arguments

  unsubscribe: ->
    @pubsub.off.apply @pubsub, arguments

  publish: ->
    @pubsub.trigger.apply @pubsub, arguments

  initGame: ->
    T('main', this).render(inside: '#' + this.config.container)

  setGameInfo: ->
    infoNode = @el.find(".info").empty()
    return  if not @game

    T('game-info', this).render inside: '.info'

  setGameState: ->
    node = @gameState.currentNode
    @publish 'current-node', node
    if node.type is jsGameViewer.model.NODE_MOVE
      @setMoveMark node.x, node.y
    else
      @removeMoveMark()
    @setMarks node.marks
    @setBranches()

  redrawBoard: ->
    T('stones-on-board', this).render inside: @el.find('.stones')

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
      box = @xyToBox(x, y)
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
          s = "<div style='position:absolute;left:" + box.left + "px;top:" + box.top +
            "px;width:" + box.width + "px;height:" + box.height +
            "px;text-align:center;vertical-align:middle;color:red;font-family:Nina;font-weight:bolder;font-size:15px;"
          s += "background-color:" + @config.boardColor + ";"  if color is jsGameViewer.model.STONE_NONE
          s += "'>" + mark[3] + "</div>"
          @el.find(".board-marks").append s

      s = "<div class='" + styleClass + "' style='position:absolute;left:" + box.left + "px;top:" + box.top + "px;"
      s += "background-color:" + @config.boardColor + ";"  if color is jsGameViewer.model.STONE_NONE
      s += "'></div>"
      @el.find(".board-marks").append s

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
        T('board-branch', i, @xyToBox(child.x, child.y)).render append: '.board .branches'

  forward_: (points) ->
    return false  if @gameState.isLast()

    @gameState.forward()
    node = @gameState.currentNode
    for point, i in node.points
      found = false
      for p, j in points
        if point.x is p.x and point.y is p.y
          found = true
          points[j] = point
          break

      points.push point  unless found

    true

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

  forwardN: (n) ->
    return  unless @gameState?

    n = @config.fastMode  if n is `undefined`
    points = new Array()
    changed = false

    for i in [0..n]
      break  unless @forward_(points)
      changed = true

    if changed
      for point, i in points
        @removeStone point.x, point.y
        @addStone point.x, point.y, point.color  unless point.deleteFlag

      @setGameState()

  forwardAll: ->
    return  if not @gameState
    @removeAllStones()
    @gameState.forwardAll()
    @redrawBoard()
    @setGameState()

  back_: (points) ->
    return false  if @gameState.isFirst()
    node = @gameState.currentNode

    # before
    for point, i in node.points
      found = false
      for p, j in points
        if point.x is p.x and point.y is p.y
          found = true
          points[j] = point
          break

      points.push point  unless found

    @gameState.back()

    # after
    true

  back: ->
    return false  if @gameState?.isFirst()

    node = @gameState.currentNode
    for point in node.points
      @removeStone point.x, point.y
      @addStone point.x, point.y, point.color  if point.deleteFlag

    @gameState.back()
    @setGameState()

    true

  backN: (n) ->
    return false  unless @gameState?

    n = @config.fastMode  if n is `undefined`
    points = new Array()
    changed = false

    for i in [0..n]
      break  unless @back_(points)
      changed = true

    if changed
      for point, i in points
        @removeStone point.x, point.y
        @addStone point.x, point.y, point.color  if point.deleteFlag

      @setGameState()

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

  xyToBox: (x, y) ->
    left: x * @config.gridSize
    top: y * @config.gridSize
    width: @config.gridSize
    height: @config.gridSize

  setToggleNumberImg: ->
    if @config.showMoveNumber
      @el.find(".toggleNumber img").removeClass "sprite-hidenumber"
      @el.find(".toggleNumber img").addClass    "sprite-shownumber"
    else
      @el.find(".toggleNumber img").removeClass "sprite-shownumber"
      @el.find(".toggleNumber img").addClass    "sprite-hidenumber"

  toggleNumber: ->
    @config.showMoveNumber = !@config.showMoveNumber
    @setToggleNumberImg()
    if @gameState? then @redrawBoard()

