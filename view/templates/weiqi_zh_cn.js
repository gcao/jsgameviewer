jsGameViewer.WEIQI_TEMPLATE_zh_cn = "<div class='gvreset gameviewer' id='GV1'><div class='gvreset gvbanner' id='GV1_banner'><div class='gvreset gvbanner-overlay' id='GV1_bannerbg'>下一手&nbsp;<img border='0px' class='gvreset' id='GV1_nextPlayer' src='http://localhost/jsgameviewer/view/images/default.gif' /></div><div class='gvreset gvmove-outer gvbutton' id='GV1_moveOuter'><a class='gvreset thickbox' href='#TB_inline?test=0&amp;width=250&amp;height=56&amp;inlineId=GV1_goTo&amp;focus=GV1_goToInput&amp;modal=true&amp;test1=0' title='跳到第XX手 [Alt Shift G]'>&nbsp;<span class='gvreset gvcontrol-text' id='GV1_curMove'>0</span>&nbsp;</a></div><div class='gvreset gvresign' id='GV1_resign'><span class='gvreset gvbutton'><a href='#' onclick='jsGameViewer.GV1.resign();return false;'>认输</a></span></div><div class='gvreset gvbanner-overlay'><div class='gvreset gvprisoners-outer'><div class='gvreset gvblack-prisoners-outer'><span class='gvreset gvbutton' id='GV1_blackPrisonersOuter'><a href='#' onclick='return false;'><img border='0px' class='gvreset' id='GV1_blackPrisonersImg' src='http://localhost/jsgameviewer/view/images/14/black_dead.gif' /><span class='gvreset gvcontrol-text' id='GV1_blackPrisoners'>0</span></a></span></div><div class='gvreset gvwhite-prisoners-outer'><span class='gvreset gvbutton' id='GV1_whitePrisonersOuter'><a href='#' onclick='return false;'><img border='0px' class='gvreset' id='GV1_whitePrisonersImg' src='http://localhost/jsgameviewer/view/images/14/white_dead.gif' />白被提<span class='gvreset gvcontrol-text' id='GV1_whitePrisoners'>0</span></a></span></div></div><div class='gvreset gvopen-window-outer'><a href='#' onclick='jsGameViewer.GV1.openInWindow();return false;' title='在新窗口打开 [Alt Shift W]'><img border='0px' class='gvreset gvsprite-newwindow' src='http://localhost/jsgameviewer/view/images/default.gif' /></a></div></div></div><div class='gvreset gvboard-outer gvsprite-21-board' id='GV1_boardOuter'><div class='gvreset gvboard' id='GV1_board'><div class='gvreset gvboard-overlay' id='GV1_boardPoints'></div><div class='gvreset gvboard-overlay' id='GV1_boardMarks'></div><div class='gvreset gvboard-overlay' id='GV1_boardBranches'></div><div class='gvreset gvsprite-21-markmove' id='GV1_moveMark'></div><div class='gvreset gvboard-overlay' id='GV1_prisoners'></div><div class='gvreset gvboard-overlay gvboard-fascade' id='GV1_boardFascade'><img class='gvreset gvsprite-21-blankboard' src='http://localhost/jsgameviewer/view/images/default.gif' /></div></div></div><div class='gvreset gvtoolbar' id='GV1_toolbar'><div class='gvreset gvtb-item' id='GV1_refresh'><a class='gvreset toggleopacity' href='#' onclick='jsGameViewer.GV1.refresh(true);return false;' title='刷新棋谱内容 [Alt Shift R]'><img border='0px' class='gvreset gvsprite-refresh' id='GV1_refreshImg' src='http://localhost/jsgameviewer/view/images/default.gif' /></a></div><div class='gvreset gvtb-item' id='GV1_toggleNumber'><a class='gvreset toggleopacity' href='#' onclick='jsGameViewer.GV1.toggleNumber();return false;' title='显示/隐藏手数 [Alt Shift M]'><img border='0px' class='gvreset gvsprite-shownumber' id='GV1_toggleNumberImg' src='http://localhost/jsgameviewer/view/images/default.gif' /></a></div><div class='gvreset gvtb-item' id='GV1_backAll'><a class='gvreset toggleopacity' href='#' onclick='jsGameViewer.GV1.backAll();return false;' title='到棋局开始 [Ctrl Alt &#8592;]'><img border='0px' class='gvreset gvsprite-backall' src='http://localhost/jsgameviewer/view/images/default.gif' /></a></div><div class='gvreset gvtb-item' id='GV1_backC'><a class='gvreset toggleopacity' href='#' onclick='jsGameViewer.GV1.backToComment();return false;' title='上一评论或变化图 [Alt Shift &#8592;]'><img border='0px' class='gvreset gvsprite-backc' src='http://localhost/jsgameviewer/view/images/default.gif' /></a></div><div class='gvreset gvtb-item' id='GV1_backN'><a class='gvreset toggleopacity' href='#' onclick='jsGameViewer.GV1.backN();return false;' title='快退 [Ctrl &#8592;]'><img border='0px' class='gvreset gvsprite-backn' src='http://localhost/jsgameviewer/view/images/default.gif' /></a></div><div class='gvreset gvtb-item' id='GV1_back'><a class='gvreset toggleopacity' href='#' onclick='jsGameViewer.GV1.back();return false;' title='上一手 [&#8592;]'><img border='0px' class='gvreset gvsprite-back' src='http://localhost/jsgameviewer/view/images/default.gif' /></a></div><div class='gvreset gvtb-item' id='GV1_forward'><a class='gvreset toggleopacity' href='#' onclick='jsGameViewer.GV1.forward();return false;' title='下一手 [&#8594;]'><img border='0px' class='gvreset gvsprite-forward' src='http://localhost/jsgameviewer/view/images/default.gif' /></a></div><div class='gvreset gvtb-item' id='GV1_forwardN'><a class='gvreset toggleopacity' href='#' onclick='jsGameViewer.GV1.forwardN();return false;' title='快进 [Ctrl &#8594;]'><img border='0px' class='gvreset gvsprite-forwardn' src='http://localhost/jsgameviewer/view/images/default.gif' /></a></div><div class='gvreset gvtb-item' id='GV1_forwardC'><a class='gvreset toggleopacity' href='#' onclick='jsGameViewer.GV1.forwardToComment();return false;' title='下一评论或变化图 [Alt Shift &#8594;]'><img border='0px' class='gvreset gvsprite-forwardc' src='http://localhost/jsgameviewer/view/images/default.gif' /></a></div><div class='gvreset gvtb-item' id='GV1_forwardAll'><a class='gvreset toggleopacity' href='#' onclick='jsGameViewer.GV1.forwardAll();return false;' title='到棋局结束 [Ctrl Alt &#8594;]'><img border='0px' class='gvreset gvsprite-forwardall' src='http://localhost/jsgameviewer/view/images/default.gif' /></a></div><div class='gvreset gvtb-branches' id='GV1_branches'></div></div><div align='center' class='gvreset gvpoint-label' id='GV1_pointLabel'></div><div class='gvreset gvmove-slider' id='GV1_moveSliderOuter'><input class='gvreset fd_tween fd_range_400_0 fd_vertical fd_hide_input' id='GV1_moveSlider' name='GV1_moveSlider' style='display: none;' type='text' value='0' /></div><div class='gvreset gvright-pane' id='GV1_rightPanel'><div class='gvreset gvinfo' id='GV1_info'></div><div class='gvreset gvcomment' id='GV1_comment'></div></div><div id='GV1_goTo' style='display:none;'><form action='#' name='GV1_goToForm' onsubmit='return false;'>跳到第<input id='GV1_goToInput' name='goToInput' onKeyDown='jsGameViewer.GV1.goToKeyDown(this,event);' size='5' style='text-align:center' type='text' />&nbsp;&nbsp;&nbsp;&nbsp;<input onclick='jsGameViewer.GV1.goToOkHandler();' type='submit' value='执行' />&nbsp;&nbsp;<input onclick='tb_remove();jsGameViewer.GV1.postThickBoxFix();' type='submit' value='取消' /></form></div></div>";
jsGameViewer.WEIQI_TEMPLATE = jsGameViewer.WEIQI_TEMPLATE_zh_cn;
