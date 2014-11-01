// ECMAScript 5 strict mode
"use strict";

var camera;

(function() {
	// general setup
	var scene, renderer;
	var cameraControls, effectController;
	// for picking
	var projector;
	// 3D board representation
	var chessBoard;
	// for proper timing
	var clock = new THREE.Clock();

	var g_backgroundEngineValid = true;

	// array for picking
	var board3D = [];


	// hold current selection
	var selectedPiece = null;
	var selectedCell = null;

	/*
	 * BASIC SETUP
	 */
	function init() {
		// initialize everything for 3D

		// CANVAS PARAMETERS
		var canvasWidth  = window.innerWidth;
		var canvasHeight = window.innerHeight;
		var canvasRatio  = canvasWidth / canvasHeight;

		// RENDERER
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.setSize(canvasWidth, canvasHeight);

		if ( SHADOW ) {
			renderer.shadowMapEnabled = true;
			renderer.shadowMapType =  THREE.PCFSoftShadowMap;
			renderer.shadowMapCascade = true;
		}

		// black background
		renderer.setClearColor( 0x000000, 1.0 );
		document.body.appendChild( renderer.domElement );

		// CAMERA
		camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 40000 );
		// CONTROLS
		cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
		// limitations
		cameraControls.minPolarAngle = 0;
		cameraControls.maxPolarAngle = 80 * Math.PI/180;
		cameraControls.minDistance   = 10;
		cameraControls.maxDistance   = 200;
		cameraControls.userZoomSpeed = 1.0;
		// default position behind white
		// (might want to change that according to color selection)
		camera.position.set( 0, 100, 100 );


		// LIGHTING
		var spotlight = new THREE.SpotLight( 0xFFFFFF, 1.0);
		spotlight.position.set( 0, 300, 0 );
		spotlight.angle =  Math.PI / 2;
		spotlight.exponent = 50.0;
		spotlight.target.position.set( 0, 0, 0 );

		if ( SHADOW ) {
			spotlight.castShadow = true;
			spotlight.shadowDarkness = 0.5;
			//spotlight.shadowMapWidth = 4096;  // yeah crazy testing
			//spotlight.shadowMapHeight = 4096;
			spotlight.shadowBias = -0.001;
		}


		var whiteLight = new THREE.PointLight( 0xFFEEDD, 0.2);
		whiteLight.position.set(0,0,100);
		var blackLight = new THREE.PointLight( 0xFFEEDD, 0.2);
		blackLight.position.set(0,0,-100);

		// generate createPiece and createCell functions
		//initPieceFactory();
		initCellFactory();

		// we let chessBoard in global scope to use it for picking
		chessBoard = createChessBoard(BOARD_SIZE);
		var floor = createFloor(FLOOR_SIZE,BOARD_SIZE);

		//floor.position.y = -5*BOARD_SIZE/100;
		floor.position.y = chessBoard.height;

		// create and fill the scene with default stuff
		scene = new THREE.Scene();
		scene.add(floor);
		scene.add(spotlight);
		scene.add(whiteLight);
    scene.add(blackLight);
    scene.add(chessBoard);

		// to make everything black in the background
		scene.fog = new THREE.FogExp2( 0x000000, 0.001 );
		// little reddish to fake a bit of bounce lighting
		scene.add(new THREE.AmbientLight(0x330000));

		// for picking
		projector = new THREE.Projector();

		// Menu
		//initGUI();
		// Check feedback
		//initInfo();

		createValidCellMaterial();
		createSelectedMaterial();

		// picking event
		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );

		// avoid stretching
		window.addEventListener('resize',onResize,false);
	}

	function onResize() {
		var canvas = renderer.domElement;
		var w = window.innerWidth;
		var h = window.innerHeight;
		renderer.setSize(w,h);
		// have to change the projection
		// else the image will be stretched
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
	}

	function animate() {
		window.requestAnimationFrame(animate);
		render();
	}

	function render() {
		var delta = clock.getDelta();
		cameraControls.update(delta);
		renderer.render(scene, camera);
	}

	/*
	 * BOARD
   */

	function updateBoard3D() {
		// list all the pieces
		board3D = [];
		for (var y = 0; y < ROWS; y++) {
			for (var x = 0; x < COLS; x++) {
				var piece = g_board[MakeSquare(y,x)];
				var pieceColor = (piece & colorWhite) ? WHITE : BLACK;
				var pieceName = null;
				//switch (piece & 0x7) {
				//case piecePawn:
				//  pieceName = "pawn";
				//  break;
				//case pieceKnight:
				//  pieceName = "knight";
				//  break;
				//}

				if (pieceName !== null) {
					board3D[x+y*COLS] = createPiece(pieceName,pieceColor);
				}
			}
		}
	}

	function clearBoard() {
		// remove all pieces from the board
		var cell;
		board3D.forEach(function(piece) {
			scene.remove(piece);
			cell = new Cell(piece.cell);
		});
	}

	function fillBoard() {
		// place all the pieces on the board
		var cell;
		board3D.forEach(function(piece,index) {
			cell = new Cell(index);
			piece.position = cell.getWorldPosition();
			piece.cell = index;
			scene.add(piece);
		});
	}



	function redrawBoard() {
		validMoves = GenerateValidMoves();
		clearBoard();
		updateBoard3D();
		fillBoard();
		displayCheck();
	}


	/*
	 * PICKING
	 */
	function pickPiece(raycaster) {
		var intersect   = null;
		var picked = null;
		// intersect piece
		var hitList = [];
		var hit,piece;
		for (var i in board3D) {
			if ({}.hasOwnProperty.call(board3D, i)) {
				piece     = board3D[i];
				intersect = raycaster.intersectObject( piece.children[0], true );

				if (intersect.length > 0) {
					hit = intersect[0];
					if (( g_playerWhite && hit.object.parent.color === WHITE ) ||
						(!g_playerWhite && hit.object.parent.color === BLACK ) ){

						// only pick the right color
						hitList.push(hit);
					}
				}
			}
		}

		// find the closest
		hitList.forEach(function(hit) {
			if (picked === null || picked.distance > hit.distance) {
				picked = hit;
			}
		});


		if (picked) {
			return picked.object.parent;
		} else {
			return null;
		}

	}

	function pickCell(raycaster) {
		// here we don't need to test the distance since you can't really
		// intersect more than one cell at a time.
		var intersect = raycaster.intersectObject( chessBoard, true );
		if (intersect.length > 0) {
			var pickedCell = intersect[0].object;
			return pickedCell;
		}
		return null;
	}

	function getRay(event) {
		// get the raycaster object from the mouse position
		var zoomLevel = window.devicePixelRatio | 1.0 ;
		var canvas = renderer.domElement;
		var canvasPosition = canvas.getBoundingClientRect();
		var mouseX = event.clientX*zoomLevel - canvasPosition.left;
		var mouseY = event.clientY*zoomLevel - canvasPosition.top;

		var mouseVector = new THREE.Vector3(
			2 * ( mouseX / canvas.width ) - 1,
			1 - 2 * ( mouseY / canvas.height ));

		return projector.pickingRay( mouseVector.clone(), camera );
	}

	function onDocumentMouseMove( event ) {

		var canvas = renderer.domElement;
		var raycaster   = getRay(event);
		var pickedPiece = pickPiece(raycaster);
		var pickedCell  = pickCell(raycaster);


		canvas.style.cursor = "default";
		// we are over one of our piece -> hand
		if (pickedPiece !== null) {
			canvas.style.cursor = "pointer";
		}

		// if a cell is selected, we unselect it by default
		if (selectedCell !== null) {
			selectedCell.material = selectedCell.baseMaterial;
		}

		// if a piece is selected and a cell is picked
		if(selectedPiece !== null && pickedCell !== null) {
			var start = new Cell(selectedPiece.cell);
			var end   = new Cell(pickedCell.name);

			var move = null;
			// we check if it would be a valid move
			for (var i = 0; i < validMoves.length; i++) {
				if ( (validMoves[i] & 0xFF)       == MakeSquare(start.y, start.x) &&
					((validMoves[i] >> 8) & 0xFF) == MakeSquare(end.y, end.x)
					) {
					move = validMoves[i];
					break;
				}
			}

			// then if a piece was clicked and we are on a valide cell
			// we highlight it and display a hand cursor
			if (pickedCell !== null && move !==null) {
				selectedCell = pickedCell;
				selectedCell.baseMaterial = selectedCell.material;
				selectedCell.material = validCellMaterial[selectedCell.color];
				canvas.style.cursor = "pointer";
			}
		}

	}

	function onDocumentMouseDown( event ) {

		var canvas = renderer.domElement;
		var raycaster = getRay(event);

		var pickedPiece = pickPiece(raycaster);
		var pickedCell  = pickCell(raycaster);

		if (selectedPiece !== null && pickedCell !== null) {
			if(playMove(selectedPiece,pickedCell)) {
				// a move is played, we reset everything
				// any selectedPiece will disappear
				// since we redraw everything
				selectedPiece = null;
				pickedPiece   = null;
				pickedCell    = null;
			}
		}

		// when a click happen, any selected piece gets unselected
		if (selectedPiece !== null) {
			selectedPiece.children[0].material = selectedPiece.baseMaterial;
			//selectedPiece.children[1].material = selectedPiece.baseMaterial;
		}

		// then if a piece was clicked, we select it
		selectedPiece = pickedPiece;
		if (selectedPiece !== null) {
			selectedPiece.baseMaterial = selectedPiece.children[0].material;
			selectedPiece.children[0].material = selectedMaterial[selectedPiece.color];
			//selectedPiece.children[1].material = selectedMaterial[selectedPiece.color];
		}
	}



	// all resources (meshs and textures) are loaded
	function onLoaded () {
		//bar.container.style.display = "none";
		removeLoader();

		init();
		if (DEBUG) {
			window.scene = scene;
			window.renderer = renderer;
		}
		//newGame(WHITE);
		animate();

		//setTimeout(loadFEN('8/Q5P1/8/8/8/8/8/2K1k3 w - -'),2000);

	}

	window.onLoaded = onLoaded;
	window.redrawBoard = redrawBoard;

})();
