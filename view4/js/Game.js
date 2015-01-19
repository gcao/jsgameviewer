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
    for (var i=0; i<19; i++) {
      board[i] = [];
      for (var j=0; j<19; j++) {
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
      var addStone = function(row, col, color) {
        var piece = {
          color: color,
          pos: [row, col]
        };
        board[row][col] = piece;
        boardController.addPiece(piece);
      }
      addStone(3 , 3 , CHECKERS.BLACK);
      addStone(3 , 4 , CHECKERS.WHITE);
      addStone(4 , 3 , CHECKERS.WHITE);
      addStone(4 , 4 , CHECKERS.BLACK);
      addStone(3 , 16, CHECKERS.BLACK);
      addStone(16, 3 , CHECKERS.BLACK);
      addStone(16, 16, CHECKERS.WHITE);
			//var row, col, piece;
			////
			//for (row = 0; row < board.length; row++) {
			//    for (col = 0; col < board[row].length; col++) {
			//        if (row < 3 && (row + col) % 2) { // black piece
			//            piece = {
			//                color: CHECKERS.BLACK,
			//                pos: [row, col]
			//            };
			//        } else if (row > 4 && (row + col) % 2) { // white piece
			//            piece = {
			//                color: CHECKERS.WHITE,
			//                pos: [row, col]
			//            };
			//        } else { // empty square
			//            piece = 0;
			//        }

			//        board[row][col] = piece;

			//        if (piece) {
			//            boardController.addPiece(piece);
			//        }
			//    }
			//}
	  }

    init();
};
