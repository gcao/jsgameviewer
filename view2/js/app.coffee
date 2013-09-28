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
      controller.element = el
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
    T('resign'     , controller)
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

T.def 'resign', (controller) ->
  [ '.resign'
    [ 'span.button'
      [ 'a'
        href: 'javascript:void(0)'
        click: -> console.log 'Resign'
        t('resign')
      ]
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
      [ '.board-overlay.points' ]
      [ '.board-overlay.marks' ]
      [ '.board-overlay.branches' ]
      [ '.sprite-21-markmove.move-marks' ]
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
      callback: -> console.log 'Back to beginning'

    T 'tb-item',
      name: 'back'
      callback: -> console.log 'Back'

    T 'tb-item',
      name: 'forward'
      callback: -> console.log 'Forward'

    T 'tb-item',
      name: 'forwardall'
      callback: -> console.log 'Forward to end'
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
    [ 'div'
      style:
        'text-align': 'center'
        'font-weight': 'bold'
      controller.gameState?.game?.name
    ]
  ]

$.extend jsGameViewer.GameController.prototype,
  initView: ->

  initGame: ->
    T('main', this).render(inside: '#' + this.config.container)

  forwardAll: ->

