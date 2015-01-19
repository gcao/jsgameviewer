// Default view configuration
jq4gv.extend(jsGameViewer.CONFIG, {
});

jq4gv.extend(jsGameViewer.GameController.prototype, function(){
  var LABELS = ['A','B','C','D','E','F','G','H','J','K','L','M','N','O','P','Q','R','S','T'];
  var BRANCHES = ['A','B','C','D','E','F','G','H','I','J'];

  return {
  };
}());

var CHECKERS = {
  WHITE: 1,
  BLACK: 2
};

CHECKERS.Game = function (options) {
  'use strict';

  options = options || {};

  /**********************************************************************************************/
  /* Private properties *************************************************************************/

  /** @type CHECKERS.BoardController */
  var boardController = null;

  /**
   * The board representation.
   * @type Array
   */
  var board = [];
  for (var i = 0; i < 19; i++) {
    board[i] = [];
    for (var j = 0; j < 19; j++) {
      board[i][j] = 0;
    }
  }


  /**********************************************************************************************/
  /* Private methods ****************************************************************************/

  /**
   * Initializer.
   */
  function init() {
    boardController = new CHECKERS.BoardController({
      containerEl: options.containerEl,
      assetsUrl: options.assetsUrl
    });

    boardController.drawBoard(onBoardReady);
  }

  /**
   * On board ready.
   */
  function onBoardReady() {
    // setup the board pieces
    var addStone = function (row, col, color) {
      var piece = {
        color: color,
        pos: [row, col]
      };
      board[row][col] = piece;
      boardController.addPiece(piece);
    }
    addStone(0, 0, CHECKERS.BLACK);
    addStone(3, 3, CHECKERS.BLACK);
    addStone(3, 4, CHECKERS.WHITE);
    addStone(4, 3, CHECKERS.WHITE);
    addStone(4, 4, CHECKERS.BLACK);
    addStone(3, 16, CHECKERS.BLACK);
    addStone(16, 3, CHECKERS.BLACK);
    addStone(16, 16, CHECKERS.WHITE);
    addStone(18, 18, CHECKERS.WHITE);
  }

  init();
};
