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
        style:
          'text-align': 'center'
          'font-weight': 'bold'
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

  redrawBoard: ->
    T('stones-on-board', this).render inside: @el.find('.stones')

  forward: ->
    return false  unless @gameState?.forward()

    node = @gameState.currentNode
    console.log node

    for point in node.points
      @removeStone(point.x, point.y)
      if not point.deleteFlag
        @addStone(point.x, point.y, point.color)

    #@setGameState()
    true

  forwardAll: ->
    return  if not @gameState
    @removeAllStones()
    @gameState.forwardAll()
    @redrawBoard()
    #@setGameState()

  back: ->
    return false  if @gameState?.isFirst()

    node = @gameState.currentNode
    for point in node.points
      @removeStone point.x, point.y
      @addStone point.x, point.y, point.color  if point.deleteFlag

    @gameState.back()

    #@setGameState()
    true

  backAll: ->
    return  if not @gameState
    @removeAllStones()
    @gameState.backAll()

    node = @gameState.currentNode
    for point in node.points
      @addStone point.x, point.y, point.color

    #@setGameState()

  addStone: (x, y, color, move = 0) ->
    return  unless color is jsGameViewer.model.STONE_BLACK or color is jsGameViewer.model.STONE_WHITE

    T('stone', this, x, y, color, move).render append: @el.find('.board .stones')

  addRemoveStones = (points) ->
    i = 0

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

