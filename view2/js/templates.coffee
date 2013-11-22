this.t = (key) -> jsgvTranslations[key]

bind = (el, obj, properties, options) ->
  tagName = $(el).get(0).tagName

  watch obj, properties, ->
    if tagName is 'INPUT'
      $(el).val(obj[properties])
    else if tagName is 'SPAN'
      $(el).text(obj[properties])

  if tagName is 'INPUT'
    $(el).change -> obj[properties] = $(this).val()

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
      controller.publish 'test', 'a', 'b'
  ]

T.def 'banner', (controller) ->
  [ '.banner'
    [ '.banner-overlay' ]
    [ '.banner-left'
      T('language-switcher')
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
      [ 'span.control-text.move-number'
        #renderComplete: (el) ->
        #  console.log 'before'

        #  setMoveNumber = ->
        #    console.log 'updateMoveNumber'
        #    move = controller.gameState?.currentNode?.moveNumber or 0
        #    $(el).text(move)

        #  setMoveNumber() # Set initial move number

        #  registerWatcher = ->
        #    console.log 'registerWatcher'
        #    if controller.gameState
        #      watch controller.gameState, 'currentNode', setMoveNumber, 0

        #  registerWatcher() # Initial watcher for controller.gameState.currentNode

        #  # Any change to controller.gameState creates another watcher
        #  #watch controller, 'gameState', registerWatcher, 0

        #  console.log 'after'
      ]
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
  [ ".prisoners.#{color}"
    [ 'span.button'
      [ 'a'
        href: 'javascript: void(0)'
        [ 'img.prisoners'
          src: "/view/images/15/#{color}_dead.gif"
          '&nbsp;&nbsp;'
          [ "span.control-text.#{color}_PRISONERS",
            renderComplete: (el) ->
              controller.subscribe "set-#{color}-prisoners", (prisoners) ->
                el.val(prisoners)
            0
          ]
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
      #linkTitle: "#{t('refresh')} [Alt Shift R]"

    [ ".tb-item.toggleNumber"
      [ 'a.toggle-opacity'
        href: 'javascript: void(0)'
        click: ->
          console.log 'toggleNumber'
          controller.toggleNumber()
        title: t('show_hide_move_number')
        [ "img.sprite-shownumber", src: '/view/images/default.gif' ]
      ]
    ]

    T 'tb-item',
      name: 'backAll'
      callback: -> controller.backAll()

    T 'tb-item',
      name: 'backN'
      callback: -> controller.backN()

    T 'tb-item',
      name: 'back'
      callback: -> controller.back()

    T 'tb-item',
      name: 'forward'
      callback: -> controller.forward()

    T 'tb-item',
      name: 'forwardN'
      callback: -> controller.forwardN()

    T 'tb-item',
      name: 'forwardall'
      callback: -> controller.forwardAll()

    ['.branches']
  ]

T.def 'tb-item', (options) ->
  [ ".tb-item.#{options.name}"
    [ 'a.toggle-opacity'
      href: 'javascript: void(0)'
      click: options.callback
      title: options.linkTitle
      [ "img.sprite-#{options.name.toLowerCase()}", src: '/view/images/default.gif' ]
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
        "&nbsp;(#{game.blackRank})"
      if game.getFirstPlayer() is jsGameViewer.model.STONE_BLACK
        playFirst
    ]
    [ 'div'
      t('white')
      ': '
      [ 'strong', game.whiteName ]
      if game.whiteRank
        "&nbsp;(#{game.whiteRank})"
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
      stones.push T('stone', controller, i, j, color, controller.gameState.getMoveNumber(i, j))

  stones

T.def 'stone', (controller, x, y, color, move) ->
  imgClass =
    if color is jsGameViewer.model.STONE_BLACK
      "sprite-21-black"
    else if color is jsGameViewer.model.STONE_WHITE
      "sprite-21-white"

  box = controller.xyToBox(x, y)

  [ 'div'
    class: "stone x#{x} y#{y} #{imgClass}"
    style:
      position: 'absolute'
      left: box.left
      top: box.top

    if controller.config.showMoveNumber and move > 0
      # http://www.jakpsatweb.cz/css/css-vertical-center-solution.html
      fontSize = "medium"
      left = 0
      if move >= 10 and move < 100
        fontSize = "small"
      else if move >= 100
        fontSize = "x-small"
        left = 1

      [ 'div'
        style:
          display: 'table'
          width: box.width
          height: box.height
          overflow: 'hidden'
        [ 'div'
          style:
            display: 'table-cell'
            vertical_align: 'middle'
          [ 'div'
            style:
              left: left
              width: '100%'
              text_align: 'center'
              color: if color is jsGameViewer.model.STONE_WHITE then 'black' else 'white'
              font_family: 'times'
              font_size: fontSize
            move
          ]
        ]
      ]
  ]

T.def 'tb-branch', (controller, i, title) ->
  [ '.branch.button'
    [ 'a'
      href: 'javascript:void(0)'
      click: -> controller.goToBranch(i)
      title: title
      controller.BRANCHES[i]
    ]
  ]

T.def 'board-branch', (i, box) ->
  [ '.branch'
    style: box
    BRANCHES[i]
  ]

