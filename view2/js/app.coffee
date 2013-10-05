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

t = (key) -> jsgvTranslations[key]

T.def 'main', (controller) ->
  [ '.gameviewer.size-21'
    T('banner'     , controller)
    T('board'      , controller)
    T('toolbar'    , controller)
    T('point-label', controller)
    T('right-panel', controller)
    languageChanged: (e, language) ->
      console.log "Language is changed to #{language}"
    renderComplete: (el) ->
      controller.el = $(el)
  ]

T.def 'banner', (controller) ->
  [ '.banner'
    [ '.banner-overlay' ]
    [ '.banner-left'
      T('language-switcher').process()
      '&nbsp;&nbsp;'
      t('whose_turn')
      "&nbsp;"
      [ 'img.next-player', src: '/view/images/default.gif' ]
    ]
    T('move-number', controller)
    [ '.banner-overlay'
      T('banner-prisoners', controller)
      T('window-opener'   , controller)
    ]
  ]

T.def 'language-switcher', ->
  [
    [ 'a.localization'
      href: 'javascript:void(0)'
      click: -> $(this).trigger('languageChanged', ['cn'])
      '中文'
    ]
    ' | '
    [ 'a.localization'
      href: 'javascript:void(0)'
      click: -> $(this).trigger('languageChanged', ['en'])
      'EN'
    ]
  ]

T.def 'move-number', (controller) ->
  [ '.button.move-number-outer'
    [ 'a.thickbox'
      href: '#TB_inline?test=0&width=250&height=56&inlineId=1_goTo&focus=1_goToInput&modal=true&test1=0'
      title: "#{t('jump_to_xx')} [Alt Shift G]"
      t('move_number_before')
      '&nbsp;'
      [ 'span.control-text.move-number', 0 ]
      '&nbsp;'
      t('move_number_after')
    ]
  ]

T.def 'banner-prisoners', (controller) ->
  [ '.prisoners-outer'
    T('banner-prisoner', controller, 'black')
    T('banner-prisoner', controller, 'white')
  ]

T.def 'banner-prisoner', (controller, color) ->
  [ ".#{color}"
    [ 'span.button'
      [ 'a'
        href: 'javascript: void(0)'
        [ 'img.prisoners'
          src: "/view/images/15/#{color}_dead.gif"
          '&nbsp;'
          [ "span.control-text.#{color}_PRISONERS", 0 ]
        ]
      ]
    ]
  ]

T.def 'window-opener', (controller) ->
  [ '.open-window-outer'
    [ 'a'
      title: "#{t('open_in_new_window')} [Alt Shift W]"
      href: 'javascript: void(0)'
      click: -> console.log 'Open in new window'
      [ 'img.sprite-newwindow', src: '/view/images/default.gif' ]
    ]
  ]

T.def 'board', (controller) ->
  [ '.board-outer.sprite-21-board'
    [ '.board'
      [ '.board-overlay.stones' ]
      [ '.board-overlay.marks' ]
      [ '.board-overlay.branches' ]
      [ '.sprite-21-markmove.move-marks' 
        style: display: 'none'
      ]
      [ '.board-overlay.prisoners' ]
      [ '.board-overlay.fascade'
        [ 'img.sprite-21-blankboard', src: '/view/images/default.gif' ]
      ]
    ]
  ]

T.def 'toolbar', (controller) ->
  [ '.toolbar'

    T 'tb-item',
      name: 'refresh'
      callback: -> console.log 'Refresh'
      linkTitle: "#{t('refresh')} [Alt Shift R]"

    T 'tb-item',
      name: 'backall'
      callback: -> controller.backAll()

    T 'tb-item',
      name: 'back'
      callback: -> controller.back()

    T 'tb-item',
      name: 'forward'
      callback: -> controller.forward()

    T 'tb-item',
      name: 'forwardall'
      callback: -> controller.forwardAll()
  ]

T.def 'tb-item', (options) ->
  [ ".tb-item.#{options.name}"
    [ 'a.toggle-opacity'
      href: 'javascript: void(0)'
      click: options.callback
      title: options.linkTitle
      [ "img.sprite-#{options.name}", src: '/view/images/default.gif' ]
    ]
  ]

T.def 'point-label', (controller) ->
  [ '.point-label' ]

T.def 'right-panel', (controller) ->
  [ '.right-pane'
    T('info-pane', controller)
    [ '.comment' ]
  ]

T.def 'info-pane', (controller) ->
  [ '.info'
    T('game-info', controller)
  ]

T.def 'game-info', (controller) ->
  return  unless controller.gameState?.game

  game = controller.gameState.game
  playFirst = "&nbsp;&#8592; " + t("play_first")

  [
    if game.name
      [ 'div'
        style: 'text-align:center; font-weight:bold; margin-bottom: 5px'
        game.name
      ]
    if game.date
      [ 'div'
        t('time')
        ': '
        game.date
      ]
    if game.place
      [ 'div'
        t('place')
        ': '
        game.place
      ]
    [ 'div'
      t('black')
      ': '
      [ 'strong', game.blackName ]
      if game.blackRank
        "&nbsp;(" + game.blackRank + ")" 
      if game.getFirstPlayer() is jsGameViewer.model.STONE_BLACK
        playFirst
    ]
    [ 'div'
      t('white')
      ': '
      [ 'strong', game.whiteName ]
      if game.whiteRank
        "&nbsp;(" + game.whiteRank + ")" 
      if game.getFirstPlayer() is jsGameViewer.model.STONE_WHITE
        playFirst
    ]
    [ 'div'
      t('moves')
      ': '
      game.getMoves()
    ]
    [ 'div'
      t('result')
      ': '
      game.result
    ]
  ]

T.def 'stones-on-board', (controller) ->
  board = controller.gameState.board
  stones = []

  for i in [0..board.size - 1]
    for j in [0..board.size - 1]
      color = board[i][j]
      continue unless color is jsGameViewer.model.STONE_BLACK or color is jsGameViewer.model.STONE_WHITE
      stones.push T('stone', controller, i, j, color, 0)

  stones

T.def 'stone', (controller, x, y, color, move) ->
  imgClass =
    if color is jsGameViewer.model.STONE_BLACK
      "sprite-21-black"
    else if color is jsGameViewer.model.STONE_WHITE
      "sprite-21-white"

  box = controller.xyToArea(x, y)

  [ 'div'
    'class': "stone x#{x} y#{y} #{imgClass}"
    style:
      position: 'absolute'
      left: box[0]
      top: box[1]
  ]

$.extend jsGameViewer.GameController.prototype,
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
    @el.find(".move").replace moveNumber

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

  addStone: (x, y, color, move = 0) ->
    return  unless color is jsGameViewer.model.STONE_BLACK or color is jsGameViewer.model.STONE_WHITE

    T('stone', this, x, y, color, move).render append: @el.find('.board .stones')

  addRemoveStones = (points) ->
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

bind = (el, obj, properties, options) ->
  tagName = $(el).get(0).tagName

  watch obj, properties, ->
    if tagName is 'INPUT'
      $(el).val(obj[properties])
    else if tagName is 'SPAN'
      $(el).text(obj[properties])

  if tagName is 'INPUT'
    $(el).change -> obj[properties] = $(this).val()
